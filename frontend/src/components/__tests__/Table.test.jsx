import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {ReadingsTable} from "../Table.jsx";

const rows = [
  {
    id: 1,
    asset_id: "BH-001",
    asset_type: "borehole",
    metric: "flow_rate",
    value: 37.4,
    unit: "m3/h",
    recorded_at: "2024-03-18T14:22:00Z",
    status: "ok",
  },
  {
    id: 2,
    asset_id: "PS-001",
    asset_type: "pump_station",
    metric: "energy_kwh",
    value: 12.1,
    unit: "kWh",
    recorded_at: "2024-03-18T15:00:00Z",
    status: "fault",
  },
];

const defaultProps = {
  rows,
  totalCount: 2,
  page: 1,
  pageSize: 50,
  totalPages: 1,
  loading: false,
  ordering: "-recorded_at",
  onOrderingChange: () => {},
  onPageChange: () => {},
  onPageSizeChange: () => {},
};

describe("ReadingsTable", () => {
  it("renders a row per reading", () => {
    render(<ReadingsTable {...defaultProps} />);

    expect(screen.getByText("BH-001")).toBeInTheDocument();
    expect(screen.getByText("PS-001")).toBeInTheDocument();
  });

  it("shows empty state when there are no rows", () => {
    render(<ReadingsTable {...defaultProps} rows={[]} totalCount={0} />);

    expect(
      screen.getByText("No readings match the current filters")
    ).toBeInTheDocument();
  });

  it("disables Previous on the first page", () => {
    render(<ReadingsTable {...defaultProps} page={1} totalPages={5} />);

    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
  });

  it("disables Next on the last page", () => {
    render(<ReadingsTable {...defaultProps} page={5} totalPages={5} />);

    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Previous" })).toBeEnabled();
  });

  it("calls onPageChange with the next page number", () => {
    const onPageChange = vi.fn();
    render(
      <ReadingsTable
        {...defaultProps}
        page={2}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});