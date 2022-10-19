import { Module } from '@nestjs/common';
import { IdentityProfile } from './identity.mapper.profile';

@Module({    
    providers: [IdentityProfile],
    exports: [IdentityProfile]
})
export class IdentityProfileModule {}
