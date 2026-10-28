package com.garbhposhan.care.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.garbhposhan.care.model.MealRecord
import com.garbhposhan.care.model.MealType
import com.garbhposhan.care.model.NutrientInfo
import com.garbhposhan.care.model.SyncStatus

@Entity(tableName = "meals")
data class MealEntity(
    @PrimaryKey val id: String,
    val beneficiaryId: String,
    val beneficiaryName: String,
    val dateIso: String,
    val mealType: String,
    val foodName: String,
    val calories: Double,
    val carbohydrates: Double,
    val protein: Double,
    val fibre: Double,
    val iron: Double,
    val calcium: Double,
    val folicAcid: Double,
    val status: String,
    val imageUri: String?,
    val syncStatus: String
) {
    fun toDomain(): MealRecord {
        return MealRecord(
            id = id,
            beneficiaryId = beneficiaryId,
            beneficiaryName = beneficiaryName,
            dateIso = dateIso,
            mealType = runCatching { MealType.valueOf(mealType) }.getOrDefault(MealType.LUNCH),
            foodName = foodName,
            nutrients = NutrientInfo(
                calories = calories,
                carbohydrates = carbohydrates,
                protein = protein,
                fibre = fibre,
                iron = iron,
                calcium = calcium,
                folicAcid = folicAcid
            ),
            status = status,
            imageUri = imageUri,
            syncStatus = runCatching { SyncStatus.valueOf(syncStatus) }.getOrDefault(SyncStatus.SYNCED)
        )
    }

    companion object {
        fun fromDomain(domain: MealRecord): MealEntity {
            return MealEntity(
                id = domain.id,
                beneficiaryId = domain.beneficiaryId,
                beneficiaryName = domain.beneficiaryName,
                dateIso = domain.dateIso,
                mealType = domain.mealType.name,
                foodName = domain.foodName,
                calories = domain.nutrients.calories,
                carbohydrates = domain.nutrients.carbohydrates,
                protein = domain.nutrients.protein,
                fibre = domain.nutrients.fibre,
                iron = domain.nutrients.iron,
                calcium = domain.nutrients.calcium,
                folicAcid = domain.nutrients.folicAcid,
                status = domain.status,
                imageUri = domain.imageUri,
                syncStatus = domain.syncStatus.name
            )
        }
    }
}
