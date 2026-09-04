const HISTORY_KEY = 'schulte_training_history_v1';
const SETTINGS_KEY = 'schulte_settings_v1';

function getHistory() {
  try {
    return wx.getStorageSync(HISTORY_KEY) || [];
  } catch (e) {
    return [];
  }
}

function saveRecord(record) {
  const history = getHistory();
  history.unshift(record);
  const trimmed = history.slice(0, 200);
  wx.setStorageSync(HISTORY_KEY, trimmed);
  return trimmed;
}

function clearHistory() {
  wx.removeStorageSync(HISTORY_KEY);
}

function getSettings() {
  try {
    return wx.getStorageSync(SETTINGS_KEY) || { size: 5 };
  } catch (e) {
    return { size: 5 };
  }
}

function saveSettings(settings) {
  wx.setStorageSync(SETTINGS_KEY, settings);
}

module.exports = {
  getHistory,
  saveRecord,
  clearHistory,
  getSettings,
  saveSettings,
};
