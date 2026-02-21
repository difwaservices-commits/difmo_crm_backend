import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('add-projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Post("/")
  create(@Body() body) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

    @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }
  
  @Put(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.service.update(Number(id), body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
