import create from 'zustand'
import deviceStore from './deviceStore'
import { ethers } from 'ethers'
import walletStore from './walletStore'
import connector from '../walletConnect'
import buf2hex from '../helpers/bufToHex'
import unpackDERSig from '../helpers/unpackDERSig'
import formatMinterSig from '../helpers/formatMinterSig'
import generateCmd from '../helpers/generateCMD'
import axios from 'axios'
const ipfsHash = require('ipfs-only-hash')

const ETH_NODE = 'https://mainnet.infura.io/v3/273c16c48360429b910360f9a0591015';
const BRIDGE_NODE = 'https://bridge-ropsten-t5n3k.ondigitalocean.app/mint';

type TRegisterStore = {
  urlMode: boolean
  base64Image: any
  previewing: boolean
  loading: boolean
  registered: boolean
  signed: boolean
  signing: boolean
  message: string
  registerForm: {
    name: string
    description: string
    imageSrc: string
    image: any
  }
  sigMsg: string
  sigSplit: any
  block: any

  setUrlMode(urlMode: boolean): void
  changeRegisterField(key: string, value: string): void
  changeFileField(file: any): void
  imageSrcSubmit(): void
  clearImage(): void
  setLoading(loading: boolean): void
  signHalo(): void
  scanHalo(): void
  registerHalo(): void
}

const registerStore = create<TRegisterStore>((set) => ({
  urlMode: false,
  base64Image: false,
  loading: false,
  previewing: false,
  registered: false,
  registerForm: {
    name: '',
    description: '',
    imageSrc: '',
    image: null,
  },
  sigMsg: '',
  sigSplit: false,
  block: false,
  registerData: false,
  signed: false,
  signing: false,
  message: 'Uploading media, this may take a minute or two.',

  setLoading: (loading) => {
    set({ loading })
  },

  changeRegisterField: (key, value) => {
    set((state) => ({
      registerForm: {
        ...state.registerForm,
        [key]: value,
      },
    }))
  },

  changeFileField: (file: any) => {
    // Set state to the file
    set((state) => ({
      registerForm: {
        ...state.registerForm,
        image: file,
      },
      previewing: true,
    }))

    // Generate a preview
    var FR = new FileReader()

    FR.addEventListener('load', function (e: any) {
      set({ base64Image: e.target.result })
    })

    FR.readAsDataURL(file)
  },

  imageSrcSubmit: () => {
    set({ urlMode: false, previewing: true })
  },

  setUrlMode: (urlMode) => {
    set({ urlMode })
  },

  clearImage: () => {
    set((state) => ({
      registerForm: {
        ...state.registerForm,
        image: false,
        imageSrc: '',
      },
      base64Image: '',
      previewing: false,
    }))
  },

  // TODO: sign the address of the connected wallet with blockhash if available.
  scanHalo: async () => {
    const { triggerScan } = deviceStore.getState()
    const provider: any = new ethers.providers.JsonRpcProvider(
      ETH_NODE
    )

    const block = await provider.getBlock()
    // Note: we may want to change this format to accomodate more data than the blockHash in the future.
    const sigMsg = block.hash
    const sigCmd = generateCmd(1, 1, sigMsg)
    const sig = await triggerScan(sigCmd)
    const sigString = buf2hex(sig)
    const sigSplit = unpackDERSig(sigString)

    set({ sigSplit, sigMsg, block })
  },

  signHalo: async () => {
    console.log(`sign called`)
    const { keys } = deviceStore.getState()
    const { address, chainId } = walletStore.getState()
    const device_id = keys?.primaryPublicKeyHash.substring(2)

    const { name, description, image } = registerStore.getState().registerForm
    const device_token_metadata = { name, description }
    const { block, sigMsg, sigSplit, base64Image } = registerStore.getState()

    const ipfsCid = await ipfsHash.of(base64Image)
    console.log(`ipfs hash ${ipfsCid}`)

    // Draft Message Parameters
    const typedData = {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
        ],
        Device: [
          { name: "id", type: "string" },
          { name: "signature", type: "string" },          
          { name: "messageSigned", type: "string" },  
        ],
        Media: [
          { name: "mediaCid", type: "string" },
          { name: "tokenMetadata", type: "string" },
          { name: "minterAddress", type: "address" },
          { name: "device", type: "Device" },
        ],
      },
      primaryType: "Media",
      domain: {
        name: "ERS",
        version: "0.1.0",
        chainId: 1,
      },
      message: {
        mediaCid: ipfsCid,
        tokenMetadata: JSON.stringify(device_token_metadata),
        minterAddress: address,
        device: {
          id: device_id,
          signature: JSON.stringify(sigSplit),
          messageSigned: sigMsg,
        },
      },
    };

    console.log(`typedData ${typedData}`)

    const msgParams = [
      address, // Required
      typedData, // Required
    ];
    
    // const sigData = {
    //   media: ipfsCid,
    //   device_id,
    //   device_token_metadata: JSON.stringify(device_token_metadata),
    //   minter_addr: address,
    //   blockNumber: block.number,
    //   device_sig: JSON.stringify(sigSplit)
    // }

    // TODO: sign the full data param, not just device_id.
    // const msgParams = [address, ethers.utils.hashMessage(device_id!)]
  
    connector
      .signMessage(msgParams)
      .then((result) => {
        set({ loading: true })

        const data = {
          media: image,
          device_id,
          device_token_metadata: JSON.stringify(device_token_metadata),
          device_sig: JSON.stringify(sigSplit),
          device_sig_msg: sigMsg, // Note: we may want to include more data here than just block information, hence blockNumber alone is insufficient.
          blockNumber: block.number,
          minter_addr: address,
          minter_sig: JSON.stringify(formatMinterSig(result)),
          minter_chain_id: chainId
        }

        function getFormData(object: any) {
          const formData = new FormData()
          Object.keys(object).forEach((key) => formData.append(key, object[key]))
          return formData
        }

        const form = getFormData(data)

        axios
          .post(BRIDGE_NODE, form, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((res) => {
            set({ message: 'Mint successful! Retrieving record.' })

            const { getDevice } = deviceStore.getState()

            const poller = setInterval(() => {
              getDevice()
              const { registered } = deviceStore.getState()

              if (registered) {
                clearInterval(poller)
                set({ signed: true })
              }
            }, 5000)
          })
          .catch((err) => {
            set({ loading: false })
            alert('Something went wrong.')
            console.log(err)
          })
      })
      .catch((error) => {
        set({ loading: false })
        alert('Something went wrong.')
        console.log(error)
      })
  },

  registerHalo: () => {
    set({ loading: true })
  },
}))

export default registerStore
