export default function HomeSection({
  user,
  t,
  todayMeals = [],
  reminders = [],
  onNavigate,
  onOpenEmergency,
}) {
  const week = user?.week || 14;
  const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;

  // Meal slot status
  const hasBreakfast = todayMeals.some((m) => m.type?.toLowerCase() === "breakfast");
  const hasLunch = todayMeals.some((m) => m.type?.toLowerCase() === "lunch");
  const hasDinner = todayMeals.some((m) => m.type?.toLowerCase() === "dinner");
  const hasSnack = todayMeals.some((m) => m.type?.toLowerCase() === "snack");

  // Sum nutrition
  const totalCalories = todayMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalProtein = todayMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
  const totalIron = todayMeals.reduce((acc, m) => acc + (m.iron || 0), 0);
  const totalCalcium = todayMeals.reduce((acc, m) => acc + (m.calcium || 0), 0);
  const totalFolate = todayMeals.reduce((acc, m) => acc + (m.folate || 0), 0);

  // Targets (approximate ICMR guidelines for pregnancy)
  const targets = {
    calories: 2200,
    protein: 68,
    iron: 27,
    calcium: 1000,
    folate: 500,
  };

  const pendingReminders = reminders.filter((r) => !r.completed);

  return (
    <div>
      {/* Hero Welcome Card */}
      <div className="pw-hero-banner">
        <div className="pw-hero-badge">
          🌸 {t.hero_trimester_label || "Trimester"} {trimester} · {t.week || "Week"} {week}
        </div>
        <h1>
          {t.welcome_mother || "Namaste"}, {user?.name || "Sister"}
        </h1>
        <p>
          {t.home_subtitle ||
            "Every nutritious meal nurtures your baby's growth and protects your health. Track your daily food, symptoms, and check-ups below."}
        </p>

        <div className="pw-hero-stats">
          <div className="pw-hero-stat-card">
            <span>{t.current_week || "Current Week"}</span>
            <strong>{week} {t.weeks_unit || "weeks"}</strong>
          </div>
          <div className="pw-hero-stat-card">
            <span>{t.trimester || "Trimester"}</span>
            <strong>
              {trimester === 1
                ? (t.trimester_first || "1st Trimester")
                : trimester === 2
                ? (t.trimester_second || "2nd Trimester")
                : (t.trimester_third || "3rd Trimester")}
            </strong>
          </div>
          <div className="pw-hero-stat-card">
            <span>{t.estimated_edd || "Est. Due Date"}</span>
            <strong>{user?.edd || "2027-04-18"}</strong>
          </div>
          <div className="pw-hero-stat-card">
            <span>{t.assigned_asha || "Assigned ASHA"}</span>
            <strong>{user?.assignedAsha ? user.assignedAsha.split("(")[0] : "Radha Bai"}</strong>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="pw-quick-actions">
        <button
          type="button"
          className="pw-action-btn"
          onClick={() => onNavigate("meals")}
        >
          <div className="pw-action-icon">🍲</div>
          <div>
            <div>{t.btn_log_meal || "Log Today's Meal"}</div>
            <small style={{ color: "#618676", fontSize: "10px" }}>Photo or manual</small>
          </div>
        </button>

        <button
          type="button"
          className="pw-action-btn"
          onClick={() => onNavigate("symptoms")}
        >
          <div className="pw-action-icon">📋</div>
          <div>
            <div>{t.btn_track_symptoms || t.btn_log_symptom || "Track Symptoms"}</div>
            <small style={{ color: "#618676", fontSize: "10px" }}>Nausea, fatigue...</small>
          </div>
        </button>

        <button
          type="button"
          className="pw-action-btn"
          onClick={() => onNavigate("reminders")}
        >
          <div className="pw-action-icon">💊</div>
          <div>
            <div>{t.btn_reminders || "Medications & ANC"}</div>
            <small style={{ color: "#618676", fontSize: "10px" }}>IFA & Checkups</small>
          </div>
        </button>

        <button
          type="button"
          className="pw-action-btn"
          onClick={() => onNavigate("asha-support")}
        >
          <div className="pw-action-icon">🩺</div>
          <div>
            <div>{t.btn_contact_asha || "ASHA Contact"}</div>
            <small style={{ color: "#618676", fontSize: "10px" }}>Ask for help</small>
          </div>
        </button>

        <button
          type="button"
          className="pw-action-btn"
          style={{ borderColor: "#feb2b2", background: "#fffaf9" }}
          onClick={onOpenEmergency}
        >
          <div className="pw-action-icon" style={{ background: "#fed7d7", color: "#c53030" }}>🚨</div>
          <div>
            <div style={{ color: "#c53030" }}>{t.emergency_warning_signs || "Warning Signs"}</div>
            <small style={{ color: "#9b2c2c", fontSize: "10px" }}>When to seek urgent care</small>
          </div>
        </button>
      </div>

      {/* Today's Meal Logging Status */}
      <div className="pw-card">
        <div className="pw-card-header">
          <div>
            <h2>{t.today_meal_status || "Today's Meal Logging"}</h2>
            <p>{t.today_meal_desc || "Make sure you record all 4 meals to keep nutrition balanced."}</p>
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={() => onNavigate("meals")}
          >
            + {t.add_meal_btn || "Add Meal"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
          <div style={{ padding: "14px", borderRadius: "12px", border: hasBreakfast ? "1px solid #95d5b2" : "1px dashed #d1dfd6", background: hasBreakfast ? "#f2f9f4" : "#fdfefe", textAlign: "center" }}>
            <div style={{ fontSize: "24px" }}>🍳</div>
            <strong style={{ display: "block", fontSize: "12px", marginTop: "6px" }}>{t.meal_breakfast || "Breakfast"}</strong>
            <span style={{ fontSize: "11px", color: hasBreakfast ? "#2d6a4f" : "#8ca096", fontWeight: "700" }}>
              {hasBreakfast ? "✓ " + (t.recorded || "Recorded") : "○ " + (t.pending || "Pending")}
            </span>
          </div>

          <div style={{ padding: "14px", borderRadius: "12px", border: hasLunch ? "1px solid #95d5b2" : "1px dashed #d1dfd6", background: hasLunch ? "#f2f9f4" : "#fdfefe", textAlign: "center" }}>
            <div style={{ fontSize: "24px" }}>🍛</div>
            <strong style={{ display: "block", fontSize: "12px", marginTop: "6px" }}>{t.meal_lunch || "Lunch"}</strong>
            <span style={{ fontSize: "11px", color: hasLunch ? "#2d6a4f" : "#8ca096", fontWeight: "700" }}>
              {hasLunch ? "✓ " + (t.recorded || "Recorded") : "○ " + (t.pending || "Pending")}
            </span>
          </div>

          <div style={{ padding: "14px", borderRadius: "12px", border: hasSnack ? "1px solid #95d5b2" : "1px dashed #d1dfd6", background: hasSnack ? "#f2f9f4" : "#fdfefe", textAlign: "center" }}>
            <div style={{ fontSize: "24px" }}>🥛</div>
            <strong style={{ display: "block", fontSize: "12px", marginTop: "6px" }}>{t.meal_snack || "Snack"}</strong>
            <span style={{ fontSize: "11px", color: hasSnack ? "#2d6a4f" : "#8ca096", fontWeight: "700" }}>
              {hasSnack ? "✓ " + (t.recorded || "Recorded") : "○ " + (t.pending || "Pending")}
            </span>
          </div>

          <div style={{ padding: "14px", borderRadius: "12px", border: hasDinner ? "1px solid #95d5b2" : "1px dashed #d1dfd6", background: hasDinner ? "#f2f9f4" : "#fdfefe", textAlign: "center" }}>
            <div style={{ fontSize: "24px" }}>🍲</div>
            <strong style={{ display: "block", fontSize: "12px", marginTop: "6px" }}>{t.meal_dinner || "Dinner"}</strong>
            <span style={{ fontSize: "11px", color: hasDinner ? "#2d6a4f" : "#8ca096", fontWeight: "700" }}>
              {hasDinner ? "✓ " + (t.recorded || "Recorded") : "○ " + (t.pending || "Pending")}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Nutrition Summary */}
      <div className="pw-card">
        <div className="pw-card-header">
          <div>
            <h2>{t.nutrition_summary_title || "Today's Nutrition Summary"}</h2>
            <p>{t.nutrition_disclaimer_short || "Estimated nutritional values for maternal health guidance (ICMR reference targets)."}</p>
          </div>
          <span style={{ fontSize: "11px", color: "#618676", background: "#f0f7f3", padding: "4px 10px", borderRadius: "8px" }}>
            {todayMeals.length} {t.meals_logged_today || "meals logged today"}
          </span>
        </div>

        <div className="pw-nutrient-grid">
          <div className="pw-nutrient-card">
            <div className="pw-nutrient-top">
              <span className="pw-nutrient-name">⚡ {t.nutrient_calories || "Energy"}</span>
              <span className="pw-nutrient-val">{totalCalories} / {targets.calories} kcal</span>
            </div>
            <div className="pw-progress-bar">
              <div
                className="pw-progress-fill"
                style={{ width: `${Math.min(100, (totalCalories / targets.calories) * 100)}%` }}
              />
            </div>
            <span className="pw-nutrient-sub">Target: ~2,200 kcal</span>
          </div>

          <div className="pw-nutrient-card">
            <div className="pw-nutrient-top">
              <span className="pw-nutrient-name">💪 {t.nutrient_protein || "Protein"}</span>
              <span className="pw-nutrient-val">{totalProtein} / {targets.protein} g</span>
            </div>
            <div className="pw-progress-bar">
              <div
                className="pw-progress-fill"
                style={{ width: `${Math.min(100, (totalProtein / targets.protein) * 100)}%`, background: "#38a169" }}
              />
            </div>
            <span className="pw-nutrient-sub">Target: ~68g for fetal growth</span>
          </div>

          <div className="pw-nutrient-card">
            <div className="pw-nutrient-top">
              <span className="pw-nutrient-name">🩸 {t.nutrient_iron || "Iron"}</span>
              <span className="pw-nutrient-val">{totalIron} / {targets.iron} mg</span>
            </div>
            <div className="pw-progress-bar">
              <div
                className="pw-progress-fill"
                style={{ width: `${Math.min(100, (totalIron / targets.iron) * 100)}%`, background: "#d69e2e" }}
              />
            </div>
            <span className="pw-nutrient-sub">Target: 27mg prevents anaemia</span>
          </div>

          <div className="pw-nutrient-card">
            <div className="pw-nutrient-top">
              <span className="pw-nutrient-name">🥛 {t.nutrient_calcium || "Calcium"}</span>
              <span className="pw-nutrient-val">{totalCalcium} / {targets.calcium} mg</span>
            </div>
            <div className="pw-progress-bar">
              <div
                className="pw-progress-fill"
                style={{ width: `${Math.min(100, (totalCalcium / targets.calcium) * 100)}%`, background: "#3182ce" }}
              />
            </div>
            <span className="pw-nutrient-sub">Target: 1,000mg for baby's bones</span>
          </div>

          <div className="pw-nutrient-card">
            <div className="pw-nutrient-top">
              <span className="pw-nutrient-name">🌱 {t.nutrient_folate || "Folate"}</span>
              <span className="pw-nutrient-val">{totalFolate} / {targets.folate} mcg</span>
            </div>
            <div className="pw-progress-bar">
              <div
                className="pw-progress-fill"
                style={{ width: `${Math.min(100, (totalFolate / targets.folate) * 100)}%`, background: "#805ad5" }}
              />
            </div>
            <span className="pw-nutrient-sub">Target: 500mcg neural tube health</span>
          </div>
        </div>

        <div style={{ marginTop: "14px", fontSize: "11px", color: "#80998c", fontStyle: "italic" }}>
          {t.nutrition_estimate_note ||
            "Note: Nutritional information is an estimated calculation based on standard food portions. Individual dietary requirements may vary."}
        </div>
      </div>

      {/* Reminders & Upcoming Appointments Preview */}
      <div className="pw-card">
        <div className="pw-card-header">
          <div>
            <h2>{t.upcoming_reminders_title || "Pending Medications & Appointments"}</h2>
            <p>{t.upcoming_reminders_sub || "Keep up with your doctor's prescribed supplements and antenatal checkups."}</p>
          </div>
          <button
            type="button"
            className="secondary-button"
            onClick={() => onNavigate("reminders")}
          >
            {t.view_all || "View All Reminders"} →
          </button>
        </div>

        {pendingReminders.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center", color: "#52796f" }}>
            ✓ {t.all_reminders_done || "All scheduled reminders for today are completed!"}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {pendingReminders.slice(0, 3).map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: item.type === "medication" ? "#fbf8f0" : "#f1f8f4",
                  border: "1px solid #e2ece5",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "20px" }}>{item.type === "medication" ? "💊" : "🩺"}</span>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#19382b" }}>{item.title}</strong>
                    <div style={{ fontSize: "11px", color: "#618676" }}>{item.time || item.due} · {item.notes}</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  style={{ padding: "6px 12px", fontSize: "11px" }}
                  onClick={() => onNavigate("reminders")}
                >
                  {t.btn_view || "View"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
