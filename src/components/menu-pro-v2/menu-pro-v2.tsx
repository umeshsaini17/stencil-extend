import { Component, Prop, h } from '@stencil/core';

import '../menu/menu';                  // Required: This will include the Extending component in same bundle.
import { Menu } from '../menu/menu';    // Requires only to refer types of base class

// This Component is inheriting features from 'my-menu' component.
// The mapping is defined in extend-util.config.json
@Component({
    tag: 'my-menu-pro-v2',
    styleUrl: 'menu-pro-v2.css',
    shadow: true
})
export class MenuProV2 {

    // Need to declare Required Properties of base component
    @Prop() declare items: Array<{ id?: string, value: string, selected?: boolean }>;
    @Prop() declare header: string;
    super: Menu;    // super will be refering to the base class instance

    // This function is overriden, so we can use this.super to access the base method functionality.
    clickMe() {
        this.header = 'New Header';
        alert('Submit clicked from Menu Pro 2');
        this.super.clickMe();
    }

    // Overriding Menu render function with additional html
    render() {
        return <div>
            <h3>Menu Pro Header</h3>
            <div>{this.super.render()}</div>
            <div class="footer-v2">This is footer note</div>
        </div>
    }

}