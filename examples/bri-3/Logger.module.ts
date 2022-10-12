import { Module } from '@nestjs/common';
import { Logger } from 'tslog';

// const log: Logger = new Logger();

@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
