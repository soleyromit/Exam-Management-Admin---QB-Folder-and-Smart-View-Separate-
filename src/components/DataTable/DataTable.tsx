import React, { useCallback, useState, useRef } from 'react';
import { DataTableProps, Column, ColumnMenuAction } from './types';
import { ColumnMenu } from './ColumnMenu';
import { useFontAwesomeKit } from './useFontAwesomeKit';
export function DataTable<T extends Record<string, any>>({
  columns: initialColumns,
  data,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  onColumnReorder,
  onColumnResize,
  onColumnMenuAction,
  className = '',
  'data-id': dataId
}: DataTableProps<T>) {
  useFontAwesomeKit();
  const [columns, setColumns] = useState(initialColumns);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(
    () => {
      const widths: Record<string, number> = {};
      initialColumns.forEach((col) => {
        if (col.width) {
          widths[col.id] = parseInt(col.width, 10) || 150;
        }
      });
      return widths;
    }
  );
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(
    null
  );
  const [openMenuColumnId, setOpenMenuColumnId] = useState<string | null>(null);
  const menuButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  // Column resize
  const resizingRef = useRef<{
    columnId: string;
    startX: number;
    startWidth: number;
  } | null>(null);
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, columnId: string, currentWidth: number) => {
      e.preventDefault();
      e.stopPropagation();
      resizingRef.current = {
        columnId,
        startX: e.clientX,
        startWidth: currentWidth
      };
      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!resizingRef.current) return;
        const diff = moveEvent.clientX - resizingRef.current.startX;
        const newWidth = Math.max(60, resizingRef.current.startWidth + diff);
        setColumnWidths((prev) => ({
          ...prev,
          [resizingRef.current!.columnId]: newWidth
        }));
      };
      const handleMouseUp = () => {
        if (resizingRef.current && onColumnResize) {
          onColumnResize(
            resizingRef.current.columnId,
            columnWidths[resizingRef.current.columnId] ||
            resizingRef.current.startWidth
          );
        }
        resizingRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [onColumnResize, columnWidths]
  );
  const handleDragStart = (index: number) => {
    setDraggedColumnIndex(index);
  };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedColumnIndex === null || draggedColumnIndex === index) return;
    const newColumns = [...columns];
    const draggedColumn = newColumns[draggedColumnIndex];
    newColumns.splice(draggedColumnIndex, 1);
    newColumns.splice(index, 0, draggedColumn);
    setColumns(newColumns);
    setDraggedColumnIndex(index);
    if (onColumnReorder) onColumnReorder(draggedColumnIndex, index);
  };
  const handleDragEnd = () => {
    setDraggedColumnIndex(null);
  };
  const getCellValue = (row: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') return column.accessor(row);
    return row[column.accessor];
  };
  const getColumnWidth = (column: Column<T>): number => {
    if (columnWidths[column.id]) return columnWidths[column.id];
    if (column.width) return parseInt(column.width, 10) || 150;
    return 150;
  };
  const handleMenuAction = (columnId: string, action: ColumnMenuAction) => {
    if (onColumnMenuAction) onColumnMenuAction(columnId, action);
  };
  return (
    <div
      className={`flex flex-col h-full ${className}`}
      data-id={dataId}
      style={{
        backgroundColor: '#FFFFFF',
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
      }}>
      
      <div className="flex-1 overflow-auto">
        <table
          className="w-full"
          style={{
            borderCollapse: 'collapse',
            fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
          }}>
          
          <thead
            className="sticky top-0"
            style={{
              zIndex: 10
            }}>
            
            <tr
              style={{
                height: '36px'
              }}>
              
              {columns.map((column, index) => {
                const width = getColumnWidth(column);
                const hasMenu = column.label !== '';
                return (
                  <th
                    key={column.id}
                    draggable={!column.sticky && !resizingRef.current}
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`text-left group ${column.sticky ? 'sticky left-0' : ''} ${!column.sticky ? 'cursor-move' : ''}`}
                    style={{
                      width: `${width}px`,
                      minWidth: column.minWidth,
                      textAlign: (column.align || 'left') as any,
                      padding: '0 12px',
                      border: '1px solid #E4E4E6',
                      verticalAlign: 'middle',
                      position: column.sticky ? undefined : 'relative',
                      backgroundColor: '#FFFFFF',
                      zIndex: column.sticky ? 20 : undefined,
                      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
                    }}>
                    
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                      
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          flex: 1,
                          minWidth: 0
                        }}>
                        
                        {column.label &&
                        <span
                          style={{
                            fontFamily:
                            'Inter, ui-sans-serif, system-ui, sans-serif',
                            fontWeight: 500,
                            fontSize: '11px',
                            lineHeight: '14.7px',
                            letterSpacing: '0.3px',
                            color: column.sortable ? '#0A0A0A' : '#60636A',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                          
                            {column.label}
                          </span>
                        }
                        {column.sortable &&
                        <span
                          style={{
                            fontSize: '11px',
                            lineHeight: '11px',
                            letterSpacing: '0.3px',
                            color: '#0A0A0A'
                          }}>
                          
                            <i className="fa-solid fa-arrow-up" />
                          </span>
                        }
                      </div>

                      {/* 3-dot menu button */}
                      {hasMenu &&
                      <>
                          <button
                          ref={(el) => {
                            menuButtonRefs.current[column.id] = el;
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuColumnId(
                              openMenuColumnId === column.id ?
                              null :
                              column.id
                            );
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            fontSize: '11px',
                            lineHeight: '11px',
                            color: '#60636A',
                            flexShrink: 0
                          }}
                          onMouseEnter={(e) => {
                            ;(
                            e.currentTarget as HTMLElement).
                            style.backgroundColor =
                            'var(--interactive-hover, #f0f0f0)';
                          }}
                          onMouseLeave={(e) => {
                            ;(
                            e.currentTarget as HTMLElement).
                            style.backgroundColor = 'transparent';
                          }}
                          aria-label={`${column.label} column options`}>
                          
                            <i className="fa-light fa-ellipsis-vertical" />
                          </button>

                          {openMenuColumnId === column.id &&
                        <ColumnMenu
                          columnLabel={column.label}
                          onAction={(action) =>
                          handleMenuAction(column.id, action)
                          }
                          onClose={() => setOpenMenuColumnId(null)}
                          anchorRef={
                          {
                            current: menuButtonRefs.current[column.id]
                          } as React.RefObject<HTMLElement>
                          } />

                        }
                        </>
                      }
                    </div>

                    {/* Resize handle */}
                    <div
                      onMouseDown={(e) =>
                      handleResizeStart(e, column.id, width)
                      }
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        cursor: 'col-resize',
                        zIndex: 5
                      }}
                      onMouseEnter={(e) => {
                        ;(
                        e.currentTarget as HTMLElement).
                        style.backgroundColor = 'var(--brand-color, #cc0e9e)';
                        (e.currentTarget as HTMLElement).style.opacity = '0.4';
                      }}
                      onMouseLeave={(e) => {
                        ;(
                        e.currentTarget as HTMLElement).
                        style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLElement).style.opacity = '1';
                      }} />
                    
                  </th>);

              })}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) =>
            <tr
              key={rowIndex}
              style={{
                height: '55px'
              }}
              className="transition-colors"
              onMouseEnter={(e) => {
                const cells = e.currentTarget.querySelectorAll('td');
                cells.forEach((cell) => {
                  ;(cell as HTMLElement).style.backgroundColor =
                  'var(--interactive-hover-row, #f8f8f8)';
                });
              }}
              onMouseLeave={(e) => {
                const cells = e.currentTarget.querySelectorAll('td');
                cells.forEach((cell) => {
                  ;(cell as HTMLElement).style.backgroundColor = '#FFFFFF';
                });
              }}>
              
                {columns.map((column) => {
                const width = getColumnWidth(column);
                return (
                  <td
                    key={column.id}
                    className={column.sticky ? 'sticky left-0' : ''}
                    style={{
                      width: `${width}px`,
                      minWidth: column.minWidth,
                      textAlign: (column.align || 'left') as any,
                      padding: '0 12px',
                      border: '1px solid #E4E4E6',
                      fontFamily:
                      'Inter, ui-sans-serif, system-ui, sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#0A0A0A',
                      verticalAlign: 'middle',
                      backgroundColor: '#FFFFFF',
                      transition: 'background-color 150ms',
                      zIndex: column.sticky ? 10 : undefined
                    }}>
                    
                      {column.render ?
                    column.render(getCellValue(row, column), row) :
                    getCellValue(row, column)}
                    </td>);

              })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}