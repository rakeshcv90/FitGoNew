//
//  MusicPlayer.m
//  FitGo
//
//  Created by Sahil on 16/10/24.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(MusicPlayer, NSObject)

// Expose the setupPlayer method
RCT_EXTERN_METHOD(setupPlayer:(NSString *)audioSource resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)

// Expose the play method
RCT_EXTERN_METHOD(play:(BOOL)loop)

// Expose the pause method
RCT_EXTERN_METHOD(pause)

// Expose the stopMusic method
RCT_EXTERN_METHOD(stopMusic)

RCT_EXTERN_METHOD(stopMusicandReset)

// Expose the getMusicDuration method
RCT_EXTERN_METHOD(getMusicDuration:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)

// Expose the releaseMediaPlayer method
RCT_EXTERN_METHOD(releaseMediaPlayer)

@end

