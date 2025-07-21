interface DashboardTableProps<T> {
  title: string;
  data: T[];
  columns: { key: string; label: string; render?: (value: any, row: T) => React.ReactNode }[];
  loading: boolean;
  emptyMessage: string;
}

const DashboardTable = <T extends { id: number }>({ title, data, columns, loading, emptyMessage }: DashboardTableProps<T>) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data.length) {
    return <div>{emptyMessage}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={`${row.id}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                  {column.render ? column.render((row as any)[column.key], row) : (row as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;

