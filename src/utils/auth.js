// Mock Authentication & User Session Manager using LocalStorage

export const DEMO_USERS = [
  {
    id: "usr_asha_01",
    role: "asha",
    name: "Radha Bai",
    phone: "9876500001",
    email: "asha@poshan.org",
    password: "password123",
    subcentre: "Channapatna Primary Health Sub-Centre",
    area: "Sector 4, Ramanagara",
    assignedBeneficiariesCount: 28,
  },
  {
    id: "usr_pw_ananya",
    role: "pregnant_woman",
    name: "Ananya Sharma",
    phone: "9876543210",
    email: "ananya@poshan.org",
    password: "password123",
    age: 24,
    week: 14,
    trimester: 2,
    edd: "2027-04-18",
    preferredLanguage: "English",
    assignedAsha: "Radha Bai (PHC Channapatna - 9876500001)",
    emergencyContact: "Ramesh Sharma (Husband) - 9876599999",
    bloodGroup: "B+",
    gravida: "G1P0 (First pregnancy)",
  },
  {
    id: "usr_pw_kavya",
    role: "pregnant_woman",
    name: "Kavya Gowda",
    phone: "9876543211",
    email: "kavya@poshan.org",
    password: "password123",
    age: 27,
    week: 24,
    trimester: 2,
    edd: "2027-02-10",
    preferredLanguage: "ಕನ್ನಡ",
    assignedAsha: "Radha Bai (PHC Channapatna - 9876500001)",
    emergencyContact: "Suresh Gowda - 9876588888",
    bloodGroup: "O+",
    gravida: "G2P1 (Second pregnancy)",
  },
];

export function getUsers() {
  try {
    const stored = localStorage.getItem("poshan_registered_users");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return [...DEMO_USERS, ...parsed];
      }
    }
  } catch (err) {
    console.warn("Error reading users from localStorage", err);
  }
  return DEMO_USERS;
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("poshan_current_user");
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Error reading current user", err);
  }
  return null;
}

export function setCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem("poshan_current_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("poshan_current_user");
    }
  } catch (err) {
    console.warn("Error setting current user", err);
  }
}

export function registerUser(newUserData) {
  const users = getUsers();
  const identifier = (newUserData.phone || newUserData.email || "").trim().toLowerCase();
  
  const existing = users.find(
    (u) =>
      (u.phone && u.phone === identifier) ||
      (u.email && u.email.toLowerCase() === identifier)
  );

  if (existing) {
    throw new Error("An account with this phone number or email already exists.");
  }

  const id = `usr_${Date.now()}`;
  const newUser = {
    id,
    ...newUserData,
  };

  try {
    const stored = localStorage.getItem("poshan_registered_users");
    const currentList = stored ? JSON.parse(stored) : [];
    currentList.push(newUser);
    localStorage.setItem("poshan_registered_users", JSON.stringify(currentList));
  } catch (err) {
    console.warn("Error persisting new user", err);
  }

  return newUser;
}

export function loginUser({ identifier, password, role }) {
  const cleanId = (identifier || "").trim().toLowerCase();
  const cleanPass = (password || "").trim();
  const users = getUsers();

  const user = users.find(
    (u) =>
      ((u.phone && u.phone === cleanId) ||
        (u.email && u.email.toLowerCase() === cleanId)) &&
      (!role || u.role === role)
  );

  if (!user) {
    throw new Error("No account found matching these credentials and role.");
  }

  if (user.password !== cleanPass) {
    throw new Error("Incorrect password. Please try again.");
  }

  setCurrentUser(user);
  return user;
}

export function logoutUser() {
  setCurrentUser(null);
}
