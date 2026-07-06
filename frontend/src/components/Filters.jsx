import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import { METRIC_LABELS, STATUS_LABELS } from "../constants";
import { useFilters, EMPTY_FILTERS } from "../context/FiltersContext";
import { useAssets } from "../hooks/useAssets";
import { useEffect } from "react";
export const Filters = ({ onApply, filters, updateFilters, clearFilters }) => {

  const assets = useAssets();

  const handleClear = () => {
    clearFilters();
    onApply(EMPTY_FILTERS);
  };

  
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      useFlexGap
      sx={{ mb: 4 }}
    >
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="asset-label">Asset</InputLabel>
        <Select
          labelId="asset-label"
          label="Asset"
          value={filters.asset_id}
          onChange={(e) => updateFilters({ asset_id: e.target.value })}
        >
          <MenuItem value="">All assets</MenuItem>
          {assets.map((asset) => (
            <MenuItem key={asset.asset_id} value={asset.asset_id}>
              {asset.asset_id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="metric-label">Metric</InputLabel>
        <Select
          labelId="metric-label"
          label="Metric"
          value={filters.metric}
          onChange={(e) => updateFilters({ metric: e.target.value })}
        >
          <MenuItem value="">All metrics</MenuItem>
          {Object.entries(METRIC_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          label="Status"
          value={filters.status}
          onChange={(e) => updateFilters({ status: e.target.value })}
        >
          <MenuItem value="">All statuses</MenuItem>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="From"
        type="datetime-local"
        size="small"
        value={filters.time_from}
        onChange={(e) => updateFilters({ time_from: e.target.value })}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <TextField
        label="To"
        type="datetime-local"
        size="small"
        value={filters.time_to}
        onChange={(e) => updateFilters({ time_to: e.target.value })}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Button variant="outlined" onClick={handleClear}>
        Clear
      </Button>
      <Button variant="contained" onClick={() => onApply(filters)}>
        Apply
      </Button>
    </Stack>
  );
};
