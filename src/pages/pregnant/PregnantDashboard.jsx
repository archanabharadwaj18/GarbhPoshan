import { useState, useEffect } from "react";
import "../../PregnantDashboard.css";
import HomeSection from "./HomeSection";
import MealTrackerSection from "./MealTrackerSection";
import PregnancyJourneySection from "./PregnancyJourneySection";
import MyHealthSection from "./MyHealthSection";
import SymptomsSection from "./SymptomsSection";
import RemindersSection from "./RemindersSection";
import NutritionEducationSection from "./NutritionEducationSection";
import AshaSupportSection from "./AshaSupportSection";
import ProfileSection from "./ProfileSection";
import { translations } from "../../translation";

const PREGNANT_NAV_ITEMS = [
  { id: "home", labelKey: "nav_pw_home", fallback: "Home", icon: "🏠" },
  { id: "pregnancy", labelKey: "nav_pw_journey", fallback: "My Pregnancy", icon: "🤰" },
  { id: "meals", labelKey: "nav_pw_meals", fallback: "Meal Tracker", icon: "🍲" },
  { id: "health", labelKey: "nav_pw_health", fallback: "My Health", icon: "🩺" },
  { id: "symptoms", labelKey: "nav_pw_symptoms", fallback: "Symptoms", icon: "📋" },
  { id: "reminders", labelKey: "nav_pw_reminders", fallback: "Reminders", icon: "💊" },
  { id: "education", labelKey: "nav_pw_education", fallback: "Nutrition Education", icon: "📚" },
  { id: "asha-support", labelKey: "nav_pw_asha", fallback: "ASHA Support", icon: "🤝" },
  { id: "profile", labelKey: "nav_pw_profile", fallback: "My Profile", icon: "👤" },
];

const INITIAL_MED_REMINDERS = [
  {
    id: "rem_01",
    title: "Iron & Folic Acid (IFA) Tablet",
    type: "medication",
    time: "After lunch (2:00 PM)",
    notes: "Take with water or citrus juice; avoid tea/milk for 2 hours.",
    completed: true,
  },
  {
    id: "rem_02",
    title: "Calcium Carbonate Tablet (500mg)",
    type: "medication",
    time: "After dinner (8:30 PM)",
    notes: "Never take at the same time as Iron tablet.",
    completed: false,
  },
  {
    id: "rem_03",
    title: "ANC Second Checkup (PMSMA Clinic)",
    type: "anc",
    time: "9th of this month (10:00 AM)",
    notes: "At Channapatna PHC with Dr. Sudha. Bring MCP card.",
    completed: false,
  },
  {
    id: "rem_04",
    title: "Tetanus & Diphtheria (Td) Booster Injection",
    type: "anc",
    time: "Next Wednesday",
    notes: "Administered by ANM at village Anganwadi centre.",
    completed: false,
  },
];

const INITIAL_MEALS = [
  {
    id: "m_seed_1",
    userId: "usr_pw_ananya",
    date: new Date().toISOString().split("T")[0],
    time: "08:30 AM",
    type: "Breakfast",
    food: "Ragi Dosa with Vegetable Sambar",
    portion: "2 dosas + 1 bowl sambar",
    description: "Prepared with less oil, added drumstick leaves",
    calories: 280,
    protein: 7,
    iron: 3.5,
    calcium: 160,
    folate: 45,
    aiTagged: false,
  },
  {
    id: "m_seed_2",
    userId: "usr_pw_ananya",
    date: new Date().toISOString().split("T")[0],
    time: "01:15 PM",
    type: "Lunch",
    food: "Brown Rice, Thick Dal, and Spinach (Palak) Sabzi",
    portion: "1 standard plate + 1 bowl dal",
    description: "Added lemon juice on greens for iron absorption",
    calories: 360,
    protein: 12,
    iron: 4.8,
    calcium: 120,
    folate: 110,
    aiTagged: true,
  },
];

const INITIAL_HEALTH_RECORDS = [
  {
    id: "hlth_seed_1",
    condition: "Anaemia (Mild Iron Deficiency)",
    status: "Confirmed by Healthcare Professional",
    diagnosisDate: "2026-09-12",
    doctorOrHospital: "Channapatna General Hospital (Dr. Sudha)",
    medication: "Tab IFA (100mg elemental iron + 500mcg folic acid) daily",
    testResults: "Hb 10.4 g/dL (Target: > 11.0 g/dL)",
    followUpDate: "Routine checkup next month",
    createdAt: "2026-09-12",
  },
];

const INITIAL_SYMPTOMS = [
  {
    id: "symp_seed_1",
    name: "Nausea / Morning Sickness",
    severity: "Mild",
    date: new Date().toISOString().split("T")[0],
    time: "07:30 AM",
    notes: "Felt better after ginger tea and dry biscuit",
  },
];

