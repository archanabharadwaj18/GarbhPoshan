package com.garbhposhan.care.data.api

import com.garbhposhan.care.model.BeneficiaryProfile
import com.garbhposhan.care.model.MealRecord

/**
 * REST API Contract to be implemented by Member 1 / Backend.
 */
interface PoshanApiService {
    suspend fun getBeneficiaries(): List<BeneficiaryProfile>
    suspend fun createBeneficiary(profile: BeneficiaryProfile): BeneficiaryProfile
    suspend fun getMeals(dateIso: String? = null): List<MealRecord>
    suspend fun logMeal(meal: MealRecord): MealRecord
    suspend fun syncBatchMeals(meals: List<MealRecord>): List<String>
}

/**
 * In-memory Mock Service until Backend teammate finishes deployment.
 */
class MockPoshanApiService : PoshanApiService {
    private val beneficiaries = mutableListOf(
        BeneficiaryProfile("MN001", "Ananya", 24, 12, "9876543210", 18, "On Track"),
        BeneficiaryProfile("MN002", "Kavya", 27, 24, "9876543211", 12, "Review", riskFlags = listOf("ANEMIA")),
        BeneficiaryProfile("MN003", "Lakshmi", 22, 30, "9876543212", 21, "On Track"),
        BeneficiaryProfile("MN004", "Meera", 29, 18, "9876543213", 9, "Follow-up", riskFlags = listOf("GDM")),
        BeneficiaryProfile("MN005", "Divya", 25, 34, "9876543214", 16, "On Track")
    )

    private val meals = mutableListOf<MealRecord>()

    override suspend fun getBeneficiaries(): List<BeneficiaryProfile> = beneficiaries.toList()

    override suspend fun createBeneficiary(profile: BeneficiaryProfile): BeneficiaryProfile {
        val assignedId = if (profile.id.isBlank()) "MN${String.format("%03d", beneficiaries.size + 1)}" else profile.id
        val created = profile.copy(id = assignedId)
        beneficiaries.add(created)
        return created
    }

    override suspend fun getMeals(dateIso: String?): List<MealRecord> {
        return if (dateIso == null) meals.toList() else meals.filter { it.dateIso == dateIso }
    }

    override suspend fun logMeal(meal: MealRecord): MealRecord {
        meals.add(meal)
        return meal
    }

    override suspend fun syncBatchMeals(mealsToSync: List<MealRecord>): List<String> {
        meals.addAll(mealsToSync)
        return mealsToSync.map { it.id }
    }
}
