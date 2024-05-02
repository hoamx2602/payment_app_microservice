import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
    apiVersion: "2024-04-10"
  });

  constructor(private readonly configService: ConfigService) {}

  async createCharge ({ amount }: CreateChargeDto) {
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
    
    return paymentIntent;
  }
}
