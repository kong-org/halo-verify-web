import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import walletStore from '../stores/walletStore'

import { ReactComponent as Logo } from '../svg/logo.svg'
import connector from '../walletConnect'
import Button from './Button'
import WalletDropdown from './WalletDropdown'

export default function Header() {
  const store = walletStore()

  console.log(store)

  useEffect(() => {
    connector.on('connect', (error, payload) => {
      if (error) return
      store.connect(payload.params[0].accounts[0])
    })

    connector.on('session_update', (error, payload) => {
      if (error) return
      store.connect(payload.params[0].accounts[0])
    })

    connector.on('disconnect', (error, payload) => {
      if (error) return
      console.log('disconnect triggered!')
      store.disconnect()
    })
  }, [])

  return (
    <header className="header">
      <Link to="/">
        <Logo />
      </Link>

      {store.connected ? (
        <WalletDropdown />
      ) : (
        <Button size="small" color="pink-gradient" onClick={store.requestAccess}>
          Connect wallet
        </Button>
      )}
    </header>
  )
}
