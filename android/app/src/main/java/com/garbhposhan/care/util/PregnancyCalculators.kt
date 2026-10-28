package com.garbhposhan.care.util

import com.garbhposhan.care.model.NutrientInfo
import com.garbhposhan.care.model.Trimester
import java.util.concurrent.TimeUnit

object PregnancyCalculators {

    private const val DAYS_IN_PREGNANCY = 280L

    /**
     * Calculates gestational week (1..42) from Last Menstrual Period (LMP) epoch millis.
     */
    fun calculateGestationalWeek(lmpMillis: Long, currentMillis: Long = System.currentTimeMillis()): Int {
        if (lmpMillis > currentMillis) return 1
        val diffDays = TimeUnit.MILLISECONDS.toDays(currentMillis - lmpMillis)
        val week = (diffDays / 7).toInt() + 1
        return week.coerceIn(1, 42)
    }

    /**
     * Calculates Naegele's Estimated Date of Delivery (EDD) = LMP + 280 days.
     */
    fun calculateEdd(lmpMillis: Long): Long {
        return lmpMillis + TimeUnit.DAYS.toMillis(DAYS_IN_PREGNANCY)
    }

    /**
     * Recommended daily dietary allowances for pregnancy (based on ICMR-NIN & WHO maternal guidelines).
     */
    fun getDailyNutrientTargets(trimester: Trimester): NutrientInfo {
        return when (trimester) {
            Trimester.FIRST -> NutrientInfo(
                calories = 2000.0,
                carbohydrates = 275.0,
                protein = 60.0,
                fibre = 28.0,
                iron = 27.0,
                calcium = 1000.0,
                folicAcid = 570.0
            )
            Trimester.SECOND -> NutrientInfo(
                calories = 2350.0, // +350 kcal
                carbohydrates = 320.0,
                protein = 70.0,
                fibre = 30.0,
                iron = 27.0,
                calcium = 1000.0,
                folicAcid = 570.0
            )
            Trimester.THIRD -> NutrientInfo(
                calories = 2450.0, // +450 kcal
                carbohydrates = 330.0,
                protein = 78.0,
                fibre = 32.0,
                iron = 27.0,
                calcium = 1200.0,
                folicAcid = 570.0
            )
        }
    }
}
