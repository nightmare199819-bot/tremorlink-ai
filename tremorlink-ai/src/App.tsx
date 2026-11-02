import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, AudioWaveform,
  Bell, Check, ChevronDown, CircleHelp, Clock3, Command, Cpu, Gauge,
  Globe2, HeartPulse, Layers3, Menu, Network, Radio, RefreshCw, Router,
  ShieldCheck, Signal, Siren, Sparkles, Users, Wifi, X, Zap
} from "lucide-react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";
import { baseWave, devicePositions, scenarios } from "./data";
import type { CommunityReport, Page, Scenario } from "./types";

const navItems: { id: Page; label: string; icon: typeof Activity; group: string }[] = [
  { id: "overview", label: "Command center", icon: Command, group: "OPERATIONS" },
  { id: "sensors", label: "Sensor intelligence", icon: AudioWaveform, group: "INTELLIGENCE" },
  { id: "ai", label: "AI detection engine", icon: Cpu, group: "INTELLIGENCE" },
  { id: "mesh", label: "Mesh network", icon: Network, group: "NETWORK" },
  { id: "verification", label: "Event verification", icon: ShieldCheck, group: "NETWORK" },
  { id: "community", label: "Community pulse", icon: Users, group: "COMMUNITY" }
];

const initialReports: CommunityReport[] = [
  { id: 1, area: "Sector 04 · North", message: "Brief vibration noticed near the market road.", time: "2 min ago", status: "Reviewed" },
  { id: 2, area: "Sector 02 · West", message: "No unusual activity reported in this block.", time: "8 min ago", status: "Reviewed" },
  { id: 3, area: "Sector 07 · East", message: "Residents checking nearby buildings.", time: "14 min ago", status: "New" }
];

const pageTitles: Record<Page, { title: string; subtitle: string }> = {
  overview: { title: "Command center", subtitle: "A live view of the local awareness network." },
  sensors: { title: "Sensor intelligence", subtitle: "Explore simulated motion signals and extracted features." },
  ai: { title: "AI detection engine", subtitle: "Inspect the local classifier's simulated interpretation." },
  mesh: { title: "Mesh network", subtitle: "See how packets move between nearby devices." },
  verification: { title: "Event verification", subtitle: "Compare independent observations before raising confidence." },
  community: { title: "Community pulse", subtitle: "Local reports add context to machine observations." }
};

function timeLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function App() {
  const [page, setPage] = useState<Page>("overview");
  const [scenario, setScenario] = useState<Scenario>("normal");
  const [running, setRunning] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reports, setReports] = useState(initialReports);
  const [showReport, setShowReport] = useState(false);
  const [reportArea, setReportArea] = useState("");
  const [reportMessage, setReportMessage] = useState("");
  const [tick, setTick] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setTick(v => v + 1), 1800);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const eventState = scenario === "corroborated" ? "CORROBORATED SIMULATION"
    : scenario === "isolated" ? "LOCAL OBSERVATION"
    : scenario === "interruption" ? "PARTIAL CONNECTIVITY"
    : scenario === "duplicate" ? "DUPLICATE REJECTED" : "NO ACTIVE EVENT";

  const originCount = scenario === "corroborated" ? 4 : scenario === "isolated" ? 1 : 0;
  const onlineCount = scenario === "interruption" ? 4 : 7;
  const confidence = scenario === "corroborated" ? 91 : scenario === "isolated" ? 63 : scenario === "duplicate" ? 12 : 4;

  const wave = useMemo(() => baseWave.map((p, i) => {
    const pulse = scenario === "corroborated" ? Math.exp(-Math.pow((i - (25 + (tick % 4))) / 4, 2)) * 0.82
      : scenario === "isolated" ? Math.exp(-Math.pow((i - 28) / 3, 2)) * 0.55 : 0;
    const interruption = scenario === "interruption" ? 0.025 : 0;
    return { time: `${i * 0.1}s`, amplitude: Number((p.x + pulse + interruption).toFixed(3)) };
  }), [scenario, tick]);

  const changeScenario = (value: Scenario) => {
    setScenario(value);
    setToast(`${scenarios.find(s => s.id === value)?.label} loaded`);
  };

  const addReport = () => {
    if (!reportArea.trim() || !reportMessage.trim()) return;
    setReports(prev => [{ id: Date.now(), area: reportArea.trim(), message: reportMessage.trim(), time: "Just now", status: "New" }, ...prev]);
    setReportArea("");
    setReportMessage("");
    setShowReport(false);
    setToast("Community report added");
  };

  const reset = () => {
    setScenario("normal");
    setTick(0);
    setToast("Simulation reset");
  };

  const activePage = pageTitles[page];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={19} strokeWidth={2.4} /></div>
          <div><div className="brand-name">tremor<span>link</span></div><div className="brand-caption">COMMUNITY INTELLIGENCE</div></div>
          <button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="workspace-chip"><div className="workspace-dot" /><span>FIELD SIMULATION</span><ChevronDown size={13}/></div>
        <nav className="nav-list">
          {(["OPERATIONS", "INTELLIGENCE", "NETWORK", "COMMUNITY"] as const).map(group => (
            <div className="nav-group" key={group}>
              <div className="nav-heading">{group}</div>
              {navItems.filter(item => item.group === group).map(item => {
                const Icon = item.icon;
                return <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => { setPage(item.id); setMobileOpen(false); }}>
                  <Icon size={17}/><span>{item.label}</span>{page === item.id && <span className="nav-active-dot"/>}
                </button>;
              })}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-status"><span className="status-pulse"/> Simulation environment active</div>
          <div className="user-card"><div className="avatar">TL</div><div className="user-meta"><strong>Local network</strong><span>Prototype workspace</span></div><CircleHelp size={16} className="muted-icon"/></div>
        </div>
      </aside>

      {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation"/>}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={19}/></button>
            <div className="breadcrumb">Workspace <span>/</span> <strong>{activePage.title}</strong></div>
          </div>
          <div className="topbar-right">
            <div className="live-indicator"><span className="status-pulse"/> SIMULATION LIVE</div>
            <div className="topbar-divider"/>
            <span className="clock-label"><Clock3 size={14}/>{timeLabel()}</span>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setToast("You're all caught up")}><Bell size={17}/><i/></button>
            <div className="avatar avatar-small">TL</div>
          </div>
        </header>

        <div className="content-wrap">
          <div className="page-heading">
            <div><div className="eyebrow"><span className="eyebrow-line"/>{page === "overview" ? "OVERVIEW" : "SYSTEM MODULE"}</div><h1>{activePage.title}<span className="heading-period">.</span></h1><p>{activePage.subtitle}</p></div>
            <div className="heading-actions">
              <button className={`button ${running ? "button-quiet" : "button-green"}`} onClick={() => setRunning(v => !v)}>{running ? <><span className="tiny-live-dot"/>Pause stream</> : <><Zap size={15}/>Resume stream</>}</button>
              <button className="button button-quiet" onClick={reset}><RefreshCw size={15}/>Reset</button>
            </div>
          </div>

          <div className="simulation-banner"><div className="banner-icon"><AlertTriangle size={15}/></div><div><strong>Simulation mode</strong><span>All sensor readings, model outputs, events and mesh transfers shown here are synthetic demonstrations.</span></div><span className="banner-tag">NOT FOR EMERGENCY USE</span></div>

          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.22, ease: "easeOut" }}>
              {page === "overview" && <Overview scenario={scenario} changeScenario={changeScenario} wave={wave} onlineCount={onlineCount} confidence={confidence} eventState={eventState} originCount={originCount} tick={tick} setPage={setPage}/>}
              {page === "sensors" && <Sensors wave={wave} scenario={scenario} tick={tick}/>}
              {page === "ai" && <AIEngine confidence={confidence} scenario={scenario}/>}
              {page === "mesh" && <Mesh scenario={scenario} onlineCount={onlineCount} tick={tick}/>}
              {page === "verification" && <Verification scenario={scenario} originCount={originCount} confidence={confidence}/>}
              {page === "community" && <Community reports={reports} onAdd={() => setShowReport(true)}/>}
            </motion.div>
          </AnimatePresence>

          <footer className="footer"><span>© 2026 TREMORLINK AI</span><span><span className="footer-dot"/> LOCAL SIMULATION ENVIRONMENT</span><span>BUILD 0.1.0 · PROTOTYPE</span></footer>
        </div>
      </main>

      {showReport && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowReport(false); }}>
        <motion.div className="modal" initial={{ opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
          <div className="modal-head"><div><div className="eyebrow">COMMUNITY INPUT</div><h2>Submit a local report</h2></div><button className="icon-button" onClick={() => setShowReport(false)} aria-label="Close"><X size={18}/></button></div>
          <label>Area or sector<input value={reportArea} onChange={e => setReportArea(e.target.value)} placeholder="e.g. Sector 03 · South"/></label>
          <label>What did you observe?<textarea value={reportMessage} onChange={e => setReportMessage(e.target.value)} placeholder="Describe the observation..." rows={4}/></label>
          <div className="modal-note">This report is stored only in this browser session and is part of the demonstration.</div>
          <div className="modal-actions"><button className="button button-quiet" onClick={() => setShowReport(false)}>Cancel</button><button className="button button-green" onClick={addReport} disabled={!reportArea.trim() || !reportMessage.trim()}>Add report <ArrowUpRight size={15}/></button></div>
        </motion.div>
      </div>}
      <AnimatePresence>{toast && <motion.div className="toast" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}><Check size={15}/>{toast}</motion.div>}</AnimatePresence>
    </div>
  );
}

