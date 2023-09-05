import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { QueryAppDTO } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Query() queryData: QueryAppDTO): string {
    return this.appService.getHello();
  }
}
