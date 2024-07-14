import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { DBConfig, DBType } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get<DBConfig>('database');
        return {
          type: dbConfig.type || DBType.postgres,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
              sslmode: require,
            },
          },
        };
      },
    }),
    AuthModule,
    TodosModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
