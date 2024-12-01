import { Controller, Get, Patch, Param, ParseIntPipe, UseGuards, Body } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateShippingDto } from './dto/update-shipping.dto';

@ApiTags('Shipping')
@Controller('shippings')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get()
  async getShippings() {
    return await this.shippingService.findShippings();
  }

  @Get(':id')
  async getShippingById(@Param('id', ParseIntPipe) id: number) {
    return await this.shippingService.findShippingById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Admin updates the new shippingStatus' })
  async updateShipping(
    @Param('id', ParseIntPipe) id: number,
    @Body() shippingData: UpdateShippingDto,
  ) {
    return await this.shippingService.updateShipping(id, shippingData);
  }
}