function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="section-title"><h3>{title}</h3>{action}</div>;
}

function StatCard({ label, value, suffix, trend, icon: Icon, tone = "green" }: { label: string; value: string; suffix?: string; trend?: string; icon: typeof Activity; tone?: string }) {
  return <div className="stat-card panel"><div className="stat-top"><span>{label}</span><div className={`stat-icon ${tone}`}><Icon size={16}/></div></div><div className="stat-value">{value}<small>{suffix}</small></div><div className="stat-bottom"><span className="stat-trend"><ArrowUpRight size={13}/>{trend || "Live simulation"}</span><span className="stat-period">LAST 60 SEC</span></div></div>;
}

function ScenarioPicker({ value, onChange }: { value: Scenario; onChange: (v: Scenario) => void }) {
  return <div className="scenario-picker"><div className="scenario-select-wrap"><select value={value} onChange={e => onChange(e.target.value as Scenario)} aria-label="Select simulation scenario">{scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}</select><ChevronDown size={15}/></div><span className="scenario-description">{scenarios.find(s => s.id === value)?.detail}</span></div>;
}

function WaveChart({ wave, height = 220 }: { wave: { time: string; amplitude: number }[]; height?: number }) {
  return <div className="chart-wrap" style={{ height }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={wave} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <defs><linearGradient id="waveFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#48d69a" stopOpacity={0.25}/><stop offset="100%" stopColor="#48d69a" stopOpacity={0}/></linearGradient></defs>
        <CartesianGrid stroke="#202a25" strokeDasharray="3 5" vertical={false}/>
        <XAxis dataKey="time" tick={{ fill: "#65736c", fontSize: 10 }} axisLine={false} tickLine={false} interval={9}/>
        <YAxis tick={{ fill: "#65736c", fontSize: 10 }} axisLine={false} tickLine={false} domain={[-0.5, 1.1]}/>
        <Tooltip contentStyle={{ background: "#101713", border: "1px solid #29372f", borderRadius: 10, color: "#e7f0eb", fontSize: 12 }} labelStyle={{ color: "#8c9b92" }}/>
        <Area type="monotone" dataKey="amplitude" stroke="#53dca2" strokeWidth={2} fill="url(#waveFill)" isAnimationActive={false}/>
      </AreaChart>
    </ResponsiveContainer>
  </div>;
}

function Overview({ scenario, changeScenario, wave, onlineCount, confidence, eventState, originCount, tick, setPage }: any) {
  return <div className="page-grid">
    <div className="scenario-row panel"><div className="scenario-label"><div className="scenario-symbol"><Sparkles size={17}/></div><div><strong>Scenario simulator</strong><span>Change the environment to explore system behaviour</span></div></div><ScenarioPicker value={scenario} onChange={changeScenario}/></div>
    <div className="stats-grid">
      <StatCard label="Connected devices" value={String(onlineCount).padStart(2, "0")} suffix="/ 07" trend="Network coverage" icon={Radio}/>
      <StatCard label="Sensor observations" value={String(128 + tick * 3)} trend="+3 this interval" icon={Activity}/>
      <StatCard label="Event confidence" value={`${confidence}%`} trend={scenario === "corroborated" ? "Independent origins" : "Local model output"} icon={Gauge} tone="amber"/>
      <StatCard label="Verified origins" value={String(originCount).padStart(2, "0")} suffix=" / 03" trend="Quorum threshold" icon={ShieldCheck} tone="violet"/>
    </div>
    <div className="two-column">
      <section className="panel chart-panel"><SectionTitle title="Sensor signal stream" action={<span className="live-small"><i/>LIVE DATA</span>}/><div className="chart-legend"><span><i className="legend-green"/>Composite acceleration</span><span className="chart-unit">NORMALIZED · SIMULATED</span></div><WaveChart wave={wave}/><div className="chart-foot"><span>DEVICE TL-06 · LOCAL HUB</span><span>WINDOW 4.8 SEC</span></div></section>
      <section className="panel event-panel"><SectionTitle title="Event assessment" action={<span className={`state-pill ${scenario === "corroborated" ? "state-green" : scenario === "isolated" ? "state-amber" : "state-neutral"}`}>{scenario === "corroborated" ? "CORROBORATED" : scenario === "isolated" ? "OBSERVATION" : "STABLE"}</span>}/><div className="event-status"><div className={`event-orb ${scenario !== "normal" ? "orb-active" : ""}`}><Activity size={25}/></div><div><div className="event-status-title">{eventState}</div><p>{scenario === "corroborated" ? "Multiple simulated origins report a matching signal." : scenario === "isolated" ? "One device has reported an unusual local signal." : scenario === "interruption" ? "Some nodes are currently unreachable in this scenario." : scenario === "duplicate" ? "A repeated packet was identified and discarded." : "No unusual signal pattern is currently being simulated."}</p></div></div><div className="event-metrics"><div><span>ORIGIN COUNT</span><strong>{originCount} <small>/ 3</small></strong></div><div><span>MODEL CONFIDENCE</span><strong>{confidence}<small>%</small></strong></div><div><span>STATUS</span><strong className="green-text">{scenario === "corroborated" ? "Matched" : scenario === "isolated" ? "Review" : "Clear"}</strong></div></div><button className="text-action" onClick={() => setPage("verification")}>View verification details <ArrowUpRight size={14}/></button></section>
    </div>
    <div className="two-column lower-grid">
      <section className="panel"><SectionTitle title="Mesh network overview" action={<button className="text-action" onClick={() => setPage("mesh")}>Explore network <ArrowUpRight size={13}/></button>}/><MiniMesh onlineCount={onlineCount}/><div className="mesh-legend"><span><i className="legend-green"/>Connected</span><span><i className="legend-muted"/>Offline</span><span><i className="legend-line"/>Relay path</span></div></section>
      <section className="panel activity-panel"><SectionTitle title="Recent activity" action={<span className="activity-count">LAST 5 EVENTS</span>}/><ActivityList scenario={scenario}/></section>
    </div>
  </div>;
}

function ActivityList({ scenario }: { scenario: Scenario }) {
  const items = [
    { time: "Now", title: scenario === "corroborated" ? "Independent origins matched" : scenario === "isolated" ? "Local signal flagged for review" : scenario === "interruption" ? "Connectivity reduced" : scenario === "duplicate" ? "Duplicate packet discarded" : "Sensor stream refreshed", detail: "Simulation event · TL-06", icon: scenario === "normal" ? Activity : AlertTriangle, tone: scenario === "normal" ? "green" : "amber" },
    { time: "12s", title: "Packet forwarded to neighbour", detail: "Mesh relay · TTL 04", icon: Router, tone: "green" },
    { time: "28s", title: "Sensor window processed", detail: "Feature extraction · 48 samples", icon: Cpu, tone: "violet" },
    { time: "41s", title: "Device heartbeat received", detail: "Node TL-03 · Connected", icon: Radio, tone: "green" }
  ];
  return <div className="activity-list">{items.map((item, i) => { const Icon = item.icon; return <div className="activity-item" key={i}><div className={`activity-icon ${item.tone}`}><Icon size={14}/></div><div className="activity-copy"><strong>{item.title}</strong><span>{item.detail}</span></div><time>{item.time}</time></div>; })}</div>;
}

function MiniMesh({ onlineCount }: { onlineCount: number }) {
  return <div className="mini-mesh"><svg viewBox="0 0 500 180" role="img" aria-label="Illustrative mesh network with connected device nodes">
    <g stroke="#30463a" strokeWidth="1.4" fill="none">{[[250,24,110,82],[250,24,390,75],[110,82,250,115],[390,75,250,115],[250,115,150,160],[250,115,370,155],[110,82,150,160],[390,75,370,155]].map((l,i)=><line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]}/>)}</g>
    {[[250,24],[110,82],[390,75],[250,115],[150,160],[370,155]].map((p,i)=><g key={i}><circle cx={p[0]} cy={p[1]} r="12" fill="#10251b" stroke={i < onlineCount ? "#4bd49a" : "#59625d"} strokeWidth="1.5"/><circle cx={p[0]} cy={p[1]} r="3.5" fill={i < onlineCount ? "#4bd49a" : "#59625d"}/></g>)}
    <circle cx="250" cy="115" r="22" fill="none" stroke="#48d69a" opacity=".12"><animate attributeName="r" values="17;26;17" dur="3s" repeatCount="indefinite"/></circle>
  </svg></div>;
}

