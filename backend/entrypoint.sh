#!/bin/sh
set -e

python manage.py migrate

if [ ! -f /data/telemetry.csv ]; then
  echo "No telemetry.csv — generating mock data..."
  python /data/generate_data.py -o /data/telemetry.csv --rows 1000000
fi

if [ ! -f /data/telemetry_clean.csv ] || [ /data/telemetry.csv -nt /data/telemetry_clean.csv ]; then
  echo "Cleaning CSV..."
  python scripts/clean_csv.py
fi

if [ "$(python manage.py shell -c "from telemetry.models import Reading; print(Reading.objects.count())")" = "0" ]; then
  echo "Loading data into MySQL..."
  python manage.py load_csv /data/telemetry_clean.csv
fi

exec python manage.py runserver 0.0.0.0:8000