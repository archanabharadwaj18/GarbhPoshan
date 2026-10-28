import { useState } from "react";

export default function Beneficiaries({ people, setPeople }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [newPerson, setNewPerson] = useState({
    name: "",
    age: "",
    week: "",
    phone: "",
  });

  const filtered = people.filter((p) =>
    `${p.name} ${p.id}`.toLowerCase().includes(search.toLowerCase()) &&
    (status === "All" || p.status === status)
  );

  if (showForm) {
    return (
      <section className="panel page-panel">
        <div className="panel-heading">
          <div>
            <h2>Add Beneficiary</h2>
            <p>Register a beneficiary for maternal nutrition tracking.</p>
          </div>

          <button
            className="secondary-button profile-back"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>

        <form
          className="beneficiary-form"
          onSubmit={(event) => {
            event.preventDefault();

            const person = {
              id: `MN${String(people.length + 1).padStart(3, "0")}`,
              name: newPerson.name.trim(),
              age: Number(newPerson.age),
              week: Number(newPerson.week),
              phone: newPerson.phone.trim(),
              meals: 0,
              status: "On Track",
            };

            setPeople((prev) => [...prev, person]);
            setSearch("");
            setStatus("All");
            setNewPerson({ name: "", age: "", week: "", phone: "" });
            setShowForm(false);
          }}
        >
          <label>
            Beneficiary name
            <input
              required
              minLength={2}
              value={newPerson.name}
              onChange={(e) =>
                setNewPerson({ ...newPerson, name: e.target.value })
              }
              placeholder="Enter full name"
            />
          </label>

          <label>
            Age
            <input
              required
              type="number"
              min="10"
              max="60"
              value={newPerson.age}
              onChange={(e) =>
                setNewPerson({ ...newPerson, age: e.target.value })
              }
              placeholder="Age in years"
            />
          </label>

          <label>
            Pregnancy week
            <input
              required
              type="number"
              min="1"
              max="42"
              value={newPerson.week}
              onChange={(e) =>
                setNewPerson({ ...newPerson, week: e.target.value })
              }
              placeholder="1–42"
            />
          </label>

          <label>
            Contact number
            <input
              required
              type="tel"
              pattern="[0-9]{10}"
              value={newPerson.phone}
              onChange={(e) =>
                setNewPerson({ ...newPerson, phone: e.target.value })
              }
              placeholder="10-digit mobile number"
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Save beneficiary
            </button>
          </div>
        </form>
      </section>
    );
  }

  if (selected) {
    return (
      <section className="panel page-panel">
        <div className="panel-heading">
          <div>
            <h2>{selected.name}</h2>
            <p>Beneficiary profile · {selected.id}</p>
          </div>
          <button className="secondary-button profile-back" onClick={() => setSelected(null)}>
            ← Back to list
          </button>
        </div>
        <div className="profile-details">
          <div><span>Age</span><strong>{selected.age} years</strong></div>
          <div><span>Pregnancy</span><strong>Week {selected.week}</strong></div>
          <div><span>Trimester</span><strong>{selected.week <= 13 ? "First" : selected.week <= 27 ? "Second" : "Third"}</strong></div>
          <div><span>Meals recorded</span><strong>{selected.meals}</strong></div>
          <div><span>Record status</span><strong>{selected.status}</strong></div>
        </div>
        <p className="page-hint">
          This is sample profile data. Meal history and verified health information will be connected later.
        </p>
      </section>
    );
  }

  return (
    <section className="panel page-panel">
      <div className="panel-heading">
        <div>
          <h2>Beneficiary directory</h2>
          <p>Search and review your assigned beneficiaries.</p>
        </div>
        <div className="directory-actions">
          <span className="record-count">{filtered.length} records</span>
          <button
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            + Add Beneficiary
          </button>
        </div>
      </div>

      <div className="page-filters">
        <input
          className="page-input"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="page-input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>
          <option>On Track</option>
          <option>Review</option>
          <option>Follow-up</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>BENEFICIARY</th><th>PREGNANCY</th><th>MEALS</th><th>STATUS</th><th>ACTION</th></tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong><span className="cell-muted">{p.id} · {p.age} years</span></td>
                <td>Week {p.week}<span className="cell-muted">{p.week <= 13 ? "First" : p.week <= 27 ? "Second" : "Third"} trimester</span></td>
                <td>{p.meals}</td>
                <td><span className={`status-pill ${p.status.toLowerCase().replace(" ", "-")}`}>{p.status}</span></td>
                <td><button className="text-button" onClick={() => setSelected(p)}>View profile →</button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="5" className="empty-state">No matching beneficiaries found.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}