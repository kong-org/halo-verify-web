import create from 'zustand'
import URL from 'url-parse'
import axios from 'axios'
import parseKeys from '../helpers/parseKeys'
import safeTag from '../helpers/safeTag'
import fromHexString from '../helpers/fromHexString'
import buf2hex from '../helpers/bufToHex'
import { IDevice, IKeys } from '../types'
import generateArweaveQuery from '../helpers/generateArweaveQuery'
import { ethers } from 'ethers'

type TDeviceStore = {
  keys: IKeys | null
  device: IDevice | null
  registered: boolean
  creator: string | null
  loading: boolean
  init(): void
  getDevice(): void
  linkHalo(): void
  triggerScan(reqx: any): void
}

const deviceStore = create<TDeviceStore>((set) => ({
  keys: null,
  device: null,
  registered: false,
  creator: null,
  loading: false,

  init: () => {
    const url = URL(window.location.href, true)
    const keys = parseKeys(url.query.static)

    if (keys) {
      set({ keys })
      deviceStore.getState().getDevice()
    }
  },

  getDevice: async () => {
    console.log('Fetching the device')

    const { keys } = deviceStore.getState()

    // Return early if we don't have keys
    if (!keys) return

    console.log('We have keys continuing')

    set({ loading: true })

    // if we do fetch data from arweave
    const query = generateArweaveQuery(keys)

    console.log('Generating query', query)

    axios
      .post('https://arweave.net/graphql', { query })
      .then(async (res) => {
        console.log('re got a response', res)

        const transactions = res.data.data.transactions.edges
        const transactionIndex = transactions.findIndex((t: any) => {
          const tag = t.node.tags.find((tag: any) => {
            return tag.name === 'Device-Record-Type'
          })

          if (tag === 'Device-Media') return
        })
        const tIndex = transactionIndex > -1 ? transactionIndex : 0

        console.log('Search response for device-media record index', tIndex)

        // Create a device object from the first record
        const mapped = [transactions[tIndex || 0]].flatMap((nodeItem: any) => {
          const node = nodeItem.node

          return {
            node_id: node.id,
            app_name: safeTag(node, 'App-Name', null),
            app_version: safeTag(node, 'App-Version', null),
            content_type: safeTag(node, 'Content-Type', null),
            device_record_type: safeTag(node, 'Device-Record-Type', null),
            device_id: safeTag(node, 'Device-Id', null),
            device_address: safeTag(node, 'Device-Address', null),
            device_manufacturer: safeTag(node, 'Device-Manufacturer', null),
            device_model: safeTag(node, 'Device-Model', null),
            device_merkel_root: safeTag(node, 'Device-Merkel-Root', null),
            device_registry: safeTag(node, 'Device-Registry', null),
            ifps_add: safeTag(node, 'IPFS-Add', null),
            device_token_metadata: safeTag(node, 'Device-Token-Metadata', null),
            device_minter: safeTag(node, 'Device-Minter', null),
          }
        })

        console.log('Creating a device object', mapped[0])

        set({ device: mapped[0], registered: mapped[0].device_record_type === 'Device-Media', loading: false })

        console.log(mapped[0])

        if (mapped[0].device_minter) {
          // Get the creator
          const provider: any = new ethers.providers.JsonRpcProvider(
            'https://mainnet.infura.io/v3/273c16c48360429b910360f9a0591015'
          )

          const creator = await provider.lookupAddress(mapped[0].device_minter)

          set({ creator, loading: false })
        }
      })
      .catch((err) => {
        console.log(err)
        set({ loading: false })
      })
  },

  triggerScan: async (reqx: any) => {
    try {
      var req: any = {
        publicKey: {
          allowCredentials: [
            {
              id: fromHexString(reqx),
              transports: ['nfc'],
              type: 'public-key',
            },
          ],
          challenge: new Uint8Array([
            113, 241, 176, 49, 249, 113, 39, 237, 135, 170, 177, 61, 15, 14, 105, 236, 120, 140, 4, 41, 65, 225, 107,
            63, 214, 129, 133, 223, 169, 200, 21, 88,
          ]),
          rpId: '3000.robbyk.xyz',
          timeout: 60000,
          userVerification: 'discouraged',
        },
      }

      var xdd: any = await navigator.credentials.get(req)

      return xdd?.response.signature
    } catch (err) {
      console.log('Error with scan', err)
    }
  },

  linkHalo: async () => {
    const { triggerScan, getDevice } = deviceStore.getState()
    const sig = await triggerScan('02')

    if (typeof sig !== 'undefined') {
      const sss = buf2hex(sig)
      const keys = parseKeys(sss)

      if (keys) {
        set({ keys })
        getDevice()
      }
    }
  },
}))

export default deviceStore
