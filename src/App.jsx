
import { useState } from "react";
import "./App.css";

import Beneficiaries from "./pages/Beneficiaries";
import NutritionMonitoring from "./pages/NutritionMonitoring";
import FollowUps from "./pages/FollowUps";

const navItems = [
  { label: "Overview", icon: "▦" },
  { label: "Beneficiaries", icon: "♙" },
  { label: "Nutrition Monitoring", icon: "♡" },
  { label: "Follow-ups", icon: "☷" },
];

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [language, setLanguage] = useState("English");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✚</div>
          <div>
            <h2>Poshan Care</h2>
            <p>Maternal wellness</p>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="navigation">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${activePage === item.label ? "active" : ""}`}
              onClick={() => setActivePage(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon">♡</div>
            <h3>Every meal matters</h3>
            <p>Supporting healthier pregnancies, one meal at a time.</p>
          </div>
          <div className="worker-profile">
            <div className="avatar">AS</div>
            <div>
              <strong>ASHA Worker</strong>
              <p>Field worker account</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> {activePage}</div>
          <label className="language-select">
            文
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>English</option>
              <option>ಕನ್ನಡ</option>
              <option>हिन्दी</option>
            </select>
          </label>
        </header>

        <section className="page-content">
          <div className="welcome-row">
            <div>
              <div className="eyebrow">MATERNAL HEALTH • FIELD DASHBOARD</div>
              <h1>
                {activePage === "Overview"
                  ? "Good morning, ASHA Worker"
                  : activePage}
              </h1>
              <p className="page-subtitle">
                Supporting maternal nutrition through accessible meal tracking.
              </p>
            </div>
          </div>

          {activePage === "Overview" && (
            <>
              <div className="stats-grid">
                <StatCard label="Total beneficiaries" value="128" note="Assigned to your area" />
                <StatCard label="Meals recorded" value="342" note="Illustrative sample total" />
                <StatCard label="Needs review" value="12" note="Records to check" />
                <StatCard label="Pending sync" value="08" note="Illustrative offline records" />
              </div>
              <section className="panel page-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Welcome to Poshan Care</h2>
                    <p>Select a section from the sidebar to get started.</p>
                  </div>
                </div>
                <div className="overview-links">
                  {navItems.slice(1).map((item) => (
                    <button
                      className="overview-link"
                      key={item.label}
                      onClick={() => setActivePage(item.label)}
                    >
                      <span>{item.icon}</span>
                      <strong>{item.label}</strong>
                      <span>→</span>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {activePage === "Beneficiaries" && <Beneficiaries />}
          {activePage === "Nutrition Monitoring" && <NutritionMonitoring />}
          {activePage === "Follow-ups" && <FollowUps />}

          <footer className="page-footer">
            <span>Poshan Care · Maternal Nutrition Tracking</span>
            <span className="offline-indicator"><span /> Frontend prototype</span>
          </footer>
          <p className="demo-note">
            Demo only. All beneficiary information and counts are illustrative sample data.
          </p>
        </section>
      </main>
    </div>
  );
}

function StatCard({ label, value, note }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </div>
  );
}

export default App;
