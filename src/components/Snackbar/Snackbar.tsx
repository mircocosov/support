import { useEffect, useState } from 'react'
import style from './Snackbar.module.scss'
import classNames from 'classnames'

interface SnackbarProps {
  open: boolean
  onClose: () => void
  message: string
  severity?: 'success' | 'error'
}

export default function Snackbar({ open, onClose, message, severity = 'success' }: SnackbarProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className={classNames(
      style.snackbar,
      severity === 'success' ? style.snackbarSuccess : style.snackbarError
    )}>
      {message}
    </div>
  )
} 