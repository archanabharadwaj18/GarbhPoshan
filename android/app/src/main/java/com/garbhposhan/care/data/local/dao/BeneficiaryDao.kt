package com.garbhposhan.care.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.garbhposhan.care.data.local.entity.BeneficiaryEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface BeneficiaryDao {

    @Query("SELECT * FROM beneficiaries ORDER BY name ASC")
    fun getAllBeneficiaries(): Flow<List<BeneficiaryEntity>>

    @Query("SELECT * FROM beneficiaries WHERE id = :id LIMIT 1")
    suspend fun getBeneficiaryById(id: String): BeneficiaryEntity?

    @Query("SELECT * FROM beneficiaries WHERE status IN ('Review', 'Follow-up')")
    fun getBeneficiariesNeedingAttention(): Flow<List<BeneficiaryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBeneficiary(beneficiary: BeneficiaryEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBeneficiaries(beneficiaries: List<BeneficiaryEntity>)

    @Update
    suspend fun updateBeneficiary(beneficiary: BeneficiaryEntity)

    @Query("UPDATE beneficiaries SET mealsLoggedCount = mealsLoggedCount + 1 WHERE id = :id")
    suspend fun incrementMealCount(id: String)

    @Query("SELECT COUNT(*) FROM beneficiaries")
    suspend fun getCount(): Int
}
