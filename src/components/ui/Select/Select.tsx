import React, { useState, useRef, useEffect } from 'react'
import style from './Select.module.scss'
import classNames from 'classnames'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export default function Select({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Выберите...',
  className,
  disabled = false 
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(option => option.value === value)

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div className={classNames(style.select, className)} ref={selectRef}>
      <button
        type="button"
        className={classNames(style.selectButton, { 
          [style.open]: isOpen,
          [style.disabled]: disabled 
        })}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={classNames(style.selectedValue, {
          [style.placeholder]: !selectedOption
        })}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </button>
      
      {isOpen && (
        <div className={style.dropdown}>
          {options.length === 0 ? (
            <div className={style.noOptions}>Нет доступных опций</div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                className={classNames(style.option, {
                  [style.selected]: option.value === value
                })}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
