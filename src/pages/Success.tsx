import React from 'react'
import Button from '../components/Button'
import Card, { CardFooter, CardPadding } from '../components/Card'
import Badge from '../components/Badge'
import { ReactComponent as Smile } from '../svg/smile.svg'
import Divider from '../components/Divider'
import NFTClaim from '../components/NFTClaim'

export default function Success() {
  return (
    <Card className="relative">
      <img src="https://cdn.shopify.com/s/files/1/0256/7723/4247/t/8/assets/home-photo-grid-2.jpg?v=2290235965064086127" />
      <CardPadding>
        <Badge>
          <Smile /> <span className="ml-2">Successful</span>
        </Badge>
        <h2 className="uppercase mt-4">Access Shirt</h2>

        <div className="success-body mt-1">
          <p>
            Created by <a href="#">Digit</a>
          </p>

          <p className="mt-3">
            Your entry to a secret society of makers &amp; misfits. You should go claim your paop here:{' '}
            <a href="#">http://blah.com/poap</a>
          </p>
        </div>

        <Divider />

        <h3 className="font-normal mt-4 mb-1 text-light-gray text-xs">Ethereum address</h3>
        <p className="break-word font-bold text-smb">0xb2E0F4dee26CcCf1f3A267Ad185f212Dd3e7a6b1</p>

        <Divider />

        <h3 className="font-normal mt-4 mb-4 text-light-gray text-xs">NFTs to claim</h3>

        <div className="space-y-3">
          <NFTClaim onClick={() => {}} title="NFT 1" />
          <NFTClaim onClick={() => {}} title="NFT 1" />
        </div>
      </CardPadding>
    </Card>
  )
}
