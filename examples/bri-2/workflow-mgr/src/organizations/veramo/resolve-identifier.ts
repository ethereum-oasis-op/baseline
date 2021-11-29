import { agent } from './setup'

export const resolveDid = async (url) => {
    const doc = await agent.resolveDid({
      didUrl: `did:web:${url}`
    })
    return doc
}