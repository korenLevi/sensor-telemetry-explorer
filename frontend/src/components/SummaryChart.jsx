import { Card, CardContent, Typography, Grid } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { Fragment } from "react";

export const SummaryChart = ({ label, dataset, unit }) => {
  return (
    <Fragment>
      <Grid key={label} size={{ xs: 12, md: 6 }}>
        <Typography variant="h6" align="center">
          {label} {unit && `(${unit})`}
        </Typography>
        <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: "band", dataKey: "assetId" }]}
          series={[
            { dataKey: "min", label: "Min" },
            { dataKey: "avg", label: "Avg" },
            { dataKey: "max", label: "Max" },
          ]}
          height={300}
        />
      </Grid>
    </Fragment>
  );
};