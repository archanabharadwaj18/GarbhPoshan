package com.garbhposhan.care.data.repository

import com.garbhposhan.care.data.api.PoshanApiService
import com.garbhposhan.care.data.local.dao.BeneficiaryDao
import com.garbhposhan.care.data.local.dao.MealDao
import com.garbhposhan.care.data.local.entity.MealEntity
import com.garbhposhan.care.model.MealRecord
import com.garbhposhan.care.model.NutrientInfo
import com.garbhposhan.care.model.SyncStatus
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class MealRepository(
    private val mealDao: MealDao,
    private val beneficiaryDao: BeneficiaryDao,
    private val api: PoshanApiService
) {
    fun getAllMeals(): Flow<List<MealRecord>> {
        return mealDao.getAllMeals().map { list -> list.map { it.toDomain() } }
    }

    fun getMealsForBeneficiary(beneficiaryId: String): Flow<List<MealRecord>> {
        return mealDao.getMealsForBeneficiary(beneficiaryId).map { list -> list.map { it.toDomain() } }
    }

    fun getDailyNutrientIntake(beneficiaryId: String, dateIso: String): Flow<NutrientInfo> {
        return mealDao.getDailyMeals(beneficiaryId, dateIso).map { meals ->
            meals.fold(NutrientInfo.ZERO) { acc, entity ->
                acc + entity.toDomain().nutrients
            }
        }
    }

    suspend fun logMeal(meal: MealRecord): Result<MealRecord> {
        return runCatching {
            // Save locally first
            mealDao.insertMeal(MealEntity.fromDomain(meal.copy(syncStatus = SyncStatus.PENDING_UPLOAD)))
            beneficiaryDao.incrementMealCount(meal.beneficiaryId)

            // Try syncing with API
            try {
                val synced = api.logMeal(meal)
                mealDao.insertMeal(MealEntity.fromDomain(synced.copy(syncStatus = SyncStatus.SYNCED)))
                synced
            } catch (e: Exception) {
                meal
            }
        }
    }

    suspend fun confirmMeal(mealId: String) {
        mealDao.confirmMealStatus(mealId)
    }
}
