import { useState } from "react";

export default function RemindersSection({
  user,
  t,
  reminders = [],
  onToggleReminder,
  onAddReminder,
}) {
  const [filterType, setFilterType] = useState("all"); // "all" | "medication" | "anc" | "test"
  const [showAddModal, setShowAddModal] = useState(false);

  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderType, setReminderType] = useState("medication");
  const [timeOrDate, setTimeOrDate] = useState("After breakfast");
  const [notes, setNotes] = useState("");

  const filtered = reminders.filter((r) => {
    if (filterType === "all") return true;
    return r.type === filterType;
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!reminderTitle.trim()) return;

    const newReminder = {
      id: `rem_${Date.now()}`,
      userId: user?.id,
      title: reminderTitle.trim(),
      type: reminderType,
      time: timeOrDate,
      notes: notes.trim() || "Prescribed by healthcare provider",
      completed: false,
    };

    onAddReminder(newReminder);
    setShowAddModal(false);
    setReminderTitle("");
    setReminderType("medication");
    setTimeOrDate("After breakfast");
    setNotes("");
  }

  const completedCount = reminders.filter((r) => r.completed).length;

  return (
    <div>
      <div className="pw-card-header" style={{ marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px" }}>{t.reminders_heading || "Medication & Appointment Reminders"}</h2>
          <p>{t.reminders_sub || "Keep track of doctor-prescribed supplements, maternal tetanus immunisation, and ANC visits."}</p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => setShowAddModal(true)}
        >
          + {t.btn_add_reminder || "Add Reminder"}
        </button>
      </div>

      <div className="pw-disclaimer-banner">
        <strong>⚠️ {t.reminder_disclaimer_title || "Prescription Disclaimer"}:</strong>{" "}
        {t.reminder_disclaimer_text ||
          "Only track medications and supplements that have been officially prescribed or recommended by qualified doctors or auxiliary nurse midwives (ANMs). Poshan Care does not recommend or prescribe drug dosages."}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", flexWrap: "wrap", gap: "10px" }}>
        <div className="auth-tabs" style={{ maxWidth: "420px", margin: 0 }}>
          <button
            type="button"
            className={`auth-tab ${filterType === "all" ? "active" : ""}`}
            onClick={() => setFilterType("all")}
          >
            All ({reminders.length})
          </button>
          <button
            type="button"
            className={`auth-tab ${filterType === "medication" ? "active" : ""}`}
            onClick={() => setFilterType("medication")}
          >
            💊 Pills & Supplements
          </button>
          <button
            type="button"
            className={`auth-tab ${filterType === "anc" ? "active" : ""}`}
            onClick={() => setFilterType("anc")}
          >
            🩺 Doctor / ANC
          </button>
        </div>

        <span style={{ fontSize: "12px", color: "#2d6a4f", fontWeight: "700" }}>
          {completedCount} of {reminders.length} {t.completed_label || "completed"}
        </span>
      </div>

      {/* Reminders List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            className="pw-card"
            style={{
              marginBottom: 0,
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "14px",
              background: item.completed ? "#f7faf8" : "#ffffff",
              border: item.completed ? "1px solid #d2e7dc" : "1px solid #e1eee5",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: "220px" }}>
              <button
                type="button"
                onClick={() => onToggleReminder(item.id)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: item.completed ? "2px solid #2d6a4f" : "2px solid #a3c4b5",
                  background: item.completed ? "#2d6a4f" : "transparent",
                  color: "#ffffff",
                  fontSize: "14px",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                aria-label="Toggle completion status"
              >
                {item.completed ? "✓" : ""}
              </button>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <strong
                    style={{
                      fontSize: "15px",
                      color: item.completed ? "#6c8c7f" : "#19382b",
                      textDecoration: item.completed ? "line-through" : "none",
                    }}
                  >
                    {item.title}
                  </strong>
                  <span
                    className={`status-pill ${item.type === "medication" ? "on-track" : "review"}`}
                    style={{ fontSize: "9px" }}
                  >
                    {item.type === "medication" ? "Daily Supplement" : "Clinic Appointment"}
                  </span>
                </div>
                <div style={{ fontSize: "12px", color: "#547567", marginTop: "3px" }}>
                  ⏰ <strong>{item.time}</strong> · {item.notes}
                </div>
              </div>
            </div>

            <button
              type="button"
              className={item.completed ? "secondary-button" : "primary-button"}
              style={{ padding: "8px 14px", fontSize: "11px", whiteSpace: "nowrap" }}
              onClick={() => onToggleReminder(item.id)}
            >
              {item.completed ? (t.btn_mark_pending || "Reopen") : (t.btn_done || "Mark Taken / Done")}
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="pw-card" style={{ textAlign: "center", padding: "30px" }}>
            <p style={{ color: "#618676", fontSize: "13px" }}>No reminders found in this category.</p>
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" style={{ maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>{t.add_reminder_title || "Schedule Medication or Visit"}</h3>
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
                  Reminder Type
                  <select value={reminderType} onChange={(e) => setReminderType(e.target.value)}>
                    <option value="medication">Daily Medicine / Supplement (IFA, Calcium, etc.)</option>
                    <option value="anc">Antenatal Check-up (ANC) with Doctor / ANM</option>
                    <option value="test">Diagnostic Test / Blood Screening / Scan</option>
                  </select>
                </label>
              </div>

              <div className="pw-form-full">
                <label>
                  Reminder Title
                  <input
                    type="text"
                    required
                    placeholder="e.g. Iron & Folic Acid Tablet, ANC 2 Visit at PHC"
                    value={reminderTitle}
                    onChange={(e) => setReminderTitle(e.target.value)}
                  />
                </label>
              </div>

              <div className="pw-form-full">
                <label>
                  Schedule / Timing
                  <input
                    type="text"
                    required
                    placeholder="e.g. After lunch with water; Thursday 10:00 AM"
                    value={timeOrDate}
                    onChange={(e) => setTimeOrDate(e.target.value)}
                  />
                </label>
              </div>

              <div className="pw-form-full">
                <label>
                  Doctor's Instructions / Notes
                  <input
                    type="text"
                    placeholder="e.g. Do not take with tea or milk"
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
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
