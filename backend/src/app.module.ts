import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { TagsModule } from './tags/tags.module';

@Module({
  imports: [PrismaModule, TasksModule, TagsModule],
})
export class AppModule {}

