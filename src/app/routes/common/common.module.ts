import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { CommonRoutingModule } from './common-routing.module';
import { CommonSettingsComponent } from './settings/settings.component';
import { StoreSettingsComponent } from './settings/store/store.component';

const COMPONENTS = [CommonSettingsComponent, StoreSettingsComponent];

const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, CommonRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class CommonModule {}
