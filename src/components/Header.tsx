import React from 'react'
import { Link } from 'react-router-dom'
import walletStore from '../stores/walletStore'

import { ReactComponent as Logo } from '../svg/logo.svg'
import Button from './Button'
import WalletDropdown from './WalletDropdown'

export default function Header() {
  const hasMetaMask = walletStore((s) => s.hasMetaMask)
  const requestAccess = walletStore((s) => s.requestAccess)
  const address = walletStore((s) => s.address)

  return (
    <header className="header">
      <Link to="/">
        <Logo />
      </Link>

      {hasMetaMask ? (
        <>
          {address.length === 0 ? (
            <Button size="small" color="pink-gradient" onClick={requestAccess}>
              Connect wallet
            </Button>
          ) : (
            <WalletDropdown />
          )}
        </>
      ) : (
        <Button size="small" color="pink-gradient" href="https://metamask.io">
          Install Metamask
        </Button>
      )}
    </header>
  )
}
