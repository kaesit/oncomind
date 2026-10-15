import React, { useState, useEffect, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, BedDouble, RotateCw, Siren, Users, SearchX } from "lucide-react";
import { Button, Card, Checkbox, Empty, Input, PageHeader, Pill, Select, StatusPill, StatusText, Ticks } from "../dashboard/ui";

type Row = {
  id: string;
  name: string;
  age: number;
  room: string;
  status: string;
  diagnosis: string;
  confidence: number;
};

// filter row: substring match for text, exact match for the dropdown columns
const contains: FilterFn<Row> = (row, colId, value) =>
  String(row.getValue(colId) ?? "").toLowerCase().includes(String(value).toLowerCase());
const equals: FilterFn<Row> = (row, colId, value) => String(row.getValue(colId)) === String(value);

export default function AdminDashboard() {
  const [gridData, setGridData] = useState<any[]>([]);

  useEffect(() => {
    console.log("Fetching Patient Data...");

    fetch("http://localhost:5001/api/Patient")
      .then((res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // Handle if data is wrapped in an object or direct array
        const list = Array.isArray(data) ? data : (data.value || []);

        // Map the data using your EXACT backend structure
        const enrichedData = list.map((p: any) => enrichPatientData(p));
        setGridData(enrichedData);
      })
      .catch((err) => console.error("Fetch Failed:", err));
  }, []);

  const enrichPatientData = (patient: any) => {
    // 1. EXACT MAPPING FROM YOUR JSON
    const id = patient.id;
    const name = `${patient.firstName} ${patient.lastName}`; // Combine names
    const room = patient.admissionLocation || "Not Admitted"; // "Room 24C3"
    const status = patient.emergencyStatus || "Normal"; // "Normal"
    const age = patient.age;

    // 2. MOCK AI LOGIC (Client Side) based on real Status
    // Deterministic seed for consistent "random" numbers
    const seed = (id.length) + (name.length);

    let diagnosis = "Benign";
    let confidence = 0.15;

    // If status is not Normal, AI suspects Malignant
    if (status !== "Normal" && status !== "Stable") {
      diagnosis = "Malignant";
      confidence = 0.88 + (seed % 10) / 100; // High confidence
    } else {
      // Normal patients = Benign or Low confidence
      confidence = 0.05 + (seed % 20) / 100;
    }

    return {
      id,
      name,
      age,
      room,
      status,
      diagnosis,
      confidence
    };
  };

  // --- STATS ---
  const total = gridData.length;
  const occupied = gridData.filter((p) => p.room !== "Not Admitted").length;
  const urgent = gridData.filter((p) => p.status !== "Normal").length;

  // --- TABLE ---
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const statusOptions = useMemo(() => Array.from(new Set(gridData.map((p) => p.status))).sort(), [gridData]);

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      {
        id: "select",
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            ariaLabel="Select all"
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={(v) => table.toggleAllRowsSelected(v)}
          />
        ),
        cell: ({ row }) => <Checkbox ariaLabel="Select row" checked={row.getIsSelected()} onChange={(v) => row.toggleSelected(v)} />,
      },
      {
        accessorKey: "id",
        header: "Patient ID",
        filterFn: contains,
        cell: (c) => <span className="om-mono" style={{ fontSize: 12, color: "var(--om-muted)" }}>{c.getValue<string>()}</span>,
      },
      { accessorKey: "name", header: "Full Name", filterFn: contains, cell: (c) => <span style={{ fontWeight: 550 }}>{c.getValue<string>()}</span> },
      { accessorKey: "age", header: "Age", filterFn: contains, meta: { align: "center" } },
      { accessorKey: "room", header: "Location", filterFn: contains, meta: { align: "center" } },
      {
        accessorKey: "diagnosis",
        header: "AI Diagnosis (Est.)",
        filterFn: equals,
        meta: { options: ["Benign", "Malignant"] },
        cell: (c) => <StatusPill status={c.getValue<string>()} />,
      },
      {
        accessorKey: "confidence",
        header: "Confidence",
        enableColumnFilter: false,
        meta: { align: "center" },
        cell: (c) => {
          const v = c.getValue<number>();
          return (
            <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", color: v > 0.8 ? "var(--om-urgent)" : "var(--om-stable)" }}>
              {(v * 100).toFixed(1)}%
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        filterFn: equals,
        meta: { align: "center", options: "status" },
        cell: (c) => <StatusText status={c.getValue<string>()} />,
      },
    ],
    []
  );

  const table = useReactTable({
    data: gridData as Row[],
    columns,
    state: { sorting, columnFilters, rowSelection },
    getRowId: (r, i) => String(r.id ?? i),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;
  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="om-page">
      <PageHeader
        title="All Patients"
        sub={
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            Database Connection: <span className="om-live-dot" /> <span style={{ color: "var(--om-stable)", fontWeight: 550 }}>Active</span>
          </span>
        }
      >
        <Button variant="primary" icon={<RotateCw size={16} />} onClick={() => window.location.reload()}>
          Refresh List
        </Button>
      </PageHeader>

      <div className="om-stat-grid">
        <Card aura="violet" className="om-stat">
          <div className="om-stat-top">
            <span className="om-stat-label">Total Patients</span>
            <span className="om-stat-icon"><Users size={16} /></span>
          </div>
          <div className="om-dot-number">{total}</div>
          <Ticks />
        </Card>
        <Card className="om-stat" style={{ color: "var(--om-high)" }}>
          <div className="om-stat-top">
            <span className="om-stat-label">Occupied Rooms</span>
            <Pill>{total ? Math.round((occupied / total) * 100) : 0}% of patients</Pill>
          </div>
          <div className="om-dot-number">{occupied}</div>
          <Ticks ratio={total ? occupied / total : undefined} />
        </Card>
        <Card className="om-stat" style={{ color: "var(--om-urgent)" }}>
          <div className="om-stat-top">
            <span className="om-stat-label">Urgent Status</span>
            <span className="om-stat-icon" style={{ color: "var(--om-urgent)" }}><Siren size={16} /></span>
          </div>
          <div className="om-dot-number">{urgent}</div>
          <Ticks ratio={total ? urgent / total : undefined} />
        </Card>
      </div>

      <Card flush>
        <div className="om-card-head" style={{ padding: "18px 18px 0", marginBottom: 8 }}>
          <div>
            <h3 className="om-card-title">Patient registry</h3>
            <p className="om-card-sub">Filter any column, click a header to sort.</p>
          </div>
          {selectedCount > 0 && <Pill tone="lime">{selectedCount} selected</Pill>}
        </div>

        <div className="om-table-wrap" style={{ "--max-h": "60vh" } as React.CSSProperties}>
          <table className="om-table">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => {
                    const align = (h.column.columnDef.meta as any)?.align;
                    const sorted = h.column.getIsSorted();
                    return (
                      <th key={h.id} className={align} style={h.column.id === "select" ? { width: 44 } : undefined}>
                        {h.column.getCanSort() ? (
                          <button onClick={h.column.getToggleSortingHandler()}>
                            {flexRender(h.column.columnDef.header, h.getContext())}
                            {sorted === "asc" ? <ArrowUp size={12} /> : sorted === "desc" ? <ArrowDown size={12} /> : <ArrowUpDown size={12} opacity={0.35} />}
                          </button>
                        ) : (
                          flexRender(h.column.columnDef.header, h.getContext())
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
              <tr className="om-filter-row">
                {table.getAllLeafColumns().map((col) => {
                  const meta = col.columnDef.meta as any;
                  if (!col.getCanFilter()) return <th key={col.id} />;
                  const value = (col.getFilterValue() as string) ?? "";
                  if (meta?.options) {
                    const opts: string[] = meta.options === "status" ? statusOptions : meta.options;
                    return (
                      <th key={col.id} style={{ minWidth: 120 }}>
                        <Select items={opts} value={value || null} onChange={(v) => col.setFilterValue(v ?? undefined)} placeholder="All" clearable ariaLabel={`Filter ${col.id}`} />
                      </th>
                    );
                  }
                  return (
                    <th key={col.id}>
                      <Input value={value} onChange={(e) => col.setFilterValue(e.target.value || undefined)} placeholder="Filter…" aria-label={`Filter ${col.id}`} />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} data-selected={row.getIsSelected()}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={(cell.column.columnDef.meta as any)?.align}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && (
            <Empty icon={total ? <SearchX size={28} /> : <BedDouble size={28} />} title={total ? "No patients match these filters" : "No patients yet"}>
              {total ? "Clear a filter to see more rows." : "Patients will appear here once the API returns data."}
            </Empty>
          )}
        </div>

        <div className="om-table-foot">
          <span>Total: {rows.length}{rows.length !== total ? ` of ${total}` : ""}</span>
          {columnFilters.length > 0 && (
            <Button size="sm" variant="ghost" onClick={() => setColumnFilters([])}>
              Clear filters
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
