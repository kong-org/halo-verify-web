import React from 'react'
import Button from './Button'

interface IProps {
  title: string
  onClick(): void
}

export default function NFTClaim({ title, onClick }: IProps) {
  return (
    <div className="nft-claim">
      <div className="nft-claim-title">{title}</div>
      <Button size="small" onClick={onClick}>
        Claim
      </Button>
    </div>
  )
}
