const FilterBar = ({ filters, setFilters }) => {
  return (
    <div className="flex items-center gap-4 mb-5">
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="border rounded-md px-3 py-2"
      >
        <option value="">All Status</option>
        <option value="done">Done</option>
        <option value="pending">Pending</option>
      </select>

      <select
        value={filters.ats}
        onChange={(e) => setFilters({ ...filters, ats: e.target.value })}
        className="border rounded-md px-3 py-2"
      >
        <option value="">All ATS</option>
        <option value="true">ATS Friendly</option>
        <option value="false">Non-ATS</option>
      </select>
    </div>
  );
};

export default FilterBar;
