
import { useState } from "react";

const initialFollowUps = [
  { id: "FU001", name: "Kavya", reason: "Meal record needs verification", due: "Today", status: "Pending" },
  { id: "FU002", name: "Meera", reason: "Schedule a counselling visit", due: "Tomorrow", status: "Pending" },
  { id: "FU003", name: "Divya", reason: "Review recent meal history", due: "This week", status: "Completed" },
  { id: "FU004", name: "Ananya", reason: "Confirm meal portion details", due: "This week", status: "Pending" },
];

export default function FollowUps() {
  const [items, setItems] = useState(initialFollowUps);
  const [filter, setFilter] = useState("All");

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

  return (
    <section className="panel page-panel">
      <div className="panel-heading">
        <div>
          <h2>Follow-up tracker</h2>
          <p>Track counselling and record-review tasks for your beneficiaries.</p>
        </div>
        <span className="record-count">
          {items.filter((item) => item.status === "Pending").length} pending
        </span>
      </div>

      <div className="page-filters">
        <select className="page-input" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
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
                {item.status}
              </span>
              <button className="text-button" onClick={() => toggleStatus(item.id)}>
                {item.status === "Pending" ? "Mark completed" : "Reopen"}
              </button>
            </div>
          </div>
        ))}
        {visibleItems.length === 0 && <p className="empty-state">No tasks in this category.</p>}
      </div>

      <p className="page-hint">Task changes currently remain in browser memory only. Permanent storage will be added with the backend.</p>
    </section>
  );
}
