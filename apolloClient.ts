import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { defaultMessageHistoryClientCacheConfig } from '@glif/react-components'

const URI = process.env.GRAPH_API_URL

const httpLink = new HttpLink({
  uri: `https://${URI}`
})

const wsLink = process.browser
  ? new WebSocketLink({
      uri: `wss://${URI}`,
      options: {
        reconnect: true,
        lazy: true
      }
    })
  : null

export function createApolloClient() {
  // The split function takes three parameters:
  //
  // * A function that's called for each operation to execute
  // * The Link to use for an operation if the function returns a "truthy" value
  // * The Link to use for an operation if the function returns a "falsy" value
  const link = process.browser //only create the split in the browser
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          )
        },
        wsLink,
        httpLink
      )
    : httpLink

  return new ApolloClient({
    link,
    cache: new InMemoryCache({ ...defaultMessageHistoryClientCacheConfig })
  })
}
