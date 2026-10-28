package com.garbhposhan.care.vision

import com.garbhposhan.care.model.NutrientInfo

/**
 * Result of food recognition.
 * If model is not loaded or confidence is low, requiresConfirmation is true.
 */
data class RecognizedFoodResult(
    val foodName: String,
    val confidence: Float,
    val estimatedNutrients: NutrientInfo,
    val requiresManualConfirmation: Boolean,
    val modelNotice: String
)

/**
 * Interface contract for food recognition.
 * Any model implementation (e.g. TFLite MobileNet, YOLO, or Cloud CV Endpoint) must implement this interface.
 */
interface FoodRecognitionEngine {
    suspend fun recognizeMealFromImage(imageBytes: ByteArray): Result<RecognizedFoodResult>
}

/**
 * Stub / Placeholder engine.
 * IMPORTANT: No automated food recognition model is bundled in the app currently.
 * This stub transparently indicates that the model is uninstalled/mocked and marks entries
 * for manual worker review.
 */
class StubFoodRecognitionEngine : FoodRecognitionEngine {
    override suspend fun recognizeMealFromImage(imageBytes: ByteArray): Result<RecognizedFoodResult> {
        return Result.success(
            RecognizedFoodResult(
                foodName = "Estimated Mixed Meal (Unverified)",
                confidence = 0.0f,
                estimatedNutrients = NutrientInfo(
                    calories = 250.0,
                    carbohydrates = 40.0,
                    protein = 6.0,
                    fibre = 3.0,
                    iron = 1.5,
                    calcium = 30.0,
                    folicAcid = 15.0
                ),
                requiresManualConfirmation = true,
                modelNotice = "No trained ML model installed. Meal flagged for worker confirmation."
            )
        )
    }
}
