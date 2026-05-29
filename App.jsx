import { useState, useMemo, useEffect } from "react";

// ── Google Sheets Config ─────────────────────────────────────────────────────
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbwxNmLcf89ukbiuG8xfPm_xlmE5W8CbYQlWAoLRgjSvG2b2_yudeLCwhyz8XyCBPm05iw/exec";

// ── DISCIPLER CODE ───────────────────────────────────────────────────────────
const DISCIPLER_CODE = "PASTOR2024";

// ════════════════════════════════════════════════════════════════════════════
// ── NEW TESTAMENT DATA ───────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

const NT_BOOKS = [
  { name: "Matthew", chapters: 28 }, { name: "Mark", chapters: 16 }, { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 }, { name: "Acts", chapters: 28 }, { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 }, { name: "2 Corinthians", chapters: 13 }, { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 }, { name: "Philippians", chapters: 4 }, { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 }, { name: "2 Thessalonians", chapters: 3 }, { name: "1 Timothy", chapters: 6 },
  { name: "2 Timothy", chapters: 4 }, { name: "Titus", chapters: 3 }, { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 }, { name: "James", chapters: 5 }, { name: "1 Peter", chapters: 5 },
  { name: "2 Peter", chapters: 3 }, { name: "1 John", chapters: 5 }, { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 }, { name: "Jude", chapters: 1 }, { name: "Revelation", chapters: 22 },
];

const NT_SECTIONS = [
  { label: "The Gospels", range: [1,37], color: "#7C6CAF", bg: "#EDE9FF", text: "#4B3B8C", desc: "The life, ministry, death & resurrection of Jesus" },
  { label: "The Early Church", range: [38,49], color: "#2E86AB", bg: "#E3F4FF", text: "#17527A", desc: "The birth and growth of the church through Acts" },
  { label: "Paul's Letters", range: [50,72], color: "#A23B72", bg: "#FFE8F3", text: "#7A2255", desc: "Doctrine, correction and encouragement to the churches" },
  { label: "General Epistles", range: [73,84], color: "#D07A2A", bg: "#FFF3E3", text: "#8A4A0A", desc: "Practical wisdom and faith under trial" },
  { label: "Prophecy & Triumph", range: [85,90], color: "#3D9970", bg: "#E2F7EE", text: "#1D6645", desc: "The ultimate victory of Christ in Revelation" },
];

const NT_THEMES = {
  1:"Identity in Christ", 2:"The Kingdom of God", 3:"Faith & Doubt", 4:"Discipleship Cost", 5:"The Holy Spirit",
  6:"Prayer & Persistence", 7:"Forgiveness & Grace", 8:"Serving Others", 9:"Suffering & Hope", 10:"The Word of God",
  11:"Love in Action", 12:"Community & Church", 13:"Prophecy Fulfilled",
};

// ════════════════════════════════════════════════════════════════════════════
// ── OLD TESTAMENT DATA ───────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

const OT_BOOKS = [
  { name: "Genesis", chapters: 50 }, { name: "Exodus", chapters: 40 }, { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 }, { name: "Deuteronomy", chapters: 34 }, { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 }, { name: "Ruth", chapters: 4 }, { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 }, { name: "1 Kings", chapters: 22 }, { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 }, { name: "2 Chronicles", chapters: 36 }, { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 }, { name: "Esther", chapters: 10 }, { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 50 }, { name: "Proverbs", chapters: 31 }, { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Solomon", chapters: 8 }, { name: "Isaiah", chapters: 66 }, { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 }, { name: "Ezekiel", chapters: 48 }, { name: "Daniel", chapters: 12 },
];

// OT plan: first 270 chapters of the OT (27 books × ~10 ch avg) spread over 90 days × 3 chapters
const OT_SECTIONS = [
  { label: "The Law (Torah)", range: [1, 22], color: "#C0392B", bg: "#FDECEA", text: "#7B241C", desc: "Creation, covenant, law and the founding of Israel" },
  { label: "History of Israel", range: [23, 48], color: "#1A5276", bg: "#D6EAF8", text: "#1A5276", desc: "Conquest, kingdoms, exile and restoration" },
  { label: "Poetry & Wisdom", range: [49, 66], color: "#B7950B", bg: "#FEF9E7", text: "#7D6608", desc: "Psalms, Proverbs and the wisdom of the ages" },
  { label: "Major Prophets", range: [67, 80], color: "#6C3483", bg: "#F4ECF7", text: "#6C3483", desc: "Isaiah, Jeremiah and Ezekiel call Israel to return" },
  { label: "Minor Prophets", range: [81, 90], color: "#1E8449", bg: "#EAFAF1", text: "#1E8449", desc: "The twelve: messages of judgment and hope" },
];

const OT_THEMES = {
  1:"God's Sovereignty", 2:"Covenant & Promise", 3:"Obedience & Blessing", 4:"Deliverance & Redemption", 5:"Worship & Holiness",
  6:"Leadership & Courage", 7:"Faith Under Pressure", 8:"God's Faithfulness", 9:"Justice & Mercy", 10:"Repentance & Restoration",
  11:"Wisdom for Living", 12:"Prophecy & Hope", 13:"The Coming Messiah",
};

// Minor prophets OT books (for days 81–90 of OT plan)
const OT_MINOR_PROPHETS = [
  { name: "Hosea", chapters: 14 }, { name: "Joel", chapters: 3 }, { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 }, { name: "Jonah", chapters: 4 }, { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 }, { name: "Habakkuk", chapters: 3 }, { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 }, { name: "Zechariah", chapters: 14 }, { name: "Malachi", chapters: 4 },
];

const MILESTONES = { 7:"1 week complete!", 30:"1 month strong!", 60:"Two-thirds done!", 90:"Journey Complete! 🎉" };

// ════════════════════════════════════════════════════════════════════════════
// ── PLAN BUILDERS ────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

function buildChapterList(books) {
  const list = [];
  for (const b of books) for (let c = 1; c <= b.chapters; c++) list.push({ book: b.name, chapter: c });
  return list;
}

function buildPlan(books) {
  const all = buildChapterList(books);
  const days = [];
  for (let i = 0; i < 90; i++) {
    const slice = all.slice(i * 3, i * 3 + 3);
    if (slice.length) days.push(slice);
  }
  return days;
}

const NT_PLAN = buildPlan(NT_BOOKS);
const OT_PLAN = buildPlan([...OT_BOOKS, ...OT_MINOR_PROPHETS]);

// ════════════════════════════════════════════════════════════════════════════
// ── HELPERS ──────────────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

function formatReading(chs) {
  if (!chs || !chs.length) return "";
  const groups = [];
  let cur = { book: chs[0].book, start: chs[0].chapter, end: chs[0].chapter };
  for (let i = 1; i < chs.length; i++) {
    if (chs[i].book === cur.book) cur.end = chs[i].chapter;
    else { groups.push(cur); cur = { book: chs[i].book, start: chs[i].chapter, end: chs[i].chapter }; }
  }
  groups.push(cur);
  return groups.map(g => g.start === g.end ? `${g.book} ${g.start}` : `${g.book} ${g.start}–${g.end}`).join(", ");
}

function getSec(day, testament) {
  const sections = testament === "OT" ? OT_SECTIONS : NT_SECTIONS;
  return sections.find(s => day >= s.range[0] && day <= s.range[1]);
}

function getTheme(day, testament) {
  const themes = testament === "OT" ? OT_THEMES : NT_THEMES;
  return themes[Math.ceil(day / 7)] || "Walking with God";
}

function getPlan(testament) {
  return testament === "OT" ? OT_PLAN : NT_PLAN;
}

// ── AI call ──────────────────────────────────────────────────────────────────
async function callAI(messages, system) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages }),
  });
  const d = await r.json();
  return d.content?.map(c => c.text || "").join("") || "";
}

