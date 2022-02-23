import create from 'zustand'
import URL from 'url-parse'

type TDeviceStore = {
  init(): void
}

const deviceStore = create<TDeviceStore>((set) => ({
  init: () => {
    const url = URL(window.location.href, true)
    console.log(url)
  },
}))

export default deviceStore
