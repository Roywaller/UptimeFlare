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
    '🌐 Public': ['spleeter'],
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
      name: 'Spleeter Web (HF Space)',
      method: 'GET',
      target: 'https://roywaller-spleeter-web.hf.space',
      tooltip: 'Hugging Face Space - Spleeter Web',
      statusPageLink: 'https://roywaller-spleeter-web.hf.space',

      // 可接受的状态码，不写默认 2xx
      expectedCodes: [200],

      // HF 免费 Space 会休眠，冷启动可能要几十秒，超时给宽一点
      timeout: 30000,

      headers: {
        // HF 有时会对默认 UA 做限制，这里显式指定
        'User-Agent': 'Uptimeflare',
      },

      // 如果你的 Space 开始页出现固定文案，可以加上关键字校验，避免"返回 200 但实际没起来"
      // responseKeyword: 'Spleeter',
      // 命中即判定为异常
      // responseForbiddenKeyword: 'Runtime error',
    },
  ],

  notification: {
    // Server酱³（Turbo 版）推送
    // 这里必须用 POST + JSON：$MSG 是多行文本，塞进 GET query 容易超长或编码出错
    // 注意 $MSG 只会被整体替换，所以 title 只能是固定文案，正文用 desp 承载
    webhook: [
      {
        url: 'https://29762.push.ft07.com/send/sctp29762tmf4g4hv4rssbtrrf8e793h.send',
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
