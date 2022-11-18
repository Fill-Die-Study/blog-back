import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), UsersModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
