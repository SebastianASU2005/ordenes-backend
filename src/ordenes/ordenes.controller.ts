import {
    Controller,
    Post,
    Body,
    Get,
    Query,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { CrearOrdenDto } from './dto/crear-orden.dto';
  import { OrdenesService } from './ordenes.service';
  
  @Controller('ordenes')
  export class OrdenesController {
    constructor(private readonly ordenesService: OrdenesService) {}
  
    @Post()
    async crear(@Body() dto: CrearOrdenDto) {
      try {
        return await this.ordenesService.crearOrden(dto);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  
    @Get()
    async listar(
      @Query('page') page = 1,
      @Query('limit') limit = 10,
      @Query('id_usuario') id_usuario?: string,
    ) {
      return this.ordenesService.listarOrdenes(+page, +limit, id_usuario);
    }
  }
  