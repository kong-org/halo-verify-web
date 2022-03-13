import { ethers } from 'ethers'
import buf2hex from './bufToHex'

export default function generateCmd(cmd, keyslot, message = null) {
  // EIP-191 signed data for local verification.
  let messageBytes = ethers.utils.hashMessage(message)

  // Remove prepended 0x.
  messageBytes = messageBytes.slice(2)

  // Structure command bytes.
  let cmdBytes = new Uint8Array(2)
  cmdBytes[0] = cmd
  cmdBytes[1] = keyslot
  cmdBytes = buf2hex(cmdBytes)

  // Prepend the message with the command.
  const inputBytes = cmdBytes + messageBytes

  return inputBytes
}
