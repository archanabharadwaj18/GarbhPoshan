import { useState } from "react";

const EDUCATION_TOPICS = [
  {
    id: "iron",
    icon: "🩸",
    title: "Iron-Rich Foods & Anaemia Prevention",
    category: "Essential Nutrients",
    highlight: "Prevents maternal exhaustion, low birth weight, and postpartum complications.",
    foods: [
      "Moringa (drumstick) leaves, palak (spinach), methi, amaranth leaves",
      "Jaggery (gur) with roasted peanuts or chana",
      "Sprouted green gram (moong) and bengal gram",
      "Beetroot, dates, raisins, and dried figs",
      "Eggs, poultry, or iron-fortified government rations",
    ],
    goldenRule: "Always drink lemonade or eat amla (Vitamin C) with iron foods to double absorption! Never take iron with tea, coffee, or milk.",
  },
  {
    id: "calcium",
    icon: "🥛",
    title: "Calcium for Strong Baby Bones & Teeth",
    category: "Bone Health",
    highlight: "Baby draws calcium from mother's reserves during the second & third trimesters.",
    foods: [
      "Ragi (finger millet) — one of the richest plant calcium sources",
      "Milk, fresh curd, homemade buttermilk (chaas/majjige)",
      "Paneer, tofu, and white sesame seeds (til)",
      "Dark green leafy greens and curry leaves",
    ],
    goldenRule: "Keep at least a 2-hour gap between taking your Calcium tablet and your Iron (IFA) tablet, as calcium blocks iron absorption.",
  },
  {
    id: "protein",
    icon: "💪",
    title: "Protein for Muscle & Baby Growth",
    category: "Growth & Building Blocks",
    highlight: "Mothers need an additional 23g of protein daily during pregnancy.",
    foods: [
      "All dals (toor, chana, moong, masoor, urad)",
      "Boiled eggs (rich in complete protein + choline for baby's brain)",
      "Sprouted pulses, green peas, soya chunks",
      "Curd, milk, and roasted chana snacks",
    ],
    goldenRule: "Combine a cereal with a pulse (like Rice + Dal, or Ragi + Sambar, or Khichdi) to get a complete protein score.",
  },
  {
    id: "folate",
    icon: "🌱",
    title: "Folate & Folic Acid",
    category: "Neural Development",
    highlight: "Critical during early pregnancy to prevent neural tube and spinal defects.",
    foods: [
      "Spinach, broccoli, lady's finger (bhindi), green peas",
      "Citrus fruits like sweet lime (mosambi), oranges, and lemons",
      "Black-eyed beans (lobia) and lentils",
      "Fortified government wheat flour and cereal",
    ],
    goldenRule: "Do not overcook green vegetables in open water to preserve heat-sensitive folic acid.",
  },
  {
    id: "iodine",
    icon: "🧂",
    title: "Iodine & Thyroid Health",
    category: "Brain & Metabolism",
    highlight: "Iodine is essential for baby's brain development and mother's thyroid balance.",
    foods: [
      "Always use packaged, government-certified Iodized Salt (Tata Salt or similar)",
      "Dairy milk and curd",
      "Fresh drinking water and balanced local vegetables",
    ],
    goldenRule: "Store iodized salt in a dry, covered container away from moisture and direct stove flame to prevent iodine loss.",
  },
  {
    id: "hydration",
    icon: "💧",
    title: "Healthy Hydration",
    category: "Circulation & Fluid Balance",
    highlight: "Supports expanded blood volume, prevents constipation and painful urinary infections (UTIs).",
    foods: [
      "8 to 10 glasses of clean, boiled and cooled drinking water",
      "Tender coconut water (rich in electrolytes)",
      "Spiced thin buttermilk with mint and ginger",
      "Homemade clear vegetable or dal soups",
    ],
    goldenRule: "If your urine looks dark yellow, you need to drink more water immediately.",
  },
  {
    id: "thali",
    icon: "🍲",
    title: "The Balanced Pregnancy Thali (Plate Rule)",
    category: "Daily Meal Planning",
    highlight: "How to arrange your plate every day without expensive ingredients.",
    foods: [
      "Half (50%) of your plate: Colourful cooked vegetables, greens, or salads",
      "One Quarter (25%): Protein source (thick dal, sprouted pulses, egg, or paneer)",
      "One Quarter (25%): Wholesome energy food (Ragi, brown rice, whole wheat chapati, jowar)",
      "Accompaniment: 1 small cup of fresh curd or buttermilk",
    ],
    goldenRule: "Eat a rainbow on your plate! Different colours provide different micronutrients.",
  },
  {
    id: "diabetes",
    icon: "🩸",
    title: "Gestational Diabetes Awareness",
    category: "Special Conditions",
    highlight: "Some mothers develop elevated blood glucose after Week 20 due to pregnancy hormones.",
    foods: [
      "Whole millets (ragi, foxtail millet, jowar) instead of white maida",
      "Plenty of low-starch vegetables (gourds, beans, cabbage, greens)",
      "Avoid sweets, fruit juices with added sugar, biscuits, and sodas",
      "Eat small meals every 2.5 to 3 hours rather than heavy feasts",
    ],
    goldenRule: "A gentle 15-minute walk after lunch and dinner helps keep post-meal blood sugar in safe limits.",
  },
  {
    id: "anaemia",
    icon: "🩺",
    title: "Understanding Pregnancy Anaemia",
    category: "Vital Awareness",
    highlight: "Over 50% of pregnant women in India have low haemoglobin (Hb < 11 g/dL).",
    foods: [
      "Notice symptoms early: shortness of breath while walking, pale nails, unusual fatigue",
      "Take 1 red IFA tablet daily for at least 180 days during pregnancy",
      "In high-risk severe anaemia (Hb < 7 g/dL), consult your doctor for injectable iron or hospital care",
    ],
    goldenRule: "Mild blackish stool colour after taking iron tablets is completely normal and harmless.",
  },
];

