export default function truncateAddress(address) {
  const firstSix = address.slice(0, 5)
  const lastFour = address.substring(address.length - 4)
  const together = firstSix + '..' + lastFour

  return together
}
