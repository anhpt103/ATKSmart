import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { CategoryRoutingModule } from './category-routing.module';
import { ProductComponent } from './product/product.component';

const COMPONENTS = [
  ProductComponent
];

const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [CommonModule, SharedModule, CategoryRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
  entryComponents: COMPONENTS_NOROUNT,
})
export class CategoryModule {}
