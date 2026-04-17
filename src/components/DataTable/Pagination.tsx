import React from 'react';
import { PaginationProps } from './types';
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 16, 25, 50]
}: PaginationProps) {
  const maxVisiblePages = 7;
  const getPageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from(
        {
          length: totalPages
        },
        (_, i) => i + 1
      );
    }
    const pages: (number | string)[] = [];
    const leftSiblingIndex = Math.max(currentPage - 1, 1);
    const rightSiblingIndex = Math.min(currentPage + 1, totalPages);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = Array.from(
        {
          length: 5
        },
        (_, i) => i + 1
      );
      pages.push(...leftRange, '...', totalPages);
    } else if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = Array.from(
        {
          length: 5
        },
        (_, i) => totalPages - 4 + i
      );
      pages.push(1, '...', ...rightRange);
    } else if (shouldShowLeftDots && shouldShowRightDots) {
      pages.push(
        1,
        '...',
        leftSiblingIndex,
        currentPage,
        rightSiblingIndex,
        '...',
        totalPages
      );
    }
    return pages;
  };
  return (
    <div
      className="flex items-center justify-between font-sans"
      style={{
        padding: '8px 12px',
        borderTop: '1px solid #E4E4E6',
        backgroundColor: '#FFFFFF'
      }}>
      
      <div className="flex items-center gap-2">
        <span
          style={{
            fontSize: '12px',
            color: '#60636A'
          }}>
          
          Rows per page:
        </span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="font-sans"
          style={{
            height: '28px',
            padding: '0 8px',
            fontSize: '12px',
            border: '1px solid #E4E4E6',
            borderRadius: '6px',
            backgroundColor: '#FFFFFF',
            color: '#0A0A0A',
            outline: 'none'
          }}>
          
          {pageSizeOptions.map((size) =>
          <option key={size} value={size}>
              {size}
            </option>
          )}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-interactive-hover transition-colors"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#0A0A0A'
          }}
          aria-label="Previous page">
          
          <i className="fa-light fa-chevron-left" />
        </button>

        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`dots-${index}`}
                style={{
                  padding: '0 4px',
                  color: '#60636A',
                  fontSize: '12px'
                }}>
                
                ...
              </span>);

          }
          const pageNum = page as number;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`flex items-center justify-center font-medium transition-colors ${isActive ? 'bg-interactive-hover-strong text-[var(--brand-color)]' : 'hover:bg-interactive-hover'}`}
              style={{
                minWidth: '28px',
                height: '28px',
                borderRadius: '6px',
                fontSize: '12px',
                color: isActive ? undefined : '#0A0A0A'
              }}>
              
              {pageNum}
            </button>);

        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-interactive-hover transition-colors"
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#0A0A0A'
          }}
          aria-label="Next page">
          
          <i className="fa-light fa-chevron-right" />
        </button>
      </div>
    </div>);

}