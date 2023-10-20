import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IPvz } from '../interfaces';

@Schema({
  versionKey: false,
})
export class Task {
  @Prop({ type: Number, required: true })
  article: number;

  @Prop({ type: Number, required: true })
  status: number;

  @Prop({ type: String, required: true })
  key: string;

  @Prop({ type: Array<IPvz>, required: true })
  pwz: IPvz;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
