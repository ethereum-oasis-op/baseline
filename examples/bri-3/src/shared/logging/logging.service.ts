import { Injectable } from '@nestjs/common';
import { Logger } from 'tslog';

@Injectable()
export class LoggingService {
  private _logger: Logger;

  constructor() {
    this._logger = new Logger();
  }

  public logError(message: string) {
    this._logger.error(message);
  }

  public logInfo(message: string) {
    this._logger.info(message);
  }

  public logWarn(message: string) {
    this._logger.warn(message);
  }

  public logFatal(message: string) {
    this._logger.fatal(message);
  }

  public logTrace(message: string) {
    this._logger.trace(message);
  }

  public logDebug(message: string) {
    this._logger.debug(message);
  }
}
