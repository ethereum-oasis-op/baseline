import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { Module } from '@nestjs/common';
import { IdentityProfile } from './identity.mapper.profile';

@Module({    
    providers: [IdentityProfile],
})
export class IdentityProfileModule {}
