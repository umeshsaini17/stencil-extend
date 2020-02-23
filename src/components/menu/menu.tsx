import { Component, Prop, h } from '@stencil/core';
import { IMenuItem } from '../../shared/models';

@Component({
  tag: 'my-menu',
  styleUrl: 'menu.css',
  shadow: true
})
export class Menu {

  @Prop() items: Array<IMenuItem> = [];
  @Prop() header: string = '';

  clickMe() {
    alert('Clicked from Menu');
  }

  itemClicked(x) {
    this.items = this.items.map(i => {
      return {
        ...i,
        selected: x.value === i.value
      }
    });
    console.log(x);
    // // this.items = this.items.map(i => ({...i, selected: false}));
    // x.selected = !x.selected;
    // console.log(this.items);
  }

  render() {
    return <div class="menu-bar">
      <div class="header">{this.header}</div>
      <ul>
        {this.items ? this.items.map(x =>
          <li class={x.selected ? 'selected' : ''} onClick={this.itemClicked.bind(this, x)}>{x.value}</li>
        ) : ''}
      </ul>
      <div class="footer">
        <button onClick={() => { this.clickMe(); }}>Submit</button>
      </div>
    </div>
  }

}