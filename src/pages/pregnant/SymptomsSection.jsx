import { useState } from "react";

const COMMON_SYMPTOMS = [
  "Nausea / Morning Sickness",
  "Vomiting",
  "Fatigue / Excessive Tiredness",
  "Mild Headache",
  "Swelling in Feet or Ankles",
  "Abdominal Discomfort / Cramping",
  "Heartburn / Acidity",
  "Back Pain",
  "Constipation",
  "Dizziness / Lightheadedness",
  "Other Symptom",
];

export default function SymptomsSection({ user, t, symptoms = [], onAddSymptom }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [symptomName, setSymptomName] = useState(COMMON_SYMPTOMS[0]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [severity, setSeverity] = useState("Mild");
  const [notes, setNotes] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const finalName = symptomName === "Other Symptom" && customSymptom.trim()
      ? customSymptom.trim()
      : symptomName;

    const newSymptom = {
      id: `symp_${Date.now()}`,
      userId: user?.id,
      name: finalName,
      severity,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      notes: notes.trim() || "No additional notes",
    };

    onAddSymptom(newSymptom);
    setShowAddModal(false);
    setSymptomName(COMMON_SYMPTOMS[0]);
    setCustomSymptom("");
    setSeverity("Mild");
    setNotes("");
  }

  return (
    <div>
      {/* Emergency Red Flags Card */}
      <div className="pw-emergency-card">
        <div className="pw-emergency-title">
          <span>🚨</span>
          <span>{t.urgent_care_warning_title || "URGENT DANGER SIGNS (Seek Immediate Emergency Care)"}</span>
        </div>
        <p style={{ fontSize: "12px", color: "#742a2a", margin: "0 0 10px", lineHeight: "1.6" }}>
          {t.urgent_care_warning_desc ||
            "If you or your family notice ANY of the following danger signs, do NOT wait. Go to the nearest Hospital or Community Health Centre immediately:"}
        </p>

        <ul className="pw-emergency-list">
          <li><strong>Vaginal bleeding</strong> or leaking of watery fluid</li>
          <li><strong>Severe abdominal pain</strong> or constant severe cramping</li>
          <li><strong>Severe headache with blurred vision</strong> or seeing spots</li>
          <li><strong>High fever</strong> with chills or shivering</li>
          <li><strong>Difficulty breathing</strong> or chest tightness</li>
          <li><strong>Convulsions or seizures</strong> (fits)</li>
          <li><strong>Sudden severe swelling</strong> of face, eyelids, or hands</li>
          <li><strong>Reduced fetal movement</strong> (baby kicking much less than usual)</li>
        </ul>

        <div className="pw-emergency-contacts">
          <a href="tel:108" className="pw-call-btn">
            📞 {t.call_108_btn || "Call 108 (Free Ambulance)"}
          </a>
          <a href="tel:102" className="pw-call-btn" style={{ background: "#9b2c2c" }}>
            🚑 {t.call_102_btn || "Call 102 (Janani Maternal Transport)"}
          </a>
          {user?.assignedAsha && (
            <a href="tel:9876500001" className="pw-call-btn" style={{ background: "#2d6a4f" }}>
              🩺 Call ASHA Worker ({user.assignedAsha.split("(")[0]})
            </a>
          )}
        </div>
      </div>

      {/* Routine Symptoms Header */}
      <div className="pw-card-header" style={{ marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px" }}>{t.symptoms_journal_title || "Symptoms and Health Journal"}</h2>
          <p>{t.symptoms_journal_sub || "Log daily pregnancy symptoms to discuss during your ASHA home visits or doctor checkups."}</p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => setShowAddModal(true)}
        >
          + {t.btn_log_symptom || "Log a Symptom"}
        </button>
      </div>

      {/* Symptom Log Disclaimer */}
      <div className="pw-disclaimer-banner">
        <strong>⚠️ {t.clinical_note || "Clinical Note"}:</strong>{" "}
        {t.symptom_disclaimer ||
          "Logging symptoms in Poshan Care is for personal tracking and communication with health workers. It does not automatically diagnose or rule out complications. If you feel unwell or uncertain, always contact your health centre."}
      </div>

      {/* History of Recorded Symptoms */}
      {symptoms.length === 0 ? (
        <div className="pw-card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>🌸</div>
          <h3 style={{ margin: "0 0 6px", color: "#19382b" }}>{t.no_symptoms_logged || "No symptoms recorded"}</h3>
          <p style={{ color: "#547567", fontSize: "13px", maxWidth: "420px", margin: "0 auto 16px" }}>
            {t.no_symptoms_sub || "Feeling nauseous, tired, or having heartburn? Log your symptoms to help your ASHA worker give personalized guidance."}
          </p>
          <button
            type="button"
            className="primary-button"
            onClick={() => setShowAddModal(true)}
          >
            + {t.btn_log_first_symptom || "Record First Symptom"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {symptoms.map((s) => (
            <div key={s.id} className="pw-card" style={{ marginBottom: 0, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <strong style={{ fontSize: "16px", color: "#19382b" }}>{s.name}</strong>
                    <span
                      className={`status-pill ${
                        s.severity === "Severe"
                          ? "follow-up"
                          : s.severity === "Moderate"
                          ? "review"
                          : "on-track"
                      }`}
                      style={{ fontSize: "10px" }}
                    >
                      {s.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#547567" }}>{s.notes}</div>
                </div>

                <div style={{ fontSize: "11px", color: "#749386", textAlign: "right" }}>
                  <div>{s.date}</div>
                  <div>{s.time}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Symptom Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" style={{ maxWidth: "520px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>{t.log_symptom_modal_title || "Record Symptom"}</h3>
              <button
                type="button"
                className="text-button"
                onClick={() => setShowAddModal(false)}
                style={{ fontSize: "18px" }}
              >
                ✕
              </button>
            </div>

            <form className="pw-form" onSubmit={handleSubmit}>
              <div className="pw-form-full">
                <label>
                  {t.label_symptom_type || "Select Symptom"}
                  <select value={symptomName} onChange={(e) => setSymptomName(e.target.value)}>
                    {COMMON_SYMPTOMS.map((sym) => (
                      <option key={sym} value={sym}>{sym}</option>
                    ))}
                  </select>
                </label>
              </div>

              {symptomName === "Other Symptom" && (
                <div className="pw-form-full">
                  <label>
                    Specify Symptom
                    <input
                      type="text"
                      required
                      placeholder="e.g. Skin itching, Leg cramps at night"
                      value={customSymptom}
                      onChange={(e) => setCustomSymptom(e.target.value)}
                    />
                  </label>
                </div>
              )}

              <div className="pw-form-full">
                <label>
                  {t.label_severity || "Severity Level"}
                  <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
                    <option value="Mild">Mild (Noticeable but does not affect daily chores)</option>
                    <option value="Moderate">Moderate (Uncomfortable, need to rest)</option>
                    <option value="Severe">Severe (Affects eating or moving - Consult doctor if persists)</option>
                  </select>
                </label>
              </div>

              <div className="pw-form-full">
                <label>
                  {t.label_notes_triggers || "Description / Triggers"}
                  <textarea
                    rows={3}
                    placeholder="e.g. Happened after morning tea; felt dizzy when standing up quickly."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>
              </div>

              <div className="pw-form-full" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowAddModal(false)}
                >
                  {t.btn_cancel || "Cancel"}
                </button>
                <button type="submit" className="primary-button">
                  {t.btn_save_symptom || "Save Symptom Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
