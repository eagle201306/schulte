const { getHistory, getSettings, saveSettings } = require('../../utils/storage');
const { formatDuration } = require('../../utils/schulte');

Page({
  data: {
    sizes: [3, 4, 5, 6, 7],
    selectedSize: 5,
    totalCells: 25,
    bestText: '--',
    trainingCount: 0,
    recentScore: '--',
  },

  onLoad() {
    const settings = getSettings();
    const size = Number(settings.size) || 5;
    this.setData({ selectedSize: size, totalCells: size * size });
  },

  onShow() {
    this.refreshSummary();
  },

  selectSize(e) {
    const size = Number(e.currentTarget.dataset.size);
    this.setData({ selectedSize: size, totalCells: size * size }, () => {
      this.refreshSummary();
    });
    saveSettings({ size });
  },

  startTraining() {
    const { selectedSize } = this.data;
    wx.navigateTo({
      url: `/pages/training/training?size=${selectedSize}`,
    });
  },

  openHistory() {
    wx.navigateTo({ url: '/pages/history/history' });
  },

  refreshSummary() {
    const history = getHistory();
    const { selectedSize } = this.data;
    const sameSize = history.filter((item) => Number(item.size) === Number(selectedSize));
    const best = sameSize.length
      ? Math.min.apply(null, sameSize.map((item) => item.durationMs))
      : null;

    this.setData({
      trainingCount: history.length,
      bestText: best ? `${formatDuration(best)}s` : '--',
      recentScore: history.length ? history[0].score : '--',
    });
  },
});
