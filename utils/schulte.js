function shuffleNumbers(size) {
  const total = size * size;
  const numbers = Array.from({ length: total }, (_, i) => i + 1);

  for (let i = numbers.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}

function formatDuration(ms) {
  const safe = Math.max(0, Number(ms) || 0);
  return (safe / 1000).toFixed(2);
}

function calcAccuracy(total, errors) {
  const attempts = total + errors;
  if (!attempts) return 100;
  return Math.round((total / attempts) * 100);
}

function getBenchmarkSeconds(size) {
  const table = {
    3: 8,
    4: 15,
    5: 25,
    6: 40,
    7: 60,
  };
  return table[size] || size * size;
}

function calcFocusScore(size, durationMs, errors) {
  const benchmarkMs = getBenchmarkSeconds(size) * 1000;
  const speedScore = Math.min(100, Math.max(0, (benchmarkMs / Math.max(durationMs, 1)) * 82));
  const errorPenalty = errors * 5;
  return Math.round(Math.max(0, Math.min(100, speedScore - errorPenalty)));
}

function getScoreLabel(score) {
  if (score >= 90) return '优秀';
  if (score >= 80) return '良好';
  if (score >= 65) return '稳定';
  if (score >= 50) return '继续训练';
  return '正在建立节奏';
}

module.exports = {
  shuffleNumbers,
  formatDuration,
  calcAccuracy,
  calcFocusScore,
  getScoreLabel,
};
