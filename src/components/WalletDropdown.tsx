import classNames from 'classnames'
import walletStore from '../stores/walletStore'
import { ReactComponent as ChevronUp } from '../svg/chevron-up.svg'
import truncateAddress from '../helpers/truncateAddress'
import { useDisconnect } from 'wagmi'

declare var window: any

export default function WalletDropdown() {
  const { disconnect } = useDisconnect()

  const setActive = walletStore((s) => s.setDropdownActive)

  const active = walletStore((s) => s.dropdownActive)
  const address = walletStore((s) => s.address)
  const together = truncateAddress(address)

  const handleDisconnect = () => {
    disconnect()
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
          <span className="wallet-dropdown-wallet-link">
            <span className="wallet-dropdown-wallet-link-indicator"></span>
            <span className="wallet-dropdown-wallet-link-address">{together}</span>
          </span>
          <button onClick={handleDisconnect} className="wallet-dropdown-wallet-disconnect">
            Disconnect
          </button>
        </div>
      </div>
    </div>
  )
}
