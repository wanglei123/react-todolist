# Java 练习用 Todo List（React）

Vite + React 前端，用来对接 Java 后端做增删改查练习。

## 启动

需要 Node 18+（仓库已写 `.nvmrc`，可用 `nvm use`）。

```bash
cd front
nvm use
npm install
npm run dev
```

浏览器打开 http://localhost:5173

当前没有 Java 服务时，页面会自动进入**本地模式**（数据存在浏览器）。后端启动后刷新即可切到接口模式。

## 给 Java 后端的接口约定

开发时 Vite 会把 `/api` 代理到 `http://localhost:8080`。

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/todos` | 查询全部待办 |
| POST | `/api/todos` | 新增，body: `{ "title": "学习 Spring Boot" }` |
| PUT | `/api/todos/{id}` | 更新，body: `{ "title": "...", "completed": true }` |
| DELETE | `/api/todos/{id}` | 删除 |

建议返回 JSON：

```json
{
  "id": 1,
  "title": "学习 Spring Boot",
  "completed": false,
  "createdAt": "2026-09-09T10:00:00"
}
```

请求走 `src/api/request.js` 的 axios 拦截器：

- 请求头自动带 `Authorization: Bearer <token>`（`localStorage.token`）
- 后端统一包装 `{ "code": 0, "message": "...", "data": ... }` 时自动取 `data`
- `code` 非 0/200、HTTP 错误、网络异常会转成统一的 Error 抛出

后端需要开启 CORS，或继续走当前 Vite 代理。