function Sensors({ wave, scenario, tick }: any) {
  const metrics = [{ label: "RMS energy", value: scenario === "corroborated" ? "0.842" : scenario === "isolated" ? "0.621" : "0.084", unit: "g²" }, { label: "Peak amplitude", value: scenario === "corroborated" ? "1.240" : scenario === "isolated" ? "0.910" : "0.182", unit: "g" }, { label: "Dominant frequency", value: scenario === "corroborated" ? "4.8" : "2.1", unit: "Hz" }, { label: "Signal persistence", value: scenario === "corroborated" ? "2.8" : "0.4", unit: "sec" }];
  return <div className="page-grid"><div className="stats-grid four-stats">{metrics.map((m,i)=><div className="panel feature-stat" key={m.label}><span>{m.label}</span><strong>{m.value}<small>{m.unit}</small></strong><div className="feature-stat-line"><i style={{ width: `${[68, scenario === "normal" ? 18 : 82, 44, scenario === "corroborated" ? 85 : 26][i]}%` }}/></div></div>)}</div>
    <section className="panel chart-panel large-chart"><SectionTitle title="Three-axis acceleration composite" action={<span className="live-small"><i/>STREAMING · {tick} UPDATES</span>}/><div className="chart-legend"><span><i className="legend-green"/>Composite signal</span><span className="chart-unit">NORMALIZED ACCELERATION</span></div><WaveChart wave={wave} height={310}/><div className="chart-foot"><span>SAMPLING WINDOW · 2.0 SEC</span><span>OVERLAP · 50%</span><span>DEVICE · TL-06</span></div></section>
    <div className="two-column"><section className="panel"><SectionTitle title="Signal processing pipeline"/><Pipeline steps={["Raw sensor window","Noise filtering","Feature extraction","Classifier input"]}/></section><section className="panel"><SectionTitle title="Extracted feature set"/><div className="feature-list">{["Variance","Spectral energy","Zero-crossing rate","Crest factor","Spectral entropy"].map((f,i)=><div key={f}><span>{f}</span><strong>{(0.12 + ((i * 13 + tick) % 31) / 100).toFixed(3)}</strong></div>)}</div></section></div>
  </div>;
}

