import create from 'zustand'

declare var window: any

type TWalletStore = {
  hasMetaMask: boolean
  requestAccess(): void
  ready: boolean
  address: string
  dropdownActive: boolean
  setDropdownActive(dropdownActive: boolean): void
  disconnect(): void
}

const walletStore = create<TWalletStore>((set) => ({
  hasMetaMask: typeof window.ethereum !== 'undefined',
  address: '',
  ready: false,
  dropdownActive: false,

  setDropdownActive: (dropdownActive) => {
    set({ dropdownActive })
  },

  requestAccess: async () => {
    const address = walletStore.getState().address

    try {
      if (!address || address.length === 0) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        set({ address: accounts[0], ready: true })
      } else {
        set({ ready: true })
      }
    } catch {
      set({ ready: true })
    }
  },

  disconnect: () => {
    set({ dropdownActive: false })
  },
}))

export default walletStore
