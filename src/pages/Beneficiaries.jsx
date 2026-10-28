import { useState } from "react";

export default function Beneficiaries({ t = {}, people, setPeople }) {
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

  function getStatusLabel(st) {
    if (st === "On Track") return t.status_on_track || "On Track";
    if (st === "Review") return t.status_review || "Review";
    if (st === "Follow-up") return t.status_follow_up || "Follow-up";
    return st;
  }

  function getTrimesterLabel(week) {
    if (week <= 13) return t.trimester_first || "First trimester";
    if (week <= 27) return t.trimester_second || "Second trimester";
    return t.trimester_third || "Third trimester";
  }

  function validateForm() {
    const errs = {};
    const trimmedName = newPerson.name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      errs.name = t.err_name || "Name must be at least 2 characters long.";
    }

    const ageNum = Number(newPerson.age);
    if (!newPerson.age || isNaN(ageNum) || ageNum < 10 || ageNum > 60) {
      errs.age = t.err_age || "Age must be between 10 and 60 years.";
    }

    const weekNum = Number(newPerson.week);
    if (!newPerson.week || isNaN(weekNum) || weekNum < 1 || weekNum > 42) {
      errs.week = t.err_week || "Pregnancy week must be between 1 and 42.";
    }

    const phoneTrimmed = newPerson.phone.trim();
    if (!/^[0-9]{10}$/.test(phoneTrimmed)) {
      errs.phone = t.err_phone || "Contact number must be exactly 10 digits.";
    }

    return errs;
  }

  if (showForm) {
    return (
      <section className="panel page-panel">
        <div className="panel-heading">
          <div>
            <h2>{t.form_title || "Add Beneficiary"}</h2>
            <p>{t.form_subtitle || "Register a beneficiary for maternal nutrition tracking."}</p>
          </div>

          <button
            className="secondary-button profile-back"
            onClick={() => {
              setShowForm(false);
              setErrors({});
            }}
          >
            {t.btn_cancel || "Cancel"}
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
            setNotification(`${person.name} (${person.id}) ${t.msg_registered || "registered successfully."}`);
          }}
        >
          <label>
            {t.label_name || "Beneficiary name"}
            <input
              required
              minLength={2}
              value={newPerson.name}
              onChange={(e) => {
                setNewPerson({ ...newPerson, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              placeholder={t.placeholder_name || "Enter full name"}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </label>

          <label>
            {t.label_age || "Age"}
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
              placeholder={t.placeholder_age || "Age in years"}
            />
            {errors.age && <span className="form-error">{errors.age}</span>}
          </label>

          <label>
            {t.label_week || "Pregnancy week"}
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
              placeholder={t.placeholder_week || "1–42"}
            />
            {errors.week && <span className="form-error">{errors.week}</span>}
          </label>

          <label>
            {t.label_phone || "Contact number"}
            <input
              required
              type="tel"
              pattern="[0-9]{10}"
              value={newPerson.phone}
              onChange={(e) => {
                setNewPerson({ ...newPerson, phone: e.target.value });
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              placeholder={t.placeholder_phone || "10-digit mobile number"}
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
              {t.btn_cancel || "Cancel"}
            </button>
            <button type="submit" className="primary-button">
              {t.btn_save || "Save beneficiary"}
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
            <p>{t.profile_subtitle || "Beneficiary profile"} · {selected.id}</p>
          </div>
          <button className="secondary-button profile-back" onClick={() => setSelected(null)}>
            {t.profile_back || "← Back to list"}
          </button>
        </div>
        <div className="profile-details">
          <div><span>{t.profile_label_age || "Age"}</span><strong>{selected.age} {t.years || "years"}</strong></div>
          <div><span>{t.profile_label_pregnancy || "Pregnancy"}</span><strong>{t.week || "Week"} {selected.week}</strong></div>
          <div><span>{t.profile_label_trimester || "Trimester"}</span><strong>{getTrimesterLabel(selected.week)}</strong></div>
          <div><span>{t.profile_label_meals || "Meals recorded"}</span><strong>{selected.meals}</strong></div>
          <div><span>{t.profile_label_status || "Record status"}</span><strong>{getStatusLabel(selected.status)}</strong></div>
        </div>
        <p className="page-hint">
          {t.profile_hint || "This is sample profile data. Meal history and verified health information will be connected later."}
        </p>
      </section>
    );
  }

  return (
    <section className="panel page-panel">
      <div className="panel-heading">
        <div>
          <h2>{t.dir_title || "Beneficiary directory"}</h2>
          <p>{t.dir_subtitle || "Search and review your assigned beneficiaries."}</p>
        </div>
        <div className="directory-actions">
          <span className="record-count">{filtered.length} {t.records_count || "records"}</span>
          <button
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            {t.add_beneficiary || "+ Add Beneficiary"}
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
          placeholder={t.search_placeholder || "Search by name or ID..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="page-input" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="All">{t.status_all || "All"}</option>
          <option value="On Track">{t.status_on_track || "On Track"}</option>
          <option value="Review">{t.status_review || "Review"}</option>
          <option value="Follow-up">{t.status_follow_up || "Follow-up"}</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t.th_beneficiary || "BENEFICIARY"}</th>
              <th>{t.th_pregnancy || "PREGNANCY"}</th>
              <th>{t.th_meals || "MEALS"}</th>
              <th>{t.th_status || "STATUS"}</th>
              <th>{t.th_action || "ACTION"}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong>{p.name}</strong>
                  <span className="cell-muted">{p.id} · {p.age} {t.years || "years"}</span>
                </td>
                <td>
                  {t.week || "Week"} {p.week}
                  <span className="cell-muted">{getTrimesterLabel(p.week)}</span>
                </td>
                <td>{p.meals}</td>
                <td>
                  <span className={`status-pill ${p.status.toLowerCase().replace(" ", "-")}`}>
                    {getStatusLabel(p.status)}
                  </span>
                </td>
                <td>
                  <button className="text-button" onClick={() => setSelected(p)}>
                    {t.view_profile || "View profile →"}
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-state">
                  {t.no_records || "No matching beneficiaries found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}