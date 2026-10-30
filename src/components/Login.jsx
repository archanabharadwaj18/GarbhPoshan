import { useState } from "react";
import "../Login.css";
import { loginUser, registerUser, DEMO_USERS } from "../utils/auth";
import { translations } from "../translation";

export default function Login({ onLoginSuccess, currentLanguage = "English", onLanguageChange }) {
  const [tab, setTab] = useState("login"); // "login" | "signup"
  const [role, setRole] = useState("pregnant_woman"); // "pregnant_woman" | "asha"
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("24");
  const [week, setWeek] = useState("14");
  const [error, setError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  const t = translations[currentLanguage] || translations.English;

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      if (tab === "login") {
        if (!identifier.trim()) {
          setError(t.err_enter_identifier || "Please enter your phone number or email.");
          return;
        }
        if (!password.trim()) {
          setError(t.err_enter_password || "Please enter your password.");
          return;
        }
        const user = loginUser({ identifier, password, role });
        onLoginSuccess(user);
      } else {
        // Sign Up
        if (!fullName.trim() || fullName.trim().length < 2) {
          setError(t.err_name || "Name must be at least 2 characters long.");
          return;
        }
        if (!identifier.trim()) {
          setError(t.err_enter_identifier || "Please enter a valid phone number or email.");
          return;
        }
        if (!password || password.length < 4) {
          setError("Password must be at least 4 characters long.");
          return;
        }

        const isPhone = /^[0-9]{10}$/.test(identifier.trim());
        const newUserPayload = {
          role,
          name: fullName.trim(),
          phone: isPhone ? identifier.trim() : "",
          email: !isPhone ? identifier.trim() : "",
          password: password.trim(),
          preferredLanguage: currentLanguage,
          ...(role === "pregnant_woman"
            ? {
                age: Number(age) || 24,
                week: Number(week) || 12,
                trimester: Number(week) <= 13 ? 1 : Number(week) <= 27 ? 2 : 3,
                edd: calculateEDD(Number(week) || 12),
                assignedAsha: "Radha Bai (PHC Channapatna - 9876500001)",
                emergencyContact: "Emergency Support - 108 / 102",
              }
            : {
                subcentre: "Channapatna Health Centre",
                area: "Field Sector 2",
              }),
        };

        const user = registerUser(newUserPayload);
        onLoginSuccess(user);
      }
    } catch (err) {
      setError(err.message || "Authentication error. Please check your details.");
    }
  }

  function handleDemoLogin(demoUser) {
    setError("");
    setRole(demoUser.role);
    setIdentifier(demoUser.phone);
    setPassword(demoUser.password);
    try {
      const user = loginUser({
        identifier: demoUser.phone,
        password: demoUser.password,
        role: demoUser.role,
      });
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message);
    }
  }

  function calculateEDD(weeksPregnant) {
    const remainingWeeks = Math.max(0, 40 - weeksPregnant);
    const target = new Date();
    target.setDate(target.getDate() + remainingWeeks * 7);
    return target.toISOString().split("T")[0];
  }

  return (
    <div className="login-page">
      <header className="login-topbar">
        <div className="login-brand">
          <div className="login-brand-icon">✚</div>
          <div className="login-brand-text">
            <h1>Poshan Care</h1>
            <p>{t.tagline || "Maternal wellness & nutrition"}</p>
          </div>
        </div>

        <label className="language-select">
          文
          <select value={currentLanguage} onChange={(e) => onLanguageChange(e.target.value)}>
            <option>English</option>
            <option>ಕನ್ನಡ</option>
            <option>हिन्दी</option>
            <option>తెలుగు</option>
            <option>தமிழ்</option>
            <option>മലയാളം</option>
          </select>
        </label>
      </header>

      <main className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>{tab === "login" ? (t.login_title || "Welcome Back") : (t.signup_title || "Create Account")}</h2>
            <p>
              {tab === "login"
                ? (t.login_sub || "Log in to access your maternal health records and guidance.")
                : (t.signup_sub || "Register for simple, personalized maternal nutrition tracking.")}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
              onClick={() => {
                setTab("login");
                setError("");
              }}
            >
              {t.tab_login || "Log In"}
            </button>
            <button
              type="button"
              className={`auth-tab ${tab === "signup" ? "active" : ""}`}
              onClick={() => {
                setTab("signup");
                setError("");
              }}
            >
              {t.tab_signup || "Sign Up"}
            </button>
          </div>

          <div className="role-selector-title">{t.select_account_type || "Select Account Type"}</div>
          <div className="role-grid">
            <div
              className={`role-card ${role === "pregnant_woman" ? "selected" : ""}`}
              onClick={() => setRole("pregnant_woman")}
            >
              <div className="role-icon">🌸</div>
              <div className="role-info">
                <strong>{t.role_pregnant_woman || "Pregnant Woman"}</strong>
                <span>{t.role_pregnant_desc || "Mother tracking meal & health"}</span>
              </div>
            </div>

            <div
              className={`role-card ${role === "asha" ? "selected" : ""}`}
              onClick={() => setRole("asha")}
            >
              <div className="role-icon">🩺</div>
              <div className="role-info">
                <strong>{t.role_asha || "ASHA Worker"}</strong>
                <span>{t.role_asha_desc || "Frontline healthcare field worker"}</span>
              </div>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {tab === "signup" && (
              <>
                <label>
                  {t.label_name || "Full Name"}
                  <input
                    type="text"
                    required
                    placeholder={t.placeholder_name || "Enter your full name"}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </label>

                {role === "pregnant_woman" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <label>
                      {t.label_age || "Age"}
                      <input
                        type="number"
                        min="15"
                        max="55"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </label>

                    <label>
                      {t.label_week || "Pregnancy Week"}
                      <input
                        type="number"
                        min="1"
                        max="42"
                        value={week}
                        onChange={(e) => setWeek(e.target.value)}
                      />
                    </label>
                  </div>
                )}
              </>
            )}

            <label>
              {t.label_phone_or_email || "Mobile Number or Email"}
              <input
                type="text"
                required
                placeholder="e.g. 9876543210 or user@poshan.org"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </label>

            <label>
              {t.label_password || "Password"}
              <div className="auth-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </label>

            {tab === "login" && (
              <div className="forgot-password-link">
                <button type="button" onClick={() => setShowForgotModal(true)}>
                  {t.forgot_password || "Forgot password?"}
                </button>
              </div>
            )}

            <button type="submit" className="auth-submit-btn">
              {tab === "login"
                ? `${t.btn_login || "Log In as"} ${role === "asha" ? (t.role_asha || "ASHA Worker") : (t.role_pregnant_woman || "Pregnant Woman")}`
                : `${t.btn_create_account || "Register as"} ${role === "asha" ? (t.role_asha || "ASHA Worker") : (t.role_pregnant_woman || "Pregnant Woman")}`}
            </button>
          </form>

          {/* Quick Demo Logins for evaluators */}
          <div className="demo-box">
            <div className="demo-title">{t.demo_quick_access || "Demo Prototype Quick Logins"}</div>
            <div className="demo-buttons">
              <button
                type="button"
                className="demo-btn"
                onClick={() => handleDemoLogin(DEMO_USERS[0])}
              >
                <span>🩺 Radha Bai (ASHA Worker)</span>
                <span className="demo-badge">1-Click Login</span>
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => handleDemoLogin(DEMO_USERS[1])}
              >
                <span>🌸 Ananya Sharma (Pregnant Mother · Wk 14)</span>
                <span className="demo-badge">1-Click Login</span>
              </button>
              <button
                type="button"
                className="demo-btn"
                onClick={() => handleDemoLogin(DEMO_USERS[2])}
              >
                <span>🌸 Kavya Gowda (Pregnant Mother · Wk 24)</span>
                <span className="demo-badge">1-Click Login</span>
              </button>
            </div>
            <div className="demo-disclaimer">
              {t.demo_auth_disclaimer || "Prototype demo mode using local storage. No live server credentials required."}
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{t.forgot_password_title || "Reset Password"}</h3>
            <p>
              {t.forgot_password_desc ||
                "In rural field deployments, ASHA workers or local health sub-centre staff can assist with credential recovery. For this prototype, enter your registered number or email below to receive a mock reset verification code."}
            </p>
            <input
              type="text"
              placeholder="Registered Mobile or Email"
              className="auth-input-wrapper"
              style={{ width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #c2dbcd", borderRadius: "8px" }}
              value={forgotInput}
              onChange={(e) => setForgotInput(e.target.value)}
            />
            {forgotMsg && <div style={{ color: "#256346", fontSize: "12px", fontWeight: "600", marginBottom: "12px" }}>{forgotMsg}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotMsg("");
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={() => {
                  if (!forgotInput.trim()) {
                    setForgotMsg("Please enter your registered number or email.");
                    return;
                  }
                  setForgotMsg("✓ Temporary demo password reset link generated! Demo password is: password123");
                }}
              >
                Verify & Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
