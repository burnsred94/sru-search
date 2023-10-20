import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas';
import { TaskRepository } from './repositories';

@Module({
  imports: [MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])],
  providers: [TaskRepository],
  exports: [TaskRepository],
})
export class TasksStatsModule {}