function Pipeline({ steps }: { steps: string[] }) { return <div className="pipeline">{steps.map((s,i)=><div className="pipeline-step" key={s}><div className="pipeline-index">{String(i+1).padStart(2,"0")}</div><div><strong>{s}</strong><span>{["48 sample frame","Band-limited signal","8 computed features","Local inference"][i]}</span></div>{i < steps.length-1 && <div className="pipeline-arrow"><ArrowDownRight size={14}/></div>}</div>)}</div>; }

function AIEngine({ confidence, scenario }: { confidence: number; scenario: Scenario }) {
  const label = scenario === "corroborated" ? "EARTHQUAKE-LIKE" : scenario === "isolated" ? "IMPACT-LIKE" : "NORMAL";
  const classes = [{ name: "Normal activity", score: scenario === "normal" ? 96 : scenario === "interruption" ? 73 : 4 }, { name: "Walking / running", score: scenario === "normal" ? 3 : 8 }, { name: "Impact-like", score: scenario === "isolated" ? 78 : 2 }, { name: "Earthquake-like", score: scenario === "corroborated" ? 91 : 1 }, { name: "Collapse-like", score: scenario === "corroborated" ? 6 : 1 }];
  return <div className="page-grid"><div className="two-column ai-top"><section className="panel ai-result"><div className="eyebrow">CURRENT MODEL OUTPUT</div><div className="ai-class">{label}</div><p>Illustrative classification from the selected synthetic scenario.</p><div className="confidence-row"><span>Scenario confidence</span><strong>{confidence}%</strong></div><div className="confidence-track"><i style={{ width: `${confidence}%` }}/></div><div className="ai-foot"><span><Cpu size={14}/> LOCAL INFERENCE DEMO</span><span>NO CLOUD MODEL</span></div></section><section className="panel"><SectionTitle title="Model information"/><div className="model-info">{[["Model type","Synthetic rule-based demo"],["Input features","8 signal features"],["Window size","2.0 seconds"],["Inference location","Browser simulation"],["Validation status","Not validated"]].map(r=><div key={r[0]}><span>{r[0]}</span><strong>{r[1]}</strong></div>)}</div></section></div>
    <section className="panel"><SectionTitle title="Class probability distribution" action={<span className="chart-unit">ILLUSTRATIVE SCORES</span>}/><div className="class-bars">{classes.map(c=><div className="class-row" key={c.name}><span>{c.name}</span><div className="class-track"><i style={{ width: `${c.score}%` }}/></div><strong>{c.score}%</strong></div>)}</div></section>
    <div className="notice-card"><AlertTriangle size={17}/><div><strong>Prototype limitation</strong><span>This is not a trained or validated earthquake-detection model. Scores are generated for interface demonstration and must not be used for real-world safety decisions.</span></div></div>
  </div>;
}

