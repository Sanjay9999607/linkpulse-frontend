import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8080";

const api = {
  shorten: (data) => fetch(`${API_BASE}/api/shorten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  getAllUrls: () => fetch(`${API_BASE}/api/urls/all`).then(r => r.json()),
  deleteUrl: (code) => fetch(`${API_BASE}/api/url/${code}`, { method: "DELETE" }).then(r => r.json()),
  getOverview: () => fetch(`${API_BASE}/api/stats/overview`).then(r => r.json()),
  getCountry: () => fetch(`${API_BASE}/api/stats/country`).then(r => r.json()),
  getPlatform: () => fetch(`${API_BASE}/api/stats/platform`).then(r => r.json()),
  getAllLogs: () => fetch(`${API_BASE}/api/logs/all`).then(r => r.json()),
  getSuccessLogs: () => fetch(`${API_BASE}/api/logs/success`).then(r => r.json()),
  getFailedLogs: () => fetch(`${API_BASE}/api/logs/failed`).then(r => r.json()),
  getExpiredLogs: () => fetch(`${API_BASE}/api/logs/expired`).then(r => r.json()),
  getQrCode: (code) => fetch(`${API_BASE}/api/qr/${code}`).then(r => r.json()),
  subscribe: (email) => fetch(`${API_BASE}/api/logs/alerts/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  }).then(r => r.json()),
};

