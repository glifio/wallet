This app was bootstrapped with Create React App. For more instructions, check out their [readme](https://github.com/facebook/create-react-app/blob/master/README.md).

This app also runs with several other microservices.

1. [chainwatch-api-server](https://github.com/openworklabs/chainwatch-api-server) - The chainwatch api server allows us to make optimized queries for transaction data associated with Filecoin addresses.

Requirement: add a `REACT_APP_CHAINWATCH_API_SERVER_ENDPOINT` variable to your `.env` file.

2. A Lotus node running.

Requirement: add a `REACT_APP_LOTUS_API_ENDPOINT` variable to your `.env` file.

## Start the app

`npm start`
