// import { ComponentInterface, h, getElement } from "@stencil/core";
// import { Prop } from "@stencil/core";

export class ExtensionHelper {
    // ExtendFrom - Its a Helper method used to set any component to be used as extended.
    static extendFrom(obj: any, externalType: any) {
        obj.__proto__.__proto__ = externalType.prototype;
        obj.super = obj.__proto__.__proto__;

        console.log('-----------extendFrom-----------');
        // console.log(obj);
        // console.log(obj.__proto__);
        // console.log(obj.__proto__.__proto__);
        // console.log(externalType.prototype);

        for (let o in obj) {
            if (!obj[o])
                obj[o] = obj.super[o];
        }      

        
        // obj.super = proxyExProto;

        // let proxy = new Proxy(obj.__proto__.__proto__, {
        //     set: function (target: any, key: string, value: any) {
        //         console.log(`${key} set to ${value}`);
        //         target[key] = value;
        //         return true;
        //     }
        // });
        // obj.super = proxy;

        // for (let o in obj) {
        //     console.log(o);
        //     if (o != 'super' && !obj.super[o]) {
        //         let propType = typeof obj[o];
        //         if(propType === 'object') {
        //             let prop = new Proxy(obj[o], {
        //                 set: function (target:any, key:string, value:any) {
        //                     console.log(`${key} set to ${value}`);
        //                     target[key] = value;
        //                     return true;
        //                 }
        //             });
        //             obj.super[o] = prop;
        //         } else {
        //             let prop = new Proxy({ propType: obj[o] }, {
        //                 set: function (target:any, key:string, value:any) {
        //                     console.log(`${key} set to ${value}`);
        //                     target[key] = value;
        //                     return true;
        //                 }
        //             });
        //             obj.super[o] = prop[propType];
        //         }
        //     }
        // }

        // Object.getOwnPropertyNames(externalType.prototype).forEach(x => {
        //     console.log(x);
        //     if (x !== 'constructor' && x !== 'render' && !obj.hasOwnProperty(x)) {
        //         obj[x] = externalType.prototype[x];
        //         // externalType.prototype[x] = obj[x];
        //         console.log(x);
        //     }
        // });
        console.log(obj);



        // for (let o in ) {
        //     console.log(o);
        // }

        // for (let o in obj.__proto__) {
        //     if (!obj.super[o])
        //         obj.__proto__[o] = obj.super[o]
        // }

    }

    cloneAttributes(el: { attributes: any }) {
        return Object.values(el.attributes).reduce((acc: any, attr: Attr) => {
            acc[attr.name] = attr.value;
            return acc;
        }, {});
    }

    static OverrideComponent(type: any) {
        return (proto: any, methodName: any) => {
            console.log(methodName);
            let that = this;
            if (!proto.render) {
                proto.render = function () {
                    if (this.super) {
                        return this.super.render();
                    } else {
                        return '';
                    }
                };
            }
            const render = proto.render;

            proto.render = function () {
                console.log('Rendered called!!!');
                that.extendFrom(this, type);
                const renderResult = render.call(this);
                return renderResult;
            };
            return type;
        };
    }

    static DeclareProp() {
        return (proto: any, propName: any) => {
            let propType = typeof propName;
            let obj = {};
            obj[propType] = this[propName];
            let proxy = new Proxy(obj, {
                set: function (target: any, key: string, value: any) {
                    console.log(`${key} set to ${value}`);
                    target[key] = value;
                    return true;
                }
            });
            console.log(proto);
            return proxy;
            // obj.__proto__.__proto__ = proxyExProto;
        };
    }

    // static OverrideComponent() {
    //     return (proto: any, prop: any) => {
    //         //   if(!proto.componentWillLoad) {
    //         //       proto.componentWillLoad = function(){};
    //         //   }

    //         const { render, componentWillLoad } = proto;

    //         proto.constructor = function () {
    //             console.log('US - inside constructor');
    //         }

    //         proto.componentWillLoad = function () {
    //             const host = getElement(this);;
    //             console.log(host);
    //             if (componentWillLoad)
    //                 componentWillLoad.call(this);
    //             console.log('US - inside componentWillLoad');
    //         }

    //         //   debugger;
    //         //   (proto as any).constructor = function() {
    //         //       console.log('US -test1');
    //         //       return (function() {
    //         //           let cachedConstructor = this.constructor;
    //         //           const result = cachedConstructor.apply(this, arguments);
    //         //           console.log('US - from construcrtor');
    //         //           return result;
    //         //       })();
    //         //   }
    //         //console.log(proto)
    //         //const host = getElement(this);
    //         //console.log(host);
    //         proto.render = function () {
    //             // console.log(methodName);
    //             // console.log(proto);
    //             const renderResult = render.call(this);
    //             console.log(renderResult);
    //             return renderResult;
    //         };
    //     };
    // }
}
