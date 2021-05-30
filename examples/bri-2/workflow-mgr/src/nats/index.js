import NATS from 'nats';
import { logger } from '../logger';

let nc;

export const connectNATS = async () => {
	if (!nc) {
		try {
			nc = NATS.connect({ url: process.env.NATS_URL, json: true });
			logger.info(`Connected to NATS server`);
		} catch (err) {
			logger.error(`Could not connect to NATS: ${error.message}`);
			return;
		}
	}
	return nc;
};
