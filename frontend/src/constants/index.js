export const METRIC_LABELS = {
  flow_rate: "Flow Rate",
  pressure: "Pressure",
  energy_kwh: "Energy",
  water_level: "Water Level",
};

export const ASSET_TYPE_LABELS = {
  pump_station: "Pump Station",
  borehole: "Borehole",
  reservoir: "Reservoir",
};

export const STATUS_LABELS = {
  ok: "OK",
  warning: "Warning",
  fault: "Fault",
};

export const READING_COLUMNS = [
  { field: "id", headerName: "ID" },
  { field: "asset_id", headerName: "Asset ID" },
  {
    field: "asset_type",
    headerName: "Asset Type",
  },
  {
    field: "metric",
    headerName: "Metric", 
  },
  { field: "recorded_at", headerName: "Recorded At" },
  { field: "value", headerName: "Value" },
  { field: "unit", headerName: "Unit" },
  { field: "status", headerName: "Status" },
];
