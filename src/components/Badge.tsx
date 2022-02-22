import React from 'react'

interface IProps {
  children: React.ReactNode
}

export default function Badge({ children }: IProps) {
  return <div className="badge">{children}</div>
}
