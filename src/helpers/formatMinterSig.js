export default function formatMinterSig(sig) {
  var v = sig.substring(sig.length - 2)
  var r = sig.substring(2, 66)
  var s = sig.substring(66, sig.length - 2)
  return { r: r, s: s, v: v }
}
