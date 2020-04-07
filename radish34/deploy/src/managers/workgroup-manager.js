const assert = require('assert');

class WorkgroupManager {

	/*
	@dev either pass an deployed instance.
	*/
	constructor(orgRegistryContract, verifierContract, shieldContract) {
		assert(orgRegistryContract, "orgRegistryContract was not provided");
		assert(verifierContract, "verifierContract wallet was not provided");
		assert(shieldContract, "shieldContract wallet was not provided");
		this.orgRegistryContract = orgRegistryContract;
		this.verifierContract = verifierContract;
		this.shieldContract = shieldContract;
	}

	registerOrganisation() {
		// TODO to be implemented
	}
}

module.exports = WorkgroupManager