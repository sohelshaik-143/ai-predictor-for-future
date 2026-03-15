const K_TIME   = "aip_time_total";
const K_VISITS = "aip_page_visits";
const K_LOG    = "aip_activity_log";

export const logVisit = (page) => {
  const v = JSON.parse(localStorage.getItem(K_VISITS) || "{}");
  v[page] = (v[page] || 0) + 1;
  localStorage.setItem(K_VISITS, JSON.stringify(v));
  pushLog("visit", `Opened ${page}`);
};

export const pushLog = (type, detail) => {
  const log = JSON.parse(localStorage.getItem(K_LOG) || "[]");
  log.unshift({ type, detail, time: new Date().toISOString() });
  localStorage.setItem(K_LOG, JSON.stringify(log.slice(0, 120)));
};

export const addTime = (secs) => {
  const t = parseInt(localStorage.getItem(K_TIME) || "0") + secs;
  localStorage.setItem(K_TIME, String(t));
};

export const getStats = () => ({
  totalTime : parseInt(localStorage.getItem(K_TIME) || "0"),
  visits    : JSON.parse(localStorage.getItem(K_VISITS) || "{}"),
  log       : JSON.parse(localStorage.getItem(K_LOG) || "[]"),
});

export const fmtTime = (secs) => {
  if (!secs || secs < 1) return "0s";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};