export default function NutritionEducationSection({ t }) {
  const [selectedTopic, setSelectedTopic] = useState(EDUCATION_TOPICS[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTopics = EDUCATION_TOPICS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.foods.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="pw-card-header" style={{ marginBottom: "16px" }}>
        <div>
          <h2 style={{ fontSize: "22px" }}>{t.education_heading || "Maternal Nutrition Education"}</h2>
          <p>{t.education_sub || "Evidence-based, accessible dietary guides designed for Indian mothers and frontline care."}</p>
        </div>
      </div>

      <div className="pw-disclaimer-banner">
        <strong>📚 {t.evidence_disclaimer_title || "Evidence-based Nutritional Guidance"}:</strong>{" "}
        {t.evidence_disclaimer_text ||
          "Nutritional advice follows standard National Health Mission (NHM) and ICMR dietary guidelines. In case of maternal complications (e.g. pre-eclampsia or gestational diabetes), always follow individual meal plans prescribed by your clinical nutritionist or physician."}
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          className="page-input"
          style={{ width: "100%", maxWidth: "420px" }}
          placeholder="Search foods, e.g. Iron, Ragi, Milk, Diabetes, Water..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Topics Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="pw-card"
            style={{
              marginBottom: 0,
              cursor: "pointer",
              transition: "all 0.2s",
              border: selectedTopic.id === topic.id ? "2px solid #2d6a4f" : "1px solid #e1eee5",
              background: selectedTopic.id === topic.id ? "#f5faf7" : "#ffffff",
            }}
            onClick={() => setSelectedTopic(topic)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#d8f3dc", display: "grid", placeItems: "center", fontSize: "22px" }}>
                {topic.icon}
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "#52796f", textTransform: "uppercase", fontWeight: "700" }}>{topic.category}</span>
                <h3 style={{ margin: "2px 0 0", fontSize: "15px", color: "#19382b" }}>{topic.title}</h3>
              </div>
            </div>

            <p style={{ fontSize: "12px", color: "#547567", lineHeight: "1.5", marginBottom: "12px" }}>
              {topic.highlight}
            </p>

            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "12px", color: "#2d4d3f", lineHeight: "1.7" }}>
              {topic.foods.slice(0, 3).map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <div style={{ marginTop: "12px", padding: "8px 10px", background: "#fefae0", borderRadius: "8px", fontSize: "11px", color: "#744210", border: "1px solid #f2e9c4" }}>
              💡 <strong>Golden Rule:</strong> {topic.goldenRule}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
