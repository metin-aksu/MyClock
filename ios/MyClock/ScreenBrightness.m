#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>

static const CGFloat kNoBrightness = -1;

// iOS'ta parlaklık tüm cihaz için geçerlidir. Uygulama öne çıkmadan önce sistem değeri
// saklanır, uygulama aktifliğini kaybederken geri yüklenir.
@interface ScreenBrightness : NSObject <RCTBridgeModule>
@end

@implementation ScreenBrightness {
  CGFloat _targetBrightness;
  CGFloat _systemBrightness;
}

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

- (instancetype)init
{
  if (self = [super init]) {
    _targetBrightness = kNoBrightness;
    _systemBrightness = kNoBrightness;
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    [center addObserver:self
               selector:@selector(restoreSystemBrightness)
                   name:UIApplicationWillResignActiveNotification
                 object:nil];
    [center addObserver:self
               selector:@selector(applyTargetBrightness)
                   name:UIApplicationDidBecomeActiveNotification
                 object:nil];
  }
  return self;
}

- (void)restoreSystemBrightness
{
  if (_systemBrightness != kNoBrightness) {
    [UIScreen mainScreen].brightness = _systemBrightness;
    _systemBrightness = kNoBrightness;
  }
}

- (void)applyTargetBrightness
{
  if (_targetBrightness == kNoBrightness ||
      [UIApplication sharedApplication].applicationState != UIApplicationStateActive) {
    return;
  }
  if (_systemBrightness == kNoBrightness) {
    _systemBrightness = [UIScreen mainScreen].brightness;
  }
  [UIScreen mainScreen].brightness = _targetBrightness;
}

// Negatif değer sistem parlaklığına döner
RCT_EXPORT_METHOD(setBrightness:(double)value)
{
  if (value < 0) {
    _targetBrightness = kNoBrightness;
    [self restoreSystemBrightness];
  } else {
    _targetBrightness = value;
    [self applyTargetBrightness];
  }
}

@end
