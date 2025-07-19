import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import style from './Button.module.scss'

export interface ButtonProps {
  type: 'primary' | 'text'
  link?: string
  children?: ReactNode
  className?: string
  isDisabled?: boolean
  onClick?: (e: React.MouseEvent) => void
}

export default function Button({
  className,
  type = 'primary',
  link,
  children,
  isDisabled,
  onClick,
}: ButtonProps) {
  if (link) {
    return (
      <Link
        to={link}
        className={classNames(style.button, style[type], className, {
          [style.disabled]: isDisabled,
        })}
        onClick={(e) => isDisabled && e.preventDefault()}
      >
        {children}
      </Link>
    )
  }
  return (
    <button
      className={classNames(style.button, style[type], className)}
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
