import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Consumer, ConsumerRunConfig, Kafka } from 'kafkajs';
import { KafkaConsumerInjectable } from './consumer';
import { KafkaInjectableConfig } from './consumer.decorator';

@Injectable()
export class ConsumerOrchestrator
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly consumers: Consumer[] = [];
  @Inject('kafka:instance') kafka: Kafka;

  async onApplicationBootstrap() {
    for (const consumer of this.consumers) {
      await consumer.connect();
    }
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  public async registerConsumer(
    config: KafkaInjectableConfig,
    provider: KafkaConsumerInjectable,
  ) {
    const consumer = this.kafka.consumer(config.consumerConfig);
    await consumer.subscribe(config.subscribeConfig);

    const consumerRunConfig: ConsumerRunConfig = {};

    if (provider.eachBatch) {
      consumerRunConfig.eachBatch = provider.eachBatch.bind(provider);
    }

    if (provider.eachMessage) {
      consumerRunConfig.eachMessage = provider.eachMessage.bind(provider);
    }

    await consumer.run(consumerRunConfig);

    this.consumers.push(consumer);
  }
}
