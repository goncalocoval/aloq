import { Controller, Get } from '@nestjs/common';

@Controller() // Este controlador lida apenas com a raiz "/"
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
