import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '@env/environment';
import { serviceAPI } from 'src/app/core/constants/service-api';
import { messageForUser } from 'src/app/core/constants/message-for-user';

@Component({
  selector: 'app-store-settings',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreSettingsComponent implements OnInit {
  constructor(
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService
  ) {}
  storeLoading = true;

  store: any;

  ngOnInit(): void {
    this.http
      .post(`${environment.API_URL}` + serviceAPI.POST_STORE)
      .subscribe((res: any) => {
        this.storeLoading = false;

        if (res.isFailed) {
          this.msg.error(res.errors[0].message);
          return;
        }

        this.store = res.value;
        this.cdr.detectChanges();
      });
  }
  // #endregion

  save() {
    if (!this.store.storeName) {
      this.msg.error(messageForUser.STORE_NAME_REQUIRE);
      return;
    }
    if (!this.store.address) {
      this.msg.error(messageForUser.ADDRESS_REQUIRE);
      return;
    }
    this.http
      .post(`${environment.API_URL}` + serviceAPI.POST_CRU_STORE, {
        storeId: this.store.storeId,
        storeName: this.store.storeName,
        address: this.store.address,
      })
      .subscribe((res: any) => {
        if (res.isFailed) {
          this.msg.error(res.errors[0].message);
          return;
        }

        this.store = res.value;
        this.msg.success(messageForUser.USERPROFILE_SUCCESS);
      });
  }
}
