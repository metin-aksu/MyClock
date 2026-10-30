package com.myclock

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Yalnız uygulamanın penceresinin parlaklığını değiştirir, bu yüzden izin gerektirmez
 * ve uygulamadan çıkınca sistem ayarı geçerli olur. Negatif değer sistem ayarına döner.
 */
class ScreenBrightnessModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "ScreenBrightness"

  @ReactMethod
  fun setBrightness(value: Double) {
    val activity = reactApplicationContext.currentActivity ?: return
    activity.runOnUiThread {
      val attributes = activity.window.attributes
      attributes.screenBrightness = value.toFloat()
      activity.window.attributes = attributes
    }
  }
}
