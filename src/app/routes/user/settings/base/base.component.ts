import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { zip } from 'rxjs';
import { environment } from '@env/environment';
import { serviceAPI } from 'src/app/core/constants/service-api';
import { messageForUser } from 'src/app/core/constants/message-for-user';

@Component({
  selector: 'app-account-settings-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsBaseComponent implements OnInit {
  constructor(
    private http: _HttpClient,
    private cdr: ChangeDetectorRef,
    private msg: NzMessageService
  ) {}
  avatar = './assets/tmp/img/avatar.jpg';
  userLoading = true;
  user: any;

  provinces: any[] = [];
  cities: any[] = [];

  geographic: any = {
    country: {
      key: '84',
      label: 'Việt Nam',
    },
    city: {
      key: '100000',
      label: 'Hà Nội',
    },
    province: {
      key: '100000',
      label: 'Thanh Trì',
    },
  };

  ngOnInit(): void {
    zip(
      this.http.post(`${environment.API_URL}` + serviceAPI.POST_CURRENT_USER),
      this.http.get('/geo/province')
    ).subscribe(([user, province]: any) => {
      this.userLoading = false;
      this.user = user;
      this.user.avatar = this.avatar;
      this.user.geographic = this.geographic;
      this.provinces = province;
      this.choProvince(this.geographic.province.key, false);
      this.cdr.detectChanges();
    });
  }

  choProvince(pid: string, cleanCity = true) {
    this.http.get(`/geo/${pid}`).subscribe((res: any) => {
      this.cities = res;
      if (cleanCity) {
        this.user.geographic.city.key = '';
      }
      this.cdr.detectChanges();
    });
  }

  // #endregion

  save() {
    if (!this.user.email) {
      this.msg.error(messageForUser.EMAIL_REQUIRE);
      return;
    }
    if (!this.user.firstName) {
      this.msg.error(messageForUser.FIRSTNAME_REQUIRE);
      return;
    }
    if (!this.user.lastName) {
      this.msg.error(messageForUser.LASTNAME_REQUIRE);
      return;
    }
    if (!this.user.address) {
      this.msg.error(messageForUser.ADDRESS_REQUIRE);
      return;
    }
    if (!this.user.phoneNumber) {
      this.msg.error(messageForUser.PHONENUMBER_REQUIRE);
      return;
    }
    this.http
      .post(`${environment.API_URL}` + serviceAPI.POST_USER_PROFILE, this.user)
      .subscribe((res: any) => {
        if (res.isFailed) {
          this.msg.error(res.errors[0].message);
          return;
        }

        this.user = res.value;
        this.user.avatar = this.avatar;
        this.msg.success(messageForUser.USERPROFILE_SUCCESS);
      });
  }
}