const styles = {
  app: { minHeight: "100vh", background: "#0a0e1a", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" },
  nav: { background: "#111827", borderBottom: "1px solid #1f2937", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", position: "sticky", top: 0, zIndex: 100 },
  navLogo: { display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: 700, color: "#60a5fa" },
  navBadge: { background: "#1d4ed8", color: "white", padding: "2px 10px", borderRadius: "20px", fontSize: "11px" },
  navTabs: { display: "flex", gap: "4px" },
  navTab: { padding: "6px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 500, transition: "all 0.2s" },
  content: { padding: "24px", maxWidth: "1200px", margin: "0 auto" },
  card: { background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", marginBottom: "20px" },
  cardTitle: { fontSize: "16px", fontWeight: 600, color: "#f1f5f9", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" },
  grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
  statCard: { background: "#1f2937", borderRadius: "10px", padding: "20px", textAlign: "center" },
  statNum: { fontSize: "32px", fontWeight: 700, color: "#60a5fa" },
  statLabel: { fontSize: "13px", color: "#9ca3af", marginTop: "4px" },
  input: { width: "100%", background: "#1f2937", border: "1px solid #374151", borderRadius: "8px", padding: "10px 14px", color: "#e2e8f0", fontSize: "14px", outline: "none", boxSizing: "border-box" },
  btn: { padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600, transition: "all 0.2s" },
  btnPrimary: { background: "#2563eb", color: "white" },
  btnDanger: { background: "#dc2626", color: "white", padding: "6px 12px", fontSize: "12px" },
  btnSuccess: { background: "#059669", color: "white", padding: "6px 12px", fontSize: "12px" },
  btnGray: { background: "#374151", color: "#e2e8f0", padding: "6px 12px", fontSize: "12px" },
  btnPurple: { background: "#7c3aed", color: "white", padding: "6px 12px", fontSize: "12px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: "12px", color: "#9ca3af", borderBottom: "1px solid #1f2937", textTransform: "uppercase" },
  td: { padding: "12px", fontSize: "13px", borderBottom: "1px solid #1f2937", color: "#e2e8f0" },
  badge: { padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 },
  resultBox: { background: "#1f2937", border: "1px solid #374151", borderRadius: "8px", padding: "16px", marginTop: "16px" },
  shortUrl: { color: "#60a5fa", fontSize: "18px", fontWeight: 600 },
  label: { fontSize: "13px", color: "#9ca3af", marginBottom: "6px", display: "block" },
  row: { display: "flex", gap: "12px", alignItems: "flex-end" },
  logItem: { background: "#1f2937", borderRadius: "8px", padding: "12px 16px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  filterRow: { display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" },
  emptyState: { textAlign: "center", padding: "40px", color: "#6b7280" },
  toast: { position: "fixed", bottom: "24px", right: "24px", background: "#059669", color: "white", padding: "12px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, zIndex: 1000 },
  modal: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  modalBox: { background: "#111827", border: "1px solid #1f2937", borderRadius: "12px", padding: "24px", textAlign: "center", maxWidth: "300px" },
};

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2000); return () => clearTimeout(t); }, [onClose]);
  return <div style={styles.toast}>✅ {message}</div>;
}

function QrModal({ qrData, onClose }) {
  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", color: "#f1f5f9" }}>
          QR Code for /{qrData.shortCode}
        </div>
        <img
          src={`data:image/png;base64,${qrData.qrCode}`}
          alt="QR Code"
          style={{ width: "200px", height: "200px", borderRadius: "8px" }}
        />
        <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "12px" }}>
          Scan to open: {qrData.shortUrl}
        </div>
        <button
          style={{ ...styles.btn, ...styles.btnGray, marginTop: "16px", width: "100%" }}
          onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function CreateLink() {
  const [longUrl, setLongUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [maxClicks, setMaxClicks] = useState("");
  const [result, setResult] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleShorten = async () => {
    if (!longUrl) { setError("Please enter a URL!"); return; }
    setLoading(true); setError("");
    try {
      const data = await api.shorten({
        longUrl,
        customAlias: alias || undefined,
        expiryDate: expiryDate || undefined,
        maxClicks: maxClicks ? parseInt(maxClicks) : undefined
      });
      if (data.error) { setError(data.error); } else {
        setResult(data);
        const qr = await api.getQrCode(data.shortCode);
        setQrData(qr);
      }
    } catch (e) {
      setError("Cannot connect to backend!");
    }
    setLoading(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>🔗 Create Short Link</div>
      <div style={{ marginBottom: "12px" }}>
        <label style={styles.label}>Long URL *</label>
        <input
          style={styles.input}
          placeholder="https://www.example.com/very-long-url..."
          value={longUrl}
          onChange={e => setLongUrl(e.target.value)}
          onKeyPress={e => e.key === "Enter" && handleShorten()}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={styles.label}>Custom Alias (Optional)</label>
        <input
          style={styles.input}
          placeholder="my-custom-link"
          value={alias}
          onChange={e => setAlias(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <button
          style={{ ...styles.btn, ...styles.btnGray, fontSize: "12px", padding: "6px 12px" }}
          onClick={() => setShowAdvanced(!showAdvanced)}>
          {showAdvanced ? "▲ Hide" : "▼ Show"} Advanced Options
        </button>
      </div>

      {showAdvanced && (
        <div style={{ ...styles.grid2, marginBottom: "16px" }}>
          <div>
            <label style={styles.label}>⏰ Expiry Date (Optional)</label>
            <input
              style={styles.input}
              type="date"
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
            />
          </div>
          <div>
            <label style={styles.label}>🔢 Max Clicks (Optional)</label>
            <input
              style={styles.input}
              type="number"
              placeholder="e.g. 100"
              value={maxClicks}
              onChange={e => setMaxClicks(e.target.value)}
            />
          </div>
        </div>
      )}

      <button
        style={{ ...styles.btn, ...styles.btnPrimary, width: "100%" }}
        onClick={handleShorten}
        disabled={loading}>
        {loading ? "Creating..." : "🚀 Generate Short Link"}
      </button>

      {error && (
        <div style={{ color: "#f87171", marginTop: "12px", fontSize: "13px" }}>
          ❌ {error}
        </div>
      )}

      {result && (
        <div style={styles.resultBox}>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>
            ✅ Your Short Link is Ready!
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <div style={styles.shortUrl}>{result.shortUrl}</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ ...styles.btn, ...styles.btnSuccess }} onClick={copyUrl}>
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
              <a href={result.shortUrl} target="_blank" rel="noreferrer">
                <button style={{ ...styles.btn, ...styles.btnGray }}>🔗 Open</button>
              </a>
              {qrData && (
                <button
                  style={{ ...styles.btn, ...styles.btnPurple }}
                  onClick={() => setQrData(qrData)}>
                  📱 QR Code
                </button>
              )}
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
            Original: {result.longUrl}
          </div>
          {result.maxClicks > 0 && (
            <div style={{ fontSize: "12px", color: "#fbbf24", marginTop: "4px" }}>
              🔢 Max Clicks: {result.maxClicks}
            </div>
          )}
          {result.expiryDate && (
            <div style={{ fontSize: "12px", color: "#f87171", marginTop: "4px" }}>
              ⏰ Expires: {result.expiryDate}
            </div>
          )}
        </div>
      )}

      {qrData && qrData.qrCode && (
        <QrModal qrData={qrData} onClose={() => setQrData(null)} />
      )}
    </div>
  );
}

function OverviewStats() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.getOverview().then(setStats).catch(() => {});
    const interval = setInterval(() => {
      api.getOverview().then(setStats).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return (
    <div style={styles.card}>
      <div style={styles.emptyState}>Loading stats...</div>
    </div>
  );

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={styles.cardTitle}>📊 Overview</div>
        <span style={{ fontSize: "12px", color: "#6b7280" }}>Auto refreshes every 10s</span>
      </div>
      <div style={styles.grid4}>
        {[
          { label: "Total Links", value: stats.totalLinks || 0, color: "#60a5fa", icon: "🔗" },
          { label: "Total Clicks", value: stats.totalClicks || 0, color: "#34d399", icon: "👆" },
          { label: "Active Links", value: stats.activeLinks || 0, color: "#a78bfa", icon: "✅" },
          { label: "Unique Clicks", value: stats.uniqueClicks || 0, color: "#fbbf24", icon: "👤" },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ ...styles.statNum, color: s.color }}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MyLinks({ toast }) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState(null);

  const load = () => {
    setLoading(true);
    api.getAllUrls()
      .then(data => { setUrls(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (code) => {
    await api.deleteUrl(code);
    toast("URL deleted!");
    load();
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast("Copied!");
  };

  const showQr = async (code) => {
    const data = await api.getQrCode(code);
    setQrData(data);
  };

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={styles.cardTitle}>🔗 My Links</div>
        <button style={{ ...styles.btn, ...styles.btnGray }} onClick={load}>🔄 Refresh</button>
      </div>
      {loading ? <div style={styles.emptyState}>Loading...</div> :
        urls.length === 0 ? (
          <div style={styles.emptyState}>
            No links yet! Create your first short link ☝️
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Short URL</th>
                <th style={styles.th}>Original URL</th>
                <th style={styles.th}>Clicks</th>
                <th style={styles.th}>Max</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url, i) => (
                <tr key={i}>
                  <td style={styles.td}>
                    <a href={url.shortUrl} target="_blank" rel="noreferrer"
                      style={{ color: "#60a5fa" }}>
                      {url.shortUrl}
                    </a>
                  </td>
                  <td style={{ ...styles.td, maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {url.longUrl}
                  </td>
                  <td style={styles.td}>{url.totalClicks || 0}</td>
                  <td style={styles.td}>{url.maxClicks > 0 ? url.maxClicks : "∞"}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: url.status === "ACTIVE" ? "#065f46" : "#7f1d1d",
                      color: url.status === "ACTIVE" ? "#34d399" : "#fca5a5"
                    }}>
                      {url.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button style={{ ...styles.btn, ...styles.btnSuccess }}
                        onClick={() => copyUrl(url.shortUrl)}>📋</button>
                      <button style={{ ...styles.btn, ...styles.btnPurple }}
                        onClick={() => showQr(url.shortCode)}>📱</button>
                      <button style={{ ...styles.btn, ...styles.btnDanger }}
                        onClick={() => handleDelete(url.shortCode)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      {qrData && qrData.qrCode && (
        <QrModal qrData={qrData} onClose={() => setQrData(null)} />
      )}
    </div>
  );
}

function Analytics() {
  const [country, setCountry] = useState({});
  const [platform, setPlatform] = useState({});

  useEffect(() => {
    api.getCountry().then(setCountry).catch(() => {});
    api.getPlatform().then(setPlatform).catch(() => {});
  }, []);

  return (
    <div style={styles.grid2}>
      <div style={styles.card}>
        <div style={styles.cardTitle}>🌍 Clicks By Country</div>
        {Object.keys(country).length === 0
          ? <div style={styles.emptyState}>No data yet! Click some links first.</div>
          : Object.entries(country).map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1f2937" }}>
              <span>🌍 {k}</span>
              <span style={{ color: "#60a5fa", fontWeight: 600 }}>{v} clicks</span>
            </div>
          ))}
      </div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>💻 Clicks By Platform</div>
        {Object.keys(platform).length === 0
          ? <div style={styles.emptyState}>No data yet! Click some links first.</div>
          : Object.entries(platform).map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1f2937" }}>
              <span>{k === "Mobile" ? "📱" : k === "Desktop" ? "💻" : "📟"} {k}</span>
              <span style={{ color: "#34d399", fontWeight: 600 }}>{v} clicks</span>
            </div>
          ))}
      </div>
    </div>
  );
}

function LogAnalyzer() {
  const [logs, setLogs] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAllLogs()
      .then(data => {
        const d = Array.isArray(data) ? data : [];
        setAllLogs(d);
        setLogs(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleFilter = (f) => {
    setFilter(f);
    if (f === "all") setLogs(allLogs);
    else if (f === "success") setLogs(allLogs.filter(l => l.status === "SUCCESS"));
    else if (f === "failed") setLogs(allLogs.filter(l => l.status === "FAILED"));
    else if (f === "expired") setLogs(allLogs.filter(l => l.logType === "EXPIRED"));
    else if (f === "redirect") setLogs(allLogs.filter(l => l.logType === "REDIRECT"));
    else if (f === "create") setLogs(allLogs.filter(l => l.logType === "CREATE"));
  };

  const filterBtns = [
    { key: "all", label: "All", color: "#374151" },
    { key: "success", label: "✅ Success", color: "#065f46" },
    { key: "failed", label: "❌ Failed", color: "#7f1d1d" },
    { key: "expired", label: "⚠️ Expired", color: "#78350f" },
    { key: "redirect", label: "🔀 Redirects", color: "#1e3a5f" },
    { key: "create", label: "➕ Created", color: "#1e3a2f" },
  ];

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={styles.cardTitle}>📋 Log Analyzer</div>
        <span style={{ fontSize: "12px", color: "#6b7280" }}>
          Total: {allLogs.length} logs
        </span>
      </div>
      <div style={styles.filterRow}>
        {filterBtns.map(b => (
          <button
            key={b.key}
            style={{
              ...styles.btn,
              background: filter === b.key ? b.color : "#1f2937",
              color: "#e2e8f0",
              border: filter === b.key ? "1px solid #60a5fa" : "1px solid transparent",
              padding: "6px 12px",
              fontSize: "12px"
            }}
            onClick={() => handleFilter(b.key)}>
            {b.label}
          </button>
        ))}
      </div>
      {loading ? <div style={styles.emptyState}>Loading logs...</div> :
        logs.length === 0 ? (
          <div style={styles.emptyState}>No logs found for this filter</div>
        ) : (
          logs.map((log, i) => (
            <div key={i} style={styles.logItem}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500 }}>{log.message}</div>
                <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                  📌 {log.shortCode} • 🕐 {log.timestamp?.substring(0, 19)?.replace("T", " ")} • {log.logType}
                </div>
              </div>
              <span style={{
                ...styles.badge,
                background: log.status === "SUCCESS" ? "#065f46" : "#7f1d1d",
                color: log.status === "SUCCESS" ? "#34d399" : "#fca5a5"
              }}>
                {log.status}
              </span>
            </div>
          ))
        )}
    </div>
  );
}

function SnsAlerts({ toast }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await api.subscribe(email);
      toast("Subscribed successfully!");
      setEmail("");
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>🔔 SNS Alerts</div>
      <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "16px" }}>
        Subscribe to get email alerts for your links!
      </p>
      <div style={styles.row}>
        <input
          style={{ ...styles.input, flex: 1 }}
          placeholder="Enter your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
        />
        <button
          style={{ ...styles.btn, ...styles.btnPrimary }}
          onClick={handleSubscribe}
          disabled={loading}>
          {loading ? "Subscribing..." : "🔔 Subscribe"}
        </button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "12px" }}>
          Alert Types:
        </div>
        {[
          { icon: "🚀", title: "Viral Alert", desc: "When link gets 1000+ clicks", color: "#1d4ed8" },
          { icon: "❌", title: "Failed Redirects", desc: "When links have repeated failures", color: "#7f1d1d" },
          { icon: "📊", title: "Daily Report", desc: "Daily summary sent every midnight", color: "#065f46" },
          { icon: "⏰", title: "Expiry Alert", desc: "When your link is about to expire", color: "#78350f" },
        ].map((a, i) => (
          <div key={i} style={{ ...styles.logItem, marginBottom: "8px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "20px" }}>{a.icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500 }}>{a.title}</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>{a.desc}</div>
              </div>
            </div>
            <span style={{ ...styles.badge, background: a.color, color: "white" }}>Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const tabs = [
    { key: "dashboard", label: "🏠 Dashboard" },
    { key: "links", label: "🔗 My Links" },
    { key: "analytics", label: "📈 Analytics" },
    { key: "logs", label: "📋 Logs" },
    { key: "alerts", label: "🔔 Alerts" },
  ];

  return (
    <div style={styles.app}>
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          🔗 LinkPulse
          <span style={styles.navBadge}>AWS + Redis + QR</span>
        </div>
        <div style={styles.navTabs}>
          {tabs.map(t => (
            <button
              key={t.key}
              style={{
                ...styles.navTab,
                background: tab === t.key ? "#1d4ed8" : "transparent",
                color: tab === t.key ? "white" : "#9ca3af"
              }}
              onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div style={styles.content}>
        {tab === "dashboard" && (
          <>
            <CreateLink />
            <OverviewStats />
          </>
        )}
        {tab === "links" && <MyLinks toast={showToast} />}
        {tab === "analytics" && <Analytics />}
        {tab === "logs" && <LogAnalyzer />}
        {tab === "alerts" && <SnsAlerts toast={showToast} />}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}