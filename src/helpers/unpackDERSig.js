// This shit is nasty.
export default function unpackDERSig(sig) {
  let header0 = sig.slice(0, 2)
  if (parseInt('0x' + header0) !== 0x30) {
    throw Error('Invalid header.')
  }

  let header_r0 = sig.slice(4, 6)
  let header_r1 = sig.slice(6, 8)

  if (parseInt('0x' + header_r0) !== 0x02) {
    throw Error('Invalid header (2).')
  }

  let length_r = parseInt('0x' + header_r1) * 2
  let r = sig.slice(8, length_r + 8)

  let header_s0 = sig.slice(length_r + 8, length_r + 10)
  let header_s1 = sig.slice(length_r + 10, length_r + 12)

  if (parseInt('0x' + header_s0) !== 0x02) {
    throw Error('Invalid header (2).')
  }

  let s = sig.slice(length_r + 12, length_r + 12 + parseInt('0x' + header_s1) * 2)

  if (r.length == 66) {
    r = r.slice(2, 130)
  }

  if (s.length == 66) {
    s = s.slice(2, 130)
  }

  return {
    r: r,
    s: s,
  }
}
