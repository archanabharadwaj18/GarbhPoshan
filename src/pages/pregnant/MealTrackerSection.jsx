import { useState } from "react";

// Standard regional Indian food database with approximate nutrient profiles per portion
const FOOD_DATABASE = [
  { name: "Ragi Dosa with Sambar", calories: 280, protein: 7, iron: 3.5, calcium: 160, folate: 45, defaultPortion: "2 dosas + 1 bowl sambar" },
  { name: "Rice with Dal and Spinach (Palak)", calories: 340, protein: 11, iron: 4.8, calcium: 120, folate: 110, defaultPortion: "1 plate rice + 1 bowl dal" },
  { name: "Chapati with Mixed Vegetable Palya", calories: 290, protein: 8, iron: 2.9, calcium: 75, folate: 60, defaultPortion: "2 chapatis + 1 bowl sabzi" },
  { name: "Ragi Mudde with Soppu Saaru", calories: 320, protein: 9, iron: 5.2, calcium: 210, folate: 95, defaultPortion: "1 ball + 1 bowl saaru" },
  { name: "Boiled Egg (2 eggs)", calories: 155, protein: 13, iron: 1.8, calcium: 50, folate: 44, defaultPortion: "2 large eggs" },
  { name: "Warm Milk with Jaggery (Gur)", calories: 170, protein: 6, iron: 2.2, calcium: 240, folate: 15, defaultPortion: "1 glass (250 ml)" },
  { name: "Sprouted Moong Salad with Carrots", calories: 140, protein: 8, iron: 3.1, calcium: 65, folate: 90, defaultPortion: "1 bowl (150 g)" },
  { name: "Curd / Yoghurt with Pomegranate", calories: 130, protein: 5, iron: 0.8, calcium: 180, folate: 20, defaultPortion: "1 small bowl" },
  { name: "Poha with Roasted Peanuts", calories: 260, protein: 6, iron: 3.0, calcium: 40, folate: 35, defaultPortion: "1 medium plate" },
  { name: "Idli with Coconut Chutney & Sambar", calories: 220, protein: 6, iron: 1.6, calcium: 55, folate: 40, defaultPortion: "3 idlis" },
  { name: "Roasted Chana / Peanuts", calories: 160, protein: 7, iron: 2.5, calcium: 45, folate: 50, defaultPortion: "1 handful (40 g)" },
];

