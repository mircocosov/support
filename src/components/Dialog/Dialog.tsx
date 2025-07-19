import React, { useEffect, useState } from 'react'
import style from './Dialog.module.scss'
import classNames from 'classnames'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  children?: React.ReactNode
  actions?: React.ReactNode
}

export default function Dialog({ open, onClose, title, children, actions }: DialogProps) {
  const [showBackdrop, setShowBackdrop] = useState(open)
  const [showDialog, setShowDialog] = useState(open)
  const [animateDialog, setAnimateDialog] = useState(false)

  useEffect(() => {
    if (open) {
      setShowBackdrop(true)
      setShowDialog(true)
      setTimeout(() => setAnimateDialog(true), 10)
    } else {
      setAnimateDialog(false)
      const timeout1 = setTimeout(() => setShowDialog(false), 350)
      const timeout2 = setTimeout(() => setShowBackdrop(false), 350)
      return () => { clearTimeout(timeout1); clearTimeout(timeout2) }
    }
  }, [open])

  if (!showBackdrop) return null
  return (
    <div className={classNames(style.dialogBackdrop, { [style['dialogBackdrop-animate']]: open })} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      {showDialog && (
        <div className={classNames(style.dialog, { [style['dialog-animate']]: animateDialog })} onClick={e => e.stopPropagation()}>
          {title && <div className={style.dialogTitle}>{title}</div>}
          <div className={style.dialogContent}>{children}</div>
          {actions && <div className={style.dialogActions}>{actions}</div>}
        </div>
      )}
    </div>
  )
} 