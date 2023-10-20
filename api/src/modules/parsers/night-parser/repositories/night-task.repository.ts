import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/modules/database';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { NightTask, NightTaskDocument } from '../schemas/night-task.schema';

@Injectable()
export class NightParserRepository extends AbstractRepository<NightTaskDocument> {
  constructor(@InjectModel(NightTask.name) nightTask: Model<NightTaskDocument>) {
    super(nightTask);
  }
}
