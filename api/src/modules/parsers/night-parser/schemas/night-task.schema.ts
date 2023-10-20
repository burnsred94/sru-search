import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Task } from 'src/modules/tasks-stats/schemas';

export type NightTaskDocument = HydratedDocument<NightTask>;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class NightTask extends Task {}

export const NightTaskSchema = SchemaFactory.createForClass(NightTask);
