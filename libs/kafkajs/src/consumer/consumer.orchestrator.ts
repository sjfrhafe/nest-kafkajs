import { Inject, Injectable } from '@nestjs/common';
import { Consumer, ConsumerRunConfig, Kafka } from 'kafkajs';
import { KafkaConsumerInjectable } from './consumer';
import { KafkaInjectableConfig } from './consumer.decorator';

@Injectable()
export class ConsumerOrchestrator {
  private readonly consumers: Consumer[] = [];
  @Inject('kafka:instance') kafka: Kafka;

  public async registerConsumer(
    config: KafkaInjectableConfig,
    provider: KafkaConsumerInjectable,
  ) {
    const consumer = this.kafka.consumer(config.consumerConfig);
    await consumer.connect();
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
