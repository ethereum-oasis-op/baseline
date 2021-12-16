const orgRegistry = new Map()

const organizationExists = (id) => {
  return orgRegistry.has(id)
}

const insertOrg = (organization) => {
  if (orgRegistry.has(organization.id)) {
    console.log(`organization with id ${organization.id} already exists`)
    return;
  }

  console.log('adding new organization ', organization)
  orgRegistry.set(organization.id, {
    id: organization.id,
    name: organization.name
  })
}

module.exports = {
  orgRegistry,
  organizationExists,
  insertOrg
}