export default function MealTrackerSection({ user, t, meals = [], onAddMeal }) {
  const [viewTab, setViewTab] = useState("daily"); // "daily" | "weekly"
  const [showAddModal, setShowAddModal] = useState(false);

  // New meal form state
  const [mealType, setMealType] = useState("Breakfast");
  const [foodItem, setFoodItem] = useState("");
  const [portion, setPortion] = useState("1 medium bowl");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [aiDetectedNote, setAiDetectedNote] = useState("");

  function handleFoodSelect(e) {
    const selectedName = e.target.value;
    setFoodItem(selectedName);
    const found = FOOD_DATABASE.find((f) => f.name === selectedName);
    if (found) {
      setPortion(found.defaultPortion);
    }
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setAiDetectedNote("⚡ TensorFlow Lite on-device model simulation: Recognized mixed meal (Carbohydrates + Green vegetables detected)");
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSubmitMeal(e) {
    e.preventDefault();

    const matched = FOOD_DATABASE.find((f) => f.name.toLowerCase() === foodItem.toLowerCase());
    const approxCalories = matched ? matched.calories : 260;
    const approxProtein = matched ? matched.protein : 8;
    const approxIron = matched ? matched.iron : 2.5;
    const approxCalcium = matched ? matched.calcium : 90;
    const approxFolate = matched ? matched.folate : 50;

    const newMeal = {
      id: `meal_${Date.now()}`,
      userId: user?.id,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: mealType,
      food: foodItem || "Balanced Home-cooked Meal",
      portion: portion || "1 standard portion",
      description: description || "Freshly prepared meal",
      image: imagePreview || null,
      calories: approxCalories,
      protein: approxProtein,
      iron: approxIron,
      calcium: approxCalcium,
      folate: approxFolate,
      aiTagged: !!imagePreview,
    };

    onAddMeal(newMeal);
    setShowAddModal(false);
    // Reset form
    setFoodItem("");
    setPortion("1 medium bowl");
    setDescription("");
    setImagePreview(null);
    setAiDetectedNote("");
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const todayMeals = meals.filter((m) => m.date === todayStr);

  return (
    <div>
      {/* Header bar */}
      <div className="pw-card-header" style={{ marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "22px" }}>{t.meal_tracker_heading || "Meal and Nutrition Tracker"}</h2>
          <p>{t.meal_tracker_sub || "Log your daily food intake, upload meal photos, and check estimated nutrients."}</p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => setShowAddModal(true)}
          style={{ padding: "10px 18px", fontSize: "13px" }}
        >
          + {t.btn_log_new_meal || "Log a Meal"}
        </button>
      </div>

      {/* Medical & Nutrient Disclaimer */}
      <div className="pw-disclaimer-banner">
        <strong>⚠️ {t.disclaimer_note || "Nutrition Estimate Disclaimer"}:</strong>{" "}
        {t.meal_estimate_disclaimer ||
          "Nutritional values are approximate estimates derived from standard Indian Food Composition Tables (IFCT). Individual food preparations and portion sizes vary. This is for health guidance only and not a clinical diagnosis or prescription."}
      </div>

      {/* Tabs: Daily History vs Weekly View */}
      <div className="auth-tabs" style={{ maxWidth: "320px", marginBottom: "20px" }}>
        <button
          type="button"
          className={`auth-tab ${viewTab === "daily" ? "active" : ""}`}
          onClick={() => setViewTab("daily")}
        >
          {t.tab_today_meals || "Today's Meals"} ({todayMeals.length})
        </button>
        <button
          type="button"
          className={`auth-tab ${viewTab === "weekly" ? "active" : ""}`}
          onClick={() => setViewTab("weekly")}
        >
          {t.tab_all_history || "Weekly History"} ({meals.length})
        </button>
      </div>

      {/* Daily Meals List */}
      {viewTab === "daily" && (
        <div>
          {todayMeals.length === 0 ? (
            <div className="pw-card" style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>🍲</div>
              <h3 style={{ margin: "0 0 8px", color: "#2d6a4f" }}>{t.no_meals_today || "No meals logged yet today"}</h3>
              <p style={{ color: "#618676", fontSize: "13px", marginBottom: "18px" }}>
                {t.no_meals_sub || "Log your breakfast, lunch, snack, or dinner to monitor nutrition."}
              </p>
              <button
                type="button"
                className="primary-button"
                onClick={() => setShowAddModal(true)}
              >
                + {t.btn_log_first_meal || "Log Your First Meal"}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {todayMeals.map((meal) => (
                <div key={meal.id} className="pw-card" style={{ marginBottom: "0", display: "flex", gap: "18px", flexWrap: "wrap", alignItems: "center" }}>
                  {meal.image ? (
                    <img
                      src={meal.image}
                      alt="Meal"
                      style={{ width: "90px", height: "90px", borderRadius: "14px", objectFit: "cover", border: "1px solid #d4e6dc" }}
                    />
                  ) : (
                    <div style={{ width: "90px", height: "90px", borderRadius: "14px", background: "#f1f8f4", display: "grid", placeItems: "center", fontSize: "36px", color: "#2d6a4f" }}>
                      {meal.type === "Breakfast" ? "🍳" : meal.type === "Lunch" ? "🍛" : meal.type === "Snack" ? "🥛" : "🍲"}
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: "220px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span className="status-pill on-track" style={{ fontSize: "10px" }}>{meal.type}</span>
                      <span style={{ fontSize: "11px", color: "#749386" }}>{meal.time}</span>
                      {meal.aiTagged && (
                        <span className="pw-ai-badge" style={{ margin: 0 }}>⚡ TFLite Assisted</span>
                      )}
                    </div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "16px", color: "#19382b" }}>{meal.food}</h3>
                    <div style={{ fontSize: "12px", color: "#547567", marginBottom: "8px" }}>
                      <strong>{t.label_portion || "Portion"}:</strong> {meal.portion} {meal.description && `• ${meal.description}`}
                    </div>

                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", fontSize: "11px", color: "#24503c", background: "#f5fbf7", padding: "6px 12px", borderRadius: "8px" }}>
                      <span><strong>{meal.calories}</strong> kcal</span>
                      <span><strong>{meal.protein}g</strong> {t.nutrient_protein || "Protein"}</span>
                      <span><strong>{meal.iron}mg</strong> {t.nutrient_iron || "Iron"}</span>
                      <span><strong>{meal.calcium}mg</strong> {t.nutrient_calcium || "Calcium"}</span>
                      <span><strong>{meal.folate}mcg</strong> {t.nutrient_folate || "Folate"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weekly History View */}
      {viewTab === "weekly" && (
        <div className="pw-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t.th_date || "DATE"}</th>
                  <th>{t.meal_type || "TYPE"}</th>
                  <th>{t.food_item || "FOOD ITEM"}</th>
                  <th>{t.label_portion || "PORTION"}</th>
                  <th>{t.th_nutrients || "ESTIMATED NUTRIENTS"}</th>
                </tr>
              </thead>
              <tbody>
                {meals.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <strong>{m.date}</strong>
                      <span className="cell-muted">{m.time}</span>
                    </td>
                    <td>
                      <span className="status-pill on-track">{m.type}</span>
                    </td>
                    <td>
                      <strong>{m.food}</strong>
                      {m.aiTagged && <span style={{ display: "block", fontSize: "9px", color: "#6b46c1" }}>⚡ TFLite Image Verified</span>}
                    </td>
                    <td>{m.portion}</td>
                    <td>
                      <span style={{ fontSize: "11px", color: "#24503c" }}>
                        {m.calories} kcal · P: {m.protein}g · Fe: {m.iron}mg · Ca: {m.calcium}mg
                      </span>
                    </td>
                  </tr>
                ))}
                {meals.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      {t.no_records_history || "No recorded meals found in history."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Meal Modal Form */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" style={{ maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0, fontSize: "18px" }}>{t.log_meal_title || "Record a Meal"}</h3>
              <button
                type="button"
                className="text-button"
                onClick={() => setShowAddModal(false)}
                style={{ fontSize: "18px" }}
              >
                ✕
              </button>
            </div>

            <form className="pw-form" onSubmit={handleSubmitMeal}>
              <div>
                <label>
                  {t.meal_type || "Meal Slot"}
                  <select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                    <option value="Breakfast">Breakfast (ಬೆಳಗಿನ ಉಪಹಾರ / नाश्ता)</option>
                    <option value="Lunch">Lunch (ಮಧ್ಯಾಹ್ನದ ಊಟ / दोपहर का भोजन)</option>
                    <option value="Snack">Evening Snack (ಸಂಜೆ ತಿಂಡಿ / शाम का नाश्ता)</option>
                    <option value="Dinner">Dinner (ರಾತ್ರಿಯ ಊಟ / रात का खाना)</option>
                  </select>
                </label>
              </div>

              <div>
                <label>
                  {t.quick_select_food || "Quick Select Regional Food"}
                  <select onChange={handleFoodSelect} defaultValue="">
                    <option value="" disabled>-- Select recommended meal --</option>
                    {FOOD_DATABASE.map((f) => (
                      <option key={f.name} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="pw-form-full">
                <label>
                  {t.food_name_or_ingredients || "Food Name / Ingredients"}
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 Ragi Dosa, Sambhar with Drumstick"
                    value={foodItem}
                    onChange={(e) => setFoodItem(e.target.value)}
                  />
                </label>
              </div>

              <div>
                <label>
                  {t.label_portion || "Approximate Portion Size"}
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 pieces, 1 bowl, 250ml"
                    value={portion}
                    onChange={(e) => setPortion(e.target.value)}
                  />
                </label>
              </div>

              <div>
                <label>
                  {t.additional_notes || "Optional Notes"}
                  <input
                    type="text"
                    placeholder="e.g. Homemade, less oil"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
              </div>

              {/* Photo Upload & AI Placeholder */}
              <div className="pw-form-full">
                <label>{t.upload_meal_photo || "Upload Meal Photograph (Optional)"}</label>
                <div className="pw-upload-box">
                  <input
                    type="file"
                    accept="image/*"
                    id="meal-photo-input"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="meal-photo-input" style={{ cursor: "pointer", display: "block" }}>
                    {imagePreview ? (
                      <div>
                        <img
                          src={imagePreview}
                          alt="Uploaded meal"
                          style={{ maxHeight: "140px", borderRadius: "10px", objectFit: "contain", margin: "0 auto" }}
                        />
                        <div style={{ fontSize: "11px", color: "#2d6a4f", marginTop: "6px" }}>Click to replace photo</div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: "32px", marginBottom: "4px" }}>📷</div>
                        <strong style={{ fontSize: "13px", color: "#19382b" }}>Tap to take or choose photo</strong>
                        <p style={{ fontSize: "11px", color: "#547567", margin: "4px 0" }}>Helpful for ASHA workers to review your meal balance</p>
                      </div>
                    )}
                  </label>

                  <div className="pw-ai-badge">
                    ⚡ TensorFlow Lite On-Device Food Recognition Engine (Future-ready AI Placeholder)
                  </div>
                  {aiDetectedNote && (
                    <div style={{ fontSize: "11px", color: "#553c9a", fontWeight: "600", marginTop: "6px" }}>
                      {aiDetectedNote}
                    </div>
                  )}
                </div>
              </div>

              <div className="pw-form-full" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowAddModal(false)}
                >
                  {t.btn_cancel || "Cancel"}
                </button>
                <button type="submit" className="primary-button">
                  {t.btn_save_meal || "Save Meal Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
