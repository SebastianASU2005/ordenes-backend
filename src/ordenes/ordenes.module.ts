import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdenesService } from './ordenes.service';
import { OrdenesController } from './ordenes.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Orden, OrdenSchema } from './Schema/orden.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Orden.name, schema: OrdenSchema }]),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: configService.get<string>('KAFKA_CLIENT_ID')!,
                brokers: [configService.get<string>('KAFKA_BROKER')!],
              },
              consumer: {
                groupId: 'ordenes-consumer',
              },
            },
          }),
      },
    ]),
  ],
  controllers: [OrdenesController],
  providers: [OrdenesService],
})
export class OrdenesModule {}
