import { NOTIFICATIONS_SERVICE, NOTIFY_EMAIL_EVENT } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
    apiVersion: "2024-04-10"
  });

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy
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

    this.notificationsService.emit(NOTIFY_EMAIL_EVENT, { email })
    
    return paymentIntent;
  }
}
