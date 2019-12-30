export const shortenAddress = (address) => {
  const beginning = address.slice(0, 5)
  const end = address.slice(address.length - 5, address.length)
  return beginning + '...' + end
}
