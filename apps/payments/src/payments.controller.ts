import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CREATE_CHARGE_MSG, CreateChargeDto } from '@app/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern(CREATE_CHARGE_MSG)
  async createCharge (@Payload() data: CreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }
}
