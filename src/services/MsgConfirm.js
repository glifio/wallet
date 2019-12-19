import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Lotus } from '@openworklabs/lotus-block-explorer';
import { confirmedMessages } from '../store/actions';

const isSameMsg = (msg1, msg2) => {
  const sameFromAddress = msg1.From === msg2.From;
  const sameToAddress = msg1.To === msg2.To;
  const sameNonce = msg1.Nonce === msg2.Nonce;
  const match = sameFromAddress && sameToAddress && sameNonce;
  return match;
};

export const MsgConfirm = () => {
  const dispatch = useDispatch();
  const pendingMsgs = useSelector(({ pendingMsgs }) => pendingMsgs);

  useEffect(() => {
    if (pendingMsgs.length > 0) {
      const lotus = new Lotus({
        jsonrpcEndpoint: 'https://lotus-dev.temporal.cloud/rpc/v0',
      });

      const subscribeCb = chainState => {
        const confirmedMsgs = [];
        const newPendingMsgs = pendingMsgs.filter(msg => {
          // const isMatch = isSameMsg(msg, message);
          // check if match and handle it
          confirmedMsgs.push(msg);
          return false;
        });

        dispatch(confirmedMessages(confirmedMsgs, newPendingMsgs));

        if (newPendingMsgs.length === 0) {
          lotus.store.unsubscribe(subscribeCb);
          lotus.stopListening();
        }
      };

      /*
      const newPendingMsgs = state.pendingMsgs.filter(msg => {
    const isMatch = isSameMsg(msg, message);
    if (isMatch) {
      // push message into array of confirmed messages
      newConfirmedMsgs.push(message);
      // delete this message from the pending messages list
      return false;
    } else {
      // if not the same message
      return true;
    }
  }); */

      lotus.store.subscribe(subscribeCb);
      lotus.listen();

      return () => {
        lotus.store.unsubscribe(subscribeCb);
        lotus.stopListening();
      };
    }
  }, [pendingMsgs, dispatch]);

  return null;
};
