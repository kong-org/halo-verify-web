export default function safeTag(node, tagName, defaultValue) {
  const tag = node.tags.find((tag) => tag.name === tagName)
  return tag ? tag.value : defaultValue
}
