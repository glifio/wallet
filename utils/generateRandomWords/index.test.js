import generateRandomWords from '.'

const mnemonic =
  'tuna sun current because impact nuclear actor immune auction gun nominee vivid zoo tell vicious canvas master lottery reflect uphold cinnamon spice left educate'

describe('generateRandomWords', () => {
  test('it returns a set with numRandoms amount of numbers', () => {
    const vals = generateRandomWords(mnemonic, 4)
    expect(vals.size).toBe(4)
    expect(vals instanceof Set).toBe(true)
    vals.forEach(val => expect(typeof val).toBe('number'))
  })

  test('it returns ascending set', () => {
    const vals = generateRandomWords(mnemonic, 10).entries()
    let isAscending = true
    for (let i = 0; i < vals.size; i += 1) {
      isAscending = isAscending && vals[i] <= vals[i + 1]
    }
    expect(isAscending).toBe(true)
  })

  test('it only returns unique values', () => {
    const vals = [...generateRandomWords(mnemonic, 10)]
    const unique = vals.filter((v, i, a) => a.indexOf(v) === i)
    expect(unique.length).toBe(vals.length)
  })
})
