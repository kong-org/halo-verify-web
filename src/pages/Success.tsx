import React, { useEffect } from 'react'
import Card, { CardPadding } from '../components/Card'
import Badge from '../components/Badge'
import { ReactComponent as Smile } from '../svg/smile.svg'
import Divider from '../components/Divider'
import deviceStore from '../stores/deviceStore'
import { Navigate } from 'react-router-dom'
import Loading from '../components/Loading'

export default function Success() {
  const ds = deviceStore()

  useEffect(() => {
    if (ds.device && !ds.registered) {
      ds.getDevice()
    }
  }, [])

  if (!ds.device) return <Navigate to="/" />

  if (ds.device && !ds.registered) {
    return (
      <Card>
        <CardPadding>
          <div className="loading-wrap-2">
            <Loading />
          </div>
        </CardPadding>
      </Card>
    )
  }

  const meta = JSON.parse(ds.device.device_token_metadata)

  return (
    <Card className="relative">
      <img src={`https://arweave.net/${ds.device.node_id}`} />
      <CardPadding>
        <Badge>
          <Smile /> <span className="ml-2">Successful</span>
        </Badge>
        <h2 className="uppercase mt-4">{meta.name}</h2>

        <div className="success-body mt-1">
          {ds.creator && (
            <p>
              Created by <a href={`https://etherscan.io/address/${ds.creator}`}>{ds.creator}</a>
            </p>
          )}

          <p className="mt-3">{meta.description}</p>
        </div>

        <Divider />

        <h3 className="font-normal mt-4 mb-1 text-light-gray text-xs">Ethereum address</h3>
        <p className="break-word font-bold text-smb">{ds.keys?.primaryPublicKeyHash}</p>
      </CardPadding>
    </Card>
  )
}
