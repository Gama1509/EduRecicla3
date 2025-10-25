import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApproveProductDto } from './dto/approve-product.dto';
import { RejectProductDto } from './dto/reject-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('approve')
  approve(@Body() approveProductDto: ApproveProductDto, @Request() req) {
    return this.adminService.approve(approveProductDto, req.user.id);
  }

  @Post('reject')
  reject(@Body() rejectProductDto: RejectProductDto, @Request() req) {
    return this.adminService.reject(rejectProductDto, req.user.id);
  }
}
