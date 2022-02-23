import classNames from 'classnames'
import React from 'react'

import walletStore from '../stores/walletStore'
import { ReactComponent as ChevronUp } from '../svg/chevron-up.svg'
import { ReactComponent as Arrow } from '../svg/arrow-up-right.svg'
import connector from '../walletConnect'

declare var window: any

export default function WalletDropdown() {
  const setActive = walletStore((s) => s.setDropdownActive)
  const active = walletStore((s) => s.dropdownActive)
  const address = walletStore((s) => s.address)
  const firstSix = address.slice(0, 5)
  const lastFour = address.substring(address.length - 4)
  const together = firstSix + '..' + lastFour

  const handleDisconnect = () => {
    if (connector?.peerMeta?.url) {
      window.open(connector?.peerMeta?.url, '_blank').focus()
    }
  }

  return (
    <div className={classNames('wallet-dropdown-wrap', { active })} onClick={() => setActive(false)}>
      <div className="wallet-dropdown-overlay"></div>
      <div className="wallet-dropdown" onClick={(e) => e.stopPropagation()}>
        <button
          className="wallet-dropdown-button uppercase"
          onClick={(e) => {
            e.stopPropagation()
            setActive(!active)
          }}
        >
          {together}
          <ChevronUp />
        </button>

        <div className="wallet-dropdown-dropdown">
          <a className="wallet-dropdown-wallet-link">
            <span className="wallet-dropdown-wallet-link-indicator"></span>
            <span className="wallet-dropdown-wallet-link-address">{together}</span>
            <Arrow />
          </a>
          <button onClick={handleDisconnect} className="wallet-dropdown-wallet-disconnect">
            Disconnect
          </button>
        </div>
      </div>
    </div>
  )
}
