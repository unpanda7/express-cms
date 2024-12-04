# Express CMS API

一个基于 Express.js 的现代化内容管理系统 API，提供完整的 RBAC 权限控制和文章管理功能。

## 技术栈

- **Express.js** - Node.js Web 应用框架
- **Prisma** - 下一代 ORM 工具
- **PostgreSQL** - 数据库
- **Zod** - TypeScript 优先的模式验证
- **JWT** - 用户认证
- **Morgan** - HTTP 请求日志
- **Swagger** - API 文档

## 功能特性

### 用户认证
- JWT 基于令牌的身份验证
- 用户注册/登录
- 密码加密存储

### RBAC 权限管理
- 用户管理（增删改查）
- 角色管理（增删改查）
- 权限管理
- 动态权限分配

### 内容管理
- 文章管理（增删改查）
- 文章发布/取消发布
- 支持分页和搜索

### API 文档
- Swagger UI 接口文档
- 详细的请求/响应示例

## 快速开始

### 前置要求

- Node.js 16+
- PostgreSQL
- pnpm

### 安装

#### 克隆项目

```bash
git clone https://github.com/unpanda7/express-cms.git
cd express-cms
```

#### 安装依赖

```bash
pnpm install
```

#### 环境配置

创建 .env

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
JWT_SECRET="your-secret-key"
```

#### 数据库迁移

```bash
npx prisma migrate dev
```

#### 初始化数据库

```bash
npx prisma db seed
```
