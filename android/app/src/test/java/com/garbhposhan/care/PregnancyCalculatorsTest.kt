package com.garbhposhan.care

import com.garbhposhan.care.model.Trimester
import com.garbhposhan.care.util.PregnancyCalculators
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.util.concurrent.TimeUnit

class PregnancyCalculatorsTest {

    @Test
    fun calculateGestationalWeek_returnsCorrectWeek() {
        val now = System.currentTimeMillis()
        val twoWeeksAgo = now - TimeUnit.DAYS.toMillis(14)
        val week = PregnancyCalculators.calculateGestationalWeek(twoWeeksAgo, now)
        assertEquals(3, week)
    }

    @Test
    fun calculateGestationalWeek_boundsBetween1And42() {
        val now = System.currentTimeMillis()
        val futureDate = now + TimeUnit.DAYS.toMillis(10)
        assertEquals(1, PregnancyCalculators.calculateGestationalWeek(futureDate, now))

        val longPast = now - TimeUnit.DAYS.toMillis(350)
        assertEquals(42, PregnancyCalculators.calculateGestationalWeek(longPast, now))
    }

    @Test
    fun calculateEdd_adds280Days() {
        val lmp = 1_000_000_000L
        val expectedEdd = lmp + TimeUnit.DAYS.toMillis(280)
        assertEquals(expectedEdd, PregnancyCalculators.calculateEdd(lmp))
    }

    @Test
    fun trimester_fromWeek_matchesClinicalRanges() {
        assertEquals(Trimester.FIRST, Trimester.fromWeek(1))
        assertEquals(Trimester.FIRST, Trimester.fromWeek(12))
        assertEquals(Trimester.SECOND, Trimester.fromWeek(13))
        assertEquals(Trimester.SECOND, Trimester.fromWeek(26))
        assertEquals(Trimester.THIRD, Trimester.fromWeek(27))
        assertEquals(Trimester.THIRD, Trimester.fromWeek(40))
    }

    @Test
    fun dailyNutrientTargets_elevatesEnergyForLaterTrimesters() {
        val firstTrim = PregnancyCalculators.getDailyNutrientTargets(Trimester.FIRST)
        val secondTrim = PregnancyCalculators.getDailyNutrientTargets(Trimester.SECOND)
        val thirdTrim = PregnancyCalculators.getDailyNutrientTargets(Trimester.THIRD)

        assertTrue("2nd trimester energy should exceed 1st", secondTrim.calories > firstTrim.calories)
        assertTrue("3rd trimester energy should exceed 2nd", thirdTrim.calories > secondTrim.calories)
        assertEquals(27.0, firstTrim.iron, 0.01)
        assertEquals(570.0, firstTrim.folicAcid, 0.01)
        assertEquals(1200.0, thirdTrim.calcium, 0.01)
    }
}
