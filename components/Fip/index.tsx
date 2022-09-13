import {
  ButtonRowCenter,
  ButtonRowSpaced,
  ButtonV2,
  Dialog,
  InputV2,
  LoadingScreen,
  navigate,
  ShadowBox,
  useWallet,
  useWalletProvider
} from '@glif/react-components'
import axios from 'axios'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import { Message } from '@glif/filecoin-message'
import * as cbor from '@ipld/dag-cbor'
import { Header, FIPData, FormState } from './Helpers'
import { PAGE } from '../../constants'

enum Vote {
  APPROVE = 'Approve',
  REJECT = 'Reject',
  ABSTAIN = 'Abstain'
}

const FIP_ID = 14

export const Fip = () => {
  const [vote, setVote] = useState<Vote | ''>('')
  const [fipDetails, setFipDetails] = useState<FIPData>(null)
  const [error, setError] = useState<Error | null>(null)
  const [formState, setFormState] = useState<FormState>(FormState.FETCHING_VOTE)

  const router = useRouter()
  const wallet = useWallet()
  const { getProvider, walletError } = useWalletProvider()

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormState(FormState.SIGNING_MESSAGE)
    try {
      const params = Buffer.from(cbor.encode([`${FIP_ID} - ${vote}`])).toString(
        'base64'
      )
      const provider = await getProvider()
      const newMessage = new Message({
        to: 'f01',
        from: wallet.robust || wallet.id,
        nonce: 0,
        value: '0',
        method: 1,
        params
      })

      setFormState(FormState.SIGNING_MESSAGE)
      const signedMessage = await provider.wallet.sign(
        wallet.address,
        newMessage.toLotusType()
      )
      setFormState(FormState.SIGNED_MESSAGE)
      console.log(signedMessage)
      // comment this line in with your URL and send it...
      // await axios.post('your-url', { ...signedMessage })
      setFormState(FormState.SUCCESS)
    } catch (err) {
      console.log(err)
      setError(err)
    }
  }

  useEffect(() => {
    if (formState === FormState.FETCHING_VOTE) {
      axios
        .get(`https://api.filpoll.io/api/polls/${FIP_ID}`)
        .then(({ data }) => setFipDetails(data as FIPData))
        .catch((err) => {
          if (err instanceof Error) setError(err)
          else setError(new Error(JSON.stringify(err)))
        })
        .finally(() => setFormState(FormState.FILLING_FORM))
    }
  }, [formState, setFormState, setFipDetails])

  return (
    <>
      {formState > FormState.FETCHING_VOTE ? (
        <Dialog>
          <form onSubmit={onSubmit}>
            <Header
              fipDetails={fipDetails}
              formState={formState}
              error={error?.message || walletError() || ''}
            />
            <ShadowBox>
              <InputV2.Select
                label='Vote'
                placeholder='Select'
                options={[Vote.APPROVE, Vote.REJECT, Vote.ABSTAIN]}
                value={vote}
                onChange={(v: Vote) => setVote(v)}
                disabled={formState > FormState.FILLING_FORM}
              />
            </ShadowBox>
            {formState <= FormState.FILLING_FORM && (
              <ButtonRowSpaced>
                <ButtonV2 large type='button' onClick={router.back}>
                  Back
                </ButtonV2>
                <ButtonV2 large green type='submit' disabled={vote === ''}>
                  Vote
                </ButtonV2>
              </ButtonRowSpaced>
            )}
            {formState === FormState.SUCCESS && (
              <ButtonRowCenter>
                <ButtonV2
                  large
                  green
                  type='button'
                  onClick={() =>
                    navigate(router, { pageUrl: PAGE.WALLET_HOME })
                  }
                >
                  Done
                </ButtonV2>
              </ButtonRowCenter>
            )}
          </form>
        </Dialog>
      ) : (
        <LoadingScreen />
      )}
    </>
  )
}
