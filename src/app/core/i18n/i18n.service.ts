import { registerLocaleData } from '@angular/common';
import ngEn from '@angular/common/locales/en';
import ngVi from '@angular/common/locales/vi';
import { Injectable } from '@angular/core';
import {
  AlainI18NService,
  DelonLocaleService,
  en_US as delonEnUS,
  SettingsService,
} from '@delon/theme';
import { TranslateService } from '@ngx-translate/core';
import { enUS as dfEn, vi as dfVn } from 'date-fns/locale';
import {
  en_US as zorroEnUS,
  vi_VN as zorroViVN,
  NzI18nService,
} from 'ng-zorro-antd/i18n';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

interface LangData {
  text: string;
  ng: any;
  zorro: any;
  date: any;
  delon: any;
  abbr: string;
}

const DEFAULT = 'vi-VN';
const LANGS: { [key: string]: LangData } = {
  'vi-VN': {
    text: 'Tiếng Việt',
    ng: ngVi,
    zorro: zorroViVN,
    date: dfVn,
    delon: delonEnUS,
    abbr: 'vi',
  },
  'en-US': {
    text: 'English',
    ng: ngEn,
    zorro: zorroEnUS,
    date: dfEn,
    delon: delonEnUS,
    abbr: '🇬🇧',
  },
};

@Injectable({ providedIn: 'root' })
export class I18NService implements AlainI18NService {
  private _default = DEFAULT;
  private change$ = new BehaviorSubject<string | null>(null);

  private _langs = Object.keys(LANGS).map((code) => {
    const item = LANGS[code];
    return { code, text: item.text, abbr: item.abbr };
  });

  constructor(
    private settings: SettingsService,
    private nzI18nService: NzI18nService,
    private delonLocaleService: DelonLocaleService,
    private translate: TranslateService
  ) {
    // `@ngx-translate/core` Know in advance which languages are supported
    const lans = this._langs.map((item) => item.code);
    translate.addLangs(lans);

    const defaultLan = this.getDefaultLang();
    if (lans.includes(defaultLan)) {
      this._default = defaultLan;
    }

    this.updateLangData(this._default);
  }

  private getDefaultLang(): string | undefined {
    if (this.settings.layout.lang) {
      return this.settings.layout.lang;
    }
    return (
      (navigator.languages ? navigator.languages[0] : null) ||
      navigator.language
    );
  }

  private updateLangData(lang: string) {
    const item = LANGS[lang];
    registerLocaleData(item.ng);
    this.nzI18nService.setLocale(item.zorro);
    this.nzI18nService.setDateLocale(item.date);
    this.delonLocaleService.setLocale(item.delon);
  }

  get change(): Observable<string> {
    return this.change$
      .asObservable()
      .pipe(filter((w) => w != null)) as Observable<string>;
  }

  use(lang: string): void {
    lang = lang || this.translate.getDefaultLang();
    if (this.currentLang === lang) {
      return;
    }
    this.updateLangData(lang);
    this.translate.use(lang).subscribe(() => this.change$.next(lang));
  }
  /** Get a list of languages */
  getLangs() {
    return this._langs;
  }
  /** translation */
  fanyi(key: string, interpolateParams?: {}) {
    return this.translate.instant(key, interpolateParams);
  }
  /** default language */
  get defaultLang() {
    return this._default;
  }
  /** Current language */
  get currentLang() {
    return (
      this.translate.currentLang ||
      this.translate.getDefaultLang() ||
      this._default
    );
  }
}
