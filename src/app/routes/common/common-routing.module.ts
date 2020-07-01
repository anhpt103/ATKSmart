import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonSettingsComponent } from './settings/settings.component';
import { StoreSettingsComponent } from './settings/store/store.component';

const routes: Routes = [
  {
    path: 'settings',
    component: CommonSettingsComponent,
    children: [
      { path: '', redirectTo: 'store', pathMatch: 'full' },
      {
        path: 'store',
        component: StoreSettingsComponent,
        data: { titleI18n: 'Cửa hàng' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonRoutingModule {}
