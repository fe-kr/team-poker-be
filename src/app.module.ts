import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeormConfig } from './configs/typeorm.config';
import { AuthModule } from './resources/auth/auth.module';
import { CoreModule } from './resources/core/core.module';
import { RoomsModule } from './resources/rooms/rooms.module';
import { TopicsModule } from './resources/topics/topics.module';
import { UsersModule } from './resources/users/users.module';
import { VotesModule } from './resources/votes/votes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeormConfig),
    CoreModule,
    UsersModule,
    RoomsModule,
    AuthModule,
    TopicsModule,
    VotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
