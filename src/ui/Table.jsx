import { Table as BSTable } from 'react-bootstrap';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const Table = ({ 
  columns, 
  data, 
  striped = false,
  hover = true,
  sortable = false,
  onSort,
  sortField,
  sortDirection,
  emptyMessage = "No data available"
}) => {
  const handleSort = (field) => {
    if (sortable && onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="ms-2" size={12} style={{ opacity: 0.3 }} />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="ms-2" size={12} style={{ color: 'var(--primary-600)' }} />
      : <FaSortDown className="ms-2" size={12} style={{ color: 'var(--primary-600)' }} />;
  };

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <BSTable className="table mb-0" striped={striped} hover={hover}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.field}
                  className={sortable && column.sortable !== false ? 'sortable' : ''}
                  onClick={() => sortable && column.sortable !== false && handleSort(column.field)}
                  style={{ cursor: sortable && column.sortable !== false ? 'pointer' : 'default' }}
                >
                  <div className="d-flex align-items-center">
                    {column.header}
                    {sortable && column.sortable !== false && getSortIcon(column.field)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={column.field}>
                      {column.render 
                        ? column.render(row[column.field], row, rowIndex)
                        : row[column.field]
                      }
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="table-empty">
                  <div className="table-empty-icon">📋</div>
                  <div className="table-empty-text">{emptyMessage}</div>
                </td>
              </tr>
            )}
          </tbody>
        </BSTable>
      </div>
    </div>
  );
};

export default Table;
