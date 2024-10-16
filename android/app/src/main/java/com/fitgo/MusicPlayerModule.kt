package fitme.health.fitness.homeworkouts.equipment

import android.media.MediaPlayer
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.IOException

class MusicPlayerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var mediaPlayer: MediaPlayer? = null
    private var isPaused: Boolean = false
    private var isInitialized: Boolean = false

    override fun getName(): String {
        return "MusicPlayer"
    }

    // Method to Setup Music Player
    @ReactMethod
    fun setupPlayer(audioSource: String, promise: Promise) {
        Log.d("MusicPlayer", "CALLED")
        if (mediaPlayer == null) {
            try {
//                mediaPlayer = MediaPlayer.create(reactApplicationContext, audioSource)
                if (BuildConfig.DEBUG) {
                    mediaPlayer = MediaPlayer().apply {
                        setDataSource(audioSource)
                        prepare()
                    }
                } else {
                    mediaPlayer = MediaPlayer().apply {
                        setDataSource(audioSource)  // Set URL directly
                        prepareAsync()  // Use prepareAsync for URL streams
                        setOnPreparedListener {
                            isInitialized = true
                            Log.d("MusicPlayer", "Audio is ready to play.")
                            promise.resolve(isInitialized)
                        }
                    }
                    // FOR LOCAL AUDIOS
//                    val resId = reactApplicationContext.resources.getIdentifier(
//                        audioSource, "raw", reactApplicationContext.packageName
//                    )
//
//                    if (resId != 0) {
//                        // Play the bundled resource by resource ID
//                        mediaPlayer = MediaPlayer.create(reactApplicationContext, resId)
//                        Log.d("MusicPlayer", "Playing audio from resource.")
//                    } else {
//                        isInitialized = false
//                        promise.reject("error", "Resource not found: $audioSource")
//                    }
                }
                isInitialized = true
            } catch (e: IOException) {
                isInitialized = false
                e.printStackTrace()
                promise.reject("MusicPlayer", "Failed to play audio.${e.message}")
            }
        }
        Log.d("MusicPlayer", "$mediaPlayer")
        promise.resolve(isInitialized)
    }

    // Method to play an audio file
    @ReactMethod
    fun play(loop: Boolean = false) {
        mediaPlayer?.start()
        mediaPlayer?.isLooping = loop
        isPaused = false
        Log.d(
            "MusicPlayer",
            "Playing audio. and $loop and $mediaPlayer Player Initialized $isInitialized"
        )

//        mediaPlayer?.setOnCompletionListener {
//            releaseMediaPlayer()
//            Log.d("MusicPlayer", "Audio playback completed.")
//        }
//       if (isPaused) {
//            mediaPlayer?.start()
//            isPaused = false
//            Log.d("MusicPlayer", "Resuming audio playback.")
//        } else
//            if (mediaPlayer != null && mediaPlayer!!.isPlaying) {
//            stopMusic()
//        }
    }

    @ReactMethod
    fun getMusicDuration(promise: Promise) {
        if (mediaPlayer != null) {
            val durationInMillis = mediaPlayer!!.duration
            val duration = durationInMillis / 1000
            promise.resolve(duration)
        }
        promise.resolve(0)
    }

    // Method to pause audio playback
    @ReactMethod
    fun pause() {
        if (mediaPlayer != null && mediaPlayer!!.isPlaying) {
            mediaPlayer?.pause()
            isPaused = true
            Log.d("MusicPlayer", "Audio playback paused.")
        }
    }

    // Method to stop the audio playback
    @ReactMethod
    fun stopMusic() {
        mediaPlayer?.let {
            if (it.isPlaying || isPaused) {
                it.stop()
                Log.d("MusicPlayer", "Audio playback stopped.")
//                releaseMediaPlayer()
            }
        }
    }

    // Release media player resources
    @ReactMethod
    private fun releaseMediaPlayer() {
        Log.d("MusicPlayer....RELEASE", "$mediaPlayer")
        mediaPlayer?.release()
        mediaPlayer = null
        isPaused = false
    }
}