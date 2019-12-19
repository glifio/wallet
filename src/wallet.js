import Filecoin, {
  LocalNodeProvider,
} from '@openworklabs/filecoin-wallet-provider';

export default new Filecoin(
  new LocalNodeProvider({
    apiAddress: 'https://lotus-dev.temporal.cloud/rpc/v0',
    token: process.env.REACT_APP_LOTUS_JWT_TOKEN,
  }),
  { token: process.env.REACT_APP_LOTUS_JWT_TOKEN }
);