export default function PregnantDashboard({
  currentUser,
  onLogout,
  currentLanguage = "English",
  onLanguageChange,
}) {
  const [activeTab, setActiveTab] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // User state
  const [user, setUser] = useState(currentUser);

  // Local storage keys per user
  const userPrefix = user?.id || "guest";

  // Meals state
  const [meals, setMeals] = useState(() => {
    try {
      const saved = localStorage.getItem(`poshan_meals_${userPrefix}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MEALS;
  });

  // Health records state
  const [healthRecords, setHealthRecords] = useState(() => {
    try {
      const saved = localStorage.getItem(`poshan_health_${userPrefix}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_HEALTH_RECORDS;
  });

  // Symptoms state
  const [symptoms, setSymptoms] = useState(() => {
    try {
      const saved = localStorage.getItem(`poshan_symptoms_${userPrefix}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SYMPTOMS;
  });

  // Reminders state
  const [reminders, setReminders] = useState(() => {
    try {
      const saved = localStorage.getItem(`poshan_reminders_${userPrefix}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MED_REMINDERS;
  });

  // Persist meals
  useEffect(() => {
    try {
      localStorage.setItem(`poshan_meals_${userPrefix}`, JSON.stringify(meals));
    } catch {
      // ignore
    }
  }, [meals, userPrefix]);

  // Persist health records
  useEffect(() => {
    try {
      localStorage.setItem(`poshan_health_${userPrefix}`, JSON.stringify(healthRecords));
    } catch {
      // ignore
    }
  }, [healthRecords, userPrefix]);

  // Persist symptoms
  useEffect(() => {
    try {
      localStorage.setItem(`poshan_symptoms_${userPrefix}`, JSON.stringify(symptoms));
    } catch {
      // ignore
    }
  }, [symptoms, userPrefix]);

  // Persist reminders
  useEffect(() => {
    try {
      localStorage.setItem(`poshan_reminders_${userPrefix}`, JSON.stringify(reminders));
    } catch {
      // ignore
    }
  }, [reminders, userPrefix]);

  const t = translations[currentLanguage] || translations.English;

  function handleAddMeal(meal) {
    setMeals((prev) => [meal, ...prev]);
  }

  function handleAddHealthRecord(rec) {
    setHealthRecords((prev) => [rec, ...prev]);
  }

  function handleAddSymptom(sym) {
    setSymptoms((prev) => [sym, ...prev]);
  }

  function handleAddReminder(rem) {
    setReminders((prev) => [rem, ...prev]);
  }

  function handleToggleReminder(id) {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  }

  const activeNavItem = PREGNANT_NAV_ITEMS.find((n) => n.id === activeTab);
  const activeTitle = activeNavItem
    ? t[activeNavItem.labelKey] || activeNavItem.fallback
    : "Dashboard";

  const todayStr = new Date().toISOString().split("T")[0];
  const todayMeals = meals.filter((m) => m.date === todayStr);

  return (
    <div className="pw-shell">
      {/* Sidebar Navigation */}
      <aside className={`pw-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="pw-brand">
          <div className="pw-brand-icon">🌸</div>
          <div className="pw-brand-text">
            <h2>Poshan Care</h2>
            <p>{t.mother_portal_tag || "Maternal Health Portal"}</p>
          </div>
        </div>

        <nav className="pw-nav">
          {PREGNANT_NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`pw-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
            >
              <span className="pw-nav-icon">{item.icon}</span>
              <span>{t[item.labelKey] || item.fallback}</span>
            </button>
          ))}
        </nav>

        <div className="pw-sidebar-user">
          <div className="pw-user-card">
            <div className="pw-user-avatar">
              {user?.name ? user.name.charAt(0) : "M"}
            </div>
            <div className="pw-user-details">
              <strong>{user?.name || "Mother"}</strong>
              <span>Week {user?.week || 14} · Trimester {user?.week <= 13 ? 1 : user?.week <= 27 ? 2 : 3}</span>
            </div>
          </div>

          <button
            type="button"
            className="pw-logout-btn"
            onClick={onLogout}
          >
            <span>⎋</span>
            <span>{t.btn_logout || "Logout"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="pw-main">
        <header className="pw-topbar">
          <div className="pw-topbar-left">
            <button
              type="button"
              className="pw-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>
            <div className="pw-breadcrumb">
              Poshan Care <span>/</span> {activeTitle}
            </div>
          </div>

          <div className="pw-topbar-right">
            {/* Urgent Care Red Flag Quick Button */}
            <button
              type="button"
              className="pw-urgent-btn"
              onClick={() => setShowEmergencyModal(true)}
            >
              <span>🚨</span>
              <span>{t.emergency_badge || "Urgent Signs"}</span>
            </button>

            {/* Language Selector */}
            <label className="language-select">
              文
              <select value={currentLanguage} onChange={(e) => onLanguageChange(e.target.value)}>
                <option>English</option>
                <option>ಕನ್ನಡ</option>
                <option>हिन्दी</option>
                <option>తెలుగు</option>
                <option>தமிழ்</option>
                <option>മലയാളം</option>
              </select>
            </label>
          </div>
        </header>

        <div className="pw-content">
          {activeTab === "home" && (
            <HomeSection
              user={user}
              t={t}
              todayMeals={todayMeals}
              reminders={reminders}
              onNavigate={setActiveTab}
              onOpenEmergency={() => setShowEmergencyModal(true)}
            />
          )}

          {activeTab === "pregnancy" && (
            <PregnancyJourneySection user={user} t={t} />
          )}

          {activeTab === "meals" && (
            <MealTrackerSection
              user={user}
              t={t}
              meals={meals}
              onAddMeal={handleAddMeal}
            />
          )}

          {activeTab === "health" && (
            <MyHealthSection
              user={user}
              t={t}
              healthRecords={healthRecords}
              onAddRecord={handleAddHealthRecord}
            />
          )}

          {activeTab === "symptoms" && (
            <SymptomsSection
              user={user}
              t={t}
              symptoms={symptoms}
              onAddSymptom={handleAddSymptom}
            />
          )}

          {activeTab === "reminders" && (
            <RemindersSection
              user={user}
              t={t}
              reminders={reminders}
              onToggleReminder={handleToggleReminder}
              onAddReminder={handleAddReminder}
            />
          )}

          {activeTab === "education" && (
            <NutritionEducationSection t={t} />
          )}

          {activeTab === "asha-support" && (
            <AshaSupportSection user={user} t={t} />
          )}

          {activeTab === "profile" && (
            <ProfileSection
              user={user}
              t={t}
              onUpdateUser={setUser}
              onLogout={onLogout}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="pw-mobile-bottom-nav">
        <div className="pw-mobile-nav-items">
          <button
            type="button"
            className={`pw-mobile-nav-btn ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <span>🏠</span>
            <span>Home</span>
          </button>

          <button
            type="button"
            className={`pw-mobile-nav-btn ${activeTab === "meals" ? "active" : ""}`}
            onClick={() => setActiveTab("meals")}
          >
            <span>🍲</span>
            <span>Meals</span>
          </button>

          <button
            type="button"
            className={`pw-mobile-nav-btn ${activeTab === "pregnancy" ? "active" : ""}`}
            onClick={() => setActiveTab("pregnancy")}
          >
            <span>🤰</span>
            <span>Baby</span>
          </button>

          <button
            type="button"
            className={`pw-mobile-nav-btn ${activeTab === "symptoms" ? "active" : ""}`}
            onClick={() => setActiveTab("symptoms")}
          >
            <span>📋</span>
            <span>Symptoms</span>
          </button>

          <button
            type="button"
            className={`pw-mobile-nav-btn ${activeTab === "asha-support" ? "active" : ""}`}
            onClick={() => setActiveTab("asha-support")}
          >
            <span>🤝</span>
            <span>ASHA</span>
          </button>
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="modal-backdrop" onClick={() => setShowEmergencyModal(false)}>
          <div className="modal-box" style={{ maxWidth: "560px", background: "#fffdfd", border: "2px solid #feb2b2" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#c53030" }}>
                <span style={{ fontSize: "24px" }}>🚨</span>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#c53030" }}>
                  {t.emergency_modal_title || "URGENT PREGNANCY DANGER SIGNS"}
                </h3>
              </div>
              <button
                type="button"
                className="text-button"
                onClick={() => setShowEmergencyModal(false)}
                style={{ fontSize: "18px" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "12px", color: "#742a2a", lineHeight: "1.6", margin: "0 0 14px" }}>
              If you experience any of these warning signs, reach out to your nearest Community Health Centre (CHC) or District Hospital immediately:
            </p>

            <ul style={{ margin: "0 0 18px", paddingLeft: "20px", fontSize: "12px", color: "#742a2a", lineHeight: "1.8" }}>
              <li><strong>Vaginal bleeding or fluid discharge</strong></li>
              <li><strong>Severe abdominal or pelvic pain</strong></li>
              <li><strong>Severe headache with blurred vision / spots</strong></li>
              <li><strong>Sudden swelling of face, eyes, or hands</strong></li>
              <li><strong>High fever and shivering</strong></li>
              <li><strong>Decreased or stopped fetal movements</strong></li>
              <li><strong>Difficulty breathing or convulsions</strong></li>
            </ul>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", padding: "12px", background: "#fff5f5", borderRadius: "10px", marginBottom: "14px" }}>
              <a href="tel:108" className="pw-call-btn" style={{ flex: 1, textAlign: "center", justifyContent: "center" }}>
                📞 Call 108 Ambulance
              </a>
              <a href="tel:102" className="pw-call-btn" style={{ flex: 1, textAlign: "center", justifyContent: "center", background: "#9b2c2c" }}>
                🚑 Call 102 Maternal Van
              </a>
              <a href="tel:9876500001" className="pw-call-btn" style={{ flex: 1, textAlign: "center", justifyContent: "center", background: "#2d6a4f" }}>
                🩺 Call Radha Bai (ASHA)
              </a>
            </div>

            <div style={{ textAlign: "right" }}>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowEmergencyModal(false)}
              >
                Close Guidance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
