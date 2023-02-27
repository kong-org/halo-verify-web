import { useWeb3Modal } from '@web3modal/react'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAccount, useNetwork } from 'wagmi'
import walletStore from '../stores/walletStore'

import Button from './Button'
import WalletDropdown from './WalletDropdown'

export default function Header() {
  const store = walletStore()
  const { open } = useWeb3Modal()
  const { address, isConnected, isDisconnected } = useAccount()
  const { chain } = useNetwork()

  useEffect(() => {
    if (isConnected && address) {
      console.log('connected!')
      store.connect(address, chain?.id || 1)
    }

    if (isDisconnected) {
      store.disconnect()
    }
  }, [address, isConnected, isDisconnected])

  return (
    <header className="header">
      <Link to="/">
        <img width="62" src="/assets/logo.png" />
      </Link>

      {store.connected ? (
        <WalletDropdown />
      ) : (
        <Button size="small" color="pink-gradient" onClick={open}>
          Connect wallet
        </Button>
      )}
    </header>
  )
}
