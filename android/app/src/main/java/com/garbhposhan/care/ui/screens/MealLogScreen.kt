package com.garbhposhan.care.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.garbhposhan.care.model.BeneficiaryProfile
import com.garbhposhan.care.model.MealRecord
import com.garbhposhan.care.model.MealType
import com.garbhposhan.care.model.NutrientInfo
import com.garbhposhan.care.ui.theme.*
import java.util.UUID

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MealLogScreen(
    meals: List<MealRecord>,
    beneficiaries: List<BeneficiaryProfile>,
    onLogMeal: (MealRecord) -> Unit,
    onConfirmMeal: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var showLogDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(SurfaceLight)
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Nutrition Monitoring",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = "${meals.size} meal records logged",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextSecondary
                    )
                }
                Button(
                    onClick = { showLogDialog = true },
                    colors = ButtonDefaults.buttonColors(containerColor = TealPrimary),
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Icon(imageVector = Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Log Meal", style = MaterialTheme.typography.labelSmall)
                }
            }
        },
        modifier = modifier
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(BackgroundLight)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            contentPadding = PaddingValues(vertical = 12.dp)
        ) {
            items(meals, key = { it.id }) { meal ->
                MealCard(
                    meal = meal,
                    onConfirm = { onConfirmMeal(meal.id) }
                )
            }
        }
    }

    if (showLogDialog) {
        LogMealDialog(
            beneficiaries = beneficiaries,
            onDismiss = { showLogDialog = false },
            onConfirm = { newMeal ->
                onLogMeal(newMeal)
                showLogDialog = false
            }
        )
    }
}

@Composable
fun MealCard(
    meal: MealRecord,
    onConfirm: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceLight),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = meal.beneficiaryName,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Text(
                        text = "${meal.mealType.displayName} • ${meal.dateIso}",
                        style = MaterialTheme.typography.labelSmall,
                        color = TextSecondary
                    )
                }
                StatusBadge(status = meal.status)
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = meal.foodName,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                color = TextPrimary
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Nutrient highlights
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                NutrientChip(label = "${meal.nutrients.calories.toInt()} kcal", color = TealLight, textColor = TealDark)
                NutrientChip(label = "${meal.nutrients.protein}g protein", color = Color(0xFFEFF6FF), textColor = Color(0xFF1D4ED8))
                NutrientChip(label = "${meal.nutrients.iron}mg iron", color = Color(0xFFFEF3C7), textColor = Color(0xFFB45309))
                NutrientChip(label = "${meal.nutrients.calcium.toInt()}mg Ca", color = Color(0xFFF3E8FF), textColor = Color(0xFF7E22CE))
            }

            if (meal.status == "Review") {
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.End
                ) {
                    OutlinedButton(
                        onClick = onConfirm,
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Check, contentDescription = null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Confirm Portion", style = MaterialTheme.typography.labelSmall)
                    }
                }
            }
        }
    }
}

@Composable
fun NutrientChip(label: String, color: Color, textColor: Color) {
    Surface(
        color = color,
        shape = RoundedCornerShape(6.dp)
    ) {
        Text(
            text = label,
            color = textColor,
            style = MaterialTheme.typography.labelSmall,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
        )
    }
}

@Composable
fun LogMealDialog(
    beneficiaries: List<BeneficiaryProfile>,
    onDismiss: () -> Unit,
    onConfirm: (MealRecord) -> Unit
) {
    var selectedBeneficiaryId by remember { mutableStateOf(beneficiaries.firstOrNull()?.id ?: "") }
    var selectedMealType by remember { mutableStateOf(MealType.LUNCH) }
    var foodName by remember { mutableStateOf("") }
    var calories by remember { mutableStateOf("300") }
    var protein by remember { mutableStateOf("10") }
    var iron by remember { mutableStateOf("2.5") }
    var calcium by remember { mutableStateOf("80") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Log Meal Entry") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = "Beneficiary: ${beneficiaries.firstOrNull { it.id == selectedBeneficiaryId }?.name ?: "None"}",
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold
                )
                OutlinedTextField(
                    value = foodName,
                    onValueChange = { foodName = it },
                    label = { Text("Food Items (e.g. Chapati, dal & salad)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = calories,
                        onValueChange = { calories = it },
                        label = { Text("Calories") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = protein,
                        onValueChange = { protein = it },
                        label = { Text("Protein (g)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f)
                    )
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = iron,
                        onValueChange = { iron = it },
                        label = { Text("Iron (mg)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = calcium,
                        onValueChange = { calcium = it },
                        label = { Text("Calcium (mg)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val beneficiary = beneficiaries.firstOrNull { it.id == selectedBeneficiaryId }
                    if (beneficiary != null && foodName.isNotBlank()) {
                        val meal = MealRecord(
                            id = "ML" + UUID.randomUUID().toString().take(6).uppercase(),
                            beneficiaryId = beneficiary.id,
                            beneficiaryName = beneficiary.name,
                            dateIso = "Today",
                            mealType = selectedMealType,
                            foodName = foodName.trim(),
                            nutrients = NutrientInfo(
                                calories = calories.toDoubleOrNull() ?: 300.0,
                                carbohydrates = 45.0,
                                protein = protein.toDoubleOrNull() ?: 10.0,
                                fibre = 5.0,
                                iron = iron.toDoubleOrNull() ?: 2.5,
                                calcium = calcium.toDoubleOrNull() ?: 80.0,
                                folicAcid = 25.0
                            ),
                            status = "Recorded"
                        )
                        onConfirm(meal)
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = TealPrimary)
            ) {
                Text("Save Meal")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}
