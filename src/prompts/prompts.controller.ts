import { Controller, Post, Body } from '@nestjs/common';
import { PromptsService } from './prompts.service';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post('translate')
  translate(@Body() body: { text: string; targetLanguage: string }) {
    return this.promptsService.translate(body.text, body.targetLanguage);
  }
  @Post('summarize')
  summarize(@Body() body: { text: string; maxWords: number }) {
    return this.promptsService.summarizeText(body.text, body.maxWords);
  }
  @Post('classify')
  classify(@Body() body: { text: string }) {
    return this.promptsService.classifyText(body.text);
  }
  @Post('codeReview')
  codeReview(@Body() body: { code: string; language: string }) {
    return this.promptsService.codeReview(body.code, body.language);
  }
}
