# Cleans the raw telemetry CSV before loading it into the database.
# pandas is used here for offline/batch work only — live API queries go
# through the Django ORM, not through pandas.
#
# Run once, from the backend folder:
#   python scripts/clean_csv.py

import pandas as pd

INPUT = "../data/telemetry.csv"
OUTPUT = "../data/telemetry_clean.csv"

PLAUSIBLE_RANGES = {
    "flow_rate":   (0, 150),   # m3/h
    "pressure":    (0, 15),    # bar
    "energy_kwh":  (0, 100),   # kWh
    "water_level": (0, 30),    # m
}

df = pd.read_csv(INPUT)
print("rows before cleaning:", len(df))

df = df.drop_duplicates(subset="id")

df["value"] = pd.to_numeric(df["value"], errors="coerce")

df["recorded_at"] = pd.to_datetime(df["recorded_at"], utc=True, format="ISO8601")

df = df[df["status"].isin(["ok", "warning", "fault"])]

low = df["metric"].map(lambda m: PLAUSIBLE_RANGES[m][0])
high = df["metric"].map(lambda m: PLAUSIBLE_RANGES[m][1])
df["is_out_of_range"] = (df["value"] < low) | (df["value"] > high)

df.to_csv(OUTPUT, index=False)

print("rows after cleaning: ", len(df))
print("flagged out-of-range:", int(df["is_out_of_range"].sum()))
