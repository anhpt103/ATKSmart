import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserSettingsBaseComponent } from './settings/base/base.component';
import { UserSettingsBindingComponent } from './settings/binding/binding.component';
import { UserSettingsNotificationComponent } from './settings/notification/notification.component';
import { UserSettingsSecurityComponent } from './settings/security/security.component';
import { UserSettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: 'settings',
    component: UserSettingsComponent,
    children: [
      { path: '', redirectTo: 'base', pathMatch: 'full' },
      {
        path: 'base',
        component: UserSettingsBaseComponent,
        data: { titleI18n: 'Người dùng' },
      },
      {
        path: 'security',
        component: UserSettingsSecurityComponent,
        data: { titleI18n: 'Bảo mật' },
      },
      {
        path: 'binding',
        component: UserSettingsBindingComponent,
        data: { titleI18n: 'Dữ liệu' },
      },
      {
        path: 'notification',
        component: UserSettingsNotificationComponent,
        data: { titleI18n: 'Thông báo' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
