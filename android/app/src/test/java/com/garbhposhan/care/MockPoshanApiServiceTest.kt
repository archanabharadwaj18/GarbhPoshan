package com.garbhposhan.care

import com.garbhposhan.care.data.api.MockPoshanApiService
import com.garbhposhan.care.model.BeneficiaryProfile
import com.garbhposhan.care.model.MealRecord
import com.garbhposhan.care.model.MealType
import com.garbhposhan.care.model.NutrientInfo
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Test

class MockPoshanApiServiceTest {

    private val api = MockPoshanApiService()

    @Test
    fun getBeneficiaries_initialReturnsWebDashboardSampleData() = runTest {
        val beneficiaries = api.getBeneficiaries()
        assertEquals(5, beneficiaries.size)
        assertEquals("Ananya", beneficiaries[0].name)
        assertEquals("Kavya", beneficiaries[1].name)
    }

    @Test
    fun createBeneficiary_assignsSequentialId() = runTest {
        val newProfile = BeneficiaryProfile(
            id = "",
            name = "Rukmini",
            age = 26,
            week = 16,
            phone = "9876543299"
        )
        val created = api.createBeneficiary(newProfile)
        assertEquals("MN006", created.id)
        assertEquals(6, api.getBeneficiaries().size)
    }

    @Test
    fun logMeal_storesAndRetrievesMeal() = runTest {
        val meal = MealRecord(
            id = "ML999",
            beneficiaryId = "MN001",
            beneficiaryName = "Ananya",
            dateIso = "Today",
            mealType = MealType.BREAKFAST,
            foodName = "Idli and Sambar",
            nutrients = NutrientInfo(280.0, 48.0, 8.0, 4.0, 2.0, 40.0, 20.0)
        )
        api.logMeal(meal)
        val meals = api.getMeals()
        assertEquals(1, meals.size)
        assertEquals("Idli and Sambar", meals[0].foodName)
    }
}
