// Reusable Table component
export default function Table({ columns, data, className = '' }) {
  return (
    <div className={`overflow-x-auto rounded-xl shadow-lg border border-gray-700 bg-gray-800 ${className}`}>
      <table className="min-w-full divide-y divide-cyan-700">
        <thead className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-4 py-3 text-left text-xs font-extrabold text-cyan-400 uppercase tracking-wider neon-text">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-700/80 transition-all duration-200">
              {columns.map((col, j) => (
                <td key={j} className="px-4 py-3 text-sm text-gray-200">
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 