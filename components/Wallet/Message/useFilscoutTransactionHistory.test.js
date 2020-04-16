import { act, renderHook } from '@testing-library/react-hooks'
import axios from 'axios'
import { cleanup } from '@testing-library/react'
import composeMockAppTree from '../../../test-utils/composeMockAppTree'

import useTransactionHistory from './useFilscoutTransactionHistory'

jest.mock('axios')

const mockData = JSON.parse(
  '[{"cid":"bafy2bzacea5463eugsz6f7dbwixzqxmwe2ouqeq6zukackb3xxotskdidqmjm","block_cid":"bafy2bzacecunksrqoiwvwx6oikijaaiz2ihdxqzfuamge4i44of4vgjuh6kwe","block_height":174246,"block_confirms":0,"timestamp":1586804670,"timestamp_str":"2 days 20 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","nonce":42,"value":"0.0001","value_str":"0.0001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000001","gas_limit":1000,"fee":"0.000000000000000138","receipt":0,"return":"","gas_used":138,"signature":{"type":"secp256k1","data":"ZvK9sZ6Q/Xwp5L9jYS65hRXlFjyXiIBCNkund9gY6IsKKtmBigjrYtPT5OFyDVGkl/lJ9eOmz1LVnjPv3xvanAE="}},{"cid":"bafy2bzacechoabzj3qmt6pmeazop4o7icjz3qryp2373rww6yyaehtggguaru","block_cid":"bafy2bzacea4ofuewprz5kgdayrsbwz22iluf7okvithcbg2ktbxda64hewkf6","block_height":174230,"block_confirms":0,"timestamp":1586803950,"timestamp_str":"2 days 21 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","nonce":41,"value":"0.0001","value_str":"0.0001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000001","gas_limit":1000,"fee":"0.000000000000000138","receipt":0,"return":"","gas_used":138,"signature":{"type":"secp256k1","data":"ZvK9sZ6Q/Xwp5L9jYS65hRXlFjyXiIBCNkund9gY6It/O7iM5V3oAHYDhjzEFFYQDgrdKPjHhfHsDtUAgfu5LgE="}},{"cid":"bafy2bzaceccksvowupdgynkot6rt32b3rz5palqsi5iguwhh42ftad4bux252","block_cid":"bafy2bzacedpyvf2wpbacq7kpdv4medvekgzjlbd7rue6ivus3shhdhnnweskm","block_height":174229,"block_confirms":0,"timestamp":1586803905,"timestamp_str":"2 days 21 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","nonce":40,"value":"0.0000001","value_str":"0.0000001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000001","gas_limit":1000,"fee":"0.000000000000000136","receipt":0,"return":"","gas_used":136,"signature":{"type":"secp256k1","data":"ZvK9sZ6Q/Xwp5L9jYS65hRXlFjyXiIBCNkund9gY6Is4/d6fwaA2tMr4ZAjo1hAvZqhBapoEkH/cURTqafTo9gA="}},{"cid":"bafy2bzacecq5ukepuk3uptf7dymgopylp5xr2dysyobyhmghxrbdl3odvjjts","block_cid":"bafy2bzaceafpjxzhpj4pe4nstg4xcyyivnfv4ci7oevuut27wne3ddjp54eym","block_height":174224,"block_confirms":0,"timestamp":1586803680,"timestamp_str":"2 days 21 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","nonce":39,"value":"0.0001","value_str":"0.0001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000001","gas_limit":1000,"fee":"0.000000000000000138","receipt":0,"return":"","gas_used":138,"signature":{"type":"secp256k1","data":"ZvK9sZ6Q/Xwp5L9jYS65hRXlFjyXiIBCNkund9gY6It4H+0Ax6d/Lo/MUXmJUf6U2MH6hXToyf2O+axsd1345wA="}},{"cid":"bafy2bzacec7ofmou7w2uy5yg46xiiqu3vjvwy4isx3ln7wpmein63zvzje4du","block_cid":"bafy2bzacebeztehfvavo2foedhh23rfuazaijomkgjopyfrb7ihu32otlsves","block_height":174221,"block_confirms":0,"timestamp":1586803545,"timestamp_str":"2 days 21 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","nonce":38,"value":"0.00001","value_str":"0.00001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000001","gas_limit":1000,"fee":"0.000000000000000138","receipt":0,"return":"","gas_used":138,"signature":{"type":"secp256k1","data":"ZvK9sZ6Q/Xwp5L9jYS65hRXlFjyXiIBCNkund9gY6ItWR0rnzQLufYIlsINwhfnHQneBM18dCL1SrzHFMW0AmwA="}},{"cid":"bafy2bzacedzadj6lbhwb4yvdlyleoe5lruvybc25nzln76va6nfmzbb6nqjos","block_cid":"bafy2bzacedjhsiw4se3gahhl333locj3w3coodket573nqrlscd5nniauqqyo","block_height":174216,"block_confirms":0,"timestamp":1586803320,"timestamp_str":"2 days 21 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","nonce":37,"value":"0.001","value_str":"0.001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000002","gas_limit":1000,"fee":"0.00000000000000028","receipt":0,"return":"","gas_used":140,"signature":{"type":"secp256k1","data":"ZvK9sZ6Q/Xwp5L9jYS65hRXlFjyXiIBCNkund9gY6IstRKAceETncRHx069vyWKLAAJ81Nngqksa8Kcgm0k3HwA="}},{"cid":"bafy2bzacedsvhiju5ceuuylwr7l62gbxhpajjpfhbeqndebfw2wbp2yuuorfy","block_cid":"bafy2bzaced7xbqxapxu6nwbr76pbxw7j7osbjgk6imngfnwzikgsxyzrqthwm","block_height":167006,"block_confirms":0,"timestamp":1586478870,"timestamp_str":"6 days 15 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","nonce":36,"value":"0.0001","value_str":"0.0001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000001","gas_limit":1000,"fee":"0","receipt":0,"return":"","gas_used":0,"signature":{"type":"secp256k1","data":"ZvK9sZ6Q/Xwp5L9jYS65hRXlFjyXiIBCNkund9gY6IsDGg9sECIHEuZ4ggPrFHCxMZd/nrjxcj2XcPs5FgCFZwE="}},{"cid":"bafy2bzaceayvhqvj2whax5dk22bqkhojafmiqfg6h4pbjcdecsfi2tspqqiwa","block_cid":"bafy2bzacea4gz7bit763ehkeucvbdb2npskecxbmz5txh67naqy73gblz3hbi","block_height":166753,"block_confirms":0,"timestamp":1586467485,"timestamp_str":"6 days 18 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","nonce":35,"value":"0.00000001","value_str":"0.00000001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000001","gas_limit":1000,"fee":"0","receipt":0,"return":"","gas_used":0,"signature":{"type":"secp256k1","data":"LiT+QAIEmvE1PoCZsae+152byRW7BTssuH6UqD+v6mVwzo68AmS+OthsLSnXSl7isGVUL+Ca0H9zr04+eCS5YQE="}},{"cid":"bafy2bzacebanflo2opw2krddugt7hlagl2xwws6yx5env4k5l2dcu5fpfbvt4","block_cid":"bafy2bzacealmgbmuxggt54mnnkbkjgzcvziap57imzuuctzqp5wayws3i7way","block_height":166716,"block_confirms":0,"timestamp":1586465820,"timestamp_str":"6 days 18 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t3wjxuftije2evjmzo2yoy5ghfe2o42mavrpmwuzooghzcxdhqjdu7kn6dvkzf4ko37w7sfnnzdzstcjmeooea","to":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","nonce":104236,"value":"0.005","value_str":"0.005 FIL","method":"Transfer","params":"","gas_price":"0","gas_limit":1000,"fee":"0","receipt":0,"return":"","gas_used":200,"signature":{"type":"","data":""}},{"cid":"bafy2bzaceantq66vqmmxrciis26xvaye7dqbnlz3vs33dezsfl5lfq3g3w3ka","block_cid":"bafy2bzacebppsxkpkw7ss7pqg2gvpkkjg2v2ursbuc4clmxtqx7psxhuy7pwu","block_height":166641,"block_confirms":0,"timestamp":1586462445,"timestamp_str":"6 days 19 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","nonce":34,"value":"0.0001","value_str":"0.0001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000001","gas_limit":1000,"fee":"0","receipt":0,"return":"","gas_used":0,"signature":{"type":"secp256k1","data":"oG43rmmARO1mody8+xp3UVq5nJqyQLGohONqZOoIKBIvp+AcHKRhpdvoTfxx55MuhdZ4OIal32k5nmRZJD1wggE="}},{"cid":"bafy2bzaceb5a6dr3qci262cfm3tzy7u4vqss5a5oxqzxl4ga3xwfipan3fl6c","block_cid":"bafy2bzacecizhrxyhl6lwapb5capjyx5yvepvyadfhvh2vng5ltn3qqud7jbm","block_height":166613,"block_confirms":0,"timestamp":1586461185,"timestamp_str":"6 days 20 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t24vg6ut43yw2h2jqydgbg2xq7x6f4kub3bg6as6i","nonce":33,"value":"0.00001","value_str":"0.00001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000001","gas_limit":1000,"fee":"0","receipt":0,"return":"","gas_used":0,"signature":{"type":"secp256k1","data":"ZvK9sZ6Q/Xwp5L9jYS65hRXlFjyXiIBCNkund9gY6Is6A6WvwEdj7/nwTdZWEGwm+qVTn4rYiVu8jB5qfX2qEAA="}},{"cid":"bafy2bzacebx4muck75g7aqy2uj7nowebbsnpqrbnqfnbp2crtis3leaei4suo","block_cid":"bafy2bzacedrkbvfgrvue3qy4ei2nxmmqdjyiljgwzrwnnk3et3zz7gsajbzvo","block_height":166610,"block_confirms":0,"timestamp":1586461050,"timestamp_str":"6 days 20 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t24vg6ut43yw2h2jqydgbg2xq7x6f4kub3bg6as6i","nonce":32,"value":"0.00001","value_str":"0.00001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000001","gas_limit":1000,"fee":"0.000000000000001","receipt":1,"return":"","gas_used":1000,"signature":{"type":"secp256k1","data":"PT89MzLzunf++8hCJpJl+dGgAV92mwpiwqmYELoZqBgpcmIaHmBffsbohb2+xmZEk5oeZDIag0Z2fwRAO10XmAA="}},{"cid":"bafy2bzaceashphl4pvlxnqzic3xmrnsshuyqtq5kkpltqkqypencxigu55adm","block_cid":"bafy2bzacediufax47hfm3w2qi3qqw7effh3y5egblmqnijgfpvusrgwnme362","block_height":166606,"block_confirms":0,"timestamp":1586460870,"timestamp_str":"6 days 20 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t24vg6ut43yw2h2jqydgbg2xq7x6f4kub3bg6as6i","nonce":31,"value":"0.0001","value_str":"0.0001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000001","gas_limit":1000,"fee":"0","receipt":0,"return":"","gas_used":0,"signature":{"type":"secp256k1","data":"VoKr1t3mv633ufxxIXfenXVlrn4T+6UZ+Z8RhCCWsaA9KWOwrRteaS7v3YceB3DaRLiTd3QhTGz5m0OGft7IBgE="}},{"cid":"bafy2bzacebpo3cdin3gxqvpvcymawlsrc6wxedcty36c376k64ujwpbqq6twy","block_cid":"bafy2bzaceclmkwfq6heh4ck6drimkkvdcu2hougg62332b4eakxs2ogmwfq74","block_height":166604,"block_confirms":0,"timestamp":1586460780,"timestamp_str":"6 days 20 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t24vg6ut43yw2h2jqydgbg2xq7x6f4kub3bg6as6i","nonce":30,"value":"0.0001","value_str":"0.0001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000001","gas_limit":1000,"fee":"0.000000000000001","receipt":1,"return":"","gas_used":1000,"signature":{"type":"secp256k1","data":"ZvK9sZ6Q/Xwp5L9jYS65hRXlFjyXiIBCNkund9gY6IsK4MOjkbczei1BhG6PZ6Kc24eZ/qzWsMsLe0051/UotwE="}},{"cid":"bafy2bzacebpkpf36th2dqbxxa6ohyxmer7ibmccgremsis3tvefjtc37hykow","block_cid":"bafy2bzacebrnie63xjztzwpt7wz4nkfsouqwq54b4b4oy6gmv5pkabyn43htw","block_height":166599,"block_confirms":0,"timestamp":1586460555,"timestamp_str":"6 days 20 hrs ago","time":"","date":"0001-01-01T00:00:00Z","from":"t137sjdbgunloi7couiy4l5nc7pd6k2jmq32vizpy","to":"t24vg6ut43yw2h2jqydgbg2xq7x6f4kub3bg6as6i","nonce":29,"value":"0.00001","value_str":"0.00001 FIL","method":"Transfer","params":"","gas_price":"0.000000000000000001","gas_limit":1000,"fee":"0.000000000000001","receipt":1,"return":"","gas_used":1000,"signature":{"type":"secp256k1","data":"ZvK9sZ6Q/Xwp5L9jYS65hRXlFjyXiIBCNkund9gY6IscIzFuoGZmdFoU/XaCTuYYwMs3rYAY9JlYLpvQrEMFDAE="}}]'
)

