import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tag } from '@prisma/client';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Tag[]> {
    return this.prisma.tag.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });
    if (!tag) {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }
    return tag;
  }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const existingTag = await this.prisma.tag.findUnique({
      where: { name: createTagDto.name },
    });
    if (existingTag) {
      throw new ConflictException(`Tag with name "${createTagDto.name}" already exists`);
    }

    return this.prisma.tag.create({
      data: {
        name: createTagDto.name,
        color: createTagDto.color ?? '#3B82F6',
      },
    });
  }

  async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag> {
    await this.findOne(id);

    if (updateTagDto.name) {
      const existingTag = await this.prisma.tag.findUnique({
        where: { name: updateTagDto.name },
      });
      if (existingTag && existingTag.id !== id) {
        throw new ConflictException(`Tag with name "${updateTagDto.name}" already exists`);
      }
    }

    return this.prisma.tag.update({
      where: { id },
      data: {
        ...(updateTagDto.name !== undefined && { name: updateTagDto.name }),
        ...(updateTagDto.color !== undefined && { color: updateTagDto.color }),
      },
    });
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.tag.delete({
      where: { id },
    });
    return { message: 'Tag deleted' };
  }
}
