import { Logger } from 'tslog';

const log: Logger = new Logger();

export function getLogger() {
  return log;
}
