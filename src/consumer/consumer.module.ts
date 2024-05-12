import { Module } from '@nestjs/common';
import { ConsumerExplorer } from './consumer.explorer';
import { DiscoveryModule } from '@nestjs/core';
import { ConsumerOrchestrator } from './consumer.orchestrator';

@Module({
  imports: [DiscoveryModule],
  providers: [ConsumerExplorer, ConsumerOrchestrator],
})
export class ConsumerModule {}
