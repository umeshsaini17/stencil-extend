/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  IMenuItem,
} from './shared/models';

export namespace Components {
  interface MyApp {}
  interface MyMenu {
    'header': string;
    'items': Array<IMenuItem>;
  }
  interface MyMenuPro {
    'header': string;
    'items': Array<{id?: string, value: string, selected?: boolean}>;
  }
  interface MyMenuProV2 {
    'header': string;
    'items': Array<{ id?: string, value: string, selected?: boolean }>;
  }
}

declare global {


  interface HTMLMyAppElement extends Components.MyApp, HTMLStencilElement {}
  var HTMLMyAppElement: {
    prototype: HTMLMyAppElement;
    new (): HTMLMyAppElement;
  };

  interface HTMLMyMenuElement extends Components.MyMenu, HTMLStencilElement {}
  var HTMLMyMenuElement: {
    prototype: HTMLMyMenuElement;
    new (): HTMLMyMenuElement;
  };

  interface HTMLMyMenuProElement extends Components.MyMenuPro, HTMLStencilElement {}
  var HTMLMyMenuProElement: {
    prototype: HTMLMyMenuProElement;
    new (): HTMLMyMenuProElement;
  };

  interface HTMLMyMenuProV2Element extends Components.MyMenuProV2, HTMLStencilElement {}
  var HTMLMyMenuProV2Element: {
    prototype: HTMLMyMenuProV2Element;
    new (): HTMLMyMenuProV2Element;
  };
  interface HTMLElementTagNameMap {
    'my-app': HTMLMyAppElement;
    'my-menu': HTMLMyMenuElement;
    'my-menu-pro': HTMLMyMenuProElement;
    'my-menu-pro-v2': HTMLMyMenuProV2Element;
  }
}

declare namespace LocalJSX {
  interface MyApp {}
  interface MyMenu {
    'header'?: string;
    'items'?: Array<IMenuItem>;
  }
  interface MyMenuPro {
    'header'?: string;
    'items'?: Array<{id?: string, value: string, selected?: boolean}>;
  }
  interface MyMenuProV2 {
    'header'?: string;
    'items'?: Array<{ id?: string, value: string, selected?: boolean }>;
  }

  interface IntrinsicElements {
    'my-app': MyApp;
    'my-menu': MyMenu;
    'my-menu-pro': MyMenuPro;
    'my-menu-pro-v2': MyMenuProV2;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'my-app': LocalJSX.MyApp & JSXBase.HTMLAttributes<HTMLMyAppElement>;
      'my-menu': LocalJSX.MyMenu & JSXBase.HTMLAttributes<HTMLMyMenuElement>;
      'my-menu-pro': LocalJSX.MyMenuPro & JSXBase.HTMLAttributes<HTMLMyMenuProElement>;
      'my-menu-pro-v2': LocalJSX.MyMenuProV2 & JSXBase.HTMLAttributes<HTMLMyMenuProV2Element>;
    }
  }
}


