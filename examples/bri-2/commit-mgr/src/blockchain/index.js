import { subscribeMerkleEvents, unsubscribeMerkleEvents } from './events';
import {
	get_ws_provider,
	http_provider,
	restartSubscriptions,
	checkChainLogs,
	jsonrpc,
	switchChain,
	chainName
} from './utils';
import { compileContract, shieldContract } from './contracts';

export {
	subscribeMerkleEvents,
	unsubscribeMerkleEvents,
	restartSubscriptions,
	get_ws_provider,
	http_provider,
	checkChainLogs,
	jsonrpc,
	switchChain,
	chainName,
	compileContract,
	shieldContract
};
