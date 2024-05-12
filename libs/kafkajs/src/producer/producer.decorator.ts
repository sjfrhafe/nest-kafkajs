import { Inject } from '@nestjs/common';

export const InjectProducer = () => {
  return Inject('kafka:producer');
};
