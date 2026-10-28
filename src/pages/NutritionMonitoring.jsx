const meals = [
  { id: "ML001", person: "Ananya", food: "Rice, dal and vegetables", date: "Today", nutrients: "Carbohydrates, protein, fibre", status: "Recorded" },
  { id: "ML002", person: "Kavya", food: "Ragi dosa and sambar", date: "Today", nutrients: "Carbohydrates, protein, iron", status: "Review" },
  { id: "ML003", person: "Lakshmi", food: "Chapati and green gram", date: "Yesterday", nutrients: "Carbohydrates, protein, fibre", status: "Recorded" },
  { id: "ML004", person: "Meera", food: "Rice and vegetable palya", date: "Yesterday", nutrients: "Carbohydrates, fibre", status: "Review" },
];

export default function NutritionMonitoring({ t = {} }) {
  const reviewCount = meals.filter((m) => m.status === "Review").length;
  const hasPendingConfirmation = meals.some((m) => m.status === "Review");

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">{t.nutrition_stat_meals || "Meal records"}</div>
          <div className="stat-value">{meals.length}</div>
          <div className="stat-note">{t.nutrition_note_sample || "Sample records shown"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.nutrition_stat_review || "Records to review"}</div>
          <div className="stat-value">{reviewCount}</div>
          <div className="stat-note">{t.nutrition_note_verify || "Require verification"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">{t.nutrition_stat_confirm || "Food confirmation"}</div>
          <div className="stat-value">
            {hasPendingConfirmation
              ? (t.nutrition_status_pending || "Pending")
              : (t.nutrition_status_uptodate || "Up to date")}
          </div>
          <div className="stat-note">{t.nutrition_note_some || "Some entries need confirmation"}</div>
        </div>
      </div>

      <section className="panel page-panel">
        <div className="panel-heading">
          <div>
            <h2>{t.nutrition_heading || "Meal records"}</h2>
            <p>{t.nutrition_subheading || "Review logged meals and their estimated food information."}</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t.th_beneficiary || "BENEFICIARY"}</th>
                <th>{t.th_meal || "MEAL"}</th>
                <th>{t.th_date || "DATE"}</th>
                <th>{t.th_nutrients || "ESTIMATED NUTRIENTS"}</th>
                <th>{t.th_status || "STATUS"}</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr key={meal.id}>
                  <td>
                    <strong>{meal.person}</strong>
                    <span className="cell-muted">{meal.id}</span>
                  </td>
                  <td>{meal.food}</td>
                  <td>{meal.date}</td>
                  <td>{meal.nutrients}</td>
                  <td>
                    <span className={`status-pill ${meal.status === "Review" ? "review" : "on-track"}`}>
                      {meal.status === "Review"
                        ? (t.status_review || "Review")
                        : (t.status_on_track || "Recorded")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="page-hint">
          {t.nutrition_hint || "Sample records only. These are not measured nutrient values or clinical assessments."}
        </p>
      </section>
    </>
  );
}