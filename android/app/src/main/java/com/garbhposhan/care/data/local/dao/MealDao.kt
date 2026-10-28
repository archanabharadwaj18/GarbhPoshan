package com.garbhposhan.care.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.garbhposhan.care.data.local.entity.MealEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface MealDao {

    @Query("SELECT * FROM meals ORDER BY dateIso DESC")
    fun getAllMeals(): Flow<List<MealEntity>>

    @Query("SELECT * FROM meals WHERE beneficiaryId = :beneficiaryId ORDER BY dateIso DESC")
    fun getMealsForBeneficiary(beneficiaryId: String): Flow<List<MealEntity>>

    @Query("SELECT * FROM meals WHERE beneficiaryId = :beneficiaryId AND dateIso = :dateIso")
    fun getDailyMeals(beneficiaryId: String, dateIso: String): Flow<List<MealEntity>>

    @Query("SELECT * FROM meals WHERE status = 'Review'")
    fun getMealsNeedingReview(): Flow<List<MealEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMeal(meal: MealEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMeals(meals: List<MealEntity>)

    @Query("UPDATE meals SET status = 'Recorded' WHERE id = :mealId")
    suspend fun confirmMealStatus(mealId: String)

    @Query("SELECT COUNT(*) FROM meals")
    suspend fun getCount(): Int
}
