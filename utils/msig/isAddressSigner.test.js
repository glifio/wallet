import isAddressSigner from './isAddressSigner'

describe('isAddressSigner', () => {
  let lotus

  afterEach(() => {
    jest.clearAllMocks()
    lotus = {
      request: jest.fn(() => {
        return Promise.resolve('t0100')
      })
    }
  })

  test('it confirms non ID address signers', async () => {
    const walletAddress = 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy'
    const signers = ['t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy']
    expect(await isAddressSigner(lotus, walletAddress, signers)).toBe(true)
    signers.push('t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vidpy')
    signers.push('t137sjdbgunloi7couiy4l5dsafdsak2jmq32vidpy')
    expect(await isAddressSigner(lotus, walletAddress, signers)).toBe(true)
  })

  test('it rejects non ID address signers', async () => {
    const walletAddress = 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizty'
    const signers = ['t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy']
    expect(await isAddressSigner(lotus, walletAddress, signers)).toBe(false)
    signers.push('t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vidpy')
    signers.push('t137sjdbgunloi7couiy4l5dsafdsak2jmq32vidpy')
    expect(await isAddressSigner(lotus, walletAddress, signers)).toBe(false)
  })

  test('it accepts ID address signers', async () => {
    const walletAddress = 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizty'
    const signers = ['t0100', 't01002']
    expect(await isAddressSigner(lotus, walletAddress, signers)).toBe(true)
    expect(await isAddressSigner(lotus, 't0100', signers)).toBe(true)
  })

  test('it rejects ID address signers', async () => {
    const walletAddress = 't137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizty'
    const signers = ['t01001', 't01002']
    expect(await isAddressSigner(lotus, walletAddress, signers)).toBe(false)
    expect(await isAddressSigner(lotus, 't0100', signers)).toBe(false)
  })
})
