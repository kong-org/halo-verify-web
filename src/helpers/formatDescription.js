import { marked } from 'marked'

export default function formatDescription(txt) {
  return marked(txt)
}
