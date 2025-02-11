#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
//#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "RCTAppleHealthKit.h"
#import <Firebase.h>
#import <CodePush/CodePush.h>
#import "FitGo-Swift.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  self.moduleName = @"FitGo";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self
                                             launchOptions:launchOptions];
   [[RCTAppleHealthKit new] initializeBackgroundObservers:bridge];
  self.initialProps = @{};
//  [[FBSDKApplicationDelegate sharedInstance] application:application
//                             didFinishLaunchingWithOptions:launchOptions];
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}
 
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}
 
- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
return [CodePush bundleURL];
//return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


@end
