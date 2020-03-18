export default (networkCode, i) => {
  if (networkCode !== 461 && networkCode !== 1)
    throw new Error('Invalid network code passed')
  return `m/44'/${networkCode}'/0/0/${i}`
}
