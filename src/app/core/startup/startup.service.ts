import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ACLService } from '@delon/acl';
import {
  ALAIN_I18N_TOKEN,
  MenuService,
  SettingsService,
  TitleService,
} from '@delon/theme';
import { TranslateService } from '@ngx-translate/core';
import { NzIconService } from 'ng-zorro-antd/icon';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { I18NService } from '../i18n/i18n.service';

/**
 * Used when the application starts
 * Generally used to obtain the basic data required by the application, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    private httpClient: HttpClient
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve) => {
      zip(
        this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
        this.httpClient.get('assets/tmp/app-data.json')
      )
        .pipe(
          // Exception messages generated after receiving other interceptors
          catchError((res) => {
            console.warn(`StartupService.load: Network request failed`, res);
            resolve(null);
            return [];
          })
        )
        .subscribe(
          ([langData, appData]) => {
            // setting language data
            this.translate.setTranslation(this.i18n.defaultLang, langData);
            this.translate.setDefaultLang(this.i18n.defaultLang);

            // application data
            const res: any = appData;
            // Application information: including site name, description, year
            this.settingService.setApp(res.app);
            // User information: including name, avatar, email address
            this.settingService.setUser(res.user);
            // ACL: set permissions to full
            this.aclService.setFull(true);
            // Initialize the menu
            this.menuService.add(res.menu);
            // Set the suffix of the page title
            this.titleService.default = '';
            this.titleService.suffix = res.app.name;
          },
          () => {},
          () => {
            resolve(null);
          }
        );
    });
  }
}
