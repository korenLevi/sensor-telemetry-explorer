#!/bin/sh
set -e

# 1. DB מוכן + migrations
python manage.py migrate

# 2. CSV — רק אם לא קיים
if [ ! -f /data/telemetry.csv ]; then
  echo "No telemetry.csv — generating mock data..."
  python /data/generate_data.py -o /data/telemetry.csv --rows 1000000
fi

# 3. ניקוי — רק אם אין clean או שה-raw חדש יותר
if [ ! -f /data/telemetry_clean.csv ] || [ /data/telemetry.csv -nt /data/telemetry_clean.csv ]; then
  echo "Cleaning CSV..."
  python scripts/clean_csv.py
fi

# 4. טעינה — רק אם ה-DB ריק
if [ "$(python manage.py shell -c "from telemetry.models import Reading; print(Reading.objects.count())")" = "0" ]; then
  echo "Loading data into MySQL..."
  python manage.py load_csv /data/telemetry_clean.csv
fi

# 5. השרver
exec python manage.py runserver 0.0.0.0:8000