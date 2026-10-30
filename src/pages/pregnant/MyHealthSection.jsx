import { useState } from "react";

const COMMON_CONDITIONS = [
  "Anaemia (Low Haemoglobin)",
  "Gestational Diabetes (High Blood Sugar)",
  "Hypothyroidism",
  "Hyperthyroidism",
  "High Blood Pressure (Gestational Hypertension)",
  "History of Pre-eclampsia",
  "Urinary Tract Infection (UTI)",
  "Rh-Negative Blood Group",
  "Other Medical Condition",
];

export default function MyHealthSection({ user, t, healthRecords = [], onAddRecord }) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [conditionName, setConditionName] = useState(COMMON_CONDITIONS[0]);
  const [customCondition, setCustomCondition] = useState("");
  const [diagnosisStatus, setDiagnosisStatus] = useState("Confirmed by Healthcare Professional");
  const [diagnosisDate, setDiagnosisDate] = useState(new Date().toISOString().split("T")[0]);
  const [doctorOrHospital, setDoctorOrHospital] = useState("");
  const [prescribedMedication, setPrescribedMedication] = useState("");
  const [testResults, setTestResults] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const finalName = conditionName === "Other Medical Condition" && customCondition.trim()
      ? customCondition.trim()
      : conditionName;

    const newRecord = {
      id: `hlth_${Date.now()}`,
      userId: user?.id,
      condition: finalName,
      status: diagnosisStatus,
      diagnosisDate: diagnosisDate || "Not recorded",
      doctorOrHospital: doctorOrHospital.trim() || "Local Primary Health Centre",
      medication: prescribedMedication.trim() || "None prescribed",
      testResults: testResults.trim() || "Awaiting clinical tests",
      followUpDate: followUpDate || "Routine ANC schedule",
      createdAt: new Date().toLocaleDateString(),
    };

    onAddRecord(newRecord);
    setShowAddModal(false);

    // Reset
    setConditionName(COMMON_CONDITIONS[0]);
    setCustomCondition("");
    setDoctorOrHospital("");
    setPrescribedMedication("");
    setTestResults("");
    setFollowUpDate("");
  }

  return (
    <div>
      <div className="pw-card-header" style={{ marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px" }}>{t.my_health_title || "My Health & Clinical Records"}</h2>
          <p>{t.my_health_sub || "Keep track of confirmed medical diagnoses, lab tests, and doctor follow-up schedules."}</p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => setShowAddModal(true)}
        >
          + {t.btn_add_health_record || "Add Medical Record"}
        </button>
      </div>

      {/* Mandatory Medical Disclaimer Banner */}
      <div className="pw-disclaimer-banner" style={{ background: "#fefcbf", borderColor: "#ecc94b", color: "#744210" }}>
        <strong style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>
          ⚠️ {t.medical_disclaimer_title || "Official Medical & Clinical Disclaimer"}:
        </strong>
        {t.medical_disclaimer_text ||
          "This application does not diagnose medical conditions, generate treatment recommendations, or prescribe medications. All maternal care must be evaluated, diagnosed, and supervised by qualified healthcare professionals or government health officers. Please share these logged records with your ASHA worker or doctor during your regular checkup."}
      </div>

      {/* Health Conditions List */}
      {healthRecords.length === 0 ? (
        <div className="pw-card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: "38px", marginBottom: "10px" }}>🩺</div>
          <h3 style={{ margin: "0 0 6px", color: "#19382b" }}>{t.no_health_records || "No health conditions logged yet"}</h3>
          <p style={{ color: "#547567", fontSize: "13px", maxWidth: "460px", margin: "0 auto 18px", lineHeight: "1.6" }}>
            {t.no_health_sub || "Recording conditions like Anaemia or Gestational Diabetes helps your ASHA worker monitor high-risk factors early."}
          </p>
          <button
            type="button"
            className="primary-button"
            onClick={() => setShowAddModal(true)}
          >
            + {t.btn_record_first_condition || "Log a Health Record"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {healthRecords.map((item) => (
            <div key={item.id} className="pw-card" style={{ marginBottom: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: "17px", color: "#1b4332" }}>{item.condition}</h3>
                  <span style={{ fontSize: "12px", color: "#52796f" }}>
                    Diagnosed on: <strong>{item.diagnosisDate}</strong> · Hospital / Clinic: <strong>{item.doctorOrHospital}</strong>
                  </span>
                </div>
                <span
                  className={`status-pill ${item.status.includes("Confirmed") ? "on-track" : "review"}`}
                  style={{ fontSize: "11px" }}
                >
                  {item.status.includes("Confirmed") ? "✓ Confirmed by Doctor" : "○ Self-Reported"}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", background: "#f8fbf9", padding: "14px", borderRadius: "12px", border: "1px solid #e3ede6" }}>
                <div>
                  <span style={{ fontSize: "10px", color: "#749386", textTransform: "uppercase", fontWeight: "700" }}>Prescribed Medication</span>
                  <strong style={{ display: "block", fontSize: "13px", color: "#19382b", marginTop: "2px" }}>{item.medication}</strong>
                </div>

                <div>
                  <span style={{ fontSize: "10px", color: "#749386", textTransform: "uppercase", fontWeight: "700" }}>Test Dates & Clinical Results</span>
                  <strong style={{ display: "block", fontSize: "13px", color: "#19382b", marginTop: "2px" }}>{item.testResults}</strong>
                </div>

                <div>
                  <span style={{ fontSize: "10px", color: "#749386", textTransform: "uppercase", fontWeight: "700" }}>Next Follow-up Due</span>
                  <strong style={{ display: "block", fontSize: "13px", color: "#2d6a4f", marginTop: "2px" }}>{item.followUpDate}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Health Record Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" style={{ maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>{t.log_health_title || "Record Medical Condition or Test"}</h3>
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
                  {t.label_condition || "Medical Condition / Diagnosis"}
                  <select value={conditionName} onChange={(e) => setConditionName(e.target.value)}>
                    {COMMON_CONDITIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>

              {conditionName === "Other Medical Condition" && (
                <div className="pw-form-full">
                  <label>
                    Specify Condition Name
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asthma, Epilepsy, Hepatitis B"
                      value={customCondition}
                      onChange={(e) => setCustomCondition(e.target.value)}
                    />
                  </label>
                </div>
              )}

              <div>
                <label>
                  {t.label_diagnosis_status || "Diagnosis Status"}
                  <select value={diagnosisStatus} onChange={(e) => setDiagnosisStatus(e.target.value)}>
                    <option value="Confirmed by Healthcare Professional">Confirmed by Healthcare Professional</option>
                    <option value="Self-reported / Suspected">Self-reported / Suspected</option>
                  </select>
                </label>
              </div>

              <div>
                <label>
                  {t.label_diagnosis_date || "Diagnosis Date"}
                  <input
                    type="date"
                    value={diagnosisDate}
                    onChange={(e) => setDiagnosisDate(e.target.value)}
                  />
                </label>
              </div>

              <div className="pw-form-full">
                <label>
                  {t.label_doctor_or_hospital || "Doctor, Health Worker, or Hospital Name"}
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sudha - Channapatna General Hospital / PHC"
                    value={doctorOrHospital}
                    onChange={(e) => setDoctorOrHospital(e.target.value)}
                  />
                </label>
              </div>

              <div className="pw-form-full">
                <label>
                  {t.label_medication || "Current Prescribed Medication (by doctor)"}
                  <input
                    type="text"
                    placeholder="e.g. Tab Thyroxine 50mcg empty stomach; IFA tablet twice daily"
                    value={prescribedMedication}
                    onChange={(e) => setPrescribedMedication(e.target.value)}
                  />
                </label>
              </div>

              <div>
                <label>
                  {t.label_test_results || "Recent Lab Test & Result"}
                  <input
                    type="text"
                    placeholder="e.g. Hb 10.2 g/dL (24 Oct) or TSH 2.6 mIU/L"
                    value={testResults}
                    onChange={(e) => setTestResults(e.target.value)}
                  />
                </label>
              </div>

              <div>
                <label>
                  {t.label_followup_date || "Next Doctor Follow-up Date"}
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
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
                  {t.btn_save_record || "Save Health Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
