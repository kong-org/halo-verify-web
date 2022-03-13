import create from 'zustand'
import connector from '../walletConnect'

declare var window: any

type TWalletStore = {
  requestAccess(): void
  connected: boolean
  ready: boolean
  address: string
  chainId: number
  dropdownActive: boolean
  setDropdownActive(dropdownActive: boolean): void
  disconnect(): void
  connect(address: string, chainId: number): void
}

const walletStore = create<TWalletStore>((set) => ({
  address: connector?.accounts[0] || '',
  chainId: connector?.chainId || 1,
  ready: false,
  dropdownActive: false,
  connected: connector.connected,

  requestAccess: async () => {
    if (!connector.connected) {
      connector.createSession()
    }
  },

  connect: (address, chainId) => {
    set({ address, chainId, connected: connector.connected })
  },

  disconnect: async () => {
    await connector.killSession()
    set({ dropdownActive: false, address: '', chainId: 0, connected: false })
  },

  setDropdownActive: (dropdownActive) => {
    set({ dropdownActive })
  },
}))

export default walletStore
