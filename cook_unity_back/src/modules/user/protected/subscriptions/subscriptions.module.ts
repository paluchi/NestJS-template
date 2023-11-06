import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { UserService } from '../../user.service';
import { SubscriptionsService } from './subscriptions.service';
import { MealsService } from 'src/services/meals.service';

@Module({
  imports: [],
  controllers: [SubscriptionsController],
  providers: [UserService, MealsService, SubscriptionsService],
})
export class SubscriptionsModule {}
