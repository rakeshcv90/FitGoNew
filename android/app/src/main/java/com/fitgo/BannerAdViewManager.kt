package fitme.health.fitness.homeworkouts.equipment

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import android.widget.FrameLayout



class BannerAdViewManager : SimpleViewManager<FrameLayout>() {

    override fun getName() = "RCTBannerAdView"

    override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
        val frameLayout = FrameLayout(reactContext)
        val activity = reactContext.currentActivity
        if (activity != null) {
            val adView = AdmobBanner.showBanner(activity, reactContext)
            if (adView?.parent != null) {
                (adView.parent as? FrameLayout)?.removeView(adView)
            }
            frameLayout.addView(adView)

        }
        return frameLayout
    }
}