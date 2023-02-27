import create from 'zustand'

declare var window: any

type TWalletStore = {
  connected: boolean
  ready: boolean
  address: any
  chainId: number
  dropdownActive: boolean
  setDropdownActive(dropdownActive: boolean): void
  disconnect(): void
  connect(address: string, chainId: number): void
}

const walletStore = create<TWalletStore>((set) => ({
  address: '',
  chainId: 1,
  ready: false,
  dropdownActive: false,
  connected: false,

  connect: (address, chainId) => {
    set({ address, chainId, connected: true })
  },

  disconnect: async () => {
    set({ dropdownActive: false, address: '', chainId: 0, connected: false })
  },

  setDropdownActive: (dropdownActive) => {
    set({ dropdownActive })
  },
}))

export default walletStore
