const { shuffleNumbers, calcAccuracy, calcFocusScore } = require('../../utils/schulte');
const { saveRecord } = require('../../utils/storage');

Page({
  data: {
    size: 5,
    total: 25,
    numbers: [],
    currentNumber: 1,
    completedNumbers: [],
    elapsedText: '0.00',
    errors: 0,
    progress: 0,
    isStarted: false,
    isFinished: false,
    cellFontSize: 42,
    boardGap: 10,
  },

  onLoad(options) {
    const size = Math.max(3, Math.min(7, Number(options.size) || 5));
    const total = size * size;
    this.setData({
      size,
      total,
      numbers: shuffleNumbers(size),
      cellFontSize: size >= 7 ? 29 : size === 6 ? 33 : size === 5 ? 39 : 46,
      boardGap: size >= 6 ? 7 : 10,
    });
  },

  onUnload() {
    this.stopTimer();
  },

  startGame(startTimestamp) {
    if (this.data.isStarted) return;
    const now = startTimestamp || Date.now();
    this.startAt = now;
    this.lastCorrectAt = now;
    this.clickRecords = [];
    this.setData({ isStarted: true });
    this.timer = setInterval(() => {
      const elapsed = Date.now() - this.startAt;
      this.setData({ elapsedText: (elapsed / 1000).toFixed(2) });
    }, 50);
  },

  tapCell(e) {
    if (this.data.isFinished) return;

    const value = Number(e.currentTarget.dataset.value);
    const now = Date.now();

    if (value !== this.data.currentNumber) {
      const errors = this.data.errors + 1;
      this.setData({ errors });
      if (wx.vibrateShort) {
        wx.vibrateShort({ type: 'light' });
      }
      return;
    }

    const isFirstCorrectClick = !this.data.isStarted;
    if (isFirstCorrectClick) {
      this.startGame(now);
    }

    const correctNow = Date.now();
    const reactionMs = isFirstCorrectClick ? null : correctNow - this.lastCorrectAt;
    this.clickRecords.push({
      number: value,
      reactionMs,
      clickedAt: correctNow,
    });
    this.lastCorrectAt = correctNow;

    const completedNumbers = this.data.completedNumbers.concat(value);
    const next = value + 1;
    const progress = Math.round((value / this.data.total) * 100);

    this.setData({
      currentNumber: next,
      completedNumbers,
      progress,
    });

    if (value === this.data.total) {
      this.finishGame(correctNow);
    }
  },

  finishGame(endAt) {
    this.stopTimer();
    const durationMs = endAt - this.startAt;
    const reactionTimes = this.clickRecords
      .map((item) => item.reactionMs)
      .filter((value) => typeof value === 'number');
    const avgReactionMs = reactionTimes.length
      ? Math.round(reactionTimes.reduce((sum, value) => sum + value, 0) / reactionTimes.length)
      : 0;
    const fastestMs = reactionTimes.length ? Math.min.apply(null, reactionTimes) : 0;
    const slowestMs = reactionTimes.length ? Math.max.apply(null, reactionTimes) : 0;
    const accuracy = calcAccuracy(this.data.total, this.data.errors);
    const score = calcFocusScore(this.data.size, durationMs, this.data.errors);

    const record = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      size: this.data.size,
      total: this.data.total,
      durationMs,
      errors: this.data.errors,
      accuracy,
      avgReactionMs,
      fastestMs,
      slowestMs,
      score,
      createdAt: Date.now(),
      clickRecords: this.clickRecords,
    };

    saveRecord(record);
    wx.setStorageSync('schulte_last_result_v1', record);

    this.setData({
      isFinished: true,
      elapsedText: (durationMs / 1000).toFixed(2),
      progress: 100,
    });

    setTimeout(() => {
      wx.redirectTo({ url: '/pages/result/result' });
    }, 260);
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  restartGame() {
    this.stopTimer();
    this.startAt = null;
    this.lastCorrectAt = null;
    this.clickRecords = [];
    this.setData({
      numbers: shuffleNumbers(this.data.size),
      currentNumber: 1,
      completedNumbers: [],
      elapsedText: '0.00',
      errors: 0,
      progress: 0,
      isStarted: false,
      isFinished: false,
    });
  },
});
