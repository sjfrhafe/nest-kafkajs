import { EachBatchHandler, EachMessageHandler } from 'kafkajs';

export interface KafkaConsumerInjectable {
  eachMessage?: EachMessageHandler;
  eachBatch?: EachBatchHandler;
}
