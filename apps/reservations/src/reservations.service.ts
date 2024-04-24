import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from '@app/common/schemas';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
  ) {}
  create(createReservationDto: CreateReservationDto) {
    return this.reservationRepository.creat({
      ...createReservationDto,
      timestamp: new Date(),
      user_id: '123'
    });
  }

  findAll() {
    return this.reservationRepository.find({});
  }

  findOne(_id: string) {
    return this.reservationRepository.findOne({_id});
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto }
    );
  }

  remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id })
  }
}
