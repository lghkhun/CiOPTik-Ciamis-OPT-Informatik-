import React from 'react';
import { SortConfig } from '../hooks/useSortableData';

interface Props<T> {
  label: string;
  sortKey: keyof T | null;
  sortConfig: SortConfig<T> | null;
  requestSort: (key: keyof T) => void;
}

const SortableTableHeader = <T extends object>({ label, sortKey, sortConfig, requestSort }: Props<T>) => {
    const isSortable = sortKey !== null;
    
    const getSortIcon = () => {
        if (!isSortable || !sortConfig || sortConfig.key !== sortKey) {
            return <span className="text-gray-400">↕</span>;
        }
        if (sortConfig.direction === 'ascending') {
            return <span className="text-green-600">↑</span>;
        }
        return <span className="text-green-600">↓</span>;
    };

    return (
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <button
                type="button"
                onClick={() => isSortable && requestSort(sortKey)}
                className={`flex items-center space-x-1 font-medium ${isSortable ? 'cursor-pointer hover:text-gray-700' : 'cursor-default'}`}
                disabled={!isSortable}
            >
                <span>{label}</span>
                {isSortable && getSortIcon()}
            </button>
        </th>
    );
};

export default SortableTableHeader;
