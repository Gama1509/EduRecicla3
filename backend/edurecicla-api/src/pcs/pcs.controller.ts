import { Controller, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { PCsService } from './pcs.service';
import { CreatePCDto } from './dto/create-pc.dto';
import { UpdatePCDto } from './dto/update-pc.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('pcs')
@UseGuards(JwtAuthGuard)
export class PCsController {
  constructor(private readonly pcsService: PCsService) {}

  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  create(@Body() createPCDto: CreatePCDto) {
    return this.pcsService.create(createPCDto);
  }

  @Patch(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updatePCDto: UpdatePCDto) {
    return this.pcsService.update(id, updatePCDto);
  }
}
