# nestjs-kafkajs

NestJS-KafkaJS is a NestJS wrapper for KafkaJS.

## Getting Started

This library does not implement its own logic but wraps the logic of [kafkajs](https://www.npmjs.com/package/kafkajs) in the nestjs module style.

Install nestjs-kafkajs running

```bash
npm i @sjfrhafe/nestjs-kafkajs kafkajs
```

### KafkaJS Module

The basic kafka config can be specified during the root import of the module.

```
@Module({
  imports: [
    KafkajsModule.forRoot({
      kafkaConfig: {
        brokers: ['localhost:9092'],
      },
    }),
  ],
})
export class YourModule {}
```

The default producer config can also be specified.

```
@Module({
  imports: [
    KafkajsModule.forRoot({
      kafkaConfig: {
        brokers: ['localhost:9092'],
      },
      producerConfig: {
        allowAutoTopicCreation: true,
      },
    }),
  ],
})
export class YourModule {}
```

### Consumer

Consumers are injectables. They are annotated with the KafkaInjectable decorator. When called, the configurations for the subscription and the consumer are specified.

The eachMessage and eachBatch functions are connected directly to the respective method of your service.

```
@KafkaInjectable({
  consumerConfig: {
    groupId: 'test-group',
  },
  subscribeConfig: {
    topic: 'test-topic',
  },
})
export class YourConsumerService implements KafkaConsumerInjectable {
  async eachMessage({ message }: EachMessagePayload) {
    console.log('Message received', message.value.toString());
  }
}
```

```
@KafkaInjectable({
  consumerConfig: {
    groupId: 'test-group',
  },
  subscribeConfig: {
    topic: 'test-topic',
  },
})
export class YourConsumerService implements KafkaConsumerInjectable {
  async eachBatch({ batch }: EachBatchPayload) {
    console.log('Batch received', batch.messages.length);
  }
}
```

### Producer

The kafkajs producer can be injected with the help of the producer decorator.

```
export class YourProducingService {
  @InjectProducer() producer: Producer;

  async sendMessage() {
    await this.producer.send({
      topic: 'test-topic',
      messages: [{ value: 'Hello KafkaJS user!' }],
    });
  }
}
```
