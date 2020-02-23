import { Component, h } from '@stencil/core';
import { IMenuItem } from '../../shared/models';
@Component({
  tag: 'my-app',
  styleUrl: 'my-app.css',
  shadow: true
})
export class App {

  items1: Array<IMenuItem> = [];
  items2: Array<IMenuItem> = [];

  componentWillLoad() {
    this.items1 = [
      { value: 'Home' },
      { value: 'Services' },
      { value: 'Products' },
      { value: 'About Us' }
    ];
    this.items2 = [
      { value: 'My Profile' },
      { value: 'Address' },
      { value: 'Feedback' }
    ];
  }

  render() {
    return <div>
        <h3>Try clicking on menu items below, and submit button.</h3>
        <my-menu header="Main Menu" items={this.items1}></my-menu>
        {/* <my-menu-pro header="Profile Menu" items={this.items2}></my-menu-pro> */}
        <my-menu-pro-v2 header="Profile Menu" items={this.items2}></my-menu-pro-v2>
      </div>;
  }
}
