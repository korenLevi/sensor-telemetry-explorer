import csv

from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime

from telemetry.models import Reading

BATCH_SIZE = 10000
VALID_STATUSES = {"ok", "warning", "fault"}


class Command(BaseCommand):
    help = "Load readings from a CSV file into the database"

    def add_arguments(self, parser):
        parser.add_argument("csv_path")

    def handle(self, *args, **options):
        loaded = 0
        skipped = 0
        seen_ids = set()
        batch = []

        with open(options["csv_path"], newline="") as f:
            for row in csv.DictReader(f):
                reading = self.parse_row(row, seen_ids)
                if reading is None:
                    skipped += 1
                    continue

                batch.append(reading)
                if len(batch) >= BATCH_SIZE:
                    Reading.objects.bulk_create(batch, ignore_conflicts=True)
                    loaded += len(batch)
                    batch = []
                    self.stdout.write(f"{loaded} rows loaded...")

        if batch:
            Reading.objects.bulk_create(batch, ignore_conflicts=True)
            loaded += len(batch)

        self.stdout.write(self.style.SUCCESS(f"Done: {loaded} loaded, {skipped} skipped"))

    def parse_row(self, row, seen_ids):
        try:
            reading_id = int(row["id"])
        except (KeyError, ValueError):
            return None

        if reading_id in seen_ids:
            return None
        seen_ids.add(reading_id)

        recorded_at = parse_datetime(row.get("recorded_at", ""))
        if recorded_at is None:
            return None

        status = row.get("status", "").strip()
        if status not in VALID_STATUSES:
            return None

        value = row.get("value", "").strip()

        is_out_of_range = row.get("is_out_of_range", "").strip().lower() == "true"

        return Reading(
            id=reading_id,
            asset_id=row["asset_id"],
            asset_type=row["asset_type"],
            metric=row["metric"],
            value=float(value) if value else None,
            unit=row["unit"],
            recorded_at=recorded_at,
            status=status,
            is_out_of_range=is_out_of_range,
        )