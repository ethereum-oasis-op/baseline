import db from '../db'

const getPartnerByID = async address => {
  const partner = await db
    .collection('organization')
    .findOne({ address: address })
  return partner
}

const getAllPartners = async () => {
  const organizations = await db
    .collection('organization')
    .find({})
    .toArray()
  return organizations
}

const getMyPartners = async () => {
  const partners = await db
    .collection('partner')
    .find({})
    .toArray()
  return partners
}

const savePartner = async input => {
  const partner = await db
    .collection('partner')
    .updateOne({ _id: input.address }, { $set: input }, { upsert: true })
  return partner
}

const deletePartner = async input => {
  const partner = await db
    .collection('partner')
    .deleteOne({ _id: input.address })
  return partner
}

export default {
  Query: {
    partner (parent, args, context, info) {
      return getPartnerByID(args.address).then(res => res)
    },
    partners (parent, args, context, info) {
      return getAllPartners()
    },
    myPartners (parent, args, context, info) {
      return getMyPartners()
    }
  },
  Partner: {
    name: root => root.name,
    address: root => root.address,
    role: root => root.role
  },
  Mutation: {
    addPartner: async (root, args, context, info) => {
      await savePartner(args.input)
      const partners = await getMyPartners()
      return partners
    },
    removePartner: async (root, args, context, info) => {
      await deletePartner(args.input)
      const partners = await getMyPartners()
      return partners
    }
  }
}
