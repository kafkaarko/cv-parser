import { useState } from "react";

const CVTable = ({ cvs }) => {
     const [filters, setFilters] = useState({ status: "", ats: "" });

  if (!Array.isArray(cvs) || cvs.length === 0)
    return <p className="text-center text-gray-500">CV sedang diparsing terlebih dahulu, mohoh sabar yaa...😁</p>;

  const filteredCvs = cvs.filter((cv) => {
    const byStatus = filters.status ? cv.status === filters.status : true;
    const byAts = filters.ats ? String(cv.parsed.ats_friendly) === filters.ats : true;
    return byStatus && byAts;
  });

  return (
    <div className="min-h-0 p-4">
    <div className="overflow-x-auto bg-white rounded-lg shadow-md ">
      {/* Filter bar kecil */}
      <div className="flex gap-4 p-4">
        {/* <select
          className="border p-2 rounded"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="done">Done</option>
          <option value="pending">Pending</option>
        </select> */}

        <select
          className="border p-2 rounded"
          value={filters.ats}
          onChange={(e) => setFilters({ ...filters, ats: e.target.value })}
        >
          <option value="">All ATS</option>
          <option value="true">ATS Friendly</option>
          <option value="false">Non-ATS</option>
        </select>
      </div>

      <table className="min-w-full table-auto">
        <thead className="bg-orange-500 text-white">
          <tr>
            <th className="px-4 py-2 text-left">File Name</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">No. HP</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">ATS</th>
            <th className="px-4 py-2 text-left">Sections</th>
          </tr>
        </thead>
        <tbody>
          {filteredCvs.map((cv, i) => (
            <tr key={i} className="border-b hover:bg-orange-50 transition duration-200">
              <td className="px-4 py-2 font-semibold">{cv.filename}</td>
              <td className="px-4 py-2">{cv.parsed.name || "-"}</td>
              <td className="px-4 py-2">{cv.parsed.email || "-"}</td>
              <td className="px-4 py-2">{cv.parsed.phone || "-"}</td>
              <td
                className={`px-4 py-2 font-semibold ${
                  cv.status === "done" ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {cv.status}
              </td>
              <td className="px-4 py-2">
                {cv.parsed.ats_friendly ? (
                  <span className="text-green-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-red-600 font-semibold">No</span>
                )}
              </td>
              <td className="px-4 py-2 text-sm text-gray-700 space-y-2">
                {Object.entries(cv.parsed.sections).map(([section, content]) => (
                  <details key={section} className="border rounded p-2">
                    <summary className="font-medium text-orange-600 cursor-pointer capitalize">
                      {section}
                    </summary>
                    <p className="whitespace-pre-wrap mt-1">{content}</p>
                  </details>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};
export default CVTable;
