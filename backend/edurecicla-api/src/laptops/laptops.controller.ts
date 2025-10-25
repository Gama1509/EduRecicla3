import { Controller, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { LaptopsService } from './laptops.service';
import { CreateLaptopDto } from './dto/create-laptop.dto';
import { UpdateLaptopDto } from './dto/update-laptop.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Controller('laptops')
@UseGuards(JwtAuthGuard)
export class LaptopsController {
  constructor(private readonly laptopsService: LaptopsService) {}

  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  create(@Body() createLaptopDto: CreateLaptopDto) {
    return this.laptopsService.create(createLaptopDto);
  }

  @Patch(':id')
  @Roles(UserRole.USER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateLaptopDto: UpdateLaptopDto) {
    return this.laptopsService.update(id, updateLaptopDto);
  }
}
