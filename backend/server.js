const Koa = require("koa");
const Router = require("koa-router");
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const app = new Koa();
const router = new Router();

// 强缓存示例
router.get("/strong-cache", (ctx) => {
  ctx.set("Cache-Control", "public, max-age=30");
  ctx.body = `Strong Cache Data: ${new Date().toISOString()}`;
});

// 基于时间的协商缓存示例
let dynamicDataByTime = "Initial Data";
let lastModifiedByTime = new Date().toUTCString();

setInterval(() => {
  dynamicDataByTime = `Updated Data by Time: ${new Date().toISOString()}`;
  lastModifiedByTime = new Date().toUTCString();
}, 5000);

router.get("/negotiate-cache-by-time", (ctx) => {
  ctx.set("Last-Modified", lastModifiedByTime);

  const ifModifiedSince = ctx.get("If-Modified-Since");

  if (ifModifiedSince === lastModifiedByTime) {
    ctx.status = 304;
  } else {
    ctx.body = dynamicDataByTime;
  }
});

// 基于 ETag 的协商缓存示例
const infoFilePath = path.join(__dirname, "info.json");

// 初始化 info.json 文件
const initialUserInfo = {
  name: "John Doe",
  age: 30,
  email: "johndoe@example.com",
};
fs.writeFileSync(infoFilePath, JSON.stringify(initialUserInfo, null, 2));

// 计算文件的哈希值
function calculateHash(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(data).digest("hex");
}

let etag = calculateHash(infoFilePath);

// 每 5 秒更新一次 info.json 文件并更新 ETag
setInterval(() => {
  const newUserInfo = {
    name: "Jane Smith",
    age: 25,
    email: "janesmith@example.com",
    timestamp: new Date().toISOString(),
  };
  fs.writeFileSync(infoFilePath, JSON.stringify(newUserInfo, null, 2));
  etag = calculateHash(infoFilePath);
}, 5000);

router.get("/negotiate-cache-by-etag", (ctx) => {
  ctx.set("ETag", etag);

  const ifNoneMatch = ctx.get("If-None-Match");

  if (ifNoneMatch === etag) {
    ctx.status = 304;
  } else {
    const userInfo = JSON.parse(fs.readFileSync(infoFilePath));
    ctx.body = userInfo;
  }
});

app.use(router.routes());
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
