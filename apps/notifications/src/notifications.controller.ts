import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NOTIFY_EMAIL_EVENT } from '@app/common';
import { NotifyEmailDto } from './dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe({
    whitelist: true,
  }))
  @EventPattern(NOTIFY_EMAIL_EVENT)
  async nofifyEmail(@Payload() data: NotifyEmailDto) {
    this.notificationsService.notifyEmail(data);
  }
}
