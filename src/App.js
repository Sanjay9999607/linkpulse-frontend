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
  getAllStats: () => fetch(`${API_BASE}/api/stats/all`).then(r => r.json()),
  getCountry: () => fetch(`${API_BASE}/api/stats/country`).then(r => r.json()),
  getPlatform: () => fetch(`${API_BASE}/api/stats/platform`).then(r => r.json()),
  getAllLogs: () => fetch(`${API_BASE}/api/logs/all`).then(r => r.json()),
  getSuccessLogs: () => fetch(`${API_BASE}/api/logs/success`).then(r => r.json()),
  getFailedLogs: () => fetch(`${API_BASE}/api/logs/failed`).then(r => r.json()),
  getExpiredLogs: () => fetch(`${API_BASE}/api/logs/expired`).then(r => r.json()),
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
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: "12px", color: "#9ca3af", borderBottom: "1px solid #1f2937", textTransform: "uppercase", letterSpacing: "0.05em" },
  td: { padding: "12px", fontSize: "13px", borderBottom: "1px solid #1f2937", color: "#e2e8f0" },
  badge: { padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 },
  resultBox: { background: "#1f2937", border: "1px solid #374151", borderRadius: "8px", padding: "16px", marginTop: "16px" },
  shortUrl: { color: "#60a5fa", fontSize: "18px", fontWeight: 600 },
  label: { fontSize: "13px", color: "#9ca3af", marginBottom: "6px", display: "block" },
  row: { display: "flex", gap: "12px", alignItems: "flex-end" },
  logItem: { background: "#1f2937", borderRadius: "8px", padding: "12px 16px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  filterRow: { display: "flex", gap: "8px", marginBottom: "16px" },
  emptyState: { textAlign: "center", padding: "40px", color: "#6b7280" },
  toast: { position: "fixed", bottom: "24px", right: "24px", background: "#059669", color: "white", padding: "12px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, zIndex: 1000 },
};

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2000); return () => clearTimeout(t); }, [onClose]);
  return <div style={styles.toast}>✅ {message}</div>;
}

function CreateLink() {
  const [longUrl, setLongUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    if (!longUrl) { setError("Please enter a URL!"); return; }
    setLoading(true); setError("");
    try {
      const data = await api.shorten({ longUrl, customAlias: alias || undefined });
      if (data.error) { setError(data.error); } else { setResult(data); }
    } catch (e) { setError("Cannot connect to backend! Make sure Spring Boot is running."); }
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
        <input style={styles.input} placeholder="https://www.example.com/very-long-url..." value={longUrl} onChange={e => setLongUrl(e.target.value)} onKeyPress={e => e.key === "Enter" && handleShorten()} />
      </div>
      <div style={styles.row}>
        <div style={{ flex: 1 }}>
          <label style={styles.label}>Custom Alias (Optional)</label>
          <input style={styles.input} placeholder="my-custom-link" value={alias} onChange={e => setAlias(e.target.value)} />
        </div>
        <button style={{ ...styles.btn, ...styles.btnPrimary, height: "40px", whiteSpace: "nowrap" }} onClick={handleShorten} disabled={loading}>
          {loading ? "Creating..." : "🚀 Generate Short Link"}
        </button>
      </div>
      {error && <div style={{ color: "#f87171", marginTop: "12px", fontSize: "13px" }}>❌ {error}</div>}
      {result && (
        <div style={styles.resultBox}>
          <div style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "8px" }}>✅ Your Short Link is Ready!</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={styles.shortUrl}>{result.shortUrl}</div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ ...styles.btn, ...styles.btnSuccess }} onClick={copyUrl}>{copied ? "✅ Copied!" : "📋 Copy"}</button>
              <a href={result.shortUrl} target="_blank" rel="noreferrer"><button style={{ ...styles.btn, ...styles.btnGray }}>🔗 Open</button></a>
            </div>
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>Original: {result.longUrl}</div>
        </div>
      )}
    </div>
  );
}

