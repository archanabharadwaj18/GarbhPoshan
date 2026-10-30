import { useState } from "react";
import { setCurrentUser } from "../../utils/auth";

export default function ProfileSection({ user, t, onUpdateUser, onLogout }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState(user?.age || 24);
  const [phone, setPhone] = useState(user?.phone || "");
  const [week, setWeek] = useState(user?.week || 14);
  const [edd, setEdd] = useState(user?.edd || "2027-04-18");
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || "B+");
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || "Husband - 9876599999");
  const [successMsg, setSuccessMsg] = useState("");

  function handleSave(e) {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name: name.trim(),
      age: Number(age),
      phone: phone.trim(),
      week: Number(week),
      edd: edd.trim(),
      bloodGroup: bloodGroup.trim(),
      emergencyContact: emergencyContact.trim(),
    };

    onUpdateUser(updatedUser);
    setCurrentUser(updatedUser);

    setIsEditing(false);
    setSuccessMsg("✓ Profile details updated successfully.");
    setTimeout(() => setSuccessMsg(""), 4000);
  }

  return (
    <div>
      <div className="pw-card-header" style={{ marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px" }}>{t.profile_heading || "My Profile & Maternal Information"}</h2>
          <p>{t.profile_sub || "Review your personal registration details, assigned healthcare provider, and emergency contacts."}</p>
        </div>
        {!isEditing && (
          <button
            type="button"
            className="secondary-button"
            onClick={() => setIsEditing(true)}
          >
            ✏️ {t.btn_edit_profile || "Edit Profile"}
          </button>
        )}
      </div>

      {successMsg && (
        <div className="success-banner" style={{ margin: "0 0 16px" }}>
          <span>{successMsg}</span>
          <button className="text-button" onClick={() => setSuccessMsg("")}>✕</button>
        </div>
      )}

      {/* Main Profile Summary Card */}
      <div className="pw-card">
        <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", marginBottom: "22px", paddingBottom: "20px", borderBottom: "1px solid #e3ede6" }}>
          <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#ffd8d0", color: "#723b32", fontSize: "28px", fontWeight: "800", display: "grid", placeItems: "center" }}>
            {user?.name ? user.name.charAt(0) : "M"}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "20px", color: "#19382b" }}>{user?.name || "Mother"}</h3>
              <span className="status-pill on-track" style={{ fontSize: "10px" }}>Pregnant Mother Account</span>
            </div>
            <div style={{ fontSize: "12px", color: "#547567", marginTop: "4px" }}>
              ID: <strong>{user?.id}</strong> · {t.preferred_language || "Language"}: <strong>{user?.preferredLanguage || "English"}</strong>
            </div>
          </div>
        </div>

        {isEditing ? (
          <form className="pw-form" onSubmit={handleSave}>
            <div>
              <label>
                Full Name
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            </div>

            <div>
              <label>
                Age (years)
                <input
                  type="number"
                  min="15"
                  max="55"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </label>
            </div>

            <div>
              <label>
                Contact Number
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
            </div>

            <div>
              <label>
                Current Pregnancy Week (1-42)
                <input
                  type="number"
                  min="1"
                  max="42"
                  value={week}
                  onChange={(e) => setWeek(e.target.value)}
                />
              </label>
            </div>

            <div>
              <label>
                Estimated Delivery Date (EDD)
                <input
                  type="date"
                  value={edd}
                  onChange={(e) => setEdd(e.target.value)}
                />
              </label>
            </div>

            <div>
              <label>
                Blood Group
                <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </label>
            </div>

            <div className="pw-form-full">
              <label>
                Emergency Family Contact (Name & Phone)
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                />
              </label>
            </div>

            <div className="pw-form-full" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            <div style={{ background: "#f8fbf9", padding: "14px", borderRadius: "12px", border: "1px solid #e1eee5" }}>
              <span style={{ fontSize: "11px", color: "#618676", display: "block" }}>{t.label_age || "Age"}</span>
              <strong style={{ fontSize: "15px", color: "#19382b" }}>{user?.age || 24} {t.years || "years"}</strong>
            </div>

            <div style={{ background: "#f8fbf9", padding: "14px", borderRadius: "12px", border: "1px solid #e1eee5" }}>
              <span style={{ fontSize: "11px", color: "#618676", display: "block" }}>{t.label_phone || "Mobile Number"}</span>
              <strong style={{ fontSize: "15px", color: "#19382b" }}>{user?.phone || user?.email || "9876543210"}</strong>
            </div>

            <div style={{ background: "#f8fbf9", padding: "14px", borderRadius: "12px", border: "1px solid #e1eee5" }}>
              <span style={{ fontSize: "11px", color: "#618676", display: "block" }}>{t.current_week || "Pregnancy Week"}</span>
              <strong style={{ fontSize: "15px", color: "#2d6a4f" }}>{t.week || "Week"} {user?.week || 14} ({user?.week <= 13 ? "1st" : user?.week <= 27 ? "2nd" : "3rd"} Trimester)</strong>
            </div>

            <div style={{ background: "#f8fbf9", padding: "14px", borderRadius: "12px", border: "1px solid #e1eee5" }}>
              <span style={{ fontSize: "11px", color: "#618676", display: "block" }}>{t.estimated_edd || "Estimated Delivery Date (EDD)"}</span>
              <strong style={{ fontSize: "15px", color: "#19382b" }}>{user?.edd || "2027-04-18"}</strong>
            </div>

            <div style={{ background: "#f8fbf9", padding: "14px", borderRadius: "12px", border: "1px solid #e1eee5" }}>
              <span style={{ fontSize: "11px", color: "#618676", display: "block" }}>Blood Group</span>
              <strong style={{ fontSize: "15px", color: "#19382b" }}>{user?.bloodGroup || "B+"}</strong>
            </div>

            <div style={{ background: "#f8fbf9", padding: "14px", borderRadius: "12px", border: "1px solid #e1eee5" }}>
              <span style={{ fontSize: "11px", color: "#618676", display: "block" }}>Assigned ASHA Worker</span>
              <strong style={{ fontSize: "15px", color: "#19382b" }}>{user?.assignedAsha || "Radha Bai (9876500001)"}</strong>
            </div>

            <div style={{ background: "#f8fbf9", padding: "14px", borderRadius: "12px", border: "1px solid #e1eee5", gridColumn: "1 / -1" }}>
              <span style={{ fontSize: "11px", color: "#618676", display: "block" }}>Emergency Contact</span>
              <strong style={{ fontSize: "15px", color: "#c53030" }}>{user?.emergencyContact || "Family Member - 9876599999"}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="pw-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
        <div>
          <strong style={{ display: "block", fontSize: "14px", color: "#19382b" }}>Logout from Account</strong>
          <span style={{ fontSize: "12px", color: "#547567" }}>You can sign back in anytime using your phone number or email.</span>
        </div>
        <button
          type="button"
          className="secondary-button"
          onClick={onLogout}
          style={{ borderColor: "#feb2b2", color: "#c53030" }}
        >
          ⎋ {t.btn_logout || "Logout"}
        </button>
      </div>
    </div>
  );
}
