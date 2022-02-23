import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'

const connector = new WalletConnect({
  bridge: 'https://bridge.walletconnect.org',
  qrcodeModal: QRCodeModal,
})

export default connector
