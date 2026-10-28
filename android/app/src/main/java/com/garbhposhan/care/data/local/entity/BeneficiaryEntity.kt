package com.garbhposhan.care.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey
import com.garbhposhan.care.model.BeneficiaryProfile
import com.garbhposhan.care.model.SyncStatus

@Entity(tableName = "beneficiaries")
data class BeneficiaryEntity(
    @PrimaryKey val id: String,
    val name: String,
    val age: Int,
    val week: Int,
    val phone: String,
    val mealsLoggedCount: Int,
    val status: String,
    val lmpEpochMillis: Long?,
    val riskFlagsCsv: String, // comma-separated e.g. "GDM,ANEMIA"
    val syncStatus: String
) {
    fun toDomain(): BeneficiaryProfile {
        return BeneficiaryProfile(
            id = id,
            name = name,
            age = age,
            week = week,
            phone = phone,
            mealsLoggedCount = mealsLoggedCount,
            status = status,
            lmpEpochMillis = lmpEpochMillis,
            riskFlags = if (riskFlagsCsv.isBlank()) emptyList() else riskFlagsCsv.split(",").map { it.trim() },
            syncStatus = runCatching { SyncStatus.valueOf(syncStatus) }.getOrDefault(SyncStatus.SYNCED)
        )
    }

    companion object {
        fun fromDomain(domain: BeneficiaryProfile): BeneficiaryEntity {
            return BeneficiaryEntity(
                id = domain.id,
                name = domain.name,
                age = domain.age,
                week = domain.week,
                phone = domain.phone,
                mealsLoggedCount = domain.mealsLoggedCount,
                status = domain.status,
                lmpEpochMillis = domain.lmpEpochMillis,
                riskFlagsCsv = domain.riskFlags.joinToString(","),
                syncStatus = domain.syncStatus.name
            )
        }
    }
}
