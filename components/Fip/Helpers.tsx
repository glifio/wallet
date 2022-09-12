import {
  ErrorBox,
  LoadingScreen,
  SmartLink,
  StandardBox
} from '@glif/react-components'
import styled from 'styled-components'
import dayjs from 'dayjs'

export enum FormState {
  FETCHING_VOTE,
  FILLING_FORM,
  SIGNING_MESSAGE,
  SIGNED_MESSAGE,
  SUCCESS,
  ERROR
}

export type FIPData = {
  start: string
  end: string
  status: 'open' | 'closed'
}

const Stat = styled.div`
  margin-bottom: var(--space-l);

  > * {
    text-align: left;
    padding: 0;
    margin-top: 0;
    margin-bottom: var(--space-s);

    .capitalize {
      text-transform: capitalize;
    }
  }
`

export const Header = (props: HeaderProps) => {
  return (
    <>
      {props.error ? (
        <ErrorBox>{props.error}</ErrorBox>
      ) : (
        <>
          {props.formState < FormState.SIGNING_MESSAGE && (
            <StandardBox>
              <h2>FIP-0036</h2>
              <hr />
              <Stat>
                <h3>Background</h3>
                <p>
                  This poll is to gather the community&apos;s sentiment on{' '}
                  <SmartLink href=''>FIP-0036.</SmartLink> Discussions about
                  this FIP can be carried out in the original FIP{' '}
                  <SmartLink>issue #56</SmartLink>.
                </p>
              </Stat>
              {props.fipDetails && (
                <>
                  <Stat>
                    <h3>Start</h3>
                    <p>{dayjs(props.fipDetails.start).format()}</p>
                  </Stat>
                  <Stat>
                    <h3>End</h3>
                    <p>{dayjs(props.fipDetails.end).format()}</p>
                  </Stat>
                  <Stat>
                    <h3>Status</h3>
                    <p className='capitalize'>{props.fipDetails.status}</p>
                  </Stat>
                </>
              )}
            </StandardBox>
          )}
          {props.formState === FormState.SIGNING_MESSAGE && (
            <StandardBox>
              <h2>Signature Request</h2>
              <hr />
              <p>
                Please approve the signature request with your connected wallet.
                <br />{' '}
                <b>Note - no $FIL will be spent by signing this message.</b>
              </p>
            </StandardBox>
          )}
          {props.formState === FormState.SIGNED_MESSAGE && (
            <StandardBox>
              <LoadingScreen />
            </StandardBox>
          )}
          {props.formState === FormState.SUCCESS && (
            <StandardBox>
              <h2>Success!</h2>
              <hr />
              <p>Your vote has been sent.</p>
            </StandardBox>
          )}
        </>
      )}
    </>
  )
}

type HeaderProps = {
  fipDetails: FIPData
  formState: FormState
  error: string
}
