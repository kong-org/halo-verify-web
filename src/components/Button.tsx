import classNames from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'

interface IProps {
  children?: React.ReactNode
  fullWidth?: boolean
  disabled?: boolean
  color?: 'black' | 'pink-gradient' | 'black-line'
  size?: 'regular' | 'small'
  href?: string
  to?: string
  onClick?(): void
  className?: string
}

export default function Button({
  children,
  fullWidth,
  color = 'black',
  disabled,
  size = 'regular',
  href,
  to,
  onClick,
  className,
}: IProps) {
  const cls = classNames('button', color, size, { fullWidth }, className)

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    )
  }

  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button disabled={disabled} className={cls} onClick={onClick}>
      {children}
    </button>
  )
}
