import React from 'react'
import style from './Table.module.scss'
import classNames from 'classnames'

interface TableProps<T> {
  headers: string[]
  data: T[]
  loading?: boolean
  emptyText?: string
  renderRow: (row: T) => React.ReactNode[]
}

export default function Table<T>({ headers, data, loading, emptyText, renderRow }: TableProps<T>) {
  return (
    <div className={style.tableContainer}>
      <table className={style.table}>
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className={style.th}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={headers.length} className={classNames(style.td, style.centerCell)}>
                Загрузка...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className={classNames(style.td, style.centerCell)}>
                {emptyText || 'Нет данных'}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx}>
                {renderRow(row).map((cell, cidx, arr) => (
                  <td
                    key={cidx}
                    className={classNames(
                      style.td,
                      cidx === arr.length - 1 && style.actionsCell
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
} 