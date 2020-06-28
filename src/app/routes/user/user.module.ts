import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { UserRoutingModule } from './user-routing.module';

import { UserSettingsBaseComponent } from './settings/base/base.component';
import { UserSettingsBindingComponent } from './settings/binding/binding.component';
import { UserSettingsNotificationComponent } from './settings/notification/notification.component';
import { UserSettingsSecurityComponent } from './settings/security/security.component';
import { UserSettingsComponent } from './settings/settings.component';

const COMPONENTS = [
  UserSettingsComponent,
  UserSettingsBaseComponent,
  UserSettingsSecurityComponent,
  UserSettingsBindingComponent,
  UserSettingsNotificationComponent,
];

const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, UserRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class UserModule {}
