from datetime import timedelta

from django.test import TestCase
from django.utils import timezone

from telemetry.models import Reading


def create_reading(**kwargs):
    defaults = {
        "asset_id": "BH-001",
        "asset_type": "borehole",
        "metric": "flow_rate",
        "value": 10.0,
        "unit": "m3/h",
        "recorded_at": timezone.now(),
        "status": "ok",
    }
    defaults.update(kwargs)
    return Reading.objects.create(**defaults)


class ReadingApiTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        now = timezone.now()
        create_reading(value=10.0, recorded_at=now - timedelta(hours=2))
        create_reading(value=20.0, recorded_at=now - timedelta(hours=1))
        create_reading(value=30.0, recorded_at=now, status="fault")
        create_reading(
            asset_id="PS-001",
            asset_type="pump_station",
            metric="energy_kwh",
            value=5.0,
            unit="kWh",
            recorded_at=now - timedelta(hours=3),
        )

    def test_pagination(self):
        res = self.client.get("/api/readings/", {"page_size": 2}).json()

        self.assertEqual(res["page"], 1)
        self.assertEqual(res["page_size"], 2)
        self.assertEqual(len(res["results"]), 2)
        self.assertEqual(res["total_count"], 4)
        self.assertEqual(res["total_pages"], 2)

    def test_filter_by_metric(self):
        res = self.client.get("/api/readings/", {"metric": "flow_rate"}).json()

        self.assertEqual(res["total_count"], 3)
        self.assertTrue(all(r["metric"] == "flow_rate" for r in res["results"]))


    def test_page_out_of_range(self):
        res = self.client.get("/api/readings/", {"page": 9999}).json()
        self.assertEqual(res["page"], res["total_pages"])
