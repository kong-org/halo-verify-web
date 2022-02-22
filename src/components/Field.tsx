import React from 'react'

interface IProps {
  name: string
  id?: string
  label?: string
  type?: 'text' | 'textarea'
  placeholder?: string
  onChange(key: string, value: string): void
  value: string
}

export default function Field({ name, id, label, type, placeholder, onChange, value }: IProps) {
  const handleChange = (e: any) => {
    const { value } = e.target
    onChange(name, value)
  }

  if (type === 'textarea') {
    return (
      <div className="field">
        {label && <label htmlFor={id || name}>{label}</label>}
        <textarea value={value} onChange={handleChange} placeholder={placeholder} id={id || name} />
      </div>
    )
  }

  return (
    <div className="field">
      {label && <label htmlFor={id || name}>{label}</label>}
      <input value={value} onChange={handleChange} type={type} placeholder={placeholder} id={id || name} />
    </div>
  )
}
