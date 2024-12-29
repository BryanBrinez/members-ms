import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { NatsModule } from 'src/transports/nats.module';

@Module({
  controllers: [MembersController],
  providers: [MembersService],
  imports: [NatsModule]
})
export class MembersModule {}
