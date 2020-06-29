import {
  Component,
  ViewEncapsulation,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { serviceAPI } from 'src/app/core/constants/service-api';
import { tap } from 'rxjs/operators';

interface Option {
  value: number;
  text: string;
}

@Component({
  selector: 'app-supplier-autocomplete',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './supplier-autocomplete.component.html',
})
export class SupplierAutocompleteComponent implements OnInit {
  @Output() supplierIdOutput = new EventEmitter<Option[]>();
  supplierModel;
  filteredOptions: string[] = [];
  loading = false;

  options: Option[] = [
    { value: 1, text: 'Phạm Tuấn Anh' },
    { value: 2, text: 'Big C' },
  ];

  constructor(private http: _HttpClient) {
    if (this.options && this.options.length > 0) {
      this.options.forEach((val) => {
        this.filteredOptions.push(val.text);
      });
    }
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.http
      .post(`${environment.API_URL}` + serviceAPI.POST_SUPPLIER_BY_STORE)
      .pipe(tap(() => (this.loading = false)))
      .subscribe((res) => {
        console.log(res);
      });
  }

  onChange(value: string): void {
    const filterValue = this.options.filter(
      (option) => option.text.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    this.supplierIdOutput.emit(filterValue);
  }
}
