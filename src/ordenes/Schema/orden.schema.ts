import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrdenDocument = Orden & Document;

@Schema({ timestamps: true }) // Esto ya agrega createdAt y updatedAt automáticamente
export class Orden {
  @Prop({ required: true })
  id_usuario: string;

  @Prop({
    type: [
      {
        id_producto: { type: String, required: true },
        cantidad: { type: Number, required: true },
        precio_unitario: { type: Number, required: true },
      },
    ],
    required: true,
  })
  items: {
    id_producto: string;
    cantidad: number;
    precio_unitario: number;
  }[];

  @Prop({ required: true })
  total: number;

  @Prop({ default: Date.now }) // Puedes eliminar esto si usás `timestamps: true`
  fecha_creacion: Date;
}

export const OrdenSchema = SchemaFactory.createForClass(Orden);
