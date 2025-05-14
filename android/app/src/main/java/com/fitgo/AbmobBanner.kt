package fitme.health.fitness.homeworkouts.equipment

import android.app.Activity
import android.os.Build
import android.view.WindowMetrics
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.uimanager.ThemedReactContext
import com.fitgo.AdsId
import com.google.android.gms.ads.*
import com.google.android.gms.ads.AdView


object AdmobBanner {
    var mAdView: AdView? = null

    fun showBanner(activity: Activity, reactContext: ThemedReactContext): AdView? {
        mAdView = AdView(activity)
        mAdView?.adUnitId = AdsId.Bannerad
        mAdView?.setAdSize(AdSize.BANNER)
        val adRequest = AdRequest.Builder().build()
        mAdView?.loadAd(adRequest)
        mAdView?.adListener = object : AdListener() {
            override fun onAdLoaded() {
                println("admob.Ad Loaded")
                sendAdRefreshedEventToReactNative(reactContext)
            }

            override fun onAdClicked() {
                println("admob.Ad Clicked")
            }

            override fun onAdFailedToLoad(error: LoadAdError) {
                println("admob.Ad Load Failed: ${error.message}")
            }
        }

//        Handler(Looper.getMainLooper()).postDelayed({
//            mAdView?.loadAd(AdRequest.Builder().build())
//        }, 60000)
        return mAdView
    }

    private fun sendAdRefreshedEventToReactNative(reactContext: ThemedReactContext) {
        val params = Arguments.createMap()
        params.putString("type", "banner")
        params.putString("event", "refreshed")

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("BannerAdEvent", params)
    }

    private fun adSize(activity: Activity): AdSize {
        val displayMetrics = activity.resources.displayMetrics
        val adWidthPixels = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            val windowMetrics: WindowMetrics = activity.windowManager.currentWindowMetrics
            windowMetrics.bounds.width()
        } else {
            displayMetrics.widthPixels
        }
        val density = displayMetrics.density
        val adWidth = (adWidthPixels / density).toInt()
        return AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(activity, adWidth)
    }
}