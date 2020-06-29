import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { STChange, STColumn, STComponent, STData } from '@delon/abc/st';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { serviceAPI } from 'src/app/core/constants/service-api';

@Component({
  selector: 'app-category-product',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {
  q: any = {
    pi: 1,
    ps: 10,
    sorter: '',
    status: null,
    statusList: [],
  };
  data: any[] = [];
  loading = false;
  status = [
    {
      index: 1,
      text: 'Sử dụng',
      value: false,
      type: 'success',
      checked: false,
    },
    {
      index: 0,
      text: 'Không sử dụng',
      value: false,
      type: 'error',
      checked: false,
    },
  ];
  @ViewChild('st', { static: true })
  st: STComponent;

  columns: STColumn[] = [
    { title: '', index: 'key', type: 'checkbox' },
    { title: 'STT', index: 'numberOrder' },
    { title: 'Mã hàng', index: 'productCode' },
    { title: 'Tên hàng', index: 'productName' },
    {
      title: 'Giá bán',
      index: 'productPrice',
      type: 'number',
      format: (item: any) => `${item.callNo}`,
      sorter: (a: any, b: any) => a.callNo - b.callNo,
    },
    {
      title: 'Số tồn',
      index: 'productInventory',
      type: 'number',
    },
    {
      title: 'Status',
      index: 'status',
      render: 'status',
      filter: {
        menus: this.status,
        fn: (filter: any, record: any) => record.status === filter.index,
      },
    },
  ];
  selectedRows: STData[] = [];
  totalCallNo = 0;
  expandForm = false;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.loading = true;
    this.q.statusList = this.status
      .filter((w) => w.checked)
      .map((item) => item.index);
    if (this.q.status !== null && this.q.status > -1) {
      this.q.statusList.push(this.q.status);
    }
    this.http
      .get(`${environment.API_URL}` + serviceAPI.GETALL_PRODUCT, this.q)
      .pipe(
        map((list: any[]) =>
          list.map((i) => {
            i.status === 2 ? (i.status = 0) : (i.status = 1);
            const statusItem = this.status[i.status];
            i.statusText = statusItem.text;
            i.statusType = statusItem.type;
            return i;
          })
        ),
        tap(() => (this.loading = false))
      )
      .subscribe((res) => {
        this.data = res;
        this.cdr.detectChanges();
      });
  }

  stChange(e: STChange) {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox;
        this.totalCallNo = this.selectedRows.reduce(
          (total, cv) => total + cv.callNo,
          0
        );
        this.cdr.detectChanges();
        break;
      case 'filter':
        this.getData();
        break;
    }
  }

  remove() {
    this.http
      .delete('/rule', {
        searchNames: this.selectedRows.map((i) => i.searchName).join(','),
      })
      .subscribe(() => {
        this.getData();
        this.st.clearCheck();
      });
  }

  approval() {
    this.msg.success(`Approved ${this.selectedRows.length} pen`);
  }

  productName: string;
  productPrice: number;
  supplierId: number;
  unitCalcId: number;
  taxId: number;
  description: string;

  supplierChangeMethod($event) {
    console.log($event);
  }

  add(tpl: TemplateRef<{}>) {
    this.modalSrv.create({
      nzTitle: 'Thêm sản phẩm',
      nzContent: tpl,
      nzOnOk: () => {
        this.loading = true;
        this.http
          .post('/rule', { description: this.description })
          .subscribe(() => this.getData());
      },
    });
  }

  reset() {
    // wait form reset updated finished
    setTimeout(() => this.getData());
  }
}
