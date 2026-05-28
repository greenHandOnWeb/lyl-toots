# 比价



1. 输入商品信息（名称、商品编码）



2. 去各大电商平台 淘宝、京东、拼多多、唯品会等找出和输入最符合的商品的价格并且按照由低到高排序



3. 统计出这件商品近3月、近6月、近1年的价格变化



4. 综合用户反馈，店铺可信度等多个维度给出建议买哪个性价比最高



5. 数据必须是真实的（先接第三方服务）



## 实现方式



- **真实数据**：聚合数据 [商品比价 API](https://www.juhe.cn/docs/api/id/137)（百价网数据源），经 `server/price-proxy.mjs` 代理，避免密钥进前端、解决 H5 跨域。

- **不能在前端直接爬电商站**：淘宝/京东有 CORS 与反爬限制，需后端或合规 API。

- **配置与启动**：见 [docs/cheap-price-api.md](./docs/cheap-price-api.md)



```bash

# .env 中设置 JUHE_API_KEY 后

pnpm run dev:proxy   # 终端 1

pnpm run dev:h5      # 终端 2

```


