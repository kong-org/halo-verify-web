import React, { useEffect } from 'react'
import Button from '../components/Button'
import Card, { CardFooter, CardPadding } from '../components/Card'
import Chip from '../components/Chip'
import deviceStore from '../stores/deviceStore'
import walletStore from '../stores/walletStore'

function LinkButton() {
  const keys = deviceStore((s) => s.keys)
  const device = deviceStore((s) => s.device)
  const linkHalo = deviceStore((s) => s.linkHalo)
  const connected = walletStore((s) => s.address).length > 0
  const registered = deviceStore((s) => s.registered)

  if (!keys) {
    return (
      <Button fullWidth onClick={linkHalo}>
        Scan Halo
      </Button>
    )
  } else if (device && registered) {
    return (
      <Button to={'/success'} fullWidth>
        View Halo
      </Button>
    )
  } else if (device && !connected && !registered) {
    return (
      <Button fullWidth disabled>
        Link Halo
      </Button>
    )
  } else if (device && keys && !registered) {
    return (
      <Button to={'/register'} fullWidth>
        Link Halo
      </Button>
    )
  } else {
    return (
      <Button fullWidth disabled>
        Link Halo
      </Button>
    )
  }
}

export default function Home() {
  const init = deviceStore((s) => s.init)
  const keys = deviceStore((s) => s.keys)
  const connected = walletStore((s) => s.address).length > 0
  const registered = deviceStore((s) => s.registered)

  useEffect(() => {
    init()
  }, [])

  return (
    <Card>
      <CardPadding>
        <Chip detected={keys ? true : false} />
        {keys ? (
          <>
            <h1 className="text-3xl mt-6 font-expanded uppercase">
              Halo
              <br />
              Detected
            </h1>
            <p className="text-dark-gray text-sm mt-4 mb-4">
              This device hasn’t been registered. Tap link below to link device.
            </p>
            <h3 className="font-normal mt-4 mb-1 text-light-gray text-xs">Primary public key</h3>
            <p className="break-word font-bold text-smb">{keys?.primaryPublicKeyHash}</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl mt-6 font-expanded uppercase">
              Halo
              <br />
              Undetected
            </h1>
            <p className="text-dark-gray text-sm mt-4 mb-4">Please link your halo chip using the button below.</p>
          </>
        )}
      </CardPadding>
      <CardFooter>
        <CardPadding>
          {LinkButton()}
          {!connected && !registered && (
            <p className="text-center text-xs text-light-gray uppercase mt-4">Connect wallet to link Halo</p>
          )}
        </CardPadding>
      </CardFooter>
    </Card>
  )
}
