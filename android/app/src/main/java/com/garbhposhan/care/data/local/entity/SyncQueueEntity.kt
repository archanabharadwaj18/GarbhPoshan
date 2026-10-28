package com.garbhposhan.care.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "sync_queue")
data class SyncQueueEntity(
    @PrimaryKey(autoGenerate = true) val queueId: Long = 0,
    val entityType: String,      // "BENEFICIARY", "MEAL"
    val entityId: String,
    val action: String,          // "CREATE", "UPDATE", "DELETE"
    val payloadJson: String,
    val createdAtEpoch: Long = System.currentTimeMillis(),
    val attempts: Int = 0
)