function Mesh({ scenario, onlineCount, tick }: { scenario: Scenario; onlineCount: number; tick: number }) {
  const offline = scenario === "interruption" ? ["TL-03", "TL-07", "TL-05"] : [];
  return <div className="page-grid"><div className="stats-grid"><StatCard label="Active nodes" value={String(onlineCount)} suffix="/ 07" icon={Radio}/><StatCard label="Packets relayed" value={String(34 + tick * 2)} trend="Simulated traffic" icon={Layers3}/><StatCard label="Average hop count" value="2.1" trend="Illustrative route" icon={Network}/><StatCard label="Duplicate packets" value={scenario === "duplicate" ? "01" : "00"} trend="Deduplication" icon={ShieldCheck} tone="violet"/></div>
    <section className="panel network-panel"><SectionTitle title="Peer-to-peer topology" action={<span className="live-small"><i/>SIMULATED TOPOLOGY</span>}/><div className="network-canvas"><svg viewBox="0 0 760 410" preserveAspectRatio="xMidYMid meet" className="network-svg">
      <defs><radialGradient id="nodeGlow"><stop offset="0%" stopColor="#4bd49a" stopOpacity=".18"/><stop offset="100%" stopColor="#4bd49a" stopOpacity="0"/></radialGradient></defs>
      {[[380,55,135,145],[380,55,620,145],[135,145,300,245],[620,145,465,245],[300,245,465,245],[300,245,190,350],[465,245,585,350],[135,145,190,350],[620,145,585,350]].map((l,i)=><line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} className={`network-edge ${scenario === "interruption" && [1,3,6].includes(i) ? "edge-offline" : ""}`}/>)}
      {[[380,55,"TL-01"],[135,145,"TL-02"],[620,145,"TL-03"],[300,245,"TL-04"],[465,245,"TL-06"],[190,350,"TL-05"],[585,350,"TL-07"]].map(([x,y,id]: any,i)=><g key={id} className={`network-node ${offline.includes(id) ? "node-offline" : ""}`}><circle cx={x} cy={y} r="37" fill="url(#nodeGlow)"/><circle cx={x} cy={y} r="18" className="node-ring"/><circle cx={x} cy={y} r="5" className="node-core"/><text x={x} y={Number(y)+34} textAnchor="middle">{id}</text></g>)}
      {scenario !== "normal" && <circle r="5" className="packet-dot"><animateMotion dur="3s" repeatCount="indefinite" path="M380 55 L300 245 L465 245 L585 350"/></circle>}
    </svg></div><div className="network-legend"><span><i className="legend-green"/>Connected device</span><span><i className="legend-muted"/>Unavailable device</span><span><i className="legend-line"/>Peer connection</span><span><i className="legend-packet"/>Packet movement</span></div></section>
    <div className="two-column"><section className="panel"><SectionTitle title="Device registry"/><div className="device-table">{devicePositions.map(d=><div key={d.id}><span className={`device-dot ${offline.includes(d.id) ? "offline" : ""}`}/><strong>{d.id}</strong><span>{d.label}</span><em>{offline.includes(d.id) ? "Offline" : "Connected"}</em></div>)}</div></section><section className="panel"><SectionTitle title="Packet handling"/><Pipeline steps={["Create event packet","Forward to neighbours","Check packet ID","Apply TTL / deduplicate"]}/><div className="inline-note">Duplicate deliveries are ignored in this simulation and do not increase the independent-origin count.</div></section></div>
  </div>;
}

