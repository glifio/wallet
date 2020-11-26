import getAddrFromReceipt from '.'

describe('decodeTxReceipt', () => {
  test('it decodes a receipt', () => {
    expect(getAddrFromReceipt('gkMA1xJVAvKriskdpguj4VPi+gQa9hMsYso8')).toBe(
      'f26kvyvsi5uyf2hykt4l5aigxwcmwgfsr47zul2ri'
    )
  })
})
