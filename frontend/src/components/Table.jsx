import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Typography,
  Stack,
  Select,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { READING_COLUMNS } from "../constants";
const Pagination = ({
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        borderTop: "1px solid #e0e0e0",
      }}
      direction="row"
      spacing={2}
      useFlexGap
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Typography>
          Page {page} of {totalPages}
        </Typography>

        <Select
          value={pageSize}
          onChange={(e) => onPageSizeChange(e.target.value)}
          size="small"
        >
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </Box>
    </Stack>
  );
};

export const ReadingsTable = ({
  rows,
  totalCount,
  page,
  pageSize,
  totalPages,
  loading,
  onPageChange,
  onPageSizeChange,
}) => {

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {loading && <LinearProgress />}

      <TableContainer sx={{ maxHeight: 560 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {READING_COLUMNS.map((column) => (
                <TableCell key={column.field}>{column.headerName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} hover>
                {READING_COLUMNS.map((column) => (
                  <TableCell key={column.field}>{r[column.field]}</TableCell>
                ))}
              </TableRow>
            ))}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" sx={{ py: 4 }}>
                    No readings match the current filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </Paper>
  );
};
