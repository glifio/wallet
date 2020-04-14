# Glif Wallet

<!-- Glif art/branding -->

The Glif Wallet is a Filecoin web wallet built with Next.js that allows you to:

- **send and receive** Filecoin with your Ledger device
- **create** test accounts to send small amounts of FIL
- **import** accounts with seed phrases and private keys (SECURITY NOTICE: this is unsecure and is for testing and sending small amounts. If you need to recover an account, do it offline.)

### Install

```bash
npm install
npm run dev
```

If you want to develop using the Ledger integration, follow these steps to get the Ledger app onto your device: **_(Note: only use Ledger devices meant for testing purposes)_**

1. Download the shell script for installing the app [here](https://57-227919429-gh.circle-artifacts.com/0/home/test/project/src/ledger/pkg/zxtool.sh).
2. Run the file. `zxtool.sh load`

### Versioning

Glif follows semantic versioning.

Version **x.y.z**:

- When releasing **critical bug fixes** we make a **patch release** by changing the **z** number (e.g. 1.3.2 to 1.3.3).
- When releasing **new features** or **non-critical fixes**, we make a **minor release** by changing the **y** number (e.g. 1.3.3 to 1.4.0).
- When releasing **breaking changes**, we make a **major release** by changing the **x** number (e.g. 1.4.0 to 2.0.0).

<!-- ### Deploy -->

<!-- ### Contributing -->

### Filecoin modules

Here are a few modules that we've broken out.

- [Filecoin wallet provider](https://github.com/openworklabs/filecoin-wallet-provider)
- [Lotus JSON-RPC Engine](https://github.com/openworklabs/lotus-jsonrpc-engine/)
- [Filecoin number type](https://github.com/openworklabs/filecoin-number)
- [Filecoin message type](https://github.com/openworklabs/filecoin-message)
