import { SetMetadata } from '@nestjs/common';
import {
  ConsumerConfig,
  ConsumerSubscribeTopic,
  ConsumerSubscribeTopics,
} from 'kafkajs';

export type KafkaInjectableConfig = {
  consumerConfig: ConsumerConfig;
  subscribeConfig: ConsumerSubscribeTopics | ConsumerSubscribeTopic;
};

export const KafkaInjectable = (config: KafkaInjectableConfig) =>
  SetMetadata('kafka:consumer', config);
