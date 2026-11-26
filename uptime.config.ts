// UptimeFlare 配置文件 —— 放在仓库根目录，覆盖同名文件
// 下面三行 import / export 不要改，否则编译失败
import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  // 状态页标题
  title: 'Spleeter Status Page',

  // 状态页右上角的链接
  links: [
    { link: 'https://late-dream-70b1.roywaller.workers.dev/', label: 'Spleeter Web', highlight: true },
    { link: 'https://roywaller-spleeter-web.hf.space', label: 'Spleeter 后端', highlight: true },
    { link: 'https://github.com/Roywaller/UptimeFlare', label: 'GitHub' },
  ],

  // 分组显示：只有写在这里的 monitor id 才会在状态页出现（未列出的仍会被监控，但不显示）
  group: {
    '🌐 Public': ['spleeter', 'frontend'],
  },

  // [可选] 自定义图标，不填用默认 /favicon.png、/logo.svg
  // favicon: 'https://roywaller-spleeter-web.hf.space/favicon.ico',

  maintenances: {
    upcomingColor: 'gray',
  },
}

const workerConfig: WorkerConfig = {
  // 写入冷却时间（分钟），默认 3，省 D1 写入量可以调大
  kvWriteCooldownMinutes: 3,

  // [可选] 给状态页和 API 加 HTTP Basic 认证，格式 '用户名:密码'
  // passwordProtection: 'user:pass',

  monitors: [
    {
      // id 必须唯一且保持稳定，改了 id 会丢历史记录
      id: 'spleeter',
      name: '伴奏分离后端 (HF Space)',
      method: 'GET',
      // 打健康接口而不是首页：首页即使后端挂了也可能返回 200 的 HTML 外壳
      target: 'https://roywaller-spleeter-web.hf.space/api/health',
      tooltip: 'HF Space 健康检查，返回 {ok:true} 才算正常',
      statusPageLink: 'https://roywaller-spleeter-web.hf.space',

      // 可接受的状态码，不写默认 2xx
      expectedCodes: [200],

      // HF 免费 Space 会休眠，冷启动约 40~60 秒；
      // 但 cron 每分钟一次，超时别给到 60s 否则会和下一轮重叠
      timeout: 45000,

      headers: {
        // HF 有时会对默认 UA 做限制，这里显式指定
        'User-Agent': 'Uptimeflare',
      },

      // 关键字校验：避免「返回 200 但后端实际没起来」
      responseKeyword: '"ok":true',
    },
    {
      id: 'frontend',
      name: '前端页面 (Cloudflare)',
      method: 'GET',
      target: 'https://late-dream-70b1.roywaller.workers.dev/',
      tooltip: '前端静态页，打开就能上传歌曲',
      statusPageLink: 'https://late-dream-70b1.roywaller.workers.dev/',

      expectedCodes: [200],
      timeout: 10000,

      headers: {
        'User-Agent': 'Uptimeflare',
      },
    },
  ],

  notification: {
    // Server酱³（Turbo 版）推送
    // 真正的推送地址不写进仓库。这个仓库是 public，token 留在代码里等于公开。
    // 构建时由 .github/workflows/deploy.yml 从 Environment secret
    // `SERVERCHAN_WOOK` 取值替换掉下面的占位符。
    webhook: [
      {
        url: '__SERVERCHAN_WOOK__',
        method: 'POST',
        payloadType: 'json',
        payload: {
          title: 'Spleeter 状态提醒',
          desp: '$MSG',
          tags: 'uptime|spleeter',
        },
        timeout: 10000,
      },
    ],

    // 通知里的时区
    timeZone: 'Asia/Shanghai',

    // 宽限期（分钟）：连续失败 N 分钟后才发通知，避免冷启动/抖动刷屏
    gracePeriod: 5,
  },
}

// 定时维护窗口，没有就留空数组
const maintenances: MaintenanceConfig[] = []

export { maintenances, pageConfig, workerConfig }
