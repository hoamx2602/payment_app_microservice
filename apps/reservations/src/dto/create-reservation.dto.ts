import { CreateChargeDto } from "@app/common";
import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, ValidateNested } from "class-validator";

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @IsDate()
  @Type(() => Date)
  end_date: Date;

  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto
}
