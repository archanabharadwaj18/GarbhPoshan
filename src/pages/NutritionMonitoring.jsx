
const meals = [
  { id: "ML001", person: "Ananya", food: "Rice, dal and vegetables", date: "Today", nutrients: "Carbohydrates, protein, fibre", status: "Recorded" },
  { id: "ML002", person: "Kavya", food: "Ragi dosa and sambar", date: "Today", nutrients: "Carbohydrates, protein, iron", status: "Review" },
  { id: "ML003", person: "Lakshmi", food: "Chapati and green gram", date: "Yesterday", nutrients: "Carbohydrates, protein, fibre", status: "Recorded" },
  { id: "ML004", person: "Meera", food: "Rice and vegetable palya", date: "Yesterday", nutrients: "Carbohydrates, fibre", status: "Review" },
];

export default function NutritionMonitoring() {
  return (
    <>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Meal records</div><div className="stat-value">342</div><div className="stat-note">Illustrative total</div></div>
        <div className="stat-card"><div className="stat-label">Records to review</div><div className="stat-value">12</div><div className="stat-note">Require verification</div></div>
        <div className="stat-card"><div className="stat-label">Food confirmation</div><div className="stat-value">Pending</div><div className="stat-note">Some entries need confirmation</div></div>
      </div>

      <section className="panel page-panel">
        <div className="panel-heading">
          <div>
            <h2>Meal records</h2>
            <p>Review logged meals and their estimated food information.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>BENEFICIARY</th><th>MEAL</th><th>DATE</th><th>ESTIMATED NUTRIENTS</th><th>STATUS</th></tr></thead>
            <tbody>
              {meals.map((meal) => (
                <tr key={meal.id}>
                  <td><strong>{meal.person}</strong><span className="cell-muted">{meal.id}</span></td>
                  <td>{meal.food}</td>
                  <td>{meal.date}</td>
                  <td>{meal.nutrients}</td>
                  <td><span className={`status-pill ${meal.status === "Review" ? "review" : "on-track"}`}>{meal.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="page-hint">Sample records only. These are not measured nutrient values or clinical assessments.</p>
      </section>
    </>
  );
}
