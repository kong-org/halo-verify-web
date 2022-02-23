import create from 'zustand'
import connector from '../walletConnect'

declare var window: any

type TWalletStore = {
  requestAccess(): void
  connected: boolean
  ready: boolean
  address: string
  dropdownActive: boolean
  setDropdownActive(dropdownActive: boolean): void
  disconnect(): void
  connect(address: string): void
}

const walletStore = create<TWalletStore>((set) => ({
  address: connector?.accounts[0] || '',
  ready: false,
  dropdownActive: false,
  connected: connector.connected,

  requestAccess: async () => {
    if (!connector.connected) {
      connector.createSession()
    }
  },

  connect: (address) => {
    set({ address, connected: connector.connected })
  },

  disconnect: () => {
    set({ dropdownActive: false, address: '', connected: false })
  },

  setDropdownActive: (dropdownActive) => {
    set({ dropdownActive })
  },
}))

export default walletStore
