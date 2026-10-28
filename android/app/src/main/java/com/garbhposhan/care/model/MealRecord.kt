package com.garbhposhan.care.model

import java.util.UUID

data class MealRecord(
    val id: String = UUID.randomUUID().toString(),
    val beneficiaryId: String,
    val beneficiaryName: String,
    val dateIso: String,               // YYYY-MM-DD or "Today"
    val mealType: MealType,
    val foodName: String,              // e.g. "Ragi dosa and sambar"
    val nutrients: NutrientInfo,
    val status: String = "Recorded",   // "Recorded", "Review"
    val imageUri: String? = null,
    val syncStatus: SyncStatus = SyncStatus.SYNCED
)
