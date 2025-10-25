import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { HardwareSpecsService } from './hardware-specs.service';
import { CreateHardwareSpecsDto } from './dto/create-hardware-specs.dto';
import { UpdateHardwareSpecsDto } from './dto/update-hardware-specs.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/user.entity';

@Controller('hardware-specs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HardwareSpecsController {
  constructor(private readonly hardwareSpecsService: HardwareSpecsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createHardwareSpecsDto: CreateHardwareSpecsDto) {
    return this.hardwareSpecsService.create(createHardwareSpecsDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.hardwareSpecsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.hardwareSpecsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateHardwareSpecsDto: UpdateHardwareSpecsDto) {
    return this.hardwareSpecsService.update(id, updateHardwareSpecsDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.hardwareSpecsService.remove(id);
  }
}
