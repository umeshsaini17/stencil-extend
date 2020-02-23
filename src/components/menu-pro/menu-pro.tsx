import { Component, Prop, h} from '@stencil/core';
// import { ExtensionHelper } from '../../shared/helpers';
import { Menu } from '../menu/menu';

@Component({
    tag: 'my-menu-pro',
    styleUrl: 'menu-pro.css',
    shadow: true
  })
export class MenuPro {
    // Would require to declare properties used from Parent component (Just to prevent typings errors)
    //@ExtensionHelper.DeclareProp()
    @Prop() items: Array<{id?: string, value: string, selected?: boolean}>;

    @Prop() 
    //@ExtensionHelper.DeclareProp()
    header: string;

    super: Menu;    // super will be created while using extendFrom method, will be pointing to Parent component
    // declare clickMe;


    // @ExtensionHelper.OverrideComponent(Menu) base;

    // constructor() {
    //     ExtensionHelper.extendFrom(this, Menu); // Extend current component from Menu Component
    // }

    // componentWillLoad() {

    // }

    // This method is overriding the one provided in Menu component
    
    clickMe() {
        alert('click from MenuPro');
        console.log(this.items);
        console.log(this.super.items);
        console.log(this);
        this.super.clickMe();   // super property provides flexibility if we want to call any method from parent class
        this.header = 'test header';
    }

    // Uncommenting this would override the render method too
    //@ExtensionHelper.Override()
    render() {
        // return //this.super.render.bind(this);
        return <div>
                <h2>This is Menu Pro Component</h2>
                {/* <div>{this.super.render()}</div> */}

                <button onClick={() => { this.clickMe(); }}>Click</button>    
            </div>
    }
}
