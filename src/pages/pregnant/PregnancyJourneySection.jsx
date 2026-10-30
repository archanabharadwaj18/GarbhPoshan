import { useState } from "react";

const WEEKS_DATA = {
  8: {
    fruit: "Raspberry (1.6 cm)",
    baby: "Baby's tiny webbed fingers and toes are forming. The neural tube has closed, and the little heart is beating at around 150 beats per minute.",
    mother: "Morning sickness or nausea may peak. You may feel more tired than usual as your body creates the placenta.",
    nutritionTip: "Eat small, frequent meals. Ginger or dry toast helps with nausea. Continue daily 400mcg Folic Acid tablets.",
  },
  12: {
    fruit: "Plum (5.4 cm)",
    baby: "All major internal organs are formed. Reflexes are developing, and your baby can open and close tiny fingers.",
    mother: "End of First Trimester! Morning sickness often starts reducing. Your uterus is expanding above the pubic bone.",
    nutritionTip: "Ensure adequate hydration. Drink 8-10 glasses of water daily, along with tender coconut or buttermilk.",
  },
  14: {
    fruit: "Lemon (8.7 cm)",
    baby: "Welcome to the Second Trimester! Baby can make facial expressions and swallow small amounts of amniotic fluid.",
    mother: "Energy levels usually return. Your baby bump may start to gently show.",
    nutritionTip: "Start your daily Iron and Folic Acid (IFA) supplement as prescribed by your ASHA worker or doctor. Add green leafy vegetables.",
  },
  18: {
    fruit: "Bell Pepper (14 cm)",
    baby: "Baby's ears are in position and can hear muted sounds of your heartbeat. Lanugo (fine hair) covers the body.",
    mother: "You might feel slight flutterings ('quickening'). Your blood volume is expanding significantly.",
    nutritionTip: "Calcium is crucial now for baby's bone mineralisation. Include milk, curd, ragi, or paneer daily.",
  },
  24: {
    fruit: "Corn on the Cob (30 cm)",
    baby: "Baby's lungs are forming branches of the respiratory tree. Taste buds are developing.",
    mother: "You may feel strong kicks! Check your blood pressure and screening for gestational diabetes (OGTT) around this time.",
    nutritionTip: "Maintain balanced carbohydrates and avoid refined sweets to keep blood sugar steady.",
  },
  28: {
    fruit: "Eggplant / Aubergine (37 cm)",
    baby: "Welcome to the Third Trimester! Baby can open and close their eyes and perceive light and dark.",
    mother: "Backache or mild shortness of breath may occur as the baby presses upwards on the diaphragm.",
    nutritionTip: "Focus on lean proteins (dals, boiled eggs, sprouted pulses) to support baby's rapid muscle and tissue growth.",
  },
  32: {
    fruit: "Coconut (42 cm)",
    baby: "Baby is practicing breathing movements and accumulating subcutaneous fat under the skin.",
    mother: "Braxton Hicks contractions (mild false practice pains) might be noticed. Ensure adequate rest.",
    nutritionTip: "Keep bowel movements smooth by eating fibre-rich foods like whole grains, vegetables, and drinking warm fluids.",
  },
  36: {
    fruit: "Papaya (47 cm)",
    baby: "Baby is almost fully mature and may turn into the head-down position for birth.",
    mother: "Pelvic pressure increases. Pack your hospital bag and review your delivery arrangement at the government PHC or hospital.",
    nutritionTip: "Stay well-nourished with easily digestible warm foods. Keep emergency contact numbers handy.",
  },
};

