export const shortenAddress = (address) => {
  let string
  const beginning = address.slice(0, 5)
  const end = address.slice(address.length - 5, address.length)
  string = beginning + '...' + end

  return string
}