import { Injectable, Component, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReplaySubject } from 'rxjs';

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
  AdMobRewardItem,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';
import { PluginListenerHandle } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class AdmobService {
  private _isInterestialLoaded: boolean = false;

  private readonly listenerHandlers: PluginListenerHandle[] = [];
  private readonly lastBannerEvent$$ = new ReplaySubject<{
    name: string;
    value: any;
  }>(1);
  public readonly lastBannerEvent$ = this.lastBannerEvent$$.asObservable();

  private readonly lastRewardEvent$$ = new ReplaySubject<{
    name: string;
    value: any;
  }>(1);
  public readonly lastRewardEvent$ = this.lastRewardEvent$$.asObservable();

  /**
   * Height of AdSize
   */
  private appMargin = 0;
  private bannerPosition: 'top' | 'bottom';

  public isPrepareReward = false;

  public isLoading = false;

  constructor(private readonly ngZone: NgZone) {}

  initialize() {
    AdMob.initialize({
      requestTrackingAuthorization: false,
    });
  }

  private registerRewardListeners(): void {
    const eventKeys = Object.keys(RewardAdPluginEvents);

    eventKeys.forEach((key) => {
      console.log(`registering ${RewardAdPluginEvents[key]}`);
      const handler = AdMob.addListener(RewardAdPluginEvents[key], (value) => {
        console.log(`Reward Event "${key}"`, value);

        this.ngZone.run(() => {
          this.lastRewardEvent$$.next({ name: key, value: value });
        });
      });
      this.listenerHandlers.push(handler);
    });
  }

  private registerBannerListeners(): void {
    const eventKeys = Object.keys(BannerAdPluginEvents);

    eventKeys.forEach((key) => {
      console.log(`registering ${BannerAdPluginEvents[key]}`);
      const handler = AdMob.addListener(BannerAdPluginEvents[key], (value) => {
        console.log(`Banner Event "${key}"`, value);

        this.ngZone.run(() => {
          this.lastBannerEvent$$.next({ name: key, value: value });
        });
      });
      this.listenerHandlers.push(handler);
    });
  }

  private listenBannerChangeSize() {
    const resizeHandler = AdMob.addListener(
      BannerAdPluginEvents.SizeChanged,
      (info: AdMobBannerSize) => {
        this.appMargin = info.height;
        const app: HTMLElement = document.querySelector('ion-router-outlet');

        if (this.appMargin === 0) {
          app.style.marginTop = '';
          return;
        }

        if (this.appMargin > 0) {
          const body = document.querySelector('body');
          const bodyStyles = window.getComputedStyle(body);
          const safeAreaBottom = bodyStyles.getPropertyValue(
            '--ion-safe-area-bottom'
          );

          if (this.bannerPosition === 'top') {
            app.style.marginTop = this.appMargin + 'px';
          } else {
            app.style.marginBottom = `calc(${safeAreaBottom} + ${this.appMargin}px)`;
          }
        }
      }
    );

    this.listenerHandlers.push(resizeHandler);

    this.registerBannerListeners();
  }

  async showBanner(): Promise<void> {
    this.bannerPosition = 'bottom';
    this.listenBannerChangeSize();
    const options: BannerAdOptions = {
      adId: environment.admobId,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: false,
      // npa: true
    };

    const bannerOptions: BannerAdOptions = { ...options };
    console.log('Requesting banner with this options', bannerOptions);

    const result = await AdMob.showBanner(bannerOptions).catch((e) =>
      console.error(e)
    );

    if (result === undefined) {
      return;
    }
  }

  async prepareShortVideo(): Promise<void> {
    AdMob.addListener(
      InterstitialAdPluginEvents.Loaded,
      (info: AdLoadInfo) => {}
    );

    const options: AdOptions = {
      adId: environment.interestialId,
      isTesting: false,
      // npa: true
    };
    await AdMob.prepareInterstitial(options);
    this._isInterestialLoaded = true;
  }

  showShortVideo() {
    AdMob.showInterstitial();
  }

  get isInterestialLoaded() {
    return this._isInterestialLoaded;
  }

  /**
   * ==================== REWARD ====================
   */
  async prepareReward() {

    this.registerRewardListeners();
    const rewardOptions = {
      adId: environment.rewardInterestialId,
    };

    try {
      const result = await AdMob.prepareRewardVideoAd(rewardOptions);
      console.log('Reward prepared', result);
      this.isPrepareReward = true;
    } catch (e) {
      console.error('There was a problem preparing the reward', e);
    } finally {
      this.isLoading = false;
    }
  }

  async showReward() {
    const result: AdMobRewardItem = await AdMob.showRewardVideoAd().catch(
      (e) => undefined
    );
    if (result === undefined) {
      return;
    }

    this.isPrepareReward = false;
  }
}
