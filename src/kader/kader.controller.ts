import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { KaderService } from './kader.service';
import { CreateKaderDto } from './dto/create-kader.dto';
import { UpdateKaderDto } from './dto/update-kader.dto';

@Controller('kader')
export class KaderController {
  constructor(private readonly kaderService: KaderService) {}

  @Post()
  create(@Body() createKaderDto: CreateKaderDto) {
    return this.kaderService.create(createKaderDto);
  }

  @Get()
  findAll() {
    return this.kaderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kaderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKaderDto: UpdateKaderDto) {
    return this.kaderService.update(+id, updateKaderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kaderService.remove(+id);
  }
}
