import React from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import { ReactComponent as ChevronLeft } from '../svg/chevron-left.svg'
import { ReactComponent as Loading } from '../svg/loading.svg'

interface IProps {
  children?: React.ReactNode
  className?: string
  loading?: boolean
}

interface IProps2 {
  children?: React.ReactNode
  className?: string
  to: string
}

export default function Card({ children, className, loading }: IProps) {
  return (
    <div className={classNames('card', className)}>
      {loading && (
        <div className="card-loading">
          <div className="loading-wrap">
            <div className="loading"></div>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

export function CardFooter({ children, className }: IProps) {
  return <div className={classNames('card-footer', className)}>{children}</div>
}

export function CardPadding({ children, className }: IProps) {
  return <div className={classNames('card-padding', className)}>{children}</div>
}

export function CardBack({ children, className, to }: IProps2) {
  return (
    <Link to={to} className={classNames('card-back', className)}>
      <span className="card-back-icon">
        <ChevronLeft />
      </span>

      {children}
    </Link>
  )
}
