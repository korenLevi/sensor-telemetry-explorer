import { useState, useEffect } from "react";
import { getReadings } from "../services/api";
import { Filters } from "../components/Filters";
import { useFilters } from "../context/FiltersContext";
import { ReadingsTable } from "../components/Table";
export const Reading = () => {
 const { filters, updateFilters, clearFilters} = useFilters();
  const [readings, setReadings] = useState({ results: [], count: 0, page: 0, page_size: 50 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);

  const fetchReadings = async (currentFilters) => {
    setLoading(true);
    try {
      const data = await getReadings({ ...currentFilters, page, page_size: pageSize });
      setReadings(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings({ ...filters, page, page_size: pageSize });
  }, [page, pageSize]);

  return (
    <div>
      <Filters onApply={(filters) => {
        fetchReadings(filters);
      }} 
      filters={filters}
      updateFilters={updateFilters}
      clearFilters={clearFilters}
      />
      <ReadingsTable
        rows={readings.results}
        totalCount={readings.total_count}
        page={readings.page}
        pageSize={readings.page_size}
        totalPages={readings.total_pages}
        loading={loading}
        onPageChange={(page) => {
          setPage(page) 
        }}
        onPageSizeChange={(pageSize) => {
          setPageSize(pageSize)
        }}
      />
      {/* <Table
        columns={READING_COLUMNS}
        rows={readings}
        loading={loading}
        error={error}
        rowCount={readings.length}
      /> */}
    </div>
  );
};
