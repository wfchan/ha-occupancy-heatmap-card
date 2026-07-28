const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(s,t,i)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,g=m?m.emptyScript:"",f=u.reactiveElementPolyfillSupport,y=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>!a(t,e),_={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);o?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),o=t.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=s;const n=o.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const n=this.constructor;if(!1===s&&(o=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??v)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[y("elementProperties")]=new Map,b[y("finalized")]=new Map,f?.({ReactiveElement:b}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,x=t=>t,S=w.trustedTypes,A=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+T,M=`<${E}>`,U=document,D=()=>U.createComment(""),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,N="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,P=/-->/g,H=/>/g,R=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),Z=/'/g,L=/"/g,I=/^(?:script|style|textarea|title)$/i,j=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),q=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),V=new WeakMap,B=U.createTreeWalker(U,129);function W(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=z;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===z?"!--"===l[1]?r=P:void 0!==l[1]?r=H:void 0!==l[2]?(I.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=R):void 0!==l[3]&&(r=R):r===R?">"===l[0]?(r=o??z,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?R:'"'===l[3]?L:Z):r===L||r===Z?r=R:r===P||r===H?r=z:(r=R,o=void 0);const d=r===R&&t[e+1].startsWith("/>")?" ":"";n+=r===z?i+M:c>=0?(s.push(a),i.slice(0,c)+C+i.slice(c)+T+d):i+T+(-2===c?e:d)}return[W(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class J{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[l,c]=Y(t,e);if(this.el=J.createElement(l,i),B.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=B.nextNode())&&a.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(C)){const e=c[n++],i=s.getAttribute(t).split(T),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?it:X}),s.removeAttribute(t)}else t.startsWith(T)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(I.test(s.tagName)){const t=s.textContent.split(T),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],D()),B.nextNode(),a.push({type:2,index:++o});s.append(t[e],D())}}}else if(8===s.nodeType)if(s.data===E)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(T,t+1));)a.push({type:7,index:o}),t+=T.length-1}o++}}static createElement(t,e){const i=U.createElement("template");return i.innerHTML=t,i}}function G(t,e,i=t,s){if(e===q)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const n=k(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=G(t,o._$AS(t,e.values),o,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??U).importNode(e,!0);B.currentNode=s;let o=B.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Q(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new st(o,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(o=B.nextNode(),n++)}return B.currentNode=U,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),k(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&k(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=J.createElement(W(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new K(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new J(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new Q(this.O(D()),this.O(D()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=G(this,t,e,0),n=!k(t)||t!==this._$AH&&t!==q,n&&(this._$AH=t);else{const s=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=G(this,s[i+r],e,r),a===q&&(a=this._$AH[r]),n||=!k(a)||a!==this._$AH[r],a===F?t=F:t!==F&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!s&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class it extends X{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??F)===q)return;const i=this._$AH,s=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const ot=w.litHtmlPolyfillSupport;ot?.(J,Q),(w.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;let rt=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new Q(e.insertBefore(D(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};rt._$litElement$=!0,rt.finalized=!0,nt.litElementHydrateSupport?.({LitElement:rt});const at=nt.litElementPolyfillSupport;at?.({LitElement:rt}),(nt.litElementVersions??=[]).push("4.2.2");const lt=1;let ct=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const ht="important",dt=" !"+ht,pt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends ct{constructor(t){if(super(t),t.type!==lt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const s=t[i];return null==s?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const s=e[t];if(null!=s){this.ft.add(t);const e="string"==typeof s&&s.endsWith(dt);t.includes("-")||e?i.setProperty(t,e?s.slice(0,-11):s,e?ht:""):i[t]=s}}return q}}),ut=new Set(["auto","numeric","categorical"]),mt=new Set(["duration","value"]);function gt(t,e,i){const s=t??e;if(!Number.isInteger(s)||s<0||s>23)throw new Error(`${i} hour must be a whole number between 0 and 23`);return s}const ft={},yt={};function $t(t,e){try{const i=(ft[t]||=new Intl.DateTimeFormat("en-US",{timeZone:t,timeZoneName:"longOffset"}).format)(e).split("GMT")[1];return i in yt?yt[i]:_t(i,i.split(":"))}catch{if(t in yt)return yt[t];const e=t?.match(vt);return e?_t(t,e.slice(1)):NaN}}const vt=/([+-]\d\d):?(\d\d)?/;function _t(t,e){const i=+(e[0]||0),s=+(e[1]||0),o=+(e[2]||0)/60;return yt[t]=60*i+s>0?60*i+s+o:60*i-s-o}class bt extends Date{constructor(...t){super(),t.length>1&&"string"==typeof t[t.length-1]&&(this.timeZone=t.pop()),this.internal=new Date,isNaN($t(this.timeZone,this))?this.setTime(NaN):t.length?"number"==typeof t[0]&&(1===t.length||2===t.length&&"number"!=typeof t[1])?this.setTime(t[0]):"string"==typeof t[0]?this.setTime(+new Date(t[0])):t[0]instanceof Date?this.setTime(+t[0]):(this.setTime(+new Date(...t)),St(this,t)):this.setTime(Date.now())}static tz(t,...e){return e.length?new bt(...e,t):new bt(Date.now(),t)}withTimeZone(t){return new bt(+this,t)}getTimezoneOffset(){const t=-$t(this.timeZone,this);return t>0?Math.floor(t):Math.ceil(t)}setTime(t){return Date.prototype.setTime.apply(this,arguments),xt(this),+this}[Symbol.for("constructDateFrom")](t){return new bt(+new Date(t),this.timeZone)}}const wt=/^(get|set)(?!UTC)/;function xt(t){t.internal.setTime(+t),t.internal.setUTCSeconds(t.internal.getUTCSeconds()-Math.round(60*-$t(t.timeZone,t)))}function St(t,e){const i=Array.isArray(e)?(s=e,Date.UTC(s[0],s.length>1?s[1]:0,s.length>2?s[2]:1,...s.slice(3))):+t.internal;var s;const o=$t(t.timeZone,t),n=o>0?Math.floor(o):Math.ceil(o),r=new Date(+t);r.setUTCHours(r.getUTCHours()-1);const a=-new Date(+t).getTimezoneOffset(),l=-new Date(+r).getTimezoneOffset();let c=a;if(a-l&&a!==n){if(Date.prototype.getHours.apply(t)!==(Array.isArray(e)?e[3]||0:t.internal.getUTCHours())){const e=new Date(+t),i=a-n;i&&e.setUTCMinutes(e.getUTCMinutes()+i);const s=$t(t.timeZone,e);(s>0?Math.floor(s):Math.ceil(s))===n&&(c=l)}}const h=c-n;h&&Date.prototype.setUTCMinutes.call(t,Date.prototype.getUTCMinutes.call(t)+h);const d=new Date(+t);d.setUTCSeconds(0);const p=a>0?d.getSeconds():(d.getSeconds()-60)%60,u=Math.round(-60*$t(t.timeZone,t))%60;(u||p)&&Date.prototype.setUTCSeconds.call(t,Date.prototype.getUTCSeconds.call(t)+u+p);const m=$t(t.timeZone,t),g=m>0?Math.floor(m):Math.ceil(m),f=g!==n,y=-new Date(+t).getTimezoneOffset()-g-h,$=g-n,v=i-60*g*1e3,_=$>0&&At(t)-i===60*$*1e3&&At(t,v)!==i;if(f&&y&&!_){Date.prototype.setUTCMinutes.call(t,Date.prototype.getUTCMinutes.call(t)+y);const e=$t(t.timeZone,t),i=g-(e>0?Math.floor(e):Math.ceil(e));i&&y<0&&Date.prototype.setUTCMinutes.call(t,Date.prototype.getUTCMinutes.call(t)+i)}xt(t);const b=(e?i:i+1e3*u)-+t.internal;b&&Math.abs(b)<18e5&&(Date.prototype.setTime.call(t,+t+b),xt(t))}function At(t,e){const i=new Date(e??+t);return i.setUTCSeconds(i.getUTCSeconds()-Math.round(60*-$t(t.timeZone,i))),+i}Object.getOwnPropertyNames(Date.prototype).forEach(t=>{if(!wt.test(t))return;const e=t.replace(wt,"$1UTC");bt.prototype[e]&&(t.startsWith("get")?bt.prototype[t]=function(){return this.internal[e]()}:(bt.prototype[t]=function(){var t;return Date.prototype[e].apply(this.internal,arguments),t=this,Date.prototype.setFullYear.call(t,t.internal.getUTCFullYear(),t.internal.getUTCMonth(),t.internal.getUTCDate()),Date.prototype.setHours.call(t,t.internal.getUTCHours(),t.internal.getUTCMinutes(),t.internal.getUTCSeconds(),t.internal.getUTCMilliseconds()),St(t),+this},bt.prototype[e]=function(){return Date.prototype[e].apply(this,arguments),xt(this),+this}))});class Ct extends bt{static tz(t,...e){return e.length?new Ct(...e,t):new Ct(Date.now(),t)}toISOString(){const[t,e,i]=this.tzComponents(),s=`${t}${e}:${i}`;return this.internal.toISOString().slice(0,-1)+s}toString(){return`${this.toDateString()} ${this.toTimeString()}`}toDateString(){const[t,e,i,s]=this.internal.toUTCString().split(" ");return`${t?.slice(0,-1)} ${i} ${e} ${s}`}toTimeString(){const t=this.internal.toUTCString().split(" ")[4],[e,i,s]=this.tzComponents();return`${t} GMT${e}${i}${s} (${function(t,e,i="long"){return new Intl.DateTimeFormat("en-US",{hour:"numeric",timeZone:t,timeZoneName:i}).format(e).split(/\s/g).slice(2).join(" ")}(this.timeZone,this)})`}toLocaleString(t,e){return Date.prototype.toLocaleString.call(this,t,{...e,timeZone:e?.timeZone||this.timeZone})}toLocaleDateString(t,e){return Date.prototype.toLocaleDateString.call(this,t,{...e,timeZone:e?.timeZone||this.timeZone})}toLocaleTimeString(t,e){return Date.prototype.toLocaleTimeString.call(this,t,{...e,timeZone:e?.timeZone||this.timeZone})}tzComponents(){const t=this.getTimezoneOffset();return[t>0?"-":"+",String(Math.floor(Math.abs(t)/60)).padStart(2,"0"),String(Math.abs(t)%60).padStart(2,"0")]}withTimeZone(t){return new Ct(+this,t)}[Symbol.for("constructDateFrom")](t){return new Ct(+new Date(t),this.timeZone)}}function Tt(t){return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`}function Et(t,e,i,s=0,o=23){const n=Ct.tz(i,e),r=n.getFullYear(),a=n.getMonth(),l=n.getDate(),c=Tt(n),h=[];for(let e=t-1;e>=0;e-=1){const t=new Ct(r,a,l-e,0,0,0,0,i),n=t.getFullYear(),d=t.getMonth(),p=t.getDate(),u=[];for(let t=s;t<=o;t+=1){const e=new Ct(n,d,p,t,0,0,0,i),s=new Ct(n,d,p,t+1,0,0,0,i);u.push({hour:t,start:e,end:s,durationSeconds:Math.max(0,(s.getTime()-e.getTime())/1e3)})}const m=Tt(t);h.push({dateKey:m,date:t,isToday:m===c,cells:u})}return h}function Mt(t,e,i){return Math.max(0,Math.min(t.end,i)-Math.max(t.start,e))/1e3}function Ut({history:t,config:e,timeZone:i,now:s}){const o=Et(e.days,s,i,e.start_hour,e.end_hour),n="auto"===e.mode?function(t,e){const i=new Set(e),s=t.filter(t=>t.trim()&&!i.has(t));return 0===s.length?"categorical":s.every(t=>Number.isFinite(Number(t)))?"numeric":"categorical"}(t.map(t=>t.s),e.excluded_states):e.mode,r=new Set(e.excluded_states),a=function(t,e){const i=[...t].sort((t,e)=>t.lu-e.lu);return i.map((t,s)=>({state:t.s,start:1e3*t.lu,end:Math.min(1e3*(i[s+1]?.lu??e/1e3),e)}))}(t,s.getTime()),l=[],c=new Set;let h=0,d=0;const p=o.map(t=>({...t,cells:t.cells.map(t=>{const i=t.start.getTime(),o=t.end.getTime(),p=Math.min(o,s.getTime()),u=i>=s.getTime();if(u||0===t.durationSeconds)return{...t,occupiedSeconds:0,intensity:0,future:u};for(;h<a.length&&a[h].end<=i;)h+=1;if("numeric"===n){let s=0,o=0;for(let t=h;t<a.length;t+=1){const n=a[t];if(n.start>=p)break;const l=Number(n.state);if(!n.state.trim()||r.has(n.state)||!Number.isFinite(l)||l<=e.numeric_threshold)continue;const c=Mt(n,i,p);c<=0||(s+=c,o+=l*c)}return d+=s,{...t,occupiedSeconds:s,numericValue:s>0?o/s:void 0,intensity:Math.min(1,s/t.durationSeconds),future:u}}const m=new Map;let g=0;for(let t=h;t<a.length;t+=1){const e=a[t];if(e.start>=p)break;if(!e.state.trim()||r.has(e.state))continue;const s=Mt(e,i,p);if(s<=0)continue;g+=s,c.has(e.state)||(c.add(e.state),l.push(e.state));const o=m.get(e.state)??{seconds:0,latestStart:0};m.set(e.state,{seconds:o.seconds+s,latestStart:Math.max(o.latestStart,e.start)})}d+=g;const f=[...m.entries()].sort((t,e)=>e[1].seconds-t[1].seconds||e[1].latestStart-t[1].latestStart)[0],y=f?.[1].seconds??0;return{...t,occupiedSeconds:y,intensity:Math.min(1,y/t.durationSeconds),state:f?.[0],future:u}})})),u="numeric"===n&&"value"===e.numeric_intensity?p.flatMap(t=>t.cells.flatMap(t=>!t.future&&t.occupiedSeconds>0&&void 0!==t.numericValue?[t.numericValue]:[])):[],m=u.length?{min:Math.min(...u),max:Math.max(...u)}:void 0;if(m){const t=m.max-m.min;for(const e of p)for(const i of e.cells)void 0!==i.numericValue&&0!==i.occupiedSeconds&&(i.intensity=0===t?1:(i.numericValue-m.min)/t)}return{mode:n,days:p,totalSeconds:d,legendStates:l,numericRange:m}}class Dt{constructor(){this.generation=0,this.pending=new Map}load(t,e,i,s){const o=[e,i.toISOString(),s.toISOString()].join("|"),n=this.pending.get(o);if(n)return n;const r=++this.generation,a=t.callWS({type:"history/history_during_period",start_time:i.toISOString(),end_time:s.toISOString(),entity_ids:[e],minimal_response:!0,no_attributes:!0}).then(t=>({states:t[e]??[],stale:r!==this.generation})).catch(t=>{if(r!==this.generation)return{states:[],stale:!0};throw t}).finally(()=>{this.pending.get(o)===a&&this.pending.delete(o)});return this.pending.set(o,a),a}}const kt=["#e85d9e","#4ea5e0","#57b881","#e5a84b","#9b7ede","#e36a5c","#36a7a0","#c6ae38"];function Ot(t,e){const i=e[t]?.trim();if(i)return i;let s=2166136261;for(const e of t)s^=e.codePointAt(0)??0,s=Math.imul(s,16777619);return kt[Math.abs(s)%kt.length]??kt[0]}class Nt extends rt{constructor(){super(...arguments),this.viewState="idle",this.errorMessage="",this.historyService=new Dt,this.history=[]}static{this.styles=n`
    :host {
      display: block;
      container-type: inline-size;
      --heatmap-cell-size: 18px;
      --heatmap-gap: 3px;
      --heatmap-label-width: 60px;
      --heatmap-empty: color-mix(
        in srgb,
        var(--secondary-text-color, #727b88) 16%,
        transparent
      );
      color: var(--primary-text-color, #17212b);
    }

    ha-card {
      overflow: hidden;
      border-radius: var(--ha-card-border-radius, 8px);
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }

    .content {
      padding: 20px;
    }

    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 18px;
    }

    .identity {
      min-width: 0;
    }

    .title-row {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .status-dot,
    .swatch {
      flex: 0 0 auto;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--state-color, var(--primary-color, #03a9f4));
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--state-color) 15%, transparent);
    }

    h2 {
      overflow-wrap: anywhere;
      margin: 0;
      font-size: 18px;
      font-weight: 650;
      line-height: 1.3;
      letter-spacing: 0;
    }

    .summary {
      margin: 5px 0 0 19px;
      color: var(--secondary-text-color, #6d7683);
      font-size: 13px;
      line-height: 1.4;
    }

    .legend {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px 14px;
      max-width: 55%;
      color: var(--secondary-text-color, #6d7683);
      font-size: 12px;
    }

    .legend-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }

    .legend .swatch {
      width: 8px;
      height: 8px;
      box-shadow: none;
    }

    .scroll {
      overflow-x: auto;
      padding: 1px 0 7px;
      scrollbar-width: thin;
      scrollbar-color: var(--divider-color, #c8cdd4) transparent;
    }

    .matrix {
      display: grid;
      gap: var(--heatmap-gap);
      width: max-content;
      min-width: 100%;
    }

    .matrix-row {
      display: grid;
      grid-template-columns: var(--heatmap-label-width) repeat(
          var(--heatmap-column-count),
          var(--heatmap-cell-size)
        );
      gap: var(--heatmap-gap);
      align-items: center;
      min-width: max-content;
    }

    .row-label,
    .corner {
      position: sticky;
      left: 0;
      z-index: 2;
      box-sizing: border-box;
      background: var(--ha-card-background, var(--card-background-color, #fff));
    }

    .row-label {
      overflow: hidden;
      padding: 3px 8px 3px 3px;
      color: var(--secondary-text-color, #6d7683);
      font-size: 12px;
      font-weight: 600;
      text-align: right;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .row-label.today {
      border: 1px solid color-mix(in srgb, var(--primary-color, #03a9f4) 65%, transparent);
      border-radius: 6px;
      color: var(--primary-color, #03a9f4);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .hour-label {
      height: 17px;
      color: var(--secondary-text-color, #6d7683);
      font-size: 11px;
      text-align: center;
    }

    .cell {
      position: relative;
      box-sizing: border-box;
      width: var(--heatmap-cell-size);
      height: var(--heatmap-cell-size);
      padding: 0;
      border: 1px solid color-mix(in srgb, var(--divider-color, #9aa2ad) 32%, transparent);
      border-radius: 5px;
      background: var(--heatmap-empty);
      cursor: pointer;
      transition:
        transform 120ms ease,
        border-color 120ms ease;
    }

    .cell.filled {
      border-color: color-mix(in srgb, var(--cell-color) 44%, transparent);
      background: color-mix(
        in srgb,
        var(--cell-color) var(--cell-strength),
        var(--heatmap-empty)
      );
    }

    .cell:hover,
    .cell:focus-visible,
    .cell.selected {
      z-index: 3;
      border-color: var(--cell-color, var(--primary-color, #03a9f4));
      outline: none;
      transform: translateY(-1px);
    }

    .cell:focus-visible {
      box-shadow:
        0 0 0 2px var(--ha-card-background, #fff),
        0 0 0 4px var(--primary-color, #03a9f4);
    }

    .cell:disabled {
      cursor: default;
      opacity: 0.35;
      transform: none;
    }

    .details {
      display: flex;
      min-height: 20px;
      align-items: center;
      gap: 8px;
      margin-top: 11px;
      color: var(--secondary-text-color, #6d7683);
      font-size: 12px;
    }

    .details strong {
      color: var(--primary-text-color, #17212b);
      font-weight: 650;
    }

    .state-panel {
      display: grid;
      min-height: 156px;
      place-items: center;
      padding: 24px;
      text-align: center;
    }

    .state-panel strong {
      display: block;
      margin-bottom: 6px;
      font-size: 15px;
    }

    .state-panel span {
      max-width: 420px;
      color: var(--secondary-text-color, #6d7683);
      font-size: 13px;
      line-height: 1.5;
    }

    .loading-mark {
      width: 22px;
      height: 22px;
      margin-bottom: 12px;
      border: 2px solid var(--divider-color, #d3d7dd);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%;
      animation: spin 800ms linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 600px) {
      :host {
        --heatmap-cell-size: 22px;
        --heatmap-gap: 4px;
        --heatmap-label-width: 64px;
      }

      .content {
        padding: 16px;
      }

      .header {
        display: block;
        margin-bottom: 15px;
      }

      .legend {
        justify-content: flex-start;
        max-width: none;
        margin: 12px 0 0 19px;
      }
    }

    @container (min-width: 820px) {
      :host {
        --heatmap-cell-size: 23px;
        --heatmap-gap: 5px;
        --heatmap-label-width: 72px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .cell {
        transition: none;
      }

      .loading-mark {
        animation: none;
      }
    }
  `}get hass(){return this._hass}set hass(t){const e=this._hass,i=this.config?.entity,s=i?e?.states[i]?.last_changed:void 0,o=i?t?.states[i]?.last_changed:void 0;this._hass=t,this.requestUpdate("hass",e),this.config&&t&&("idle"===this.viewState||s!==o)&&this.loadHistory()}connectedCallback(){super.connectedCallback(),this.minuteTimer=setInterval(()=>this.recompute(),6e4)}disconnectedCallback(){super.disconnectedCallback(),this.minuteTimer&&clearInterval(this.minuteTimer)}setConfig(t){const e=function(t){const e=t.entity?.trim();if(!e)throw new Error("Entity is required");const i=t.days??7;if(!Number.isInteger(i)||i<1||i>31)throw new Error("Days must be an integer between 1 and 31");const s=gt(t.start_hour,0,"Start"),o=gt(t.end_hour,23,"End");if(s>o)throw new Error("Start hour must be less than or equal to end hour");const n=t.mode??"auto";if(!ut.has(n))throw new Error("Mode must be auto, numeric, or categorical");const r=t.numeric_threshold??0;if(!Number.isFinite(r))throw new Error("Numeric threshold must be a finite number");const a=t.numeric_intensity??"duration";if(!mt.has(a))throw new Error("Numeric intensity must be duration or value");const l=Array.from(new Set((t.excluded_states??["unknown","unavailable"]).map(t=>t.trim()).filter(Boolean)));return{type:"custom:occupancy-heatmap-card",entity:e,title:t.title?.trim()||void 0,days:i,start_hour:s,end_hour:o,mode:n,numeric_threshold:r,numeric_intensity:a,numeric_color:t.numeric_color?.trim()||"#03a9f4",state_colors:{...t.state_colors??{}},excluded_states:l,show_legend:t.show_legend??!0}}(t),i=JSON.stringify(e)!==JSON.stringify(this.config);this.config=e,i&&(this.data=void 0,this.history=[],this.selected=void 0,this.viewState="idle",this._hass&&this.loadHistory()),this.requestUpdate()}static getConfigElement(){return document.createElement("occupancy-heatmap-card-editor")}static getStubConfig(t,e,i){return{entity:e?.[0]??i?.[0]??Object.keys(t?.states??{})[0]??"",days:7,mode:"auto"}}getCardSize(){return Math.max(3,Math.min(12,(this.config?.days??7)+2))}getGridOptions(){return{columns:12,min_columns:6,rows:this.getCardSize()}}async loadHistory(){if(!this.config||!this._hass)return;if(!this._hass.states[this.config.entity])return this.viewState="missing",this.data=void 0,void this.requestUpdate();const t=new Date,e=Et(this.config.days,t,this._hass.config.time_zone,this.config.start_hour,this.config.end_hour),i=e[0]?.cells[0]?.start;if(!i)return;const s=new Date(i.getTime());this.viewState=this.data?"ready":"loading",this.errorMessage="",this.requestUpdate();try{const e=await this.historyService.load(this._hass,this.config.entity,s,t);if(e.stale)return;this.history=e.states,0===e.states.length?(this.data=void 0,this.viewState="empty"):(this.recompute(t),this.viewState="ready")}catch(t){this.data=void 0,this.viewState="error",this.errorMessage=t instanceof Error?t.message:"Unable to load history"}this.requestUpdate()}recompute(t=new Date){this.config&&this._hass&&0!==this.history.length&&(this.data=Ut({history:this.history,config:this.config,timeZone:this._hass.config.time_zone,now:t}),this.requestUpdate())}renderState(t){const e={loading:["Loading history","Reading recorder data for this entity."],missing:["Entity not found",`Home Assistant does not contain ${this.config?.entity}.`],empty:["No recorded history","Recorder has no states in the selected date range."],error:["History unavailable",this.errorMessage||"Home Assistant could not load history."]}[t];return j`<ha-card>
      <div
        class="state-panel"
        data-state=${t}
        role=${"error"===t?"alert":"status"}
      >
        <div>
          ${"loading"===t?j`<div class="loading-mark"></div>`:F}
          <strong>${e[0]}</strong><span>${e[1]}</span>
        </div>
      </div>
    </ha-card>`}stateColor(t){return this.config&&this.data?"numeric"===this.data.mode?this.config.numeric_color:Ot(t??"",this.config.state_colors):"var(--primary-color, #03a9f4)"}dayLabel(t,e){const i=this._hass?.locale.language||"en";return e?new Intl.RelativeTimeFormat(i,{numeric:"auto"}).format(0,"day"):new Intl.DateTimeFormat(i,{weekday:this.config&&this.config.days<=7?"short":void 0,month:this.config&&this.config.days>7?"short":void 0,day:this.config&&this.config.days>7?"numeric":void 0,timeZone:this._hass?.config.time_zone}).format(t)}numericValueLabel(t){if("numeric"!==this.data?.mode||"value"!==this.config?.numeric_intensity||void 0===t.numericValue)return;const e=this._hass?.locale.language||"en",i=new Intl.NumberFormat(e,{maximumFractionDigits:2}).format(t.numericValue),s=this._hass?.states[this.config.entity]?.attributes.unit_of_measurement;return s?`${i} ${s}`:i}cellTimeDetail(t){const e=this._hass?.locale.language||"en",i=new Intl.DateTimeFormat(e,{month:"short",day:"numeric",timeZone:this._hass?.config.time_zone}).format(t.start),s=Math.round(t.occupiedSeconds/60);return`${i}, ${String(t.hour).padStart(2,"0")}:00, ${s} min`}cellDetail(t){const e=this.numericValueLabel(t)??t.state,i=this.cellTimeDetail(t);return e?`${e}, ${i}`:i}renderCell(t){const e=this.stateColor(t.state),i=t.occupiedSeconds>0,s=this.cellDetail(t),o=this.selected?.start.getTime()===t.start.getTime();return j`<button
      class=${`cell${i?" filled":""}${o?" selected":""}`}
      style=${pt({"--cell-color":e,"--cell-strength":`${Math.round(14+86*t.intensity)}%`})}
      aria-label=${s}
      title=${s}
      ?disabled=${t.future||0===t.durationSeconds}
      @click=${()=>{this.selected=t,this.requestUpdate()}}
      @focus=${()=>{this.selected=t,this.requestUpdate()}}
    ></button>`}render(){if("ready"!==this.viewState)return this.renderState("idle"===this.viewState?"loading":this.viewState);if(!this.data||!this.config)return this.renderState("empty");const t=this._hass?.states[this.config.entity],e=this.config.title||t?.attributes.friendly_name||this.config.entity,i=this.data.totalSeconds/3600,s="numeric"===this.data.mode?"occupied":"recorded",o=this.stateColor(t?.state),n=this.data.days[0]?.cells??[],r=n.length;return j`<ha-card aria-busy="false">
      <div class="content">
        <div class="header">
          <div class="identity">
            <div class="title-row">
              <span
                class="status-dot"
                style=${pt({"--state-color":o})}
              ></span>
              <h2>${e}</h2>
            </div>
            <p class="summary">
              Past ${this.config.days} days &middot; ${i.toFixed(1)} h ${s}
            </p>
          </div>
          ${"categorical"===this.data.mode&&this.config.show_legend?j`<div class="legend" aria-label="State colors">
                  ${this.data.legendStates.map(t=>j`<span class="legend-item">
                        <span
                          class="swatch"
                          style=${pt({"--state-color":Ot(t,this.config.state_colors)})}
                        ></span>
                        ${t}
                      </span>`)}
                </div>`:F}
        </div>

        <div class="scroll" aria-label="Hourly occupancy heatmap">
          <div
            class="matrix"
            role="grid"
            style=${pt({"--heatmap-column-count":String(r)})}
          >
            <div class="matrix-row hour-row" role="row">
              <span class="corner"></span>
              ${n.map((t,e)=>e%3==0?j`<span class="hour-label" role="columnheader">${t.hour}</span>`:j`<span class="hour-label" aria-hidden="true"></span>`)}
            </div>
            ${this.data.days.map(t=>j`<div class="matrix-row" role="row">
                  <span
                    class=${"row-label"+(t.isToday?" today":"")}
                    role="rowheader"
                  >
                    ${this.dayLabel(t.date,t.isToday)}
                  </span>
                  ${t.cells.map(t=>this.renderCell(t))}
                </div>`)}
          </div>
        </div>

        <div class="details" aria-live="polite">
          ${this.selected?j`<strong
                    >${this.numericValueLabel(this.selected)||this.selected.state||s}</strong
                  >
                  <span>${this.cellTimeDetail(this.selected)}</span>`:j`<span>Select an hour for details</span>`}
        </div>
      </div>
    </ha-card>`}}class zt extends rt{constructor(){super(...arguments),this.config={},this.draftState=""}static{this.styles=n`
    :host {
      display: block;
      color: var(--primary-text-color, #17212b);
    }

    .editor {
      display: grid;
      gap: 18px;
    }

    .section {
      display: grid;
      gap: 12px;
      padding-top: 4px;
    }

    .section + .section {
      border-top: 1px solid var(--divider-color, #d9dde3);
      padding-top: 18px;
    }

    h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 650;
      letter-spacing: 0;
    }

    label {
      display: grid;
      gap: 6px;
      color: var(--secondary-text-color, #68717e);
      font-size: 12px;
      font-weight: 600;
    }

    input,
    select,
    button {
      box-sizing: border-box;
      min-height: 40px;
      border: 1px solid var(--divider-color, #b9c0c9);
      border-radius: 6px;
      color: var(--primary-text-color, #17212b);
      background: var(--card-background-color, #fff);
      font: inherit;
    }

    input,
    select {
      width: 100%;
      padding: 8px 10px;
    }

    ha-entity-picker {
      width: 100%;
    }

    input:focus-visible,
    select:focus-visible,
    button:focus-visible {
      border-color: var(--primary-color, #03a9f4);
      outline: 2px solid
        color-mix(in srgb, var(--primary-color, #03a9f4) 28%, transparent);
      outline-offset: 1px;
    }

    .two-column {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 12px;
    }

    .color-control {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 48px;
      gap: 8px;
    }

    input[type="color"] {
      padding: 4px;
    }

    .toggle {
      display: flex;
      min-height: 40px;
      align-items: center;
      gap: 10px;
      color: var(--primary-text-color, #17212b);
      font-size: 13px;
    }

    .toggle input {
      width: 18px;
      min-height: 18px;
      accent-color: var(--primary-color, #03a9f4);
    }

    .state-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 48px 40px;
      gap: 8px;
      align-items: end;
    }

    .icon-button {
      width: 40px;
      padding: 0;
      cursor: pointer;
      color: var(--error-color, #d64545);
      font-size: 20px;
    }

    .add-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px;
    }

    .add-row button {
      padding: 0 14px;
      cursor: pointer;
      border-color: var(--primary-color, #03a9f4);
      color: var(--primary-color, #03a9f4);
    }

    .helper {
      margin: -4px 0 0;
      color: var(--secondary-text-color, #68717e);
      font-size: 11px;
      font-weight: 400;
      line-height: 1.4;
    }

    @media (max-width: 480px) {
      .two-column {
        grid-template-columns: 1fr;
      }
    }
  `}get hass(){return this._hass}set hass(t){const e=this._hass;this._hass=t,this.requestUpdate("hass",e)}setConfig(t){this.config={...t},this.requestUpdate()}emit(t){this.config={...this.config,...t},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0})),this.requestUpdate()}value(t){return t.currentTarget.value}entityChanged(t){const e=t.detail.value?.trim();e&&this.emit({entity:e})}renameState(t,e){const i=e.trim();if(!i||i===t)return;const s={...this.config.state_colors??{}};s[i]=s[t]??"#03a9f4",delete s[t],this.emit({state_colors:s})}setStateColor(t,e){this.emit({state_colors:{...this.config.state_colors??{},[t]:e}})}removeState(t){const e={...this.config.state_colors??{}};delete e[t],this.emit({state_colors:e})}addState(){const t=this.draftState.trim();t&&(this.setStateColor(t,"#03a9f4"),this.draftState="")}updated(){const t={start_hour:this.config.start_hour??0,end_hour:this.config.end_hour??23};for(const[e,i]of Object.entries(t)){const t=this.renderRoot.querySelector(`select[name='${e}']`);t&&(t.value=String(i))}}render(){const t=this.config.mode??"auto",e=Object.entries(this.config.state_colors??{}),i=this.config.start_hour??0,s=this.config.end_hour??23,o=Array.from({length:24},(t,e)=>e);return j`<div class="editor">
      <section class="section">
        <h3>Source</h3>
        <label>
          Entity
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this.config.entity??""}
            @value-changed=${this.entityChanged}
          ></ha-entity-picker>
        </label>
        <label>
          Title
          <input
            name="title"
            type="text"
            .value=${this.config.title??""}
            placeholder="Use entity name"
            @change=${t=>this.emit({title:this.value(t)||void 0})}
          />
        </label>
        <div class="two-column">
          <label>
            Days
            <input
              name="days"
              type="number"
              min="1"
              max="31"
              step="1"
              .value=${String(this.config.days??7)}
              @change=${t=>this.emit({days:Number(this.value(t))})}
            />
          </label>
          <label>
            Data mode
            <select
              name="mode"
              .value=${t}
              @change=${t=>this.emit({mode:this.value(t)})}
            >
              <option value="auto">Automatic</option>
              <option value="numeric">Numeric</option>
              <option value="categorical">Categorical</option>
            </select>
          </label>
        </div>
        <div class="two-column">
          <label>
            Start hour
            <select
              name="start_hour"
              .value=${String(i)}
              @change=${t=>this.emit({start_hour:Number(this.value(t))})}
            >
              ${o.map(t=>j`<option value=${t} ?disabled=${t>s}>${t}</option>`)}
            </select>
          </label>
          <label>
            End hour
            <select
              name="end_hour"
              .value=${String(s)}
              @change=${t=>this.emit({end_hour:Number(this.value(t))})}
            >
              ${o.map(t=>j`<option value=${t} ?disabled=${t<i}>
                    ${t}
                  </option>`)}
            </select>
          </label>
        </div>
      </section>

      ${"categorical"!==t?j`<section class="section">
              <h3>Numeric occupancy</h3>
              <label>
                Color intensity
                <select
                  name="numeric_intensity"
                  .value=${this.config.numeric_intensity??"duration"}
                  @change=${t=>this.emit({numeric_intensity:this.value(t)})}
                >
                  <option value="duration">Occupied time</option>
                  <option value="value">Sensor value</option>
                </select>
              </label>
              <div class="two-column">
                <label>
                  Above threshold
                  <input
                    name="numeric_threshold"
                    type="number"
                    step="any"
                    .value=${String(this.config.numeric_threshold??0)}
                    @change=${t=>this.emit({numeric_threshold:Number(this.value(t))})}
                  />
                </label>
                <label>
                  Color
                  <input
                    name="numeric_color"
                    type="color"
                    .value=${this.config.numeric_color??"#03a9f4"}
                    @change=${t=>this.emit({numeric_color:this.value(t)})}
                  />
                </label>
              </div>
            </section>`:F}
      ${"numeric"!==t?j`<section class="section">
              <h3>Categorical colors</h3>
              <p class="helper">
                States receive stable automatic colors until you add an override.
              </p>
              ${e.map(([t,e])=>j`<div class="state-row" data-state-color=${t}>
                    <label>
                      State
                      <input
                        type="text"
                        .value=${t}
                        @change=${e=>this.renameState(t,this.value(e))}
                      />
                    </label>
                    <input
                      aria-label=${`Color for ${t}`}
                      type="color"
                      .value=${e}
                      @change=${e=>this.setStateColor(t,this.value(e))}
                    />
                    <button
                      class="icon-button"
                      type="button"
                      title=${`Remove ${t}`}
                      aria-label=${`Remove ${t}`}
                      @click=${()=>this.removeState(t)}
                    >
                      &times;
                    </button>
                  </div>`)}
              <div class="add-row">
                <input
                  type="text"
                  placeholder="State name"
                  .value=${this.draftState}
                  @input=${t=>{this.draftState=this.value(t)}}
                />
                <button
                  data-action="add-state"
                  type="button"
                  @click=${()=>this.addState()}
                >
                  Add state
                </button>
              </div>
              <label class="toggle">
                <input
                  name="show_legend"
                  type="checkbox"
                  .checked=${this.config.show_legend??!0}
                  @change=${t=>this.emit({show_legend:t.currentTarget.checked})}
                />
                Show state legend
              </label>
            </section>`:F}

      <section class="section">
        <h3>Data quality</h3>
        <label>
          Excluded states
          <input
            name="excluded_states"
            type="text"
            .value=${(this.config.excluded_states??["unknown","unavailable"]).join(", ")}
            @change=${t=>this.emit({excluded_states:this.value(t).split(",").map(t=>t.trim()).filter(Boolean)})}
          />
          <span class="helper"
            >Comma-separated recorder states that should not count.</span
          >
        </label>
      </section>
    </div>`}}customElements.get("occupancy-heatmap-card-editor")||customElements.define("occupancy-heatmap-card-editor",zt),customElements.get("occupancy-heatmap-card")||customElements.define("occupancy-heatmap-card",Nt),window.customCards=window.customCards??[],window.customCards.some(t=>"occupancy-heatmap-card"===t.type)||window.customCards.push({type:"occupancy-heatmap-card",name:"Occupancy Heatmap Card",description:"Duration-based numeric and categorical history heatmaps.",preview:!0,documentationURL:"https://github.com/wfchan/ha-occupancy-heatmap-card"});export{Nt as OccupancyHeatmapCard,zt as OccupancyHeatmapCardEditor};
//# sourceMappingURL=ha-occupancy-heatmap-card.js.map
