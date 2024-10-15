package fitme.health.fitness.homeworkouts.equipment

import android.media.MediaPlayer
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.IOException

class MusicPlayerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var mediaPlayer: MediaPlayer? = null
    private var isPaused: Boolean = false

    override fun getName(): String {
        return "MusicPlayer"
    }

    // Method to play an audio file
    @ReactMethod
    fun play(audioSource: String) {
        Log.d("MusicPlayer.play .... .", "$audioSource")
        if (mediaPlayer == null) {
            try {
//                mediaPlayer = MediaPlayer.create(reactApplicationContext, audioSource)
                if (BuildConfig.DEBUG) {
                    mediaPlayer = MediaPlayer().apply {
                        setDataSource(audioSource)
                        prepare()
                    }
                    mediaPlayer?.start()
                } else {
                    val resId = reactApplicationContext.resources.getIdentifier(
                        audioSource, "raw", reactApplicationContext.packageName
                    )

                    Log.d("MusicPlayer.REID .... .", "$resId")
                    if (resId != 0) {
                        // Play the bundled resource by resource ID
                        mediaPlayer = MediaPlayer.create(reactApplicationContext, resId)
                        mediaPlayer?.start()
                        Log.d("MusicPlayer", "Playing audio from resource.")
                    } else {
                        Log.e("MusicPlayer", "Resource not found: $audioSource")
                    }
                }
                isPaused = false
                Log.d("MusicPlayer", "Playing audio.")

                mediaPlayer?.setOnCompletionListener {
                    releaseMediaPlayer()
                    Log.d("MusicPlayer", "Audio playback completed.")
                }
            } catch (e: IOException) {
                e.printStackTrace()
                Log.e("MusicPlayer", "Failed to play audio.${e.message}")
            }
        } else if (isPaused) {
            mediaPlayer?.start()
            isPaused = false
            Log.d("MusicPlayer", "Resuming audio playback.")
        } else if (mediaPlayer != null && mediaPlayer!!.isPlaying) {
            stopMusic()
        }
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
                releaseMediaPlayer()
            }
        }
    }

    // Release media player resources
    private fun releaseMediaPlayer() {
        mediaPlayer?.release()
        mediaPlayer = null
        isPaused = false
    }
}