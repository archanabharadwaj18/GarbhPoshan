package com.garbhposhan.care

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.lifecycle.lifecycleScope
import com.garbhposhan.care.data.api.MockPoshanApiService
import com.garbhposhan.care.data.local.AppDatabase
import com.garbhposhan.care.data.repository.BeneficiaryRepository
import com.garbhposhan.care.data.repository.MealRepository
import com.garbhposhan.care.model.BeneficiaryProfile
import com.garbhposhan.care.model.MealRecord
import com.garbhposhan.care.ui.screens.BeneficiariesScreen
import com.garbhposhan.care.ui.screens.MealLogScreen
import com.garbhposhan.care.ui.screens.OverviewScreen
import com.garbhposhan.care.ui.theme.PoshanCareTheme
import com.garbhposhan.care.ui.theme.TealPrimary
import kotlinx.coroutines.launch

enum class AppDestination(val label: String, val icon: ImageVector) {
    OVERVIEW("Overview", Icons.Default.Home),
    BENEFICIARIES("Beneficiaries", Icons.Default.People),
    MEALS("Meal Logs", Icons.Default.Restaurant)
}

class MainActivity : ComponentActivity() {

    private lateinit var beneficiaryRepository: BeneficiaryRepository
    private lateinit var mealRepository: MealRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val db = AppDatabase.getInstance(applicationContext)
        val api = MockPoshanApiService()
        beneficiaryRepository = BeneficiaryRepository(db.beneficiaryDao(), api)
        mealRepository = MealRepository(db.mealDao(), db.beneficiaryDao(), api)

        setContent {
            PoshanCareTheme {
                var currentDestination by remember { mutableStateOf(AppDestination.OVERVIEW) }

                val beneficiaries by beneficiaryRepository.getAllBeneficiaries()
                    .collectAsState(initial = emptyList())
                val meals by mealRepository.getAllMeals()
                    .collectAsState(initial = emptyList())

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        NavigationBar {
                            AppDestination.values().forEach { destination ->
                                NavigationBarItem(
                                    selected = currentDestination == destination,
                                    onClick = { currentDestination = destination },
                                    label = { Text(destination.label) },
                                    icon = { Icon(imageVector = destination.icon, contentDescription = destination.label) },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = TealPrimary,
                                        selectedTextColor = TealPrimary
                                    )
                                )
                            }
                        }
                    }
                ) { innerPadding ->
                    when (currentDestination) {
                        AppDestination.OVERVIEW -> {
                            OverviewScreen(
                                beneficiaries = beneficiaries,
                                meals = meals,
                                modifier = Modifier.padding(innerPadding)
                            )
                        }
                        AppDestination.BENEFICIARIES -> {
                            BeneficiariesScreen(
                                beneficiaries = beneficiaries,
                                onAddBeneficiary = { newProfile ->
                                    lifecycleScope.launch {
                                        beneficiaryRepository.addBeneficiary(newProfile)
                                    }
                                },
                                modifier = Modifier.padding(innerPadding)
                            )
                        }
                        AppDestination.MEALS -> {
                            MealLogScreen(
                                meals = meals,
                                beneficiaries = beneficiaries,
                                onLogMeal = { newMeal ->
                                    lifecycleScope.launch {
                                        mealRepository.logMeal(newMeal)
                                    }
                                },
                                onConfirmMeal = { mealId ->
                                    lifecycleScope.launch {
                                        mealRepository.confirmMeal(mealId)
                                    }
                                },
                                modifier = Modifier.padding(innerPadding)
                            )
                        }
                    }
                }
            }
        }
    }
}
