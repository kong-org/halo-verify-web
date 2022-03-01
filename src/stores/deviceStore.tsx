import create from 'zustand'
import URL from 'url-parse'
import axios from 'axios'
import parseKeys from '../helpers/parseKeys'
import safeTag from '../helpers/safeTag'
import fromHexString from '../helpers/fromHexString'
import buf2hex from '../helpers/bufToHex'

interface IKeys {
  primaryPublicKeyHash: string
  primaryPublicKeyRaw: string
  secondaryPublicKeyHash: string
  secondaryPublicKeyRaw: string
  tertiaryPublicKeyHash: string | null
  tertiaryPublicKeyRaw: string | null
}

interface IDevice {
  node_id: string
  app_name: string
  app_version: string
  content_type: string
  device_record_type: string
  device_id: string
  device_address: string
  device_manufacturer: string
  device_model: string
  device_merkel_root: string
  device_registry: string
  ifps_add: string
}

type TDeviceStore = {
  keys: IKeys | null
  device: IDevice | null
  init(): void
  getDevice(): void
  linkHalo(): void
  triggerScan(reqx: any): void
}

function generateQuery(keys: IKeys) {
  return `
  query {
      transactions(
          tags: [{
              name: "App-Name",
              values: ["ERS"]
          },{
              name: "Device-Id",
              values: ["${keys.primaryPublicKeyHash}"]
          },{
          name: "Device-Record-Type",
          values: ["Device-Create"]
      }
      ]
      ) {
          edges {
              cursor
              node {
              id
              tags {
                  name
                  value
              }
              block {
                  id
                  timestamp
                  height
              }
              }
          }
      }
  }
  `
}

const deviceStore = create<TDeviceStore>((set) => ({
  keys: null,

  device: null,

  init: () => {
    const url = URL(window.location.href, true)
    const keys = parseKeys(url.query.static)

    console.log(keys)

    if (keys) {
      set({ keys })
      deviceStore.getState().getDevice()
    }
  },

  getDevice: async () => {
    const { keys } = deviceStore.getState()
    if (!keys) return

    const query = generateQuery(keys)

    axios.post('https://arweave.net/graphql', { query }).then((res) => {
      const transactions = res.data.data.transactions.edges

      const mapped = transactions.flatMap((nodeItem: any) => {
        const node = nodeItem.node

        return {
          node_id: node.id,
          app_name: safeTag(node, 'App-Name', 'null'),
          app_version: safeTag(node, 'App-Version', 'null'),
          content_type: safeTag(node, 'Content-Type', 'null'),
          device_record_type: safeTag(node, 'Device-Record-Type', 'null'),
          device_id: safeTag(node, 'Device-Id', 'null'),
          device_address: safeTag(node, 'Device-Address', 'null'),
          device_manufacturer: safeTag(node, 'Device-Manufacturer', 'null'),
          device_model: safeTag(node, 'Device-Model', 'null'),
          device_merkel_root: safeTag(node, 'Device-Merkel-Root', 'null'),
          device_registry: safeTag(node, 'Device-Registry', 'null'),
          ifps_add: safeTag(node, 'IPFS-Add', 'null'),
        }
      })

      set({ device: mapped[0] })
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
      console.log({ err })
    }
  },

  linkHalo: async () => {
    const { triggerScan } = deviceStore.getState()
    const sig = await triggerScan('02')
    const sss = buf2hex(sig)
    console.log({ sss })
    const keys = parseKeys(sss)

    if (keys) set({ keys })
    console.log(keys)
  },
}))

export default deviceStore
