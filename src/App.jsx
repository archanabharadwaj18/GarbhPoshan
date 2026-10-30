import { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login";
import AshaDashboard from "./pages/AshaDashboard";
import PregnantDashboard from "./pages/pregnant/PregnantDashboard";
import { getCurrentUser, logoutUser } from "./utils/auth";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("poshan_language") || "English";
    } catch {
      return "English";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("poshan_language", language);
    } catch (err) {
      console.warn("Could not save language to localStorage", err);
    }
  }, [language]);

  function handleLoginSuccess(user) {
    setCurrentUser(user);
    if (user.preferredLanguage) {
      setLanguage(user.preferredLanguage);
    }
  }

  function handleLogout() {
    logoutUser();
    setCurrentUser(null);
  }

  // If not logged in, display the Login & Registration portal
  if (!currentUser) {
    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
    );
  }

  // If logged in as ASHA worker, display the preserved ASHA Worker Dashboard
  if (currentUser.role === "asha") {
    return (
      <AshaDashboard
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // If logged in as Pregnant Mother, display the dedicated Pregnant Woman Dashboard
  return (
    <PregnantDashboard
      currentUser={currentUser}
      onLogout={handleLogout}
      currentLanguage={language}
      onLanguageChange={setLanguage}
    />
  );
}