package com.garbhposhan.care.model

data class NutrientInfo(
    val calories: Double,       // kcal
    val carbohydrates: Double,  // grams
    val protein: Double,        // grams
    val fibre: Double,          // grams
    val iron: Double,           // mg
    val calcium: Double,        // mg
    val folicAcid: Double = 0.0 // mcg
) {
    operator fun plus(other: NutrientInfo): NutrientInfo {
        return NutrientInfo(
            calories = this.calories + other.calories,
            carbohydrates = this.carbohydrates + other.carbohydrates,
            protein = this.protein + other.protein,
            fibre = this.fibre + other.fibre,
            iron = this.iron + other.iron,
            calcium = this.calcium + other.calcium,
            folicAcid = this.folicAcid + other.folicAcid
        )
    }

    companion object {
        val ZERO = NutrientInfo(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
    }
}
