package com.garbhposhan.care.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.garbhposhan.care.data.local.dao.BeneficiaryDao
import com.garbhposhan.care.data.local.dao.MealDao
import com.garbhposhan.care.data.local.entity.BeneficiaryEntity
import com.garbhposhan.care.data.local.entity.MealEntity
import com.garbhposhan.care.data.local.entity.SyncQueueEntity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        BeneficiaryEntity::class,
        MealEntity::class,
        SyncQueueEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun beneficiaryDao(): BeneficiaryDao
    abstract fun mealDao(): MealDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "poshan_care.db"
                )
                    .addCallback(SeedDataCallback())
                    .fallbackToDestructiveMigration()
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }

    private class SeedDataCallback : Callback() {
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            CoroutineScope(Dispatchers.IO).launch {
                INSTANCE?.let { database ->
                    seedInitialData(database)
                }
            }
        }

        private suspend fun seedInitialData(database: AppDatabase) {
            val initialBeneficiaries = listOf(
                BeneficiaryEntity("MN001", "Ananya", 24, 12, "9876543210", 18, "On Track", null, "", "SYNCED"),
                BeneficiaryEntity("MN002", "Kavya", 27, 24, "9876543211", 12, "Review", null, "ANEMIA", "SYNCED"),
                BeneficiaryEntity("MN003", "Lakshmi", 22, 30, "9876543212", 21, "On Track", null, "", "SYNCED"),
                BeneficiaryEntity("MN004", "Meera", 29, 18, "9876543213", 9, "Follow-up", null, "GDM", "SYNCED"),
                BeneficiaryEntity("MN005", "Divya", 25, 34, "9876543214", 16, "On Track", null, "", "SYNCED")
            )
            database.beneficiaryDao().insertBeneficiaries(initialBeneficiaries)

            val initialMeals = listOf(
                MealEntity("ML001", "MN001", "Ananya", "Today", "LUNCH", "Rice, dal and vegetables", 380.0, 65.0, 12.0, 6.0, 2.5, 60.0, 45.0, "Recorded", null, "SYNCED"),
                MealEntity("ML002", "MN002", "Kavya", "Today", "BREAKFAST", "Ragi dosa and sambar", 320.0, 52.0, 10.0, 5.0, 4.2, 120.0, 30.0, "Review", null, "SYNCED"),
                MealEntity("ML003", "MN003", "Lakshmi", "Yesterday", "LUNCH", "Chapati and green gram", 340.0, 55.0, 14.0, 7.0, 3.1, 75.0, 50.0, "Recorded", null, "SYNCED"),
                MealEntity("ML004", "MN004", "Meera", "Yesterday", "DINNER", "Rice and vegetable palya", 290.0, 50.0, 6.0, 4.0, 1.8, 45.0, 20.0, "Review", null, "SYNCED")
            )
            database.mealDao().insertMeals(initialMeals)
        }
    }
}
