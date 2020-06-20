export const toSearchString = (searchParams = {}) => {
  return Object.keys(searchParams)
    .map(key => `${key}=${encodeURIComponent(searchParams[key])}`)
    .join('&')
}

export default (email, headers) => {
  let link = `mailto:${email}`
  if (headers) {
    link += `?${toSearchString(headers)}`
  }
  return link
}
