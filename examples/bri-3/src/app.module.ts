import { Module } from '@nestjs/common';
import { SubjectsModule } from './bri/subjects/subjects.module';

@Module({
  imports: [SubjectsModule],
})
export class AppModule {}
