import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../schemas';
import { Model, Types } from 'mongoose';
import { TaskStatsEntity } from '../entities';
import { TaskStatus } from '../interfaces';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
  ) {}

  async getCountDocuments() {
    return await this.taskModel.countDocuments({ status: TaskStatus.WAITING });
  }

  async getCountAllDocuments() {
    return await this.taskModel.countDocuments();
  }

  async find() {
    const taskLength = await this.getCountDocuments();
    const random = Math.round(Math.random() * (taskLength - 1));
    const task = await this.taskModel
      .find({ status: TaskStatus.WAITING })
      .limit(1)
      .skip(random > 0 ? random : 0)
      .lean();
    return task[0];
  }

  async create(data) {
    const newTask = new TaskStatsEntity(data);
    await this.taskModel.create(newTask);
  }

  async remove(id: string) {
    await this.taskModel.findByIdAndDelete({ _id: id });
  }

  async update(id: Types.ObjectId) {
    await this.taskModel.findByIdAndUpdate({ _id: id }, { status: TaskStatus.PENDING });
  }
}
