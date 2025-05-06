// dto/item.dto.ts
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ItemDto {
  @IsString()
  @IsNotEmpty()
  id_producto: string;

  @IsNumber()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @Min(0)
  precio_unitario: number;
}
