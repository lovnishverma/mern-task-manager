import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, Tag } from '@prisma/client';
import { TaskStatus, TaskPriority } from './enums/task.enums';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

export type TaskWithTags = Task & { tags: Tag[] };

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TaskWithTags[]> {
    return this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    });
  }

  async findOne(id: string): Promise<TaskWithTags> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto): Promise<TaskWithTags> {
    const status = createTaskDto.status ?? TaskStatus.TODO;
    const priority = createTaskDto.priority ?? TaskPriority.MEDIUM;
    const dueDate = createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null;
    const completed = status === TaskStatus.DONE;

    if (createTaskDto.tagIds && createTaskDto.tagIds.length > 0) {
      const existingTags = await this.prisma.tag.findMany({
        where: { id: { in: createTaskDto.tagIds } },
      });
      if (existingTags.length !== createTaskDto.tagIds.length) {
        throw new BadRequestException('One or more specified tag IDs do not exist');
      }
    }

    // Persist new task record with status, priority, optional due date, and connected tags
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        completed,
        status,
        priority,
        dueDate,
        ...(createTaskDto.tagIds && createTaskDto.tagIds.length > 0 && {
          tags: {
            connect: createTaskDto.tagIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        tags: true,
      },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskWithTags> {
    await this.findOne(id);

    let status = updateTaskDto.status;
    let completed = updateTaskDto.completed;

    // Harmonize status and completed when one is updated without the other
    if (status !== undefined && completed === undefined) {
      completed = status === TaskStatus.DONE;
    } else if (completed !== undefined && status === undefined) {
      status = completed ? TaskStatus.DONE : TaskStatus.TODO;
    }

    if (updateTaskDto.tagIds !== undefined && updateTaskDto.tagIds.length > 0) {
      const existingTags = await this.prisma.tag.findMany({
        where: { id: { in: updateTaskDto.tagIds } },
      });
      if (existingTags.length !== updateTaskDto.tagIds.length) {
        throw new BadRequestException('One or more specified tag IDs do not exist');
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(updateTaskDto.title !== undefined && { title: updateTaskDto.title }),
        ...(completed !== undefined && { completed }),
        ...(status !== undefined && { status }),
        ...(updateTaskDto.priority !== undefined && { priority: updateTaskDto.priority }),
        ...(updateTaskDto.dueDate !== undefined && {
          dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null,
        }),
        ...(updateTaskDto.tagIds !== undefined && {
          tags: {
            set: updateTaskDto.tagIds.map((tagId) => ({ id: tagId })),
          },
        }),
      },
      include: {
        tags: true,
      },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.task.delete({
      where: { id },
    });
    return { message: 'Task deleted' };
  }
}

