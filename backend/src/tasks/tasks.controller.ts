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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tasksService.remove(id);
  }
}
