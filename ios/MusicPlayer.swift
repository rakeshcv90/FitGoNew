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
  private var statusObservation: NSKeyValueObservation?
  private var setupResolver: RCTPromiseResolveBlock?
  private var setupRejecter: RCTPromiseRejectBlock?

  @objc static func requiresMainQueueSetup() -> Bool {
    return true
  }

  @objc(setupPlayer:resolver:rejecter:)
  func setupPlayer(audioSource: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    // Configure audio session for playback (overrides silent switch)
    do {
      try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [])
      try AVAudioSession.sharedInstance().setActive(true)
    } catch {
      print("MusicPlayer: Failed to set audio session category: \(error)")
    }

    // Clean up any previous player and observer
    cleanupObservation()
    if audioPlayer != nil {
      audioPlayer?.pause()
      audioPlayer = nil
      isInitialized = false
    }

    self.setupResolver = resolver
    self.setupRejecter = rejecter

    // Check if the audioSource is a valid URL
    if let audioURL = URL(string: audioSource), audioURL.scheme?.hasPrefix("http") == true {
      // Remote URL case
      let asset = AVURLAsset(url: audioURL)
      let playerItem = AVPlayerItem(asset: asset)
      audioPlayer = AVPlayer(playerItem: playerItem)
    } else {
      // Local file case
      guard let localFileURL = Bundle.main.url(forResource: audioSource, withExtension: nil) else {
        rejecter("Error", "Invalid file path or URL: \(audioSource)", nil)
        return
      }
      audioPlayer = AVPlayer(url: localFileURL)
    }
    
    // Allow iOS to buffer the remote stream before playing
    audioPlayer?.automaticallyWaitsToMinimizeStalling = true
    
    // Pause the player immediately after setting it up
    audioPlayer?.pause()

    if let currentItem = audioPlayer?.currentItem {
        statusObservation = currentItem.observe(\.status, options: [.new, .initial]) { [weak self] (item, _) in
            // Dispatch to main thread — RCT promise callbacks must be on main
            DispatchQueue.main.async {
                guard let self = self else { return }
                if item.status == .readyToPlay {
                    self.isInitialized = true
                    print("MusicPlayer: readyToPlay — resolving setup promise")
                    self.setupResolver?(true)
                    self.cleanupObservation()
                } else if item.status == .failed {
                    print("MusicPlayer: failed to load — \(item.error?.localizedDescription ?? "unknown error")")
                    self.setupRejecter?("Error", "Failed to load audio: \(item.error?.localizedDescription ?? "unknown")", nil)
                    self.cleanupObservation()
                }
            }
        }
    } else {
        rejecter("Error", "Could not create currentItem", nil)
    }
  }

  private func cleanupObservation() {
      self.statusObservation?.invalidate()
      self.statusObservation = nil
      self.setupResolver = nil
      self.setupRejecter = nil
  }

  @objc(play:)
  func play(loop: Bool = false) {
    print("MusicPlayer: play() called, loop=\(loop), player=\(audioPlayer != nil)")
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
  
  @objc(stopMusicandReset)
  func stopMusicandReset() {
    if let player = audioPlayer, player.timeControlStatus == .playing || player.rate == 0 {
      player.pause()
      player.seek(to: CMTime.zero)
      print("Audio playback stopped and reset.")
    }
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
  
  // Function to get Current Music Position
  @objc(getCurrentPosition:rejecter:)
    func getCurrentPosition(resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
      if let currentItem = audioPlayer?.currentItem {
        let currentTime = CMTimeGetSeconds(currentItem.currentTime())
        if currentTime.isFinite {
          resolver(Int(currentTime))
        } else {
          resolver(0)
        }
      } else {
        resolver(0)
      }
    }

    // function to seek to a specific position in seconds
    @objc(seekTo:resolver:rejecter:)
    func seekTo(position: Int, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
      let seekTime = CMTimeMake(value: Int64(position), timescale: 1000)
      audioPlayer?.seek(to: seekTime, completionHandler: { completed in
        if completed {
          resolver(true)
        } else {
          rejecter("SeekError", "Failed to seek to position \(position)", nil)
        }
      })
    }
  
  @objc(releaseMediaPlayer)
  func releaseMediaPlayer() {
    NotificationCenter.default.removeObserver(self)
    cleanupObservation()
    audioPlayer?.pause()
    audioPlayer = nil
    isInitialized = false
  }
}
