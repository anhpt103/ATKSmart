import { Component } from '@angular/core';

@Component({
  selector: 'layout-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.less'],
})
export class LayoutAuthComponent {
  links = [
    {
      title: 'Help',
      href: '',
    },
    {
      title: 'Privacy',
      href: '',
    },
    {
      title: 'Terms',
      href: '',
    },
  ];
}
