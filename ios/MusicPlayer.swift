//
//  MusicPlayer.swift
//  FitGo
//
//  Created by Sahil on 16/10/24.
//
import Foundation
import AVFoundation
import React

@objc(MusicPlayer)
class MusicPlayer: NSObject {
  private var audioPlayer: AVPlayer?
  private var isInitialized: Bool = false

  @objc(setupPlayer:resolver:rejecter:)
  func setupPlayer(audioSource: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    // Check if the audioSource is a valid URL
    if let audioURL = URL(string: audioSource), audioURL.scheme?.hasPrefix("http") == true {
      // Remote URL case
      audioPlayer = AVPlayer(url: audioURL)
    } else {
      // Local file case
      guard let localFileURL = Bundle.main.url(forResource: audioSource, withExtension: nil) else {
        rejecter("Error", "Invalid file path or URL: \(audioSource)", nil)
        return
      }
      audioPlayer = AVPlayer(url: localFileURL)
    }
    
    audioPlayer?.automaticallyWaitsToMinimizeStalling = false
    isInitialized = true
    // Pause the player immediately after setting it up
    audioPlayer?.pause()
    resolver(isInitialized)
  }

  @objc(play:)
  func play(loop: Bool = false) {
    audioPlayer?.play()
    if loop {
      NotificationCenter.default.addObserver(self, selector: #selector(restartMusic), name: .AVPlayerItemDidPlayToEndTime, object: audioPlayer?.currentItem)
    }
  }

  @objc private func restartMusic() {
    audioPlayer?.seek(to: CMTime.zero)
    audioPlayer?.play()
  }

  @objc(pause)
  func pause() {
    audioPlayer?.pause()
  }

  @objc(stopMusic)
  func stopMusic() {
    audioPlayer?.pause()
    audioPlayer?.seek(to: CMTime.zero)
  }

  @objc(getMusicDuration:rejecter:)
  func getMusicDuration(resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
      if let currentItem = audioPlayer?.currentItem {
          let duration = CMTimeGetSeconds(currentItem.duration)
          
          // Check if the duration is a valid finite number
          if duration.isFinite {
              resolver(Int(duration))
          } else {
              // If duration is not valid, return 0 or an appropriate error
              resolver(0)
          }
      } else {
          resolver(0)  // Return 0 if there is no current item
      }
  }

  @objc(releaseMediaPlayer)
  func releaseMediaPlayer() {
    audioPlayer = nil
    isInitialized = false
  }
}