function Verification({ scenario, originCount, confidence }: { scenario: Scenario; originCount: number; confidence: number }) {
  return <div className="page-grid"><div className="two-column verify-top"><section className="panel quorum-panel"><div className="eyebrow">INDEPENDENT ORIGIN QUORUM</div><div className="quorum-number">{originCount}<span>/ 3</span></div><p>Distinct originating devices reporting a matching event class.</p><div className="quorum-slots">{[0,1,2].map(i=><div className={`quorum-slot ${i < originCount ? "filled" : ""}`} key={i}>{i < originCount ? <Check size={18}/> : <span>{String(i+1).padStart(2,"0")}</span>}</div>)}</div><div className={`quorum-status ${originCount >= 3 ? "complete" : ""}`}>{originCount >= 3 ? "THRESHOLD REACHED" : "AWAITING INDEPENDENT ORIGINS"}</div></section><section className="panel"><SectionTitle title="Verification parameters"/><div className="model-info">{[["Required origins","3 distinct devices"],["Matching condition","Same event class"],["Time window","Configurable demo window"],["Duplicate relays","Excluded from quorum"],["Confidence","Not a probability of safety"]].map(r=><div key={r[0]}><span>{r[0]}</span><strong>{r[1]}</strong></div>)}</div></section></div>
    <section className="panel"><SectionTitle title="Origin observations" action={<span className="chart-unit">SCENARIO: {scenario.toUpperCase()}</span>}/><div className="origin-list">{[0,1,2,3].map((i)=><div className="origin-row" key={i}><div className={`origin-avatar ${i < originCount ? "origin-active" : ""}`}>{i < originCount ? <Signal size={15}/> : <Radio size={15}/>}</div><div className="origin-main"><strong>{`Device TL-0${i+1}`}</strong><span>{i < originCount ? "Matching observation · independent origin" : "No matching origin observation"}</span></div><div className={`origin-state ${i < originCount ? "confirmed" : ""}`}>{i < originCount ? "MATCHED" : "PENDING"}</div></div>)}</div></section>
    <div className="notice-card"><ShieldCheck size={17}/><div><strong>Quorum is not certainty</strong><span>Independent observations can increase confidence in a simulated event, but this demonstration does not establish a real hazard or replace official emergency information.</span></div></div>
  </div>;
}

function Community({ reports, onAdd }: { reports: CommunityReport[]; onAdd: () => void }) {
  return <div className="page-grid"><div className="stats-grid"><StatCard label="Community reports" value={String(reports.length).padStart(2,"0")} trend="Local session" icon={Users}/><StatCard label="Reviewed reports" value={String(reports.filter(r=>r.status==="Reviewed").length).padStart(2,"0")} icon={ShieldCheck}/><StatCard label="New submissions" value={String(reports.filter(r=>r.status==="New").length).padStart(2,"0")} icon={Bell} tone="amber"/><StatCard label="Coverage areas" value="07" trend="Illustrative sectors" icon={Globe2}/></div>
    <section className="panel reports-panel"><SectionTitle title="Community observations" action={<button className="button button-green" onClick={onAdd}><Users size={15}/>Add report</button>}/><div className="report-list">{reports.map(r=><div className="report-row" key={r.id}><div className="report-pin"><Radio size={16}/></div><div className="report-content"><div className="report-meta"><strong>{r.area}</strong><span>{r.time}</span></div><p>{r.message}</p><span className={`report-status ${r.status === "New" ? "new" : ""}`}>{r.status === "New" ? "NEW SUBMISSION" : "REVIEWED"}</span></div></div>)}</div></section>
    <div className="notice-card"><HeartPulse size={17}/><div><strong>Community context matters</strong><span>Reports are unverified user-submitted context in this local prototype. They are not emergency alerts and are not transmitted to other devices.</span></div></div>
  </div>;
}

export default App;
