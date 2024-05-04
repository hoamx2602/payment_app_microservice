import { NOTIFICATIONS_SERVICE_NAME, NotificationsServiceClient } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
    apiVersion: "2024-04-10"
  });
  private notificationsService: NotificationsServiceClient;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME) private readonly client: ClientGrpc
  ) {}

  async createCharge ({ amount, email }: PaymentsCreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: 'pm_card_visa',
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      automatic_payment_methods: {
        allow_redirects: 'never',
        enabled: true
      }
    });

    // this way to set service at runtime, we can use OnModuleInit
    if (!this.notificationsService) {
      this.notificationsService = this.client.getService<NotificationsServiceClient>(NOTIFICATIONS_SERVICE_NAME);
    }

    this.notificationsService.notifyEmail({
      email,
      text: `Your payment of $${amount} has completed succesfully`,
    }).subscribe(() => {});
    
    return paymentIntent;
  }
}
