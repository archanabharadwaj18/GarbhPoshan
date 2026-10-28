import { useState, useEffect } from "react";
import "./App.css";

import Beneficiaries from "./pages/Beneficiaries";
import NutritionMonitoring from "./pages/NutritionMonitoring";
import FollowUps from "./pages/FollowUps";
import { translations } from "./translation";

const navItems = [
  { id: "Overview", labelKey: "nav_overview", icon: "▦" },
  { id: "Beneficiaries", labelKey: "nav_beneficiaries", icon: "♙" },
  { id: "Nutrition Monitoring", labelKey: "nav_nutrition", icon: "♡" },
  { id: "Follow-ups", labelKey: "nav_followups", icon: "☷" },
];

const initialPeople = [
  { id: "MN001", name: "Ananya", age: 24, week: 12, meals: 18, status: "On Track" },
  { id: "MN002", name: "Kavya", age: 27, week: 24, meals: 12, status: "Review" },
  { id: "MN003", name: "Lakshmi", age: 22, week: 30, meals: 21, status: "On Track" },
  { id: "MN004", name: "Meera", age: 29, week: 18, meals: 9, status: "Follow-up" },
  { id: "MN005", name: "Divya", age: 25, week: 34, meals: 16, status: "On Track" },
];

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("poshan_language") || "English";
    } catch {
      return "English";
    }
  });

  const [people, setPeople] = useState(() => {
    try {
      const saved = localStorage.getItem("poshan_beneficiaries");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn("Could not load beneficiaries from localStorage", err);
    }
    return initialPeople;
  });

  useEffect(() => {
    try {
      localStorage.setItem("poshan_beneficiaries", JSON.stringify(people));
    } catch (err) {
      console.warn("Could not save beneficiaries to localStorage", err);
    }
  }, [people]);

  useEffect(() => {
    try {
      localStorage.setItem("poshan_language", language);
    } catch (err) {
      console.warn("Could not save language to localStorage", err);
    }
  }, [language]);

  const t = translations[language] || translations.English;

  const currentNav = navItems.find((n) => n.id === activePage);
  const activeTitle = currentNav ? (t[currentNav.labelKey] || activePage) : activePage;

  const needsReviewCount = people.filter(
    (p) => p.status === "Review" || p.status === "Follow-up"
  ).length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✚</div>
          <div>
            <h2>{t.appName}</h2>
            <p>{t.tagline}</p>
          </div>
        </div>

        <div className="nav-label">{t.workspace}</div>

        <nav className="navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{t[item.labelKey] || item.id}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon">♡</div>
            <h3>{t.supportCardTitle}</h3>
            <p>{t.supportCardText}</p>
          </div>
          <div className="worker-profile">
            <div className="avatar">AS</div>
            <div>
              <strong>{t.workerName}</strong>
              <p>{t.workerSubtitle}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">{t.breadcrumbWorkspace} <span>/</span> {activeTitle}</div>
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
              <div className="eyebrow">{t.eyebrow}</div>
              <h1>
                {activePage === "Overview"
                  ? t.welcomeGreeting
                  : activeTitle}
              </h1>
              <p className="page-subtitle">
                {t.pageSubtitle}
              </p>
            </div>
          </div>

          {activePage === "Overview" && (
            <>
              <div className="stats-grid">
                <StatCard label={t.statTotalBeneficiaries} value={people.length} note={t.statNoteAssigned} />
                <StatCard label={t.statMealsRecorded} value="342" note={t.statNoteIllustrative} />
                <StatCard label={t.statNeedsReview} value={needsReviewCount} note={t.statNoteRecordsToCheck} />
                <StatCard label={t.statPendingSync} value="08" note={t.statNoteOfflineRecords} />
              </div>
              <section className="panel page-panel">
                <div className="panel-heading">
                  <div>
                    <h2>{t.welcomeHeading}</h2>
                    <p>{t.welcomeText}</p>
                  </div>
                </div>
                <div className="overview-links">
                  {navItems.slice(1).map((item) => (
                    <button
                      className="overview-link"
                      key={item.id}
                      onClick={() => setActivePage(item.id)}
                    >
                      <span>{item.icon}</span>
                      <strong>{t[item.labelKey] || item.id}</strong>
                      <span>→</span>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {activePage === "Beneficiaries" && (
            <Beneficiaries t={t} people={people} setPeople={setPeople} />
          )}
          {activePage === "Nutrition Monitoring" && <NutritionMonitoring t={t} />}
          {activePage === "Follow-ups" && <FollowUps t={t} />}

          <footer className="page-footer">
            <span>{t.footerBrand}</span>
            <span className="offline-indicator"><span /> {t.footerStatus}</span>
          </footer>
          <p className="demo-note">
            {t.demoNote}
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