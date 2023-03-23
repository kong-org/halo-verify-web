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
import walletStore from './walletStore'
import { getChainData } from '../helpers/getChainData'

// Note: one can create "test" records by modifying the Eth node and selecting a different chain in the wallet which signs.
const ARWEAVE_GRAPHQL = process.env.REACT_APP_ARWEAVE_NODE + '/graphql' || 'https://arweave.net/graphql'
const TAG_DOMAIN = window.location.host

console.log(`tag domain is : ${TAG_DOMAIN}`)

// TODO: allow the user to select a chain id
const { chainId } = walletStore.getState()

const CHAIN_ID = chainId || 1
const ETH_NODE = getChainData(CHAIN_ID).rpc_url

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
      .post(ARWEAVE_GRAPHQL, { query })
      .then(async (res) => {
        console.log('re got a response', res)

        // Default to first record
        let rightTransaction = res.data.data.transactions.edges[0]

        // Look for a matching registered record
        for (let i = 0; i < res.data.data.transactions.edges.length; i++) {
          const transaction = res.data.data.transactions.edges[i]

          if (!transaction?.node?.tags) continue

          let chainPass = false
          let mediaPass = false

          for (let j = 0; j < transaction.node.tags.length; j++) {
            const tag = transaction.node.tags[j]

            if (tag.name === 'Device-Record-Type' && tag.value === 'Device-Media') {
              mediaPass = true
              continue
            }

            if (tag.name === 'Device-Minter-Chain-Id' && Number(tag.value) === chainId) {
              chainPass = true
              continue
            }
          }

          if (chainPass && mediaPass) {
            console.log('we found a match', transaction)
            rightTransaction = transaction
            break
          }
        }

        // Create a device object from the first record
        const mapped = [rightTransaction].flatMap((nodeItem: any) => {
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
            chain_id: safeTag(node, 'Device-Minter-Chain-Id', null),
          }
        })

        console.log('Creating a device object', mapped[0])

        // Filter for only chainId 1. TODO: show records created for multiple chains.
        console.log(`filtering for + ${CHAIN_ID}`)
        set({
          device: mapped[0],
          registered: mapped[0].device_record_type === 'Device-Media' && +mapped[0].chain_id === CHAIN_ID,
          loading: false,
        })

        if (mapped[0].device_minter && mapped[0].chain_id === CHAIN_ID) {
          // Get the creator
          const provider: any = new ethers.providers.JsonRpcProvider(ETH_NODE)

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
          rpId: TAG_DOMAIN,
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