const sampleSuccessResponse = {
  data: {
    code: 200,
    data: {
      data: mockData,
      pagination: { total: 47, page: 1, page_size: 15 }
    },
    error: 'ok'
  }
}

describe('useTransactionHistory', () => {
  afterEach(cleanup)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('it fetches and stores the transaction history in redux', async () => {
    axios.get.mockResolvedValue(sampleSuccessResponse)

    const { Tree, store } = composeMockAppTree('postOnboard')

    const { waitForNextUpdate } = renderHook(useTransactionHistory, {
      wrapper: Tree
    })

    await waitForNextUpdate()

    const { confirmed, total } = store.getState().messages
    expect(total).toBe(47)
    expect(confirmed.length).toBe(15)
    expect(confirmed[0]).toHaveProperty('from', expect.any(String))
    expect(confirmed[0]).toHaveProperty('gaslimit', expect.any(String))
    expect(confirmed[0]).toHaveProperty('gasprice', expect.any(String))
    expect(confirmed[0]).toHaveProperty('method', expect.any(String))
    expect(confirmed[0]).toHaveProperty('nonce', expect.any(Number))
    expect(confirmed[0]).toHaveProperty('value', expect.any(String))
    expect(confirmed[0]).toHaveProperty('cid', expect.any(String))
    expect(confirmed[0]).toHaveProperty('gas_used', expect.any(String))
    expect(confirmed[0]).toHaveProperty('timestamp', expect.any(String))
    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
  })

  test('it fetches more data when showMore gets called', async () => {
    axios.get.mockResolvedValue(sampleSuccessResponse)

    const { Tree, store } = composeMockAppTree('postOnboard')

    const {
      result: { current },
      waitForNextUpdate
    } = renderHook(useTransactionHistory, {
      wrapper: Tree
    })

    await act(async () => {
      current.showMore()
      await waitForNextUpdate()
    })

    const { confirmed, total } = store.getState().messages
    expect(total).toBe(47)
    expect(confirmed.length).toBeGreaterThan(10)
    expect(confirmed[11]).toHaveProperty('from', expect.any(String))
    expect(confirmed[11]).toHaveProperty('gaslimit', expect.any(String))
    expect(confirmed[11]).toHaveProperty('gasprice', expect.any(String))
    expect(confirmed[11]).toHaveProperty('method', expect.any(String))
    expect(confirmed[11]).toHaveProperty('nonce', expect.any(Number))
    expect(confirmed[11]).toHaveProperty('value', expect.any(String))
    expect(confirmed[11]).toHaveProperty('cid', expect.any(String))
    expect(confirmed[11]).toHaveProperty('gas_used', expect.any(String))
    expect(confirmed[11]).toHaveProperty('timestamp', expect.any(String))
    expect(store.getState().messages.loadedFailure).toBeFalsy()
    expect(store.getState().messages.loadedSuccess).toBeTruthy()
  })

  test('it handles errors from filscan', async () => {
    const sampleFailResponse = {
      data: {
        code: 500,
        error: 'kobe!'
      }
    }

    axios.get.mockResolvedValue(sampleFailResponse)

    const { Tree, store } = composeMockAppTree('postOnboard')

    const { waitForNextUpdate } = renderHook(useTransactionHistory, {
      wrapper: Tree
    })

    await waitForNextUpdate()

    expect(store.getState().messages.loadedFailure).toBeTruthy()
    expect(store.getState().messages.loadedSuccess).toBeFalsy()
  })
})
