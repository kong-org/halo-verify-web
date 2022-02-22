import React from 'react'

interface IProps {
  children?: React.ReactNode
}

export default function GrayCenterBox({ children }: IProps) {
  return (
    <div className="gray-center-box">
      <div>{children}</div>
    </div>
  )
}
