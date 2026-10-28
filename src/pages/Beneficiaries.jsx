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

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState("");

  const filtered = people.filter((p) =>
    `${p.name} ${p.id}`.toLowerCase().includes(search.toLowerCase()) &&
    (status === "All" || p.status === status)
  );

  function validateForm() {
    const errs = {};
    const trimmedName = newPerson.name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      errs.name = "Name must be at least 2 characters long.";
    }

    const ageNum = Number(newPerson.age);
    if (!newPerson.age || isNaN(ageNum) || ageNum < 10 || ageNum > 60) {
      errs.age = "Age must be between 10 and 60 years.";
    }

    const weekNum = Number(newPerson.week);
    if (!newPerson.week || isNaN(weekNum) || weekNum < 1 || weekNum > 42) {
      errs.week = "Pregnancy week must be between 1 and 42.";
    }

    const phoneTrimmed = newPerson.phone.trim();
    if (!/^[0-9]{10}$/.test(phoneTrimmed)) {
      errs.phone = "Contact number must be exactly 10 digits.";
    }

    return errs;
  }

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
            onClick={() => {
              setShowForm(false);
              setErrors({});
            }}
          >
            Cancel
          </button>
        </div>

        <form
          className="beneficiary-form"
          onSubmit={(event) => {
            event.preventDefault();

            const formErrors = validateForm();
            if (Object.keys(formErrors).length > 0) {
              setErrors(formErrors);
              return;
            }

            const maxId = people.reduce((max, p) => {
              const num = parseInt(String(p.id).replace(/\D/g, ""), 10);
              return isNaN(num) ? max : Math.max(max, num);
            }, 0);

            const person = {
              id: `MN${String(maxId + 1).padStart(3, "0")}`,
              name: newPerson.name.trim(),
              age: Number(newPerson.age),
              week: Number(newPerson.week),
              phone: newPerson.phone.trim(),
              meals: 0,
              status: "On Track",
            };

            setPeople((prev) => [person, ...prev]);
            setSearch("");
            setStatus("All");
            setNewPerson({ name: "", age: "", week: "", phone: "" });
            setErrors({});
            setShowForm(false);
            setNotification(`Beneficiary ${person.name} (${person.id}) registered successfully.`);
          }}
        >
          <label>
            Beneficiary name
            <input
              required
              minLength={2}
              value={newPerson.name}
              onChange={(e) => {
                setNewPerson({ ...newPerson, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              placeholder="Enter full name"
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </label>

          <label>
            Age
            <input
              required
              type="number"
              min="10"
              max="60"
              value={newPerson.age}
              onChange={(e) => {
                setNewPerson({ ...newPerson, age: e.target.value });
                if (errors.age) setErrors({ ...errors, age: null });
              }}
              placeholder="Age in years"
            />
            {errors.age && <span className="form-error">{errors.age}</span>}
          </label>

          <label>
            Pregnancy week
            <input
              required
              type="number"
              min="1"
              max="42"
              value={newPerson.week}
              onChange={(e) => {
                setNewPerson({ ...newPerson, week: e.target.value });
                if (errors.week) setErrors({ ...errors, week: null });
              }}
              placeholder="1–42"
            />
            {errors.week && <span className="form-error">{errors.week}</span>}
          </label>

          <label>
            Contact number
            <input
              required
              type="tel"
              pattern="[0-9]{10}"
              value={newPerson.phone}
              onChange={(e) => {
                setNewPerson({ ...newPerson, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              placeholder="10-digit mobile number"
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setShowForm(false);
                setErrors({});
              }}
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

      {notification && (
        <div className="success-banner">
          <span>✓ {notification}</span>
          <button className="text-button" onClick={() => setNotification("")}>✕</button>
        </div>
      )}

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