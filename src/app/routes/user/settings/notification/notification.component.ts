import { ChangeDetectionStrategy, Component } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-account-settings-notification',
  templateUrl: './notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsNotificationComponent {
  i: any = {
    password: true,
    messages: true,
    todo: true,
  };
  constructor(public msg: NzMessageService) {}
}