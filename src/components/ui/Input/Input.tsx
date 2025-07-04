import classNames from 'classnames'
import style from './Input.module.scss'

export interface InputProps {
  placeholder?: string
  className?: string
  type?: 'text' | 'password' | 'email'
  value?: string | number
  name?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

export default function Input({
  className,
  placeholder,
  type,
  value,
  name,
  onChange,
  required,
}: InputProps) {
  return (
    <input
      type={type}
      className={classNames(style.input, className)}
      placeholder={placeholder}
      value={value}
      name={name}
      onChange={onChange}
      required={required}
    />
  )
}