// ── Google Sheets helpers ─────────────────────────────────────────────────────
async function saveProgress(name, code, testament, daysCompleted, quizScores) {
  if (!SHEETS_URL) return;
  try {
    await fetch(SHEETS_URL, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "saveProgress", name, code, testament,
        daysCompleted, quizScores: JSON.stringify(quizScores),
        lastActive: new Date().toISOString(), timestamp: Date.now(),
      }),
    });
  } catch (e) { console.warn("Sheets sync failed:", e); }
}

// ── Persistent storage helpers ────────────────────────────────────────────────
async function lsGet(key) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } catch { return null; }
}
async function lsSet(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
}
async function lsList(prefix) {
  try { const r = await window.storage.list(prefix); return r ? r.keys : []; } catch { return []; }
}

// ════════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ════════════════════════════════════════════════════════════════════════════

function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("disciple");

  const handleLogin = () => {
    const trimName = name.trim();
    const trimCode = code.trim().toUpperCase();
    if (!trimName) { setError("Please enter your name."); return; }
    if (!trimCode) { setError("Please enter your access code."); return; }
    if (mode === "discipler") {
      if (trimCode !== DISCIPLER_CODE) { setError("Invalid discipler code."); return; }
      onLogin({ name: trimName, code: trimCode, role: "discipler" });
    } else {
      onLogin({ name: trimName, code: trimCode, role: "disciple" });
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #1a0533 0%, #0d1b2a 50%, #0a1628 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif", padding: "1rem",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 48, marginBottom: "0.5rem" }}>✝</div>
          <h1 style={{ color: "#f0e6d3", fontSize: 24, fontWeight: 400, margin: "0 0 6px", letterSpacing: 1 }}>
            Bible Reading Journey
          </h1>
          <p style={{ color: "#a89880", fontSize: 14, margin: 0 }}>90-Day Discipleship Programme</p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "2rem",
        }}>
          <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 3, marginBottom: "1.5rem" }}>
            {["disciple","discipler"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                style={{ flex: 1, padding: "8px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
                  background: mode === m ? "rgba(124,108,175,0.8)" : "transparent",
                  color: mode === m ? "#fff" : "#a89880" }}>
                {m === "disciple" ? "I'm a Disciple" : "I'm the Discipler"}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", color: "#c8b89a", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Your Name</label>
            <input value={name} onChange={e => { setName(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Enter your full name"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#f0e6d3", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", color: "#c8b89a", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>
              {mode === "disciple" ? "Access Code" : "Discipler Code"}
            </label>
            <input value={code} onChange={e => { setCode(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder={mode === "disciple" ? "Code given by your discipler" : "Enter discipler password"}
              type="password"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.07)", color: "#f0e6d3", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
          </div>

          {error && <p style={{ color: "#ff8080", fontSize: 13, margin: "-0.5rem 0 1rem", textAlign: "center" }}>{error}</p>}

          <button onClick={handleLogin}
            style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #7C6CAF, #3D9970)", color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5 }}>
            Begin Journey →
          </button>

          {mode === "disciple" && (
            <p style={{ color: "#6a5f50", fontSize: 12, textAlign: "center", margin: "1rem 0 0", lineHeight: 1.5 }}>
              Don't have a code? Ask your discipler for your personal access code.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DISCIPLER DASHBOARD
// ════════════════════════════════════════════════════════════════════════════

function DisciplerDashboard({ user, onLogout }) {
  const [disciples, setDisciples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [selected, setSelected] = useState(null);
  const [testamentFilter, setTestamentFilter] = useState("All");

  useEffect(() => {
    (async () => {
      const keys = await lsList("disciple_");
      const data = (await Promise.all(keys.map(k => lsGet(k)))).filter(Boolean);
      setDisciples(data);
      setLoading(false);
    })();
  }, []);

  const filtered = testamentFilter === "All" ? disciples
    : disciples.filter(d => (d.testament || "NT") === testamentFilter);

  const avgDays = filtered.length
    ? Math.round(filtered.reduce((s, d) => s + (d.daysCompleted || 0), 0) / filtered.length) : 0;

  const avgScore = (() => {
    const withScores = filtered.filter(d => Object.keys(d.quizScores || {}).length > 0);
    if (!withScores.length) return 0;
    return Math.round(withScores.reduce((s, d) => {
      const scores = Object.values(d.quizScores || {});
      return s + scores.reduce((a, b) => a + b, 0) / scores.length;
    }, 0) / withScores.length);
  })();

  return (
    <div style={{ fontFamily: "'Georgia', serif", maxWidth: 860, margin: "0 auto", minHeight: "100vh", background: "#f8f5f0" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a0533, #2E1A5E)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: "#a89880", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 4px" }}>Discipler Dashboard</p>
          <h1 style={{ color: "#f0e6d3", fontSize: 20, fontWeight: 400, margin: 0 }}>Welcome, {user.name}</h1>
        </div>
        <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#c8b89a", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Sign out</button>
      </div>

      {/* Testament Filter */}
      <div style={{ background: "#fff", padding: "0.75rem 1.5rem", display: "flex", gap: 8, borderBottom: "1px solid #e0d8cc" }}>
        <span style={{ fontSize: 12, color: "#8a7a6a", alignSelf: "center", marginRight: 4 }}>Filter:</span>
        {["All","NT","OT"].map(f => (
          <button key={f} onClick={() => setTestamentFilter(f)}
            style={{ padding: "4px 14px", borderRadius: 99, border: "1px solid", cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: testamentFilter===f?600:400,
              borderColor: testamentFilter===f?"#7C6CAF":"#e0d8cc",
              background: testamentFilter===f?"#EDE9FF":"transparent",
              color: testamentFilter===f?"#4B3B8C":"#8a7a6a" }}>
            {f === "All" ? "All Disciples" : f === "NT" ? "NT Journey" : "OT Journey"}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0, borderBottom: "1px solid #e0d8cc" }}>
        {[["Total Disciples", filtered.length, "👥"], ["Avg Days Done", avgDays + "/90", "📅"], ["Avg Quiz Score", avgScore + "%", "📝"]].map(([label, val, icon]) => (
          <div key={label} style={{ padding: "1.25rem", textAlign: "center", background: "#fff", borderRight: "1px solid #e0d8cc" }}>
            <p style={{ fontSize: 24, margin: "0 0 4px" }}>{icon}</p>
            <p style={{ fontSize: 22, fontWeight: 600, color: "#2E1A5E", margin: "0 0 2px" }}>{val}</p>
            <p style={{ fontSize: 12, color: "#8a7a6a", margin: 0, letterSpacing: 0.5 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "1px solid #e0d8cc", padding: "0 1.5rem" }}>
        {["overview","details"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "0.875rem 1rem", background: "none", border: "none", borderBottom: tab===t?"2px solid #7C6CAF":"2px solid transparent", color: tab===t?"#7C6CAF":"#8a7a6a", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: tab===t?600:400, textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "1.5rem" }}>
        {loading ? (
          <p style={{ textAlign: "center", color: "#8a7a6a", padding: "3rem" }}>Loading disciple data…</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: 12, border: "1px solid #e0d8cc" }}>
            <p style={{ fontSize: 32, margin: "0 0 1rem" }}>🌱</p>
            <h3 style={{ color: "#2E1A5E", margin: "0 0 8px" }}>No disciples yet</h3>
            <p style={{ color: "#8a7a6a", fontSize: 14, margin: "0 0 1.5rem" }}>Share the app link with your disciples. Their progress will appear here once they start.</p>
            <div style={{ background: "#f0ebf8", borderRadius: 8, padding: "1rem", display: "inline-block", textAlign: "left" }}>
              <p style={{ fontSize: 12, color: "#7C6CAF", margin: "0 0 4px", fontWeight: 600 }}>HOW IT WORKS</p>
              <p style={{ fontSize: 13, color: "#4B3B8C", margin: 0, lineHeight: 1.6 }}>
                1. Share the app with each disciple<br/>
                2. Give each a unique access code (e.g. JOHN01, MARY02)<br/>
                3. Tell them which testament to start — NT or OT<br/>
                4. Their progress saves automatically as they read
              </p>
            </div>
          </div>
        ) : tab === "overview" ? (
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.sort((a,b) => (b.daysCompleted||0) - (a.daysCompleted||0)).map(d => {
              const pct = Math.round(((d.daysCompleted||0)/90)*100);
              const scores = Object.values(d.quizScores || {});
              const avgQ = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : null;
              const testament = d.testament || "NT";
              const testamentColor = testament === "OT" ? "#C0392B" : "#7C6CAF";
              return (
                <div key={d.code} onClick={() => { setSelected(d); setTab("details"); }}
                  style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 10, padding: "1rem 1.25rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${testamentColor},#3D9970)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: 16, flexShrink: 0 }}>
                    {d.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 14, color: "#1a0533" }}>{d.name}</span>
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: testament==="OT"?"#FDECEA":"#EDE9FF", color: testament==="OT"?"#7B241C":"#4B3B8C", fontWeight: 600 }}>{testament} Journey</span>
                      </div>
                      <span style={{ fontSize: 12, color: "#8a7a6a" }}>Code: {d.code}</span>
                    </div>
                    <div style={{ height: 6, background: "#e8e0f0", borderRadius: 99, marginBottom: 4 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${testamentColor},#3D9970)`, borderRadius: 99 }} />
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                      <span style={{ fontSize: 12, color: "#4B3B8C" }}>📅 Day {d.daysCompleted||0}/90 ({pct}%)</span>
                      {avgQ !== null && <span style={{ fontSize: 12, color: "#3D9970" }}>📝 Avg quiz: {avgQ}%</span>}
                    </div>
                  </div>
                  <span style={{ color: "#c0b0d0" }}>›</span>
                </div>
              );
            })}
          </div>
        ) : selected ? (
          <div>
            <button onClick={() => setTab("overview")} style={{ background: "none", border: "none", cursor: "pointer", color: "#7C6CAF", fontSize: 13, padding: 0, marginBottom: "1rem", fontFamily: "inherit" }}>← All disciples</button>
            <div style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 12, padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.5rem" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#7C6CAF,#3D9970)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: 22 }}>
                  {selected.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ margin: 0, color: "#1a0533", fontSize: 20 }}>{selected.name}</h2>
                  <p style={{ margin: 0, color: "#8a7a6a", fontSize: 13 }}>
                    Code: {selected.code} · {selected.testament || "NT"} Journey · Joined: {selected.joinDate ? new Date(selected.joinDate).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.5rem" }}>
                {[
                  ["Days Completed", `${selected.daysCompleted||0} / 90`],
                  ["Progress", `${Math.round(((selected.daysCompleted||0)/90)*100)}%`],
                  ["Quizzes Taken", Object.keys(selected.quizScores||{}).length],
                  ["Avg Quiz Score", (() => { const s = Object.values(selected.quizScores||{}); return s.length ? Math.round(s.reduce((a,b)=>a+b,0)/s.length)+"%" : "—" })()],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: "#f8f5f0", borderRadius: 8, padding: "1rem" }}>
                    <p style={{ fontSize: 11, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>{label}</p>
                    <p style={{ fontSize: 22, fontWeight: 600, color: "#2E1A5E", margin: 0 }}>{val}</p>
                  </div>
                ))}
              </div>
              {Object.keys(selected.quizScores||{}).length > 0 && (
                <div>
                  <h3 style={{ fontSize: 13, color: "#8a7a6a", letterSpacing: 1, textTransform: "uppercase", margin: "0 0 10px" }}>Quiz History</h3>
                  <div style={{ display: "grid", gap: 6 }}>
                    {Object.entries(selected.quizScores).map(([day, score]) => {
                      const plan = getPlan(selected.testament || "NT");
                      return (
                        <div key={day} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#f8f5f0", borderRadius: 6 }}>
                          <span style={{ fontSize: 13, color: "#1a0533" }}>Day {day} — {formatReading(plan[+day-1])}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: score >= 80 ? "#3D9970" : score >= 60 ? "#D07A2A" : "#E24B4A" }}>{score}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// TESTAMENT SELECTOR (shown to disciples who haven't chosen yet, or can switch)
// ════════════════════════════════════════════════════════════════════════════

function TestamentSelector({ onSelect, currentTestament }) {
  return (
    <div style={{ padding: "1.5rem" }}>
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e0d8cc", padding: "1.5rem", marginBottom: "1rem" }}>
        <p style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#8a7a6a", margin: "0 0 8px" }}>Discipler's Instructions</p>
        <p style={{ fontSize: 14, color: "#1a0533", lineHeight: 1.7, margin: 0 }}>
          Your discipler will tell you which testament to begin with. Follow their instructions to alternate between the Old and New Testaments as directed.
        </p>
      </div>

      <p style={{ fontSize: 13, color: "#8a7a6a", marginBottom: "1rem", fontWeight: 500 }}>Choose your current journey:</p>

      <div style={{ display: "grid", gap: 12 }}>
        {[
          { key: "NT", icon: "✝", title: "New Testament Journey", subtitle: "Matthew → Revelation · 90 days · 3 chapters daily", color: "#7C6CAF", bg: "#EDE9FF", text: "#4B3B8C" },
          { key: "OT", icon: "📜", title: "Old Testament Journey", subtitle: "Genesis → Malachi · 90 days · 3 chapters daily", color: "#C0392B", bg: "#FDECEA", text: "#7B241C" },
        ].map(t => (
          <div key={t.key} onClick={() => onSelect(t.key)}
            style={{ background: currentTestament === t.key ? t.bg : "#fff", border: `2px solid ${currentTestament === t.key ? t.color : "#e0d8cc"}`, borderRadius: 12, padding: "1.25rem 1.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0, border: `1px solid ${t.color}33` }}>
              {t.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 15, margin: "0 0 3px", color: "#1a0533" }}>{t.title}</p>
              <p style={{ fontSize: 12, color: "#8a7a6a", margin: 0 }}>{t.subtitle}</p>
            </div>
            {currentTestament === t.key && <span style={{ color: t.color, fontWeight: 700, fontSize: 18 }}>✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN DISCIPLE APP
// ════════════════════════════════════════════════════════════════════════════

function DiscipleApp({ user, onLogout }) {
  const storageKey = `disciple_${user.code}`;
  const [view, setView] = useState("dashboard");
  const [testament, setTestament] = useState(null); // "NT" | "OT"
  const [completed, setCompleted] = useState({});   // per testament: { NT: {}, OT: {} }
  const [quizScores, setQuizScores] = useState({});
  const [notes, setNotes] = useState({});
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeDay, setActiveDay] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await lsGet(storageKey);
      if (saved) {
        setTestament(saved.testament || null);
        setCompleted(saved.completed || { NT: {}, OT: {} });
        setNotes(saved.notes || { NT: {}, OT: {} });
        setQuizScores(saved.quizScores || { NT: {}, OT: {} });
      } else {
        setCompleted({ NT: {}, OT: {} });
        setNotes({ NT: {}, OT: {} });
        setQuizScores({ NT: {}, OT: {} });
      }
      setLoaded(true);
    })();
  }, []);

  const persist = async (t, newCompleted, newNotes, newScores) => {
    const tc = { ...completed, [t]: newCompleted };
    const tn = { ...notes, [t]: newNotes };
    const tq = { ...quizScores, [t]: newScores };
    setCompleted(tc); setNotes(tn); setQuizScores(tq);
    const daysCompleted = Object.values(newCompleted).filter(Boolean).length;
    const existing = await lsGet(storageKey);
    const payload = {
      name: user.name, code: user.code, role: "disciple", testament: t,
      completed: tc, notes: tn, quizScores: tq,
      daysCompleted, lastActive: new Date().toISOString(),
      joinDate: existing?.joinDate || new Date().toISOString(),
    };
    await lsSet(storageKey, payload);
    await saveProgress(user.name, user.code, t, daysCompleted, newScores);
  };

  const handleSelectTestament = async (t) => {
    setTestament(t);
    const existing = await lsGet(storageKey);
    const payload = {
      ...(existing || {}), name: user.name, code: user.code, role: "disciple",
      testament: t, lastActive: new Date().toISOString(),
      joinDate: existing?.joinDate || new Date().toISOString(),
      completed: completed, notes: notes, quizScores: quizScores,
    };
    await lsSet(storageKey, payload);
    setView("dashboard");
  };

  const currentCompleted = testament ? (completed[testament] || {}) : {};
  const currentNotes = testament ? (notes[testament] || {}) : {};
  const currentQuizScores = testament ? (quizScores[testament] || {}) : {};
  const plan = testament ? getPlan(testament) : NT_PLAN;

  const toggleDone = async (d) => {
    if (!testament) return;
    const cur = completed[testament] || {};
    const next = { ...cur, [d]: !cur[d] };
    await persist(testament, next, notes[testament] || {}, quizScores[testament] || {});
  };

  const saveNote = async (d, txt) => {
    if (!testament) return;
    const cur = notes[testament] || {};
    const next = { ...cur, [d]: txt };
    await persist(testament, completed[testament] || {}, next, quizScores[testament] || {});
  };

  const saveQuizScore = async (d, score, total) => {
    if (!testament) return;
    const pct = Math.round((score / total) * 100);
    const cur = quizScores[testament] || {};
    const next = { ...cur, [d]: pct };
    await persist(testament, completed[testament] || {}, notes[testament] || {}, next);
  };

  const doneCount = Object.values(currentCompleted).filter(Boolean).length;
  const pct = Math.round((doneCount / 90) * 100);
  const nextDay = plan.findIndex((_, i) => !currentCompleted[i + 1]) + 1;
  const testamentColor = testament === "OT" ? "#C0392B" : "#7C6CAF";
  const testamentGradient = testament === "OT"
    ? "linear-gradient(135deg, #3d0a00 0%, #1a0533 100%)"
    : "linear-gradient(135deg, #1a0533 0%, #2E1A5E 100%)";

  if (!loaded) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f5f0" }}>
      <Loader text="Loading your journey…" color="#7C6CAF" />
    </div>
  );

  if (view === "day" && activeDay && testament) return (
    <DayView day={activeDay} testament={testament} completed={currentCompleted} notes={currentNotes}
      quizScores={currentQuizScores} onToggleDone={toggleDone} onSaveNote={saveNote}
      onSaveQuizScore={saveQuizScore} onBack={() => setView("plan")} user={user} onLogout={onLogout} />
  );

  return (
    <div style={{ fontFamily: "'Georgia', serif", maxWidth: 760, margin: "0 auto", minHeight: "100vh", background: "#f8f5f0" }}>
      {/* Hero */}
      <div style={{ background: testamentGradient, padding: "2rem 1.5rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div>
            <p style={{ fontSize: 11, letterSpacing: 3, color: "#a89880", textTransform: "uppercase", margin: "0 0 6px" }}>90-Day Discipleship Journey</p>
            <h1 style={{ fontSize: 22, fontWeight: 400, margin: "0 0 4px", color: "#f0e6d3" }}>
              {testament === "OT" ? "Through the Old Testament" : testament === "NT" ? "Through the New Testament" : "Bible Reading Journey"}
            </h1>
            <p style={{ color: "#7a6a5a", fontSize: 13, margin: 0 }}>
              Welcome, {user.name} · 3 chapters daily
              {testament && <span style={{ marginLeft: 8, padding: "1px 8px", borderRadius: 99, background: "rgba(255,255,255,0.15)", fontSize: 11 }}>{testament} Journey</span>}
            </p>
          </div>
          <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "#a89880", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Sign out</button>
        </div>

        {testament && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg,${testamentColor},#3D9970)`, borderRadius: 99, transition: "width 0.5s" }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#f0e6d3", minWidth: 36 }}>{pct}%</span>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              {[["Days done", doneCount], ["Days left", 90-doneCount], ["Chapters read", doneCount*3]].map(([l,v]) => (
                <div key={l}>
                  <p style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#f0e6d3" }}>{v}</p>
                  <p style={{ fontSize: 11, color: "#7a6a5a", margin: 0 }}>{l}</p>
                </div>
              ))}
            </div>
            {MILESTONES[doneCount] && (
              <div style={{ marginTop: "1rem", background: "rgba(61,153,112,0.2)", border: "1px solid rgba(61,153,112,0.4)", borderRadius: 8, padding: "8px 14px", display: "inline-block" }}>
                <span style={{ fontSize: 13, color: "#6de8ae", fontWeight: 500 }}>🎉 {MILESTONES[doneCount]}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Nav */}
      <div style={{ display: "flex", borderBottom: "1px solid #e0d8cc", background: "#fff" }}>
        {[["dashboard","Overview"], ["plan","Reading Plan"], ["testament","Switch Journey"]].map(([v,l]) => (
          <button key={v} onClick={() => { setView(v); setFilter("All"); setSearch(""); }}
            style={{ flex: 1, padding: "0.75rem 0.5rem", background: "none", border: "none", borderBottom: view===v?`2px solid ${testamentColor}`:"2px solid transparent", color: view===v?testamentColor:"#8a7a6a", fontWeight: view===v?600:400, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>{l}</button>
        ))}
      </div>

      {view === "testament" && (
        <TestamentSelector onSelect={handleSelectTestament} currentTestament={testament} />
      )}

      {view === "dashboard" && testament && (
        <Dashboard completed={currentCompleted} doneCount={doneCount} nextDay={nextDay}
          onGoToDay={(d) => { setActiveDay(d); setView("day"); }} quizScores={currentQuizScores}
          testament={testament} testamentColor={testamentColor} />
      )}

      {view === "dashboard" && !testament && (
        <div style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: 32, margin: "0 0 1rem" }}>✝</p>
          <h3 style={{ color: "#1a0533", margin: "0 0 8px" }}>Choose your Journey</h3>
          <p style={{ color: "#8a7a6a", fontSize: 14, margin: "0 0 1.5rem" }}>Your discipler will tell you which testament to start with.</p>
          <button onClick={() => setView("testament")}
            style={{ padding: "10px 24px", borderRadius: 8, background: "linear-gradient(135deg,#7C6CAF,#3D9970)", color: "#fff", border: "none", fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
            Select Testament →
          </button>
        </div>
      )}

      {view === "plan" && testament && (
        <PlanView plan={plan} completed={currentCompleted} notes={currentNotes} filter={filter}
          search={search} setFilter={setFilter} setSearch={setSearch} testament={testament}
          testamentColor={testamentColor}
          onOpenDay={(d) => { setActiveDay(d); setView("day"); }}
          onToggleDone={toggleDone} />
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard({ completed, doneCount, nextDay, onGoToDay, quizScores, testament, testamentColor }) {
  const sections = testament === "OT" ? OT_SECTIONS : NT_SECTIONS;
  const plan = getPlan(testament);

  const sectionProgress = sections.map(s => {
    const total = s.range[1] - s.range[0] + 1;
    const done = Array.from({ length: total }, (_, i) => i + s.range[0]).filter(d => completed[d]).length;
    return { ...s, total, done, pct: Math.round((done / total) * 100) };
  });

  return (
    <div style={{ padding: "1.5rem" }}>
      {nextDay <= 90 && (
        <div onClick={() => onGoToDay(nextDay)} style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${testamentColor},#3D9970)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontSize: 18 }}>▶</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, margin: 0, fontSize: 15, color: "#1a0533" }}>Continue — Day {nextDay}</p>
            <p style={{ fontSize: 13, color: "#8a7a6a", margin: "2px 0 0" }}>{formatReading(plan[nextDay - 1])}</p>
          </div>
          <span style={{ color: "#c0b0d0" }}>›</span>
        </div>
      )}

      <h3 style={{ fontSize: 12, fontWeight: 600, margin: "0 0 1rem", color: "#8a7a6a", letterSpacing: 1.5, textTransform: "uppercase" }}>Progress by section</h3>
      <div style={{ display: "grid", gap: 10, marginBottom: "1.5rem" }}>
        {sectionProgress.map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 10, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1a0533" }}>{s.label}</span>
                <span style={{ fontSize: 13, color: "#8a7a6a" }}>{s.done}/{s.total} days</span>
              </div>
              <div style={{ height: 6, background: "#e8e0f0", borderRadius: 99 }}>
                <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: 99, transition: "width 0.4s" }} />
              </div>
              <p style={{ fontSize: 12, color: "#8a7a6a", margin: "4px 0 0" }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e0d8cc", padding: "1.25rem" }}>
        <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "#8a7a6a", margin: "0 0 6px" }}>Weekly theme</p>
        <p style={{ fontSize: 16, fontWeight: 600, color: "#1a0533", margin: "0 0 4px" }}>{getTheme(Math.max(doneCount, 1), testament)}</p>
        <p style={{ fontSize: 13, color: "#8a7a6a", margin: 0 }}>Week {Math.ceil(Math.max(doneCount, 1) / 7)} of 13</p>
      </div>
    </div>
  );
}

// ── Plan View ─────────────────────────────────────────────────────────────────

function PlanView({ plan, completed, notes, filter, search, setFilter, setSearch, onOpenDay, onToggleDone, testament, testamentColor }) {
  const sections = testament === "OT" ? OT_SECTIONS : NT_SECTIONS;

  const filtered = useMemo(() => plan.map((chs, i) => ({ chs, day: i + 1 })).filter(({ chs, day }) => {
    const sec = getSec(day, testament);
    const lbl = formatReading(chs);
    return (filter === "All" || sec?.label === filter) &&
      (search === "" || lbl.toLowerCase().includes(search.toLowerCase()) || String(day).includes(search));
  }), [plan, filter, search, testament]);

  return (
    <div style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "1rem" }}>
        {["All", ...sections.map(s => s.label)].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "5px 12px", borderRadius: 99, border: "1px solid", borderColor: filter===f?testamentColor:"#e0d8cc", background: filter===f?"rgba(124,108,175,0.1)":"transparent", color: filter===f?testamentColor:"#8a7a6a", cursor: "pointer", fontSize: 12, fontWeight: filter===f?600:400, fontFamily: "inherit" }}>{f}</button>
        ))}
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by book or day…"
        style={{ width: "100%", padding: "9px 14px", borderRadius: 8, border: "1px solid #e0d8cc", background: "#fff", fontSize: 13, marginBottom: "1rem", boxSizing: "border-box", fontFamily: "inherit", outline: "none" }} />

      <div style={{ display: "grid", gap: 8 }}>
        {filtered.map(({ chs, day }) => {
          const sec = getSec(day, testament);
          const done = !!completed[day];
          const hasNote = !!notes[day];
          return (
            <div key={day} style={{ background: "#fff", border: `1px solid ${done?"#3D9970":"#e0d8cc"}`, borderRadius: 10, overflow: "hidden", display: "flex" }}>
              <div style={{ width: 4, background: sec?.color || "#ccc", flexShrink: 0 }} />
              <div style={{ flex: 1, padding: "0.875rem 1rem", display: "flex", alignItems: "center", gap: 12 }}>
                <div onClick={() => onToggleDone(day)} style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${done?"#3D9970":"#c0b0d0"}`, background: done?"#3D9970":"transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  {done && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
                </div>
                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => onOpenDay(day)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: sec?.text }}>Day {day}</span>
                    <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 99, background: sec?.bg, color: sec?.text, fontWeight: 500 }}>{sec?.label}</span>
                    {hasNote && <span style={{ fontSize: 10, color: "#8a7a6a" }}>📝</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: done?"#a89880":"#1a0533", textDecoration: done?"line-through":"none" }}>{formatReading(chs)}</p>
                </div>
                <span onClick={() => onOpenDay(day)} style={{ color: "#c0b0d0", cursor: "pointer" }}>›</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p style={{ textAlign: "center", color: "#8a7a6a", padding: "2rem", fontSize: 14 }}>No results found.</p>}
      </div>
    </div>
  );
}

// ── Day View ──────────────────────────────────────────────────────────────────

function DayView({ day, testament, completed, notes, quizScores, onToggleDone, onSaveNote, onSaveQuizScore, onBack, user, onLogout }) {
  const plan = getPlan(testament);
  const chs = plan[day - 1];
  const sec = getSec(day, testament);
  const done = !!completed[day];

  const [tab, setTab] = useState("read");
  const [note, setNote] = useState(notes[day] || "");
  const [saved, setSaved] = useState(false);
  const [aiContent, setAiContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [reflectQ, setReflectQ] = useState("");
  const [reflectA, setReflectA] = useState("");
  const [loadingReflect, setLoadingReflect] = useState(false);

  const label = formatReading(chs);
  const score = Object.entries(answers).filter(([i,a]) => quizData?.[+i]?.answer === a).length;

  const testamentLabel = testament === "OT" ? "Old Testament" : "New Testament";

  const loadCommentary = async () => {
    if (aiContent) return;
    setLoading(true);
    const sys = "You are a Bible commentary assistant trained in evangelical theology. Write in a warm, pastoral tone suitable for discipleship. Be insightful and practical.";
    const res = await callAI([{ role: "user", content: `Write a concise discipleship commentary (3–4 paragraphs) for ${label} from the ${testamentLabel} (NIV). Include: (1) context & background, (2) key theological themes, (3) a practical application for a modern disciple. End with one memory verse from this passage.` }], sys);
    setAiContent(res);
    setLoading(false);
  };

  const loadQuiz = async () => {
    if (quizData) return;
    setLoading(true);
    const sys = "You are a Bible quiz generator. Return ONLY valid JSON — no markdown, no backticks, no preamble.";
    const res = await callAI([{ role: "user", content: `Generate 10 multiple-choice quiz questions for ${label} from the ${testamentLabel} (NIV). Return a JSON array: [{"q":"...","opts":["A","B","C","D"],"answer":0},...] where answer is the 0-based index of the correct option.` }], sys);
    try {
      const clean = res.replace(/```json|```/g,"").trim();
      setQuizData(JSON.parse(clean));
    } catch {
      setQuizData([{ q: "What is the main theme of today's reading?", opts: ["Sin", "Grace", "Law", "Judgment"], answer: 1 }]);
    }
    setLoading(false);
  };

  const loadReflect = async () => {
    if (reflectQ) return;
    setLoading(true);
    const q = await callAI([{ role: "user", content: `Give one short, personal reflection question (1 sentence) for a disciple who just read ${label} from the ${testamentLabel}. Make it personal and specific to the passage.` }], "You are a pastoral mentor. Be warm and specific.");
    setReflectQ(q.replace(/^["']+|["']+$/g,""));
    setLoading(false);
  };

  const submitReflect = async () => {
    if (!reflectA.trim()) return;
    setLoadingReflect(true);
    const fb = await callAI([{ role: "user", content: `A disciple read ${label} and was asked: "${reflectQ}". They answered: "${reflectA}". Give 2–3 sentences of warm, specific, pastoral encouragement.` }], "You are a pastoral mentor. Be warm, specific, and encouraging.");
    setReflectA(prev => prev + "\n\n🌿 " + fb);
    setLoadingReflect(false);
  };

  const handleSubmitQuiz = async () => {
    setSubmitted(true);
    await onSaveQuizScore(day, score, quizData.length);
  };

  useEffect(() => {
    if (tab === "commentary") loadCommentary();
    if (tab === "quiz") loadQuiz();
    if (tab === "reflect") loadReflect();
  }, [tab]);

  const alreadyScored = quizScores[day] !== undefined;

  return (
    <div style={{ fontFamily: "'Georgia', serif", maxWidth: 760, margin: "0 auto", minHeight: "100vh", background: "#f8f5f0" }}>
      {/* Header */}
      <div style={{ background: sec?.bg || "#f0ebff", borderBottom: "1px solid #e0d8cc", padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: sec?.text || "#4B3B8C", padding: 0, fontSize: 13, fontFamily: "inherit" }}>← Reading Plan</button>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: sec?.color + "22", color: sec?.text, fontWeight: 600, border: `1px solid ${sec?.color}44` }}>{testament} Journey</span>
            <button onClick={onLogout} style={{ background: "rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.1)", color: sec?.text || "#4B3B8C", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>Sign out</button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: sec?.color, color: "#fff" }}>Day {day}</span>
              <span style={{ fontSize: 11, color: sec?.text }}>{sec?.label}</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 400, margin: 0, color: "#1a0533" }}>{label}</h2>
          </div>
          <button onClick={() => onToggleDone(day)} style={{ padding: "6px 14px", borderRadius: 8, border: `2px solid ${done?"#3D9970":"#c0b0d0"}`, background: done?"#E2F7EE":"transparent", color: done?"#1D6645":"#8a7a6a", cursor: "pointer", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", fontFamily: "inherit" }}>{done?"✓ Done":"Mark done"}</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #e0d8cc", background: "#fff", overflowX: "auto" }}>
        {[["read","📖 Read"],["commentary","✍️ Commentary"],["quiz","📝 Quiz (10)"],["reflect","🙏 Reflect"],["notes","📒 Notes"]].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding: "0.75rem 1rem", background: "none", border: "none", borderBottom: tab===v?`2px solid ${sec?.color||"#7C6CAF"}`:"2px solid transparent", color: tab===v?(sec?.color||"#7C6CAF"):"#8a7a6a", fontWeight: tab===v?600:400, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap", fontFamily: "inherit" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: "1.5rem" }}>

        {/* READ */}
        {tab === "read" && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
              {chs.map((c, i) => (
                <a key={i} href={`https://www.biblegateway.com/passage/?search=${c.book.replace(/ /g,"+")}+${c.chapter}&version=NIV`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "1rem 1.25rem", background: "#fff", border: "1px solid #e0d8cc", borderRadius: 10, textDecoration: "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: sec?.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📖</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: "#1a0533" }}>{c.book} {c.chapter}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#8a7a6a" }}>Read on BibleGateway · NIV</p>
                  </div>
                  <span style={{ color: sec?.color || "#7C6CAF", fontSize: 16 }}>↗</span>
                </a>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: 10, padding: "1rem 1.25rem", border: "1px solid #e0d8cc" }}>
              <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "#8a7a6a", margin: "0 0 6px" }}>Daily theme</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1a0533", margin: 0 }}>{getTheme(day, testament)}</p>
            </div>
          </div>
        )}

        {/* COMMENTARY */}
        {tab === "commentary" && (
          <div>
            {loading && <Loader text="Generating commentary…" color={sec?.color} />}
            {!loading && aiContent && (
              <div>
                <div style={{ background: "#fff", borderRadius: 10, padding: "1.25rem", lineHeight: 1.8, fontSize: 15, whiteSpace: "pre-wrap", marginBottom: "1rem", border: "1px solid #e0d8cc", color: "#1a0533" }}>{aiContent}</div>
                <a href={`https://www.blueletterbible.org/commentaries/mhc/${chs[0].book.toLowerCase().replace(/ /g,"-").replace(/^(\d)/,"$1")}/${chs[0].chapter}/`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 8, border: "1px solid #e0d8cc", textDecoration: "none", fontSize: 13, color: "#4B3B8C", background: "#fff" }}>
                  Matthew Henry Full Commentary ↗
                </a>
              </div>
            )}
          </div>
        )}

        {/* QUIZ — 10 Questions */}
        {tab === "quiz" && (
          <div>
            {loading && <Loader text="Generating 10 quiz questions for today's chapters…" color={sec?.color} />}
            {!loading && quizData && (
              <div>
                {alreadyScored && !submitted && (
                  <div style={{ background: "#E2F7EE", borderRadius: 8, padding: "10px 14px", marginBottom: "1rem", fontSize: 13, color: "#1D6645" }}>
                    ✓ You previously scored <strong>{quizScores[day]}%</strong> on this quiz. You can retake it below.
                  </div>
                )}
                <p style={{ fontSize: 13, color: "#8a7a6a", marginBottom: "1.25rem" }}>{quizData.length} questions · {label}</p>
                {quizData.map((q, i) => (
                  <div key={i} style={{ background: "#fff", border: "1px solid #e0d8cc", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: 10 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, margin: "0 0 10px", color: "#1a0533" }}>{i+1}. {q.q}</p>
                    <div style={{ display: "grid", gap: 6 }}>
                      {q.opts.map((opt, j) => {
                        const chosen = answers[i] === j;
                        const correct = submitted && j === q.answer;
                        const wrong = submitted && chosen && j !== q.answer;
                        return (
                          <div key={j} onClick={() => !submitted && setAnswers(p => ({ ...p, [i]: j }))}
                            style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${correct?"#3D9970":wrong?"#E24B4A":chosen?(sec?.color||"#7C6CAF"):"#e0d8cc"}`, background: correct?"#E2F7EE":wrong?"#FCEBEB":chosen?(sec?.bg||"#EDE9FF"):"#f8f5f0", cursor: submitted?"default":"pointer", fontSize: 14 }}>
                            <span style={{ color: correct?"#1D6645":wrong?"#A32D2D":chosen?(sec?.text||"#4B3B8C"):"#1a0533" }}>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {!submitted ? (
                  <button onClick={handleSubmitQuiz} disabled={Object.keys(answers).length < quizData.length}
                    style={{ width: "100%", padding: "0.75rem", background: Object.keys(answers).length >= quizData.length?(sec?.color||"#7C6CAF"):"#e0d8cc", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                    Submit Quiz ({Object.keys(answers).length}/{quizData.length})
                  </button>
                ) : (
                  <div style={{ background: sec?.bg||"#EDE9FF", borderRadius: 10, padding: "1.25rem", textAlign: "center", border: `1px solid ${sec?.color||"#7C6CAF"}` }}>
                    <p style={{ fontSize: 28, fontWeight: 600, color: sec?.text||"#4B3B8C", margin: "0 0 4px" }}>{score}/{quizData.length}</p>
                    <p style={{ fontSize: 15, color: sec?.text||"#4B3B8C", margin: "0 0 4px" }}>
                      {Math.round((score/quizData.length)*100)}% — {score===quizData.length?"Perfect score! Outstanding.":score>=Math.ceil(quizData.length*0.7)?"Great work! Keep studying.":"Review the chapters and try again."}
                    </p>
                    <p style={{ fontSize: 12, color: "#8a7a6a", margin: 0 }}>Score saved to your discipler's dashboard ✓</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* REFLECT */}
        {tab === "reflect" && (
          <div>
            {loading && <Loader text="Preparing your reflection prompt…" color={sec?.color} />}
            {!loading && reflectQ && (
              <div>
                <div style={{ background: sec?.bg||"#EDE9FF", borderLeft: `4px solid ${sec?.color||"#7C6CAF"}`, borderRadius: "0 10px 10px 0", padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: sec?.text, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>Reflection question</p>
                  <p style={{ fontSize: 15, color: "#1a0533", margin: 0, lineHeight: 1.6 }}>{reflectQ}</p>
                </div>
                <textarea value={reflectA} onChange={e => setReflectA(e.target.value)} rows={5} placeholder="Write your reflection here…"
                  style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #e0d8cc", background: "#fff", color: "#1a0533", fontSize: 14, boxSizing: "border-box", resize: "vertical", lineHeight: 1.6, fontFamily: "inherit" }} />
                <button onClick={submitReflect} disabled={loadingReflect || !reflectA.trim()}
                  style={{ marginTop: 10, padding: "8px 18px", borderRadius: 8, background: sec?.color||"#7C6CAF", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
                  {loadingReflect ? "Getting feedback…" : "Get pastoral feedback"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* NOTES */}
        {tab === "notes" && (
          <div>
            <p style={{ fontSize: 13, color: "#8a7a6a", marginBottom: "0.75rem" }}>Personal notes for Day {day} — {label}</p>
            <textarea value={note} onChange={e => { setNote(e.target.value); setSaved(false); }} rows={8} placeholder="Write your notes, key verses, insights, or prayer points here…"
              style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #e0d8cc", background: "#fff", color: "#1a0533", fontSize: 14, boxSizing: "border-box", resize: "vertical", lineHeight: 1.7, fontFamily: "inherit" }} />
            <button onClick={async () => { await onSaveNote(day, note); setSaved(true); }}
              style={{ marginTop: 10, padding: "8px 18px", borderRadius: 8, background: saved?"#3D9970":(sec?.color||"#7C6CAF"), color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
              {saved ? "✓ Saved" : "Save notes"}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

function Loader({ text, color }) {
  return (
    <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
      <div style={{ width: 32, height: 32, border: `3px solid #e0d8cc`, borderTop: `3px solid ${color||"#7C6CAF"}`, borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ fontSize: 13, color: "#8a7a6a", margin: 0 }}>{text}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════════════════════════

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    lsGet("nt90_user").then(u => { setUser(u); setAuthLoading(false); });
  }, []);

  const handleLogin = async (u) => { await lsSet("nt90_user", u); setUser(u); };
  const handleLogout = async () => { await lsSet("nt90_user", null); setUser(null); };

  if (authLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1a0533 0%, #0d1b2a 50%, #0a1628 100%)" }}>
      <Loader text="Loading…" color="#7C6CAF" />
    </div>
  );

  if (!user) return <LoginScreen onLogin={handleLogin} />;
  if (user.role === "discipler") return <DisciplerDashboard user={user} onLogout={handleLogout} />;
  return <DiscipleApp user={user} onLogout={handleLogout} />;
}
