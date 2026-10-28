package com.garbhposhan.care.model

data class BeneficiaryProfile(
    val id: String,                    // e.g. "MN001"
    val name: String,                  // e.g. "Ananya"
    val age: Int,                      // e.g. 24
    val week: Int,                     // e.g. 12 (1..42)
    val phone: String,                 // 10-digit phone
    val mealsLoggedCount: Int = 0,
    val status: String = "On Track",   // "On Track", "Review", "Follow-up"
    val lmpEpochMillis: Long? = null,  // Last Menstrual Period date
    val riskFlags: List<String> = emptyList(), // e.g. "GDM", "ANEMIA", "HYPERTENSION"
    val syncStatus: SyncStatus = SyncStatus.SYNCED
) {
    val trimester: Trimester
        get() = Trimester.fromWeek(week)
}
