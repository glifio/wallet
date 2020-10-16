# Glif Wallet

<!-- Glif art/branding -->

The Glif Wallet is a Filecoin web wallet built with Next.js that allows you to:

- **send and receive** Filecoin with your Ledger device
- **create** test accounts to send small amounts of FIL
- **import** accounts with seed phrases and private keys (SECURITY NOTICE: this is unsecure and is for testing and sending small amounts. If you need to recover an account, do it offline.)

The Glif Vault is a (currently limited functionality) Filecoin web multisig wallet that allows users to:

- **view** available and vesting balances
- **withdraw** available balances from a multisig to another Filecoin address
- **change owners** of a multisig wallet
- **remove a PL signer** of a multisig wallet

The Vault currently only supports multisigs that are 1:1 (1 signer, 1 required signature threshold). It can only be used with a Ledger device.

### Support and audits

This project was funded by a Filecoin Ecosystem Grant from Protocol Labs. The wallet functionality has been audited by a 3rd party security auditor. **The multisig (Vault) functionality has not been audited yet.**

### Install

```bash
npm install
npm run dev
```

### Versioning

Glif follows semantic versioning.

Version **x.y.z**:

- When releasing **critical bug fixes** we make a **patch release** by changing the **z** number (e.g. 1.3.2 to 1.3.3).
- When releasing **new features** or **non-critical fixes**, we make a **minor release** by changing the **y** number (e.g. 1.3.3 to 1.4.0).
- When releasing **breaking changes**, we make a **major release** by changing the **x** number (e.g. 1.4.0 to 2.0.0).

### Filecoin modules

Here are a few modules that we've broken out.

- [Filecoin wallet provider](https://github.com/glifio/modules/tree/primary/packages/filecoin-wallet-provider)
- [Filecoin jsonrpc client](https://github.com/glifio/modules/tree/primary/packages/filecoin-rpc-client)
- [Filecoin number type](https://github.com/glifio/modules/tree/primary/packages/filecoin-number)
- [Filecoin message type](https://github.com/glifio/modules/tree/primary/packages/filecoin-message)
- [Filecoin address type](https://github.com/glifio/modules/tree/primary/packages/filecoin-address)
- [Filecoin message confirmer](https://github.com/glifio/modules/tree/primary/packages/filecoin-message-confirmer)
