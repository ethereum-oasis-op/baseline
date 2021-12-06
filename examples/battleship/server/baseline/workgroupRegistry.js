let workgroupRegistry = new Map()

const updateWorkgroup = (workgroup) => {
  if (workgroupRegistry.has(workgroup.id)) {
    console.log(`updating workgroup with id ${workgroup.id}`)

    workgroupRegistry.set(workgroup.id, workgroup)

    if (workgroup.players.length === 2) {
      startGame(workgroup)
    }

    return;
  }

  console.log('adding new workgroup ', workgroup)
  workgroupRegistry.set(workgroup.id, workgroup)
}

const getShieldAddress = (workgroupId) => {
  const workgroup = workgroupRegistry.get(workgroupId)

  if (!workgroup) {
    console.log(`getShieldAddress - workgroup ${workgroupId} not found`)
    return;
  }

  return workgroup.shieldContractAddress;
}

// TODO: don't export whole registry...
module.exports = {
  workgroupRegistry,
  updateWorkgroup,
  getShieldAddress
}