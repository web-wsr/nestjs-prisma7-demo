import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ModelsService } from './models.service';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}
  @Post('chat')
  basicChat(@Body() body: { message: string }) {
    return this.modelsService.basicChat(body.message);
  }

  @Post('chatSystem')
  chatSystem(@Body() body: { message: string; system?: string }) {
    return this.modelsService.chatSystem(body.message, body.system);
  }

  // 流式
  @Post('chatStream')
  chatStream(@Body() body: { message: string }, @Res() res: Response) {
    return this.modelsService.chatStream(body.message, res);
  }
  @Post('chat-parser')
  chatWithParser(@Body() body: { message: string }) {
    return this.modelsService.chatWithParser(body.message);
  }
}
