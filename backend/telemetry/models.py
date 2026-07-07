from django.db import models


from django.db import models


class Reading(models.Model):
    """Single sensor reading — matches the CSV schema from generate_data.py."""

    class AssetType(models.TextChoices):
        PUMP_STATION = "pump_station"
        BOREHOLE = "borehole"
        RESERVOIR = "reservoir"

    class Metric(models.TextChoices):
        FLOW_RATE = "flow_rate"
        PRESSURE = "pressure"
        ENERGY_KWH = "energy_kwh"
        WATER_LEVEL = "water_level"

    class Status(models.TextChoices):
        OK = "ok"
        WARNING = "warning"
        FAULT = "fault"

    asset_id = models.CharField(max_length=20)
    asset_type = models.CharField(max_length=20, choices=AssetType.choices)
    metric = models.CharField(max_length=20, choices=Metric.choices)
    value = models.FloatField(null=True, blank=True)
    unit = models.CharField(max_length=10)
    recorded_at = models.DateTimeField()
    status = models.CharField(max_length=10, choices=Status.choices)
    is_out_of_range = models.BooleanField(default=False)

    class Meta:
        db_table = "readings"
        ordering = ["-recorded_at"]
        indexes = [
            models.Index(fields=["asset_id", "-recorded_at"]),
            models.Index(fields=["metric", "-recorded_at"]),
            models.Index(fields=["recorded_at"]),
            models.Index(fields=["status"]),
        ]

    def __str__(self):
        return f"{self.asset_id} · {self.metric} = {self.value} @ {self.recorded_at}"