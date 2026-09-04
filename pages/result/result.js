const { getHistory } = require('../../utils/storage');
const { formatDuration, getScoreLabel } = require('../../utils/schulte');

Page({
  data: {
    result: null,
    durationText: '--',
    avgReactionText: '--',
    fastestText: '--',
    slowestText: '--',
    scoreLabel: '',
    bestText: '--',
    isBest: false,
  },

  onLoad() {
    const result = wx.getStorageSync('schulte_last_result_v1');
    if (!result) {
      wx.redirectTo({ url: '/pages/index/index' });
      return;
    }

    const history = getHistory().filter((item) => Number(item.size) === Number(result.size));
    const previous = history.filter((item) => item.id !== result.id);
    const best = history.length
      ? Math.min.apply(null, history.map((item) => item.durationMs))
      : result.durationMs;
    const previousBest = previous.length
      ? Math.min.apply(null, previous.map((item) => item.durationMs))
      : null;

    this.setData({
      result,
      durationText: `${formatDuration(result.durationMs)}s`,
      avgReactionText: `${result.avgReactionMs}ms`,
      fastestText: `${result.fastestMs}ms`,
      slowestText: `${result.slowestMs}ms`,
      scoreLabel: getScoreLabel(result.score),
      bestText: `${formatDuration(best)}s`,
      isBest: previousBest === null || result.durationMs < previousBest,
    });
  },

  trainAgain() {
    wx.redirectTo({ url: `/pages/training/training?size=${this.data.result.size}` });
  },

  goHome() {
    wx.reLaunch({ url: '/pages/index/index' });
  },

  openHistory() {
    wx.redirectTo({ url: '/pages/history/history' });
  },
});
