import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BodyAppDTO } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getСontacts(@Body() bodyData: BodyAppDTO) {
    const name = bodyData.name;
    const email = bodyData.email;
    const phone = bodyData.phone;
    return this.appService.getСontacts(name, email, phone);
  }
}
