import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tagsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tagsService.remove(id);
  }
}
