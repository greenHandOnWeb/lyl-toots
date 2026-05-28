# 比价工具 · 真实数据接入说明

## 为什么不能在前端直接爬淘宝/京东？

- 浏览器 **CORS** 禁止 H5 直接请求电商域名
- 各平台 **登录、验证码、反爬** 无法在纯前端稳定绕过
- 合规要求需使用 **开放平台或授权聚合 API**

因此本工具采用 **聚合数据（Juhe）百价网比价接口**，经本地代理转发，密钥不暴露给前端。

## 快速开始

### 1. 申请 API Key

1. 打开 [商品比价 API（ID 137）](https://www.juhe.cn/docs/api/id/137)
2. 注册并完成实名 / 场景审核（按平台要求）
3. 在控制台复制 **AppKey**

可选：若主要用 **商品条形码** 查询，可同时申请 [条码查询 API（ID 52）](https://www.juhe.cn/docs/api/id/52)，使用同一 `JUHE_API_KEY`。

### 2. 配置环境变量

复制根目录 `.env.example` 为 `.env`（勿提交 Git）：

```bash
JUHE_API_KEY=你的key
```

### 3. 启动代理 + H5

开两个终端：

```bash
# 终端 1：比价代理（8787）
pnpm run dev:proxy

# 终端 2：H5（会把 /api/price 代理到 8787）
pnpm run dev:h5
```

健康检查：浏览器访问 `http://127.0.0.1:8787/api/price/health`，应看到 `hasKey: true`。

### 4. 在 App 内搜索

输入商品名称（如「戴森吸尘器」）或 8–14 位条形码，选择平台后点击「开始比价」。

## 数据说明

| 能力 | 来源 |
|------|------|
| 多平台报价、排序 | Juhe `mmb/search/complex` |
| 条形码精确查 | Juhe `barcode/query`（若账号已开通） |
| 近 3/6/12 月走势 | 接口返回历史字段则展示；否则根据高低价区间标注「部分来自接口」 |

## 生产部署

1. 将 `server/price-proxy.mjs` 部署到 Node 服务器（或改写为云函数）
2. H5 构建时设置 `VITE_PRICE_API_BASE=https://你的域名`（指向代理）
3. **切勿**把 `JUHE_API_KEY` 写入前端环境变量

## 环境变量一览

| 变量 | 说明 |
|------|------|
| `JUHE_API_KEY` | 聚合数据 Key（仅服务端） |
| `PRICE_PROXY_PORT` | 代理端口，默认 8787 |
| `VITE_PRICE_API_BASE` | 前端 API 根路径，默认同源 `/api/price` |
| `VITE_PRICE_USE_MOCK=true` | 强制演示数据 |
| `VITE_PRICE_FALLBACK_MOCK=true` | 接口失败时回退 mock |
