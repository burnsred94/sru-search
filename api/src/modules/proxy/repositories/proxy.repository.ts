import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Proxy } from '../schemas';
import { Model, Types } from 'mongoose';
import { IProxyList } from '../interfaces';
import { ProxyEntity } from '../entities';

@Injectable()
export class ProxyRepository {
  private readonly logger = new Logger(ProxyRepository.name);

  constructor(@InjectModel(Proxy.name) private readonly proxyModel: Model<Proxy>) {}

  async findByIdProxy(id: string): Promise<string> {
    return await this.proxyModel.findOne({ idProxy: id });
  }

  async create(data: IProxyList) {
    const newProxy = new ProxyEntity(data);
    const proxy = await this.proxyModel.create(newProxy);
    if (proxy) {
      this.logger.log(`Proxy create id: ${proxy.idProxy}`);
    } else {
      this.logger.log(`Proxy create filed: ${data.id}`);
    }
  }

  async downwardUpdate(id: Types.ObjectId): Promise<void> {
    await this.proxyModel
      .findByIdAndUpdate(id, {
        $inc: { useCount: -1 },
      })
      .lean();
  }

  async upProxy(id: Types.ObjectId) {
    await this.proxyModel.findByIdAndUpdate(id, {
      $inc: { useCount: 1 },
    });
  }

  async find() {
    return await this.proxyModel
      .find({ useCount: { $gt: 0 } })
      .limit(3)
      .lean();
  }

  async findLength(): Promise<number> {
    const proxies = await this.proxyModel.find();
    return proxies.length;
  }

  async getProxyWidget(limit: number) {
    const random = Math.round(Math.random() * 18);
    return await this.proxyModel.find().skip(random).limit(limit).lean().exec();
  }
}
