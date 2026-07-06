import { createContext, useContext, useState } from "react";

export const EMPTY_FILTERS = {
  asset_id: "",
  asset_type: "",
  metric: "",
  status: "",
  time_from: "",
  time_to: "",
  page: 1,
  page_size: 50,
};

const FiltersContext = createContext(null);

export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const updateFilters = (patch) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  return (
    <FiltersContext.Provider value={{ filters, updateFilters, clearFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);