package com.groupys;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.brentvatne.react.ReactVideoPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.microsoft.codepush.react.CodePush;

import com.ocetnik.timer.BackgroundTimerPackage;
import com.farmisen.react_native_file_uploader.RCTFileUploaderPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.yoloci.fileupload.FileUploadPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.react.modules.i18nmanager.I18nUtil;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RCTCameraPackage(),
            new ReactNativeYouTube(),
            new ReactVideoPackage(),
            new ReactNativeLocalizationPackage(),
            new LinearGradientPackage(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            new BackgroundTimerPackage(),
            new RCTFileUploaderPackage(),
            new ReactNativeContacts(),
            new FileUploadPackage(),
            new PickerPackage(),
            new VectorIconsPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
    sharedI18nUtilInstance.allowRTL(getApplicationContext(), true);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
