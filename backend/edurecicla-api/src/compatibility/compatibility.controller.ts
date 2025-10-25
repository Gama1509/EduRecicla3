import { Controller, Get, UseGuards } from '@nestjs/common';
import { CompatibilityService } from './compatibility.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class CompatibilityController {
  constructor(private readonly compatibilityService: CompatibilityService) {}

  @Get('admin/proposals')
  getProposals() {
    return this.compatibilityService.getProposals();
  }

  @Get('admin/requests')
  getRequests() {
    return this.compatibilityService.getRequests();
  }
}
