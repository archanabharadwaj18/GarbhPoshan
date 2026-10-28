package com.garbhposhan.care.data.repository

import com.garbhposhan.care.data.api.PoshanApiService
import com.garbhposhan.care.data.local.dao.BeneficiaryDao
import com.garbhposhan.care.data.local.entity.BeneficiaryEntity
import com.garbhposhan.care.model.BeneficiaryProfile
import com.garbhposhan.care.model.SyncStatus
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class BeneficiaryRepository(
    private val dao: BeneficiaryDao,
    private val api: PoshanApiService
) {
    fun getAllBeneficiaries(): Flow<List<BeneficiaryProfile>> {
        return dao.getAllBeneficiaries().map { list -> list.map { it.toDomain() } }
    }

    fun getBeneficiariesNeedingAttention(): Flow<List<BeneficiaryProfile>> {
        return dao.getBeneficiariesNeedingAttention().map { list -> list.map { it.toDomain() } }
    }

    suspend fun addBeneficiary(profile: BeneficiaryProfile): Result<BeneficiaryProfile> {
        return runCatching {
            // First save locally with PENDING_UPLOAD
            val pendingEntity = BeneficiaryEntity.fromDomain(profile.copy(syncStatus = SyncStatus.PENDING_UPLOAD))
            dao.insertBeneficiary(pendingEntity)

            // Try syncing with API
            try {
                val synced = api.createBeneficiary(profile)
                dao.insertBeneficiary(BeneficiaryEntity.fromDomain(synced.copy(syncStatus = SyncStatus.SYNCED)))
                synced
            } catch (e: Exception) {
                // If offline, return the locally saved profile
                profile
            }
        }
    }
}
