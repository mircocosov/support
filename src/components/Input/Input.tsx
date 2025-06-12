import style from './Input.module.scss'
import classNames from 'classnames'

interface Props {
  className?: string
  placeholder?: string
  type?: 'text' | 'password' | 'email'
  value?: string | number
}

export default function Input({ className, placeholder, type, value }: Props) {
  return (
    <input
      type={type}
      className={classNames(style.input, className)}
      placeholder={placeholder}
      value={value}
    />
  )
}
