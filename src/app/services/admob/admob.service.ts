import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import {
  AdMob,
  BannerAdOptions,
  BannerAdSize,
  BannerAdPosition,
  BannerAdPluginEvents,
  AdMobBannerSize,
  AdOptions,
  AdLoadInfo,
  InterstitialAdPluginEvents,
} from '@capacitor-community/admob';

@Injectable({
  providedIn: 'root',
})
export class AdmobService {
  private _isInterestialLoaded : boolean = false;
  constructor() {}

  initialize() {
    AdMob.initialize({
      requestTrackingAuthorization: false,
    });
  }

  async showBanner(): Promise<void> {
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      // Subscribe Banner Event Listener
    });

    AdMob.addListener(
      BannerAdPluginEvents.SizeChanged,
      (size: AdMobBannerSize) => {
        // Subscribe Change Banner Size
      }
    );

    const options: BannerAdOptions = {
      adId: environment.admobId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: !environment.production,
      // npa: true
    };
    AdMob.showBanner(options);
  }

  async prepareShortVideo(): Promise<void> {
    AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
      this._isInterestialLoaded = true;
    });

    const options: AdOptions = {
      adId: environment.interestialId,
      isTesting: !environment.production,
      // npa: true
    };
    await AdMob.prepareInterstitial(options);
  }

  showShortVideo()
  {
    AdMob.showInterstitial();
  }

  get isInterestialLoaded()
  {
    return this._isInterestialLoaded;
  }
}
