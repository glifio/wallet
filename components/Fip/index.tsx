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
import { Message, SignedLotusMessage } from '@glif/filecoin-message'
import * as cbor from '@ipld/dag-cbor'
import { verifySignature } from '@zondax/filecoin-signing-tools/js'
import { Header, FIPData, FormState } from './Helpers'
import { PAGE } from '../../constants'

enum Vote {
  APPROVE = 'Approve',
  REJECT = 'Reject',
  ABSTAIN = 'Abstain'
}

const FIP_ID = 36

// returns the vote choice for poll 36, or null if the signature is invalid or not the correct poll
function referenceCheckSigAndExtractVote(
  signedMessage: SignedLotusMessage
): Vote | null {
  const { Message: LotusMessage, Signature } = signedMessage

  try {
    const validSignature = verifySignature(Signature.Data, LotusMessage)
    if (!validSignature) return null
    const params = cbor
      .decode(Buffer.from(LotusMessage.Params as string, 'base64'))
      .toString()

    const [pollID, vote] = params.split(' - ') as [string, Vote]

    // make sure the params are signed for the pollID we're expecting
    if (Number(pollID) !== FIP_ID) return null
    // make sure the vote choice is a valid vote choice
    const isValidVoteChoice = Object.values(Vote).some((v) => vote === v)
    if (!isValidVoteChoice) return null
    return vote
  } catch {
    return null
  }
}

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
      const provider = await getProvider()
      const nextNonce = await provider.getNonce(wallet.robust || wallet.id)
      // if this account has a nonce bigger than 0, use 0 for nonce
      // if this account has a nonce of 0, use Max safe integer
      const nonce = nextNonce === 0 ? Number.MAX_SAFE_INTEGER : 0

      const newMessage = new Message({
        to: wallet.robust || wallet.id,
        from: wallet.robust || wallet.id,
        nonce,
        value: '0',
        method: 3,
        params: Buffer.from(cbor.encode([`${FIP_ID} - ${vote}`])).toString(
          'base64'
        ),
        gasLimit: 1
      })

      setFormState(FormState.SIGNING_MESSAGE)
      const signedMessage = await provider.wallet.sign(
        wallet.address,
        newMessage.toLotusType()
      )
      setFormState(FormState.SIGNED_MESSAGE)

      // comment this line in with your URL and send it...
      await axios.post(`https://api.filpoll.io/api/polls/${FIP_ID}/vote/glif`, {
        ...signedMessage
      })

      // @Catalin Bara see this code for reference on verifying and extracting the vote choice
      referenceCheckSigAndExtractVote(signedMessage)

      setFormState(FormState.SUCCESS)
    } catch (err) {
      setFormState(FormState.FILLING_FORM)
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
