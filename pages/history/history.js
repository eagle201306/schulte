const { getHistory, clearHistory } = require('../../utils/storage');
const { formatDuration } = require('../../utils/schulte');

Page({
  data: {
    sizes: ['全部', 3, 4, 5, 6, 7],
    activeSize: '全部',
    records: [],
    totalCount: 0,
    bestText: '--',
    avgText: '--',
  },

  onShow() {
    this.refresh();
  },

  selectSize(e) {
    const value = e.currentTarget.dataset.size;
    this.setData({ activeSize: value });
    this.refresh();
  },

  refresh() {
    const history = getHistory();
    const { activeSize } = this.data;
    const filtered = activeSize === '全部'
      ? history
      : history.filter((item) => Number(item.size) === Number(activeSize));

    const records = filtered.map((item) => ({
      ...item,
      durationText: `${formatDuration(item.durationMs)}s`,
      dateText: this.formatDate(item.createdAt),
    }));

    const best = filtered.length
      ? Math.min.apply(null, filtered.map((item) => item.durationMs))
      : null;
    const avg = filtered.length
      ? Math.round(filtered.reduce((sum, item) => sum + item.durationMs, 0) / filtered.length)
      : null;

    this.setData({
      records,
      totalCount: filtered.length,
      bestText: best ? `${formatDuration(best)}s` : '--',
      avgText: avg ? `${formatDuration(avg)}s` : '--',
    });
  },

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const pad = (n) => `${n}`.padStart(2, '0');
    return `${date.getMonth() + 1}/${date.getDate()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  },

  clearAll() {
    if (!getHistory().length) return;
    wx.showModal({
      title: '清空历史成绩',
      content: '清空后无法恢复，确认继续吗？',
      confirmText: '清空',
      success: (res) => {
        if (res.confirm) {
          clearHistory();
          this.refresh();
        }
      },
    });
  },
});
