import isBase64 from '.'
describe('isBase64', () => {
  test('it returns true for valid base64', () => {
    expect(
      isBase64('WTVkaFdoSXJFS0N1RkJGZmdKVG1Vc1RHTlZBVzZnV1laa1MwaERWTHN1VQ==')
    ).toBe(true)
    expect(
      isBase64('SWlZT0FacmY4SmNIbUFRUjVDMld2VnBKNkVkblFSeDFGUHgwcV9QakJHVQ==')
    ).toBe(true)
    expect(
      isBase64('TU9hY0pFdXhTbkRncTQ0eXpaRmMzdlFKdkN1Tm9sZ3hPYldHWWxQSGdBSQ==')
    ).toBe(true)
    expect(
      isBase64('b013QnpMSWY2b1Y2WnVfS09RNGYxMXZQZG1RcDM2eUNocm10dGpzRGpZVQ==')
    ).toBe(true)
    expect(
      isBase64('bWJydW0zelBMNWwzTkhJRWRSSnJiV0ktV3B0WFJVdkhObng1SEdaZFY3bw==')
    ).toBe(true)
  })

  test('it returns false for invalid base64', () => {
    expect(
      isBase64('WTVkaFdoSXJFS0N1RkJGZmdKVG1Vc1RHTlZBVzZnV1laa1MwaERWTHN1VQ')
    ).toBe(false)
    expect(isBase64('SWlZT0FacmY4SmNIbUFRUjVDMld2VnBKNkVkblFkJHVQ==')).toBe(
      false
    )
    expect(isBase64('hi')).toBe(false)
    expect(isBase64('fdsafgdsatreawfeawvdsab')).toBe(false)
    expect(
      isBase64('bWJydW0zelBMNWwzTkhJRWRSSnJiV0ktV3B0WFJVdkhObng1SEdaZFY3bw=')
    ).toBe(false)
  })
})
