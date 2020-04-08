import updateArrayItem from '.'

describe('updateArrayItem', () => {
  test('it updates string item properly', () => {
    let array = ['1', '1', '3']
    array = updateArrayItem(array, 1, '2')

    expect(array[0]).toEqual('1')
    expect(array[1]).toEqual('2')
    expect(array[2]).toEqual('3')
  })

  test('it updates object item properly', () => {
    let array = [{ key: 'val' }, { key: 'val' }, { key: 'val' }]
    array = updateArrayItem(array, 2, { newKey: 'new val' })

    expect(array[0].key).toEqual('val')
    expect(array[1].key).toEqual('val')
    expect(array[2].newKey).toEqual('new val')
    expect(array[2].key).toEqual(undefined)
  })
})
