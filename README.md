# NestJS Prisma 7 Demo

这是一个基于 NestJS 11、Prisma 7 和 PostgreSQL 的后端示例项目，演示了在 Prisma 7 中使用 Driver Adapter 连接数据库，并实现用户与文章两个资源模块的基础 CRUD。

## 技术栈

- NestJS 11
- TypeScript
- Prisma 7
- PostgreSQL
- pnpm
- Jest
- ESLint / Prettier

## 功能概览

- 用户管理
  - 创建用户
  - 分页查询用户列表
  - 支持按用户名模糊搜索、按角色过滤
  - 查询单个用户及其文章列表
  - 更新用户
  - 删除用户，并级联删除该用户文章
- 文章管理
  - 创建文章
  - 查询文章列表
  - 支持按发布状态过滤
  - 查询单篇文章及作者信息
  - 查询某个用户的所有文章
  - 更新文章
  - 切换发布状态
  - 删除文章

## 项目结构

```text
.
├── prisma
│   ├── migrations              # Prisma 迁移文件
│   └── schema.prisma           # 数据模型定义
├── src
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── main.ts                 # 应用入口
│   ├── post                    # 文章模块
│   ├── prisma                  # PrismaService / PrismaModule
│   └── user                    # 用户模块
├── test                        # e2e 测试
├── package.json
├── pnpm-workspace.yaml
└── prisma.config.ts            # Prisma 7 配置文件
```

## 环境要求

- Node.js 20+
- pnpm
- PostgreSQL

## 安装依赖

```bash
pnpm install
```

## 环境变量

在项目根目录创建 `.env` 文件，并配置数据库连接地址：

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
PORT=3000
```

`PORT` 可选，未配置时默认监听 `3000`。

## Prisma 7 说明

本项目使用 Prisma 7，和 Prisma 6 及更早版本相比有几个关键差异：

- `schema.prisma` 中的 `generator client` 使用 `provider = "prisma-client"`。
- Prisma Client 生成目录显式配置为 `src/generated/prisma`。
- NestJS 默认使用 CommonJS，因此配置了 `moduleFormat = "cjs"`。
- `datasource` 只保留 `provider = "postgresql"`，数据库 URL 在 `prisma.config.ts` 中读取。
- Prisma 7 需要数据库 Driver Adapter，本项目使用 `@prisma/adapter-pg` 和 `pg`。
- 业务代码中从 `src/generated/prisma/client` 导入 `PrismaClient`，不再从 `@prisma/client` 导入。

生成 Prisma Client：

```bash
pnpm prisma generate
```

执行数据库迁移：

```bash
pnpm prisma migrate dev
```

查看数据库：

```bash
pnpm prisma studio
```

## 启动项目

开发模式：

```bash
pnpm run start:dev
```

普通启动：

```bash
pnpm run start
```

生产模式：

```bash
pnpm run build
pnpm run start:prod
```

启动成功后，服务默认运行在：

```text
http://localhost:3000
```

## API 示例

### 用户接口

创建用户：

```http
POST /user/create
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "123456",
  "role": "admin"
}
```

查询用户列表：

```http
GET /user/list
GET /user/list?page=1&pageSize=10
GET /user/list?name=alice
GET /user/list?role=admin
GET /user/list?page=1&pageSize=10&name=alice&role=admin
```

查询单个用户：

```http
GET /user/1
```

更新用户：

```http
PUT /user/1
Content-Type: application/json

{
  "name": "Alice Updated",
  "role": "user"
}
```

删除用户：

```http
DELETE /user/1
```

### 文章接口

创建文章：

```http
POST /post/create
Content-Type: application/json

{
  "title": "Hello Prisma 7",
  "content": "This is a demo post.",
  "published": false,
  "authorId": 1
}
```

查询文章列表：

```http
GET /post/list
GET /post/list?published=true
GET /post/list?published=false
```

查询单篇文章：

```http
GET /post/1
```

查询某个用户的文章：

```http
GET /post/author/1
```

更新文章：

```http
PUT /post/1
Content-Type: application/json

{
  "title": "Updated title",
  "content": "Updated content"
}
```

切换发布状态：

```http
PATCH /post/1/publish
```

删除文章：

```http
DELETE /post/1
```

## 数据模型

### User

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `Int` | 自增主键 |
| `email` | `String` | 唯一邮箱 |
| `name` | `String` | 用户名 |
| `password` | `String` | 密码 |
| `role` | `String` | 用户角色，默认 `user` |
| `createdAt` | `DateTime` | 创建时间 |
| `updatedAt` | `DateTime` | 更新时间 |

### Post

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | `Int` | 自增主键 |
| `title` | `String` | 标题 |
| `content` | `String` | 正文 |
| `published` | `Boolean` | 是否发布，默认 `false` |
| `authorId` | `Int` | 作者 ID |
| `createdAt` | `DateTime` | 创建时间 |
| `updatedAt` | `DateTime` | 更新时间 |

`User` 与 `Post` 是一对多关系。删除用户时，用户关联的文章会通过 `onDelete: Cascade` 自动删除。

## 常用脚本

```bash
# 格式化代码
pnpm run format

# ESLint 修复
pnpm run lint

# 单元测试
pnpm run test

# e2e 测试
pnpm run test:e2e

# 测试覆盖率
pnpm run test:cov
```

## 开发流程建议

1. 配置 `.env` 中的 `DATABASE_URL`。
2. 安装依赖：`pnpm install`。
3. 生成 Prisma Client：`pnpm prisma generate`。
4. 执行迁移：`pnpm prisma migrate dev`。
5. 启动开发服务：`pnpm run start:dev`。
6. 使用 Postman、curl 或其他 HTTP 客户端调用接口。

## 许可证

该项目为私有示例项目，当前 `package.json` 中声明为 `UNLICENSED`。
