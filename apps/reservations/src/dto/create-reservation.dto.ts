import { CreateChargeDto } from "@app/common";
import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, IsString, ValidateNested } from "class-validator";

export class CreateReservationDto {
  @IsDate()
  @Type(() => Date)
  start_date: Date;

  @IsDate()
  @Type(() => Date)
  end_date: Date;

  @IsString()
  @IsNotEmpty()
  place_id: string;

  @IsString()
  @IsNotEmpty()
  invoice_id: string;

  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto
}
