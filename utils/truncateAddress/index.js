export default address => {
  if (address.length <= 9) return address

  return `${address.slice(0, 6)} ... ${address.slice(-6)}`
}
