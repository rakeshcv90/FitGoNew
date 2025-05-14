package fitme.health.fitness.homeworkouts.equipment

import android.app.Activity
import android.content.Context
import com.fitgo.AdsId
import fitme.health.fitness.homeworkouts.equipment.OnAdShownListener
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback

object AdmobInterstitial {
    private lateinit var mInterstitialAd: InterstitialAd
    private var adLoaded:Boolean = false
    //private var onAdLoadeds: OnAdLoaded?= null
    fun loadAdmobFullAD(context: Context) {
        
        var adRequest = AdRequest.Builder().build()
        InterstitialAd.load(
            context,
            AdsId.Interstialad,
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdFailedToLoad(p0: LoadAdError) {
                    super.onAdFailedToLoad(p0)
                    println("cviengine.AdmobInterstitialAd.onAdFailedToLoad .. ${p0.message}")
//                    onAdLoaded.adLoadedCheck(true)
                }

                override fun onAdLoaded(interstitialAd: InterstitialAd) {
                    super.onAdLoaded(interstitialAd)
                    mInterstitialAd = interstitialAd
                    adLoaded = true
//                    onAdLoaded.adLoadedCheck(true)
                    println("cviengine.AdmobInterstitialAd.onAdLoaded ")
                }
            })
    }

    fun loadAdmobFullADforInternal(context: Context) {
        var adRequest = AdRequest.Builder().build()
        InterstitialAd.load(
            context,
            AdsId.Interstialad,
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdFailedToLoad(p0: LoadAdError) {
                    super.onAdFailedToLoad(p0)
                    println("cviengine.AdmobInterstitialAd.onAdFailedToLoad .. ${p0.message}")
                }

                override fun onAdLoaded(interstitialAd: InterstitialAd) {
                    super.onAdLoaded(interstitialAd)
                    mInterstitialAd = interstitialAd
                    adLoaded = true
                    println("cviengine.AdmobInterstitialAd.onAdLoaded ")
                }
            })
    }

    fun showInterstialADmobAd(context: Activity, onAdShownListener: OnAdShownListener) {
        //EngineConstant.LOCAL_AD_COUNT = 0
        println("cviengine.AdmobInterstitialAd.onAdLoaded  or not in local save ... $adLoaded")
        if(adLoaded) {
            adLoaded = false
            mInterstitialAd.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdClicked() {
                    super.onAdClicked()
                }

                override fun onAdDismissedFullScreenContent() {
                    super.onAdDismissedFullScreenContent()
                    loadAdmobFullADforInternal(context)
                    println("cviengine.AdmobInterstitialAd.onAdDismissedFullScreenContent")
                    onAdShownListener.toLaunchPageInAfterAd()
                   // EngineConstant.fullAdLoaded = false
                    //EngineConstant.onAdClosed = true
                }

                override fun onAdFailedToShowFullScreenContent(p0: AdError) {
                    super.onAdFailedToShowFullScreenContent(p0)
                    println("cviengine.AdmobInterstitialAd.onAdFailedToShowFullScreenContent")
                    onAdShownListener.toLaunchPageInAfterAd()
                }

                override fun onAdImpression() {
                    super.onAdImpression()
                }

                override fun onAdShowedFullScreenContent() {
                    super.onAdShowedFullScreenContent()
                    println("cviengine.AdmobInterstitialAd.onAdShowedFullScreenContent")
                   // EngineConstant.fullAdLoaded = true
                }
            }
            mInterstitialAd.show(context)
        }else{
            onAdShownListener.toLaunchPageInAfterAd()
        }
    }
}