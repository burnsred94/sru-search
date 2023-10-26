import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  versionKey: false,
})
export class Proxy {
  @Prop({ type: String })
  idProxy: string;

  @Prop({ type: String })
  version: string;

  @Prop({ type: String })
  ip: string;

  @Prop({ type: String })
  host: string;

  @Prop({ type: String })
  port: string;

  @Prop({ type: String })
  user: string;

  @Prop({ type: String })
  pass: string;

  @Prop({ type: Number, default: 30 })
  useCount: number;
}

export const ProxySchema = SchemaFactory.createForClass(Proxy);
