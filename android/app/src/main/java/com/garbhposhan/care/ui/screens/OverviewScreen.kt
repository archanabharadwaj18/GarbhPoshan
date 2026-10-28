package com.garbhposhan.care.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Assignment
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.garbhposhan.care.model.BeneficiaryProfile
import com.garbhposhan.care.model.MealRecord
import com.garbhposhan.care.ui.theme.*

@Composable
fun OverviewScreen(
    beneficiaries: List<BeneficiaryProfile>,
    meals: List<MealRecord>,
    modifier: Modifier = Modifier
) {
    val reviewCount = beneficiaries.count { it.status == "Review" || it.status == "Follow-up" }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(BackgroundLight)
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Welcome Card
        Card(
            colors = CardDefaults.cardColors(containerColor = TealLight),
            shape = RoundedCornerShape(16.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "MATERNAL HEALTH • ASHA DASHBOARD",
                    style = MaterialTheme.typography.labelSmall,
                    color = TealDark,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Poshan Care",
                    style = MaterialTheme.typography.titleLarge,
                    color = TealDark,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "Supporting maternal nutrition through accessible meal tracking.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextSecondary
                )
            }
        }

        // Stat Grid
        Text(
            text = "System Overview",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatCard(
                title = "Beneficiaries",
                count = "${beneficiaries.size}",
                subtitle = "Assigned in area",
                icon = Icons.Default.People,
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = "Meals Logged",
                count = "${meals.size}",
                subtitle = "Recorded entries",
                icon = Icons.Default.Restaurant,
                modifier = Modifier.weight(1f)
            )
        }

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatCard(
                title = "Needs Review",
                count = "$reviewCount",
                subtitle = "Records to check",
                icon = Icons.Default.Assignment,
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = "Offline Status",
                count = "Active",
                subtitle = "Local Room sync",
                icon = Icons.Default.Favorite,
                modifier = Modifier.weight(1f)
            )
        }
    }
}

@Composable
fun StatCard(
    title: String,
    count: String,
    subtitle: String,
    icon: ImageVector,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = SurfaceLight),
        shape = RoundedCornerShape(12.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(text = title, style = MaterialTheme.typography.labelSmall, color = TextSecondary)
                Icon(imageVector = icon, contentDescription = null, tint = TealPrimary, modifier = Modifier.size(18.dp))
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = count,
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = subtitle, style = MaterialTheme.typography.labelSmall, color = TextSecondary)
        }
    }
}
