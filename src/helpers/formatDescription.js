export default function formatDescription(txt) {
  // use whatever you want here
  const URL_REGEX =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  return txt.split(' ').map((part) =>
    URL_REGEX.test(part) ? (
      <a target="_blank" href={part}>
        {part}{' '}
      </a>
    ) : (
      part + ' '
    )
  )
}
