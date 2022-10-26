export interface Auth {
	accessToken: string;
}

export interface User {
	id: number,
	username: string, 
	publicAddress: string, 
	nonce: string, 
	createdAt: string, 
	updatedAt: string, 
}
