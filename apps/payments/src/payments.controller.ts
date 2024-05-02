import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CREATE_CHARGE_MSG, CreateChargeDto } from '@app/common';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern(CREATE_CHARGE_MSG)
  @UsePipes(new ValidationPipe({
    whitelist: true,
  }),)
  async createCharge (@Payload() data: CreateChargeDto) {
    return this.paymentsService.createCharge(data);
  }
}
