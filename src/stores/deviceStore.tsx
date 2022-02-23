import create from 'zustand'
import URL from 'url-parse'
import axios from 'axios'

type TDeviceStore = {
  primaryKey: string
  init(): void
  linkHalo(): void
}

const deviceStore = create<TDeviceStore>((set) => ({
  primaryKey: '',

  init: () => {
    const url = URL(window.location.href, true)

    if (url?.query?.cmd) {
      set({ primaryKey: url?.query?.cmd })
    } else {
      alert('no primary key!')
    }
  },

  linkHalo: () => {
    // Get
    axios.get('https://jsonplaceholder.typicode.com/todos/1').then((res) => {
      console.log(res.data)
    })

    // Post
    const data = {
      title: 'foo',
      body: 'bar',
      userId: 1,
    }

    const headers = {
      Robby: 'is sooooooo cool',
    }

    axios.post('https://jsonplaceholder.typicode.com/posts', data, { headers }).then((res) => {
      console.log(res.data)
    })
  },
}))

export default deviceStore