function OverviewStats() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.getOverview().then(setStats).catch(() => {}); }, []);
  if (!stats) return <div style={styles.card}><div style={styles.emptyState}>Loading stats...</div></div>;
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>📊 Overview</div>
      <div style={styles.grid4}>
        {[
          { label: "Total Links", value: stats.totalLinks || 0, color: "#60a5fa" },
          { label: "Total Clicks", value: stats.totalClicks || 0, color: "#34d399" },
          { label: "Active Links", value: stats.activeLinks || 0, color: "#a78bfa" },
          { label: "Unique Clicks", value: stats.uniqueClicks || 0, color: "#fbbf24" },
        ].map((s, i) => (
          <div key={i} style={styles.statCard}>
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

  const load = () => { setLoading(true); api.getAllUrls().then(data => { setUrls(Array.isArray(data) ? data : []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleDelete = async (code) => {
    await api.deleteUrl(code);
    toast("URL deleted!");
    load();
  };

  const copyUrl = (url) => { navigator.clipboard.writeText(url); toast("Copied!"); };

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={styles.cardTitle}>🔗 My Links</div>
        <button style={{ ...styles.btn, ...styles.btnGray }} onClick={load}>🔄 Refresh</button>
      </div>
      {loading ? <div style={styles.emptyState}>Loading...</div> :
        urls.length === 0 ? <div style={styles.emptyState}>No links yet! Create your first short link above ☝️</div> : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Short URL</th>
                <th style={styles.th}>Original URL</th>
                <th style={styles.th}>Clicks</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((url, i) => (
                <tr key={i}>
                  <td style={styles.td}><a href={url.shortUrl} target="_blank" rel="noreferrer" style={{ color: "#60a5fa" }}>{url.shortUrl}</a></td>
                  <td style={{ ...styles.td, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url.longUrl}</td>
                  <td style={styles.td}>{url.totalClicks || 0}</td>
                  <td style={styles.td}><span style={{ ...styles.badge, background: url.status === "ACTIVE" ? "#065f46" : "#7f1d1d", color: url.status === "ACTIVE" ? "#34d399" : "#fca5a5" }}>{url.status}</span></td>
                  <td style={styles.td}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button style={{ ...styles.btn, ...styles.btnSuccess }} onClick={() => copyUrl(url.shortUrl)}>📋</button>
                      <button style={{ ...styles.btn, ...styles.btnDanger }} onClick={() => handleDelete(url.shortCode)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        {Object.keys(country).length === 0 ? <div style={styles.emptyState}>No data yet</div> :
          Object.entries(country).map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1f2937" }}>
              <span>{k}</span><span style={{ color: "#60a5fa", fontWeight: 600 }}>{v}</span>
            </div>
          ))}
      </div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>💻 Clicks By Platform</div>
        {Object.keys(platform).length === 0 ? <div style={styles.emptyState}>No data yet</div> :
          Object.entries(platform).map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1f2937" }}>
              <span>{k}</span><span style={{ color: "#34d399", fontWeight: 600 }}>{v}</span>
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
    if (f === "all") {
      setLogs(allLogs);
    } else if (f === "success") {
      setLogs(allLogs.filter(l =>
        l.status === "SUCCESS"));
    } else if (f === "failed") {
      setLogs(allLogs.filter(l =>
        l.status === "FAILED"));
    } else if (f === "expired") {
      setLogs(allLogs.filter(l =>
        l.logType === "EXPIRED"));
    }
  };

  const filterBtns = [
    { key: "all", label: "All Logs", color: "#374151" },
    { key: "success", label: "✅ Success", color: "#065f46" },
    { key: "failed", label: "❌ Failed", color: "#7f1d1d" },
    { key: "expired", label: "⚠️ Expired", color: "#78350f" },
  ];

  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>📋 Log Analyzer</div>
      <div style={styles.filterRow}>
        {filterBtns.map(b => (
          <button
            key={b.key}
            style={{
              ...styles.btn,
              background: filter === b.key ? b.color : "#1f2937",
              color: "#e2e8f0",
              border: filter === b.key
                ? "1px solid #60a5fa"
                : "1px solid transparent"
            }}
            onClick={() => handleFilter(b.key)}>
            {b.label}
          </button>
        ))}
      </div>
      {loading
        ? <div style={styles.emptyState}>Loading logs...</div>
        : logs.length === 0
        ? <div style={styles.emptyState}>No logs found</div>
        : logs.map((log, i) => (
          <div key={i} style={styles.logItem}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 500 }}>
                {log.message}
              </div>
              <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}>
                {log.shortCode} • {log.timestamp?.substring(0, 19)?.replace("T", " ")}
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
        ))}
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
      <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "16px" }}>Subscribe to get email alerts when your links go viral or have failed redirects!</p>
      <div style={styles.row}>
        <input style={{ ...styles.input, flex: 1 }} placeholder="Enter your email address" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        <button style={{ ...styles.btn, ...styles.btnPrimary }} onClick={handleSubscribe} disabled={loading}>{loading ? "Subscribing..." : "Subscribe"}</button>
      </div>
      <div style={{ marginTop: "20px" }}>
        <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "12px" }}>Alert Types:</div>
        {[
          { icon: "🚀", title: "Viral Alert", desc: "When your link gets 1000+ clicks" },
          { icon: "❌", title: "Failed Redirects", desc: "When links have repeated failures" },
          { icon: "📊", title: "Daily Report", desc: "Daily summary of all your links" },
        ].map((a, i) => (
          <div key={i} style={{ ...styles.logItem, marginBottom: "8px" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "20px" }}>{a.icon}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500 }}>{a.title}</div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>{a.desc}</div>
              </div>
            </div>
            <span style={{ ...styles.badge, background: "#1d4ed8", color: "#93c5fd" }}>Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

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
          <span style={styles.navBadge}>AWS</span>
        </div>
        <div style={styles.navTabs}>
          {tabs.map(t => (
            <button key={t.key} style={{ ...styles.navTab, background: tab === t.key ? "#1d4ed8" : "transparent", color: tab === t.key ? "white" : "#9ca3af" }} onClick={() => setTab(t.key)}>{t.label}</button>
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