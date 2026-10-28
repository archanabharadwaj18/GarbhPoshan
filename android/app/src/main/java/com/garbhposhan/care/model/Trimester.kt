package com.garbhposhan.care.model

enum class Trimester(val displayName: String, val weekRange: IntRange) {
    FIRST("First Trimester", 1..12),
    SECOND("Second Trimester", 13..26),
    THIRD("Third Trimester", 27..42);

    companion object {
        fun fromWeek(week: Int): Trimester {
            return when {
                week <= 12 -> FIRST
                week <= 26 -> SECOND
                else -> THIRD
            }
        }
    }
}
