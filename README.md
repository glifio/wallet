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

### Deploy

Environment variables to export:

- `WEB3_STORAGE_TOKEN`
- `LOTUS_NODE_JSONRPC`
- `GRAPH_API_URL`
- `EXPLORER_URL`
- `NODE_STATUS_API_KEY`
- `STATUS_API_ADDRESS`
- `COIN_TYPE` (either `t` or `f`)
- `SENTRY_DSN` (optional)
- `SENTRY_ENV` (optional)

### Versioning

Glif follows semantic versioning.

Version **x.y.z**:

- When releasing **critical bug fixes** we make a **patch release** by changing the **z** number (e.g. 1.3.2 to 1.3.3).
- When releasing **new features** or **non-critical fixes**, we make a **minor release** by changing the **y** number (e.g. 1.3.3 to 1.4.0).
- When releasing **breaking changes**, we make a **major release** by changing the **x** number (e.g. 1.4.0 to 2.0.0).

### Filecoin modules

A number of modules have been broken out into packages in this [modules repo](https://github.com/glifio/modules).

- [Filecoin wallet provider](https://github.com/glifio/modules/tree/primary/packages/filecoin-wallet-provider)
- [Filecoin number type](https://github.com/glifio/modules/tree/primary/packages/filecoin-number)
- [Filecoin message type](https://github.com/glifio/modules/tree/primary/packages/filecoin-message)
- [Filecoin address type](https://github.com/glifio/modules/tree/primary/packages/filecoin-address)
- [Filecoin react-components](https://github.com/glifio/modules/tree/primary/packages/react-components)

#### Filecoin module package local development

In order to develop packages locally and see the changes live in this local wallet repository, the [npm link](https://docs.npmjs.com/cli/v7/commands/npm-link) tool can be used to symlink to the packages in your local modules repo.

Package linking is a two-step process.

First, from your local package folder, run:

```
npm link
```

Next, from this main wallet repository, run:

```
npm link @glif/<package-name>
```

for example, use `npm link @glif/react-components` to symlink the `react-components` package to your local version. See the npm link docs for details.
