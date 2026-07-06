import { Grid, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getSummary } from "../services/api";
import { METRIC_LABELS } from "../constants";
import { SummaryChart } from "../components/SummaryChart";
import { Filters } from "../components/Filters";
import { useFilters } from "../context/FiltersContext";

export const Summary = () => {
  const { filters, updateFilters, clearFilters } = useFilters();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("filters", filters);
  const fetchSummary = async (currentFilters) => {
    setLoading(true);
    try {
      const data = await getSummary(currentFilters);
      setSummary(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(filters);
  }, []);

  const dataSetByMetric = useMemo(() => {
    if (!summary) return {};
    const grouped = {};
    summary.results.forEach((row) => {
      (grouped[row.metric] ??= []).push({
        assetId: row.asset_id,
        avg: Number(row.avg.toFixed(2)),
        min: Number(row.min.toFixed(2)),
        max: Number(row.max.toFixed(2)),
        count: row.count,
        unit: row.unit,
      });
    });
    return grouped;
  }, [summary]);

  if (error) return <Typography color="error">{error.message}</Typography>;

  return (
    <>
      <Filters onApply={(filters) => fetchSummary(filters)} filters={filters} updateFilters={updateFilters} clearFilters={clearFilters} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {summary?.metrics.map((metric) => {
          const label = METRIC_LABELS[metric];
          const dataset = dataSetByMetric[metric] ?? [];
          const unit = dataset[0]?.unit ?? "";
          return (
            <SummaryChart key={metric} label={label} dataset={dataset} unit={unit} />
          );
        })}
      </Grid>
    </>
  );
};
