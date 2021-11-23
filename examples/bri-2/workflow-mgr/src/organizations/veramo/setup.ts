// Core interfaces
import { createAgent, IDIDManager, IResolver } from '@veramo/core'

// Custom resolvers
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'

export const agent = createAgent<IDIDManager & IResolver>({
  plugins: [
    new DIDResolverPlugin({
      resolver: new Resolver({
        web: webDidResolver().web,
      }),
    }),
  ],
})
