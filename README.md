# 舒尔特专注训练微信小程序 V1.0

原生微信小程序实现，不依赖后端即可运行。

## 已实现

- 3×3 / 4×4 / 5×5 / 6×6 / 7×7 难度
- Fisher–Yates 随机生成数字方格
- 首次点击正确数字后开始计时
- 点击错误计数 + 轻震动反馈
- 逐数字反应时间记录
- 完成时间 / 准确率 / 平均反应 / 最快反应 / 最慢反应
- 专注力评分
- 当前难度历史最佳成绩
- 本地保存最近 200 条训练记录
- 历史成绩按难度过滤
- 历史最佳 / 平均成绩统计

## 目录

```text
schulte-wechat-miniapp/
├── app.js
├── app.json
├── app.wxss
├── project.config.json
├── sitemap.json
├── pages/
│   ├── index/
│   ├── training/
│   ├── result/
│   └── history/
└── utils/
    ├── schulte.js
    └── storage.js
```

## 如何运行

1. 安装并打开微信开发者工具。
2. 选择「导入项目」。
3. 选择本项目根目录 `schulte-wechat-miniapp`。
4. 测试阶段可以使用测试号/游客模式；正式发布时，将 `project.config.json` 的 `appid` 改成自己的小程序 AppID，或在开发者工具里选择自己的 AppID。
5. 编译运行。

## V1 数据结构

每次训练记录：

```js
{
  id,
  size,
  total,
  durationMs,
  errors,
  accuracy,
  avgReactionMs,
  fastestMs,
  slowestMs,
  score,
  createdAt,
  clickRecords: [
    { number, reactionMs, clickedAt }
  ]
}
```

## 专注力评分

V1 为产品化展示评分，不是医学或心理诊断指标。评分主要基于：

- 不同方格尺寸的参考完成时间
- 实际完成速度
- 错误次数惩罚

后续可根据真实用户分布改为百分位评分模型。

## 推荐 V1.1

- 微信云开发同步训练数据
- 每日训练任务
- 连续训练天数
- 7/30 天趋势图
- 好友排行榜
- 分享成绩卡
- 音效/震动开关
- 深色模式


## V1.0.2 代码质量修复

- 在 `app.json` 启用 `"lazyCodeLoading": "requiredComponents"`。
- 用于通过微信开发者工具“代码质量 → 组件 → 启用组件按需注入”检查。
- 该项目当前无自定义组件，因此无需额外配置 `componentPlaceholder`。
