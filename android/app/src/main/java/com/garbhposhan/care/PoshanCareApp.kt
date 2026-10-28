package com.garbhposhan.care

import android.app.Application
import com.garbhposhan.care.data.local.AppDatabase

class PoshanCareApp : Application() {

    val database: AppDatabase by lazy {
        AppDatabase.getInstance(this)
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
    }

    companion object {
        lateinit var instance: PoshanCareApp
            private set
    }
}
