import isActorMsig from './isActorMsig'

describe('isActorMsig', () => {
  test('it returns true for states that have Signers prop', () => {
    expect(isActorMsig({ Signers: ['t01001'] })).toBe(true)
  })

  test('it returns false for states that have no Signers prop', () => {
    expect(isActorMsig({ Signes: ['t01001'] })).toBe(false)
    expect(isActorMsig({})).toBe(false)
  })
})
