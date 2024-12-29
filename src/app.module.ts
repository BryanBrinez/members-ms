import { Module } from '@nestjs/common';
import { MembersModule } from './members/members.module';


@Module({
  imports: [MembersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
