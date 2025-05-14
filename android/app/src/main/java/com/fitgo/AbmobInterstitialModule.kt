package fitme.health.fitness.homeworkouts.equipment

import android.app.Activity
import android.content.Context
import android.os.Handler
import android.os.Looper
import fitme.health.fitness.homeworkouts.equipment.AdmobInterstitial
import fitme.health.fitness.homeworkouts.equipment.OnAdShownListener
import com.facebook.react.bridge.*

class AdmobInterstitialModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AdmobInterstitial"
    }

    @ReactMethod
    fun loadAd(promise: Promise) {
        val context: Context = reactApplicationContext
        Handler(Looper.getMainLooper()).post {
            try {
                AdmobInterstitial.loadAdmobFullAD(context)
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("LOAD_AD_ERROR", "Failed to load ad: ${e.message}", e)
            }
        }
        
    }

    @ReactMethod
    fun showAd(promise: Promise) {
        val activity: Activity = currentActivity ?: run {
            promise.reject("NO_ACTIVITY", "Activity is null")
            return
        }

        Handler(Looper.getMainLooper()).post {
            try {
                AdmobInterstitial.showInterstialADmobAd(activity, object : OnAdShownListener {
                    override fun toLaunchPageInAfterAd() {
                        promise.resolve(true)
                    }
                })
            } catch (e: Exception) {
                promise.reject("SHOW_AD_ERROR", "Failed to show ad: ${e.message}", e)
            }
        }
    }
}