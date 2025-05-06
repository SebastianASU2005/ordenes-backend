import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CrearOrdenDto } from './dto/crear-orden.dto';
import { ClientKafka } from '@nestjs/microservices';
import { Orden } from './Schema/orden.schema';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectModel(Orden.name) private ordenModel: Model<Orden>,
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  async crearOrden(dto: CrearOrdenDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new Error('La orden debe tener al menos un item.');
    }

    const total = dto.items.reduce((acc, item) => {
      return acc + item.cantidad * item.precio_unitario;
    }, 0);

    const nuevaOrden = new this.ordenModel({
      id_usuario: dto.id_usuario,
      items: dto.items,
      total,
      fecha_creacion: new Date(),
    });

    const ordenGuardada = await nuevaOrden.save();

    this.kafkaClient.emit(process.env.KAFKA_TOPIC, {
      id_usuario: dto.id_usuario,
      items: dto.items,
      total,
      fecha_creacion: ordenGuardada.fecha_creacion,
    });

    return ordenGuardada;
  }

  async listarOrdenes(page = 1, limit = 10, id_usuario?: string) {
    const query = id_usuario ? { id_usuario } : {};
    const skip = (page - 1) * limit;
    const total = await this.ordenModel.countDocuments(query);
    const data = await this.ordenModel.find(query).skip(skip).limit(limit);

    return { total, page, limit, data };
  }
}
