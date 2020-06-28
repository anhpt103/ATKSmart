import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { CallbackComponent } from './callback/callback.component';
import { DashboardAnalysisComponent } from './dashboard/analysis/analysis.component';
import { DashboardMonitorComponent } from './dashboard/monitor/monitor.component';
// dashboard pages
import { DashboardV1Component } from './dashboard/v1/v1.component';
import { DashboardWorkplaceComponent } from './dashboard/workplace/workplace.component';
// single pages
import { UserLockComponent } from './auth/lock/lock.component';
// auth pages
import { UserLoginComponent } from './auth/login/login.component';
import { UserRegisterResultComponent } from './auth/register-result/register-result.component';
import { UserRegisterComponent } from './auth/register/register.component';
import { RouteRoutingModule } from './routes-routing.module';

const COMPONENTS = [
  DashboardV1Component,
  DashboardAnalysisComponent,
  DashboardMonitorComponent,
  DashboardWorkplaceComponent,
  // authorize pages
  UserLoginComponent,
  UserRegisterComponent,
  UserRegisterResultComponent,
  // single pages
  UserLockComponent,
  CallbackComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RoutesModule {}
