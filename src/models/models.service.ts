import { Injectable } from '@nestjs/common';
import { ChatOllama } from '@langchain/ollama';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { config } from '../config';
import { StringOutputParser } from '@langchain/core/output_parsers';
import type { Response } from 'express';
@Injectable()
export class ModelsService {
  // 创建chatOllama的实例
  private chatOllama = new ChatOllama({
    baseUrl: config.ollama.host,
    model: config.ollama.chatModel,
    temperature: config.ollama.temperature,
    think: false,
  });
  // 创建一个基础的聊天
  async basicChat(message: string) {
    const response = await this.chatOllama.invoke([new HumanMessage(message)]);
    console.log(response);
    return {
      question: message,
      answer: response.content,
      useage: response.usage_metadata,
    };
  }
  // SystemMessage + HumanMessage 设定模型的系统角色 + HumanMessage 用户输入
  async chatSystem(message: string, system?: string) {
    const response = await this.chatOllama.invoke([
      ...(system ? [new SystemMessage(system)] : []), // 模型系统角色
      new HumanMessage(message), // 用户输入
    ]);
    return {
      system,
      question: message,
      answer: response.content,
      useage: response.usage_metadata,
    };
  }
  // 创建一个流式聊天
  async chatStream(message: string, res: Response) {
    // 设置 SSE 响应头，告诉浏览器这是事件流
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const stream = await this.chatOllama.stream([
      new HumanMessage(message), // 用户输入
    ]);

    // SSE格式输出 data: JSON字符串\n\n
    for await (const chunk of stream) {
      if (chunk.content) {
        console.log(chunk);
        res.write(`data: ${JSON.stringify({ text: chunk.content })}\n\n`);
      }
    }
    // 流结束
    res.write(`data: [DONE]\n\n`);
    res.end();
  }

  // ── 方式四：pipe 链（StringOutputParser）───────────────
  // pipe 把多个组件串联成链，输出类型从 AIMessage 变成 string
  async chatWithParser(message: string) {
    // prompt → llm → parser 三步流水线
    // StringOutputParser 把 AIMessage.content 提取成纯字符串
    const chain = this.chatOllama.pipe(new StringOutputParser());
    const answer = await chain.invoke([new HumanMessage(message)]);
    // answer 直接是字符串，不是 AIMessage 对象
    return { question: message, answer };
  }
}
