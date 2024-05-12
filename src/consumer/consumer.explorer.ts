import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { ConsumerOrchestrator } from './consumer.orchestrator';

@Injectable()
export class ConsumerExplorer implements OnApplicationBootstrap {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly consumerOrchestrator: ConsumerOrchestrator,
  ) {}

  async onApplicationBootstrap() {
    await this.explore();
  }

  private async explore() {
    const providers = this.discoveryService.getProviders();

    const consumerProviders = providers
      .map((provider) => {
        if (!provider.metatype) return null;
        const consumerConfig = Reflect.getMetadata(
          'kafka:consumer',
          provider.metatype,
        );

        if (!consumerConfig) return null;

        return {
          instance: provider.instance,
          consumerConfig,
        };
      })
      .filter((consumerProvider) => !!consumerProvider);

    for (const { instance, consumerConfig } of consumerProviders) {
      await this.consumerOrchestrator.registerConsumer(
        consumerConfig,
        instance,
      );
    }
  }
}