export default function PregnancyJourneySection({ user, t }) {
  const currentWeek = user?.week || 14;
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const trimester = selectedWeek <= 13 ? 1 : selectedWeek <= 27 ? 2 : 3;

  // Closest available week data
  const weekKeys = Object.keys(WEEKS_DATA).map(Number);
  const closestWeekKey = weekKeys.reduce((prev, curr) =>
    Math.abs(curr - selectedWeek) < Math.abs(prev - selectedWeek) ? curr : prev
  );
  const weekInfo = WEEKS_DATA[closestWeekKey];

  return (
    <div>
      <div className="pw-card-header">
        <div>
          <h2 style={{ fontSize: "22px" }}>{t.pregnancy_journey_title || "My Pregnancy Journey"}</h2>
          <p>{t.pregnancy_journey_sub || "Follow your baby's growth and learn how to care for your body week by week."}</p>
        </div>
      </div>

      {/* Week Selector Bar */}
      <div className="pw-card" style={{ padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <strong style={{ fontSize: "16px", color: "#19382b" }}>
              {t.week || "Week"} {selectedWeek} of 40
            </strong>
            <span style={{ marginLeft: "10px", fontSize: "12px", color: "#2d6a4f", fontWeight: "700", background: "#d8f3dc", padding: "3px 10px", borderRadius: "10px" }}>
              {trimester === 1
                ? (t.trimester_first || "1st Trimester")
                : trimester === 2
                ? (t.trimester_second || "2nd Trimester")
                : (t.trimester_third || "3rd Trimester")}
            </span>
          </div>

          {selectedWeek !== currentWeek && (
            <button
              type="button"
              className="text-button"
              onClick={() => setSelectedWeek(currentWeek)}
              style={{ fontSize: "12px" }}
            >
              ← Back to My Current Week ({currentWeek})
            </button>
          )}
        </div>

        <input
          type="range"
          min="4"
          max="40"
          step="1"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#2d6a4f", cursor: "pointer", height: "8px" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#618676", marginTop: "6px" }}>
          <span>Week 4 (Conception)</span>
          <span>Week 13 (End 1st Tri)</span>
          <span>Week 27 (End 2nd Tri)</span>
          <span>Week 40 (Full Term)</span>
        </div>
      </div>

      {/* Week Specific Development Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Baby Development */}
        <div className="pw-card" style={{ marginBottom: 0, borderTop: "4px solid #40916c" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{ fontSize: "28px" }}>👶</div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", color: "#1b4332" }}>{t.baby_development || "Baby's Development"}</h3>
              <small style={{ color: "#52796f", fontWeight: "700" }}>Size: ~{weekInfo.fruit}</small>
            </div>
          </div>
          <p style={{ fontSize: "13px", lineHeight: "1.7", color: "#2d4d3f", margin: 0 }}>
            {weekInfo.baby}
          </p>
        </div>

        {/* Mother's Changes */}
        <div className="pw-card" style={{ marginBottom: 0, borderTop: "4px solid #52b788" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{ fontSize: "28px" }}>🌸</div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", color: "#1b4332" }}>{t.mom_changes || "What Mom Experiences"}</h3>
              <small style={{ color: "#52796f", fontWeight: "700" }}>Gestational week {selectedWeek}</small>
            </div>
          </div>
          <p style={{ fontSize: "13px", lineHeight: "1.7", color: "#2d4d3f", margin: 0 }}>
            {weekInfo.mother}
          </p>
        </div>

        {/* Nutrition Advice for this Week */}
        <div className="pw-card" style={{ marginBottom: 0, borderTop: "4px solid #e9c46a", background: "#fefdfa" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{ fontSize: "28px" }}>🥗</div>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", color: "#805b10" }}>{t.nutrition_focus || "Nutrition Focus"}</h3>
              <small style={{ color: "#9c6f19", fontWeight: "700" }}>Recommended by Health Workers</small>
            </div>
          </div>
          <p style={{ fontSize: "13px", lineHeight: "1.7", color: "#47340d", margin: 0 }}>
            {weekInfo.nutritionTip}
          </p>
        </div>
      </div>

      {/* Trimester Overview Milestones */}
      <div className="pw-card">
        <h3 style={{ margin: "0 0 16px", fontSize: "17px", color: "#19382b" }}>
          {t.trimester_milestones || "Three Trimesters Overview"}
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
          <div style={{ padding: "16px", borderRadius: "14px", background: trimester === 1 ? "#edf7f1" : "#fafcfb", border: trimester === 1 ? "2px solid #52b788" : "1px solid #e2ece5" }}>
            <div style={{ fontSize: "20px", marginBottom: "6px" }}>🌱</div>
            <strong style={{ fontSize: "14px", color: "#1b4332" }}>First Trimester (Wks 1–13)</strong>
            <p style={{ fontSize: "12px", color: "#547567", lineHeight: "1.6", marginTop: "6px" }}>
              Vital organs and spinal cord form. Focus on early registration at Anganwadi / Sub-Centre, taking daily Folic Acid, and managing morning sickness with small frequent meals.
            </p>
          </div>

          <div style={{ padding: "16px", borderRadius: "14px", background: trimester === 2 ? "#edf7f1" : "#fafcfb", border: trimester === 2 ? "2px solid #52b788" : "1px solid #e2ece5" }}>
            <div style={{ fontSize: "20px", marginBottom: "6px" }}>✨</div>
            <strong style={{ fontSize: "14px", color: "#1b4332" }}>Second Trimester (Wks 14–27)</strong>
            <p style={{ fontSize: "12px", color: "#547567", lineHeight: "1.6", marginTop: "6px" }}>
              Baby's skeleton hardens and movements begin. Focus on daily IFA tablets, calcium supplements (never taken together with iron), anomaly ultrasound scan, and tetanus (Td) immunisation.
            </p>
          </div>

          <div style={{ padding: "16px", borderRadius: "14px", background: trimester === 3 ? "#edf7f1" : "#fafcfb", border: trimester === 3 ? "2px solid #52b788" : "1px solid #e2ece5" }}>
            <div style={{ fontSize: "20px", marginBottom: "6px" }}>🤱</div>
            <strong style={{ fontSize: "14px", color: "#1b4332" }}>Third Trimester (Wks 28–40)</strong>
            <p style={{ fontSize: "12px", color: "#547567", lineHeight: "1.6", marginTop: "6px" }}>
              Rapid brain and lung maturity. Focus on balanced protein foods, monitoring daily fetal kicks, arranging institutional delivery transport (108 / 102), and learning danger signs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
