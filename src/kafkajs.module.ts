import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { Kafka, KafkaConfig, ProducerConfig } from 'kafkajs';
import { ConsumerModule } from './consumer/consumer.module';

type Config = {
  kafkaConfig: KafkaConfig;
  producerConfig?: ProducerConfig;
};

@Module({})
export class KafkajsModule {
  public static async forRoot(config: Config): Promise<DynamicModule> {
    const kafkaInstance = new Kafka(config.kafkaConfig);
    const kafkaProducer = kafkaInstance.producer(config.producerConfig);
    await kafkaProducer.connect();

    const kafkaProvider = {
      provide: 'kafka:instance',
      useValue: kafkaInstance,
    };

    const producerProvider = {
      provide: 'kafka:producer',
      useValue: kafkaProducer,
    };

    return {
      global: true,
      module: KafkajsModule,
      providers: [kafkaProvider, producerProvider],
      exports: [kafkaProvider, producerProvider],
      imports: [DiscoveryModule, ConsumerModule],
    };
  }
}
