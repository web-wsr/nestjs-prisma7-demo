import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';
import { ModelsModule } from './models/models.module';
import { PromptsModule } from './prompts/prompts.module';
import { ChainsModule } from './chains/chains.module';

@Module({
  imports: [OrderModule, UserModule, PrismaModule, PostModule, ModelsModule, PromptsModule, ChainsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
