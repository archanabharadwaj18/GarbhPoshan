import { useState, useEffect } from "react";

const initialFollowUps = [
  { id: "FU001", name: "Kavya", reason: "Meal record needs verification", due: "Today", status: "Pending" },
  { id: "FU002", name: "Meera", reason: "Schedule a counselling visit", due: "Tomorrow", status: "Pending" },
  { id: "FU003", name: "Divya", reason: "Review recent meal history", due: "This week", status: "Completed" },
  { id: "FU004", name: "Ananya", reason: "Confirm meal portion details", due: "This week", status: "Pending" },
];

export default function FollowUps({ t = {} }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("poshan_followups");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return initialFollowUps;
  });

  const [filter, setFilter] = useState("All");

  useEffect(() => {
    try {
      localStorage.setItem("poshan_followups", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const visibleItems = items.filter((item) =>
    filter === "All" || item.status === filter
  );

  function toggleStatus(id) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Pending" ? "Completed" : "Pending" }
          : item
      )
    );
  }

  const pendingCount = items.filter((item) => item.status === "Pending").length;

  return (
    <section className="panel page-panel">
      <div className="panel-heading">
        <div>
          <h2>{t.followup_heading || "Follow-up tracker"}</h2>
          <p>{t.followup_subheading || "Track counselling and record-review tasks for your beneficiaries."}</p>
        </div>
        <span className="record-count">
          {pendingCount} {t.followup_pending_count || "pending"}
        </span>
      </div>

      <div className="page-filters">
        <select className="page-input" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">{t.status_all || "All"}</option>
          <option value="Pending">{t.status_pending || "Pending"}</option>
          <option value="Completed">{t.status_completed || "Completed"}</option>
        </select>
      </div>

      <div className="followup-list">
        {visibleItems.map((item) => (
          <div className="followup-row" key={item.id}>
            <div className="followup-mark">{item.status === "Completed" ? "✓" : "!"}</div>
            <div className="followup-details">
              <strong>{item.name}</strong>
              <p>{item.reason}</p>
              <span>{item.due}</span>
            </div>
            <div className="followup-actions">
              <span className={`status-pill ${item.status === "Completed" ? "on-track" : "review"}`}>
                {item.status === "Completed"
                  ? (t.status_completed || "Completed")
                  : (t.status_pending || "Pending")}
              </span>
              <button className="text-button" onClick={() => toggleStatus(item.id)}>
                {item.status === "Pending"
                  ? (t.btn_mark_completed || "Mark completed")
                  : (t.btn_reopen || "Reopen")}
              </button>
            </div>
          </div>
        ))}
        {visibleItems.length === 0 && (
          <p className="empty-state">{t.followup_empty || "No tasks in this category."}</p>
        )}
      </div>

      <p className="page-hint">
        {t.followup_hint || "Task changes currently remain in browser memory and local storage."}
      </p>
    </section>
  );
}
