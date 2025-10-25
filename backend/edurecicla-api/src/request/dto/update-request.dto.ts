import { IsEnum, IsOptional } from 'class-validator';
import { RequestStatus } from '../request.entity';

export class UpdateRequestDto {
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;
}
