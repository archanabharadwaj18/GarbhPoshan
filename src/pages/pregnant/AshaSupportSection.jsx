import { useState } from "react";

export default function AshaSupportSection({ user, t }) {
  const [shareConsent, setShareConsent] = useState(() => {
    try {
      const saved = localStorage.getItem(`poshan_consent_${user?.id}`);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [helpRequests, setHelpRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(`poshan_helpreq_${user?.id}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: "req_01",
        type: "Home Visit Request",
        message: "Can you visit this week to check my blood pressure and supply IFA tablets?",
        status: "Acknowledged by ASHA",
        date: "Yesterday",
      },
    ];
  });

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState("Question about Diet & Supplements");
  const [requestMessage, setRequestMessage] = useState("");
  const [submittedBanner, setSubmittedBanner] = useState("");

  function handleToggleConsent(e) {
    const newVal = e.target.checked;
    setShareConsent(newVal);
    try {
      localStorage.setItem(`poshan_consent_${user?.id}`, JSON.stringify(newVal));
    } catch {
      // ignore
    }
  }

  function handleSendRequest(e) {
    e.preventDefault();
    if (!requestMessage.trim()) return;

    const newReq = {
      id: `req_${Date.now()}`,
      type: requestType,
      message: requestMessage.trim(),
      status: "Sent to ASHA Worker",
      date: "Just now",
    };

    const updated = [newReq, ...helpRequests];
    setHelpRequests(updated);
    try {
      localStorage.setItem(`poshan_helpreq_${user?.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setShowRequestModal(false);
    setRequestMessage("");
    setSubmittedBanner("✓ Your help request has been sent to your ASHA worker Radha Bai.");
    setTimeout(() => setSubmittedBanner(""), 5000);
  }

  return (
    <div>
      <div className="pw-card-header" style={{ marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px" }}>{t.asha_support_title || "ASHA Worker Connection"}</h2>
          <p>{t.asha_support_sub || "Direct communication with your designated frontline maternal healthcare worker."}</p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => setShowRequestModal(true)}
        >
          ✉️ {t.btn_send_help_request || "Send Help Request"}
        </button>
      </div>

      {submittedBanner && (
        <div className="success-banner" style={{ margin: "0 0 16px" }}>
          <span>{submittedBanner}</span>
          <button className="text-button" onClick={() => setSubmittedBanner("")}>✕</button>
        </div>
      )}

      {/* Assigned ASHA Worker Profile Card */}
      <div className="pw-card" style={{ display: "flex", gap: "20px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ width: "68px", height: "68px", borderRadius: "50%", background: "#d8f3dc", color: "#1b4332", fontSize: "28px", display: "grid", placeItems: "center", fontWeight: "800" }}>
          RB
        </div>

        <div style={{ flex: 1, minWidth: "220px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <h3 style={{ margin: 0, fontSize: "18px", color: "#19382b" }}>Radha Bai</h3>
            <span className="status-pill on-track" style={{ fontSize: "10px" }}>Accredited ASHA</span>
          </div>
          <div style={{ fontSize: "12px", color: "#52796f", lineHeight: "1.6" }}>
            <div>🏥 <strong>Sub-Centre:</strong> Channapatna Primary Health Sub-Centre (PHC Ramanagara)</div>
            <div>📍 <strong>Assigned Area:</strong> Ward 4 & Village Outreach Sector</div>
            <div>📞 <strong>Phone:</strong> +91 98765 00001</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <a
            href="tel:9876500001"
            className="primary-button"
            style={{ textDecoration: "none", textAlign: "center", padding: "10px 18px" }}
          >
            📞 Call ASHA Worker
          </a>
          <button
            type="button"
            className="secondary-button"
            onClick={() => setShowRequestModal(true)}
          >
            💬 Send Message
          </button>
        </div>
      </div>

      {/* Consent Sharing Card */}
      <div className="pw-card" style={{ background: shareConsent ? "#f4fbf7" : "#fffcf7", borderColor: shareConsent ? "#b7e4c7" : "#fbd38d" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: "16px", color: "#19382b" }}>
              🔒 {t.consent_title || "Consent for Nutrition Record Sharing"}
            </h3>
            <p style={{ fontSize: "12px", color: "#547567", maxWidth: "600px", lineHeight: "1.6", margin: 0 }}>
              {t.consent_desc ||
                "When enabled, your assigned ASHA worker Radha Bai can view your meal photos, estimated nutrients, and logged symptoms on her dashboard to support your pregnancy visits. Your records are never shared with other beneficiaries."}
            </p>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px", color: "#1b4332" }}>
            <input
              type="checkbox"
              checked={shareConsent}
              onChange={handleToggleConsent}
              style={{ width: "20px", height: "20px", accentColor: "#2d6a4f", cursor: "pointer" }}
            />
            {shareConsent ? "Sharing Enabled (Active)" : "Sharing Paused (Private)"}
          </label>
        </div>
      </div>

      {/* Follow-up Messages from ASHA */}
      <div className="pw-card">
        <h3 style={{ margin: "0 0 14px", fontSize: "17px", color: "#19382b" }}>
          📬 {t.asha_messages_title || "Messages & Follow-up Notes from ASHA Worker"}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ padding: "14px", background: "#f8fbf9", borderRadius: "12px", border: "1px solid #e1eee5" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <strong style={{ fontSize: "13px", color: "#1b4332" }}>Radha Bai (ASHA Worker)</strong>
              <span style={{ fontSize: "11px", color: "#749386" }}>2 days ago</span>
            </div>
            <p style={{ fontSize: "12px", color: "#47695c", margin: 0, lineHeight: "1.6" }}>
              "Namaste Ananya. I noticed your recent meal had good green leafy vegetables. Please remember to take your IFA tablet after your afternoon meal with plain water, not tea. I will visit your home next Thursday for weight and BP measurement."
            </p>
          </div>
        </div>
      </div>

      {/* Sent Help Requests List */}
      <div className="pw-card">
        <h3 style={{ margin: "0 0 14px", fontSize: "17px", color: "#19382b" }}>
          📤 {t.my_requests_title || "My Help Requests & Queries"}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {helpRequests.map((req) => (
            <div key={req.id} style={{ padding: "14px", background: "#ffffff", borderRadius: "12px", border: "1px solid #e1eee5", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <strong style={{ fontSize: "13px", color: "#19382b" }}>{req.type}</strong>
                  <span className="status-pill on-track" style={{ fontSize: "9px" }}>{req.status}</span>
                </div>
                <div style={{ fontSize: "12px", color: "#547567" }}>{req.message}</div>
              </div>
              <span style={{ fontSize: "11px", color: "#749386" }}>{req.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Help Request Modal */}
      {showRequestModal && (
        <div className="modal-backdrop" onClick={() => setShowRequestModal(false)}>
          <div className="modal-box" style={{ maxWidth: "500px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>Send Request to ASHA Worker</h3>
              <button
                type="button"
                className="text-button"
                onClick={() => setShowRequestModal(false)}
                style={{ fontSize: "18px" }}
              >
                ✕
              </button>
            </div>

            <form className="pw-form" onSubmit={handleSendRequest}>
              <div className="pw-form-full">
                <label>
                  Request Topic
                  <select value={requestType} onChange={(e) => setRequestType(e.target.value)}>
                    <option value="Question about Diet & Supplements">Question about Diet & Supplements</option>
                    <option value="Request Home Visit">Request Home Visit (BP & Weight Check)</option>
                    <option value="Need More IFA / Calcium Tablets">Need More IFA / Calcium Tablets</option>
                    <option value="Guidance on Government Maternity Benefits (PMMVY / PMSMA)">Guidance on Government Benefits (PMMVY / PMSMA)</option>
                    <option value="Feeling Unwell / Nauseous">Feeling Unwell / Need Advice</option>
                  </select>
                </label>
              </div>

              <div className="pw-form-full">
                <label>
                  Message
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe what you need help with..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                  />
                </label>
              </div>

              <div className="pw-form-full" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
