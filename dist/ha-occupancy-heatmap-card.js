const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),i=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const s=this.t;if(e&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=i.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&i.set(s,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(i,t,s)},n=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,g=m?m.emptyScript:"",f=u.reactiveElementPolyfillSupport,y=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!a(t,e),_={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((s,i)=>{if(e)s.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),o=t.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,s.appendChild(i)}})(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:$).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const r=this.constructor;if(!1===i&&(o=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??v)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[y("elementProperties")]=new Map,b[y("finalized")]=new Map,f?.({ReactiveElement:b}),(u.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,w=t=>t,S=x.trustedTypes,A=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+T,M=`<${E}>`,U=document,D=()=>U.createComment(""),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,z="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,P=/-->/g,H=/>/g,R=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),Z=/'/g,I=/"/g,L=/^(?:script|style|textarea|title)$/i,j=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),q=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),B=new WeakMap,W=U.createTreeWalker(U,129);function V(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const Y=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=N;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,h=0;for(;h<s.length&&(n.lastIndex=h,l=n.exec(s),null!==l);)h=n.lastIndex,n===N?"!--"===l[1]?n=P:void 0!==l[1]?n=H:void 0!==l[2]?(L.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=R):void 0!==l[3]&&(n=R):n===R?">"===l[0]?(n=o??N,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?R:'"'===l[3]?I:Z):n===I||n===Z?n=R:n===P||n===H?n=N:(n=R,o=void 0);const d=n===R&&t[e+1].startsWith("/>")?" ":"";r+=n===N?s+M:c>=0?(i.push(a),s.slice(0,c)+C+s.slice(c)+T+d):s+T+(-2===c?e:d)}return[V(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class J{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,c]=Y(t,e);if(this.el=J.createElement(l,s),W.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=W.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(C)){const e=c[r++],s=i.getAttribute(t).split(T),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?st:X}),i.removeAttribute(t)}else t.startsWith(T)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(L.test(i.tagName)){const t=i.textContent.split(T),e=t.length-1;if(e>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],D()),W.nextNode(),a.push({type:2,index:++o});i.append(t[e],D())}}}else if(8===i.nodeType)if(i.data===E)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(T,t+1));)a.push({type:7,index:o}),t+=T.length-1}o++}}static createElement(t,e){const s=U.createElement("template");return s.innerHTML=t,s}}function G(t,e,s=t,i){if(e===q)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=k(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=G(t,o._$AS(t,e.values),o,i)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??U).importNode(e,!0);W.currentNode=i;let o=W.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new it(o,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(o=W.nextNode(),r++)}return W.currentNode=U,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),k(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&k(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=J.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new K(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=B.get(t.strings);return void 0===e&&B.set(t.strings,e=new J(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new Q(this.O(D()),this.O(D()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=F}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=G(this,t,e,0),r=!k(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=G(this,i[s+n],e,n),a===q&&(a=this._$AH[n]),r||=!k(a)||a!==this._$AH[n],a===F?t=F:t!==F&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class st extends X{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??F)===q)return;const s=this._$AH,i=t===F&&s!==F||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==F&&(s===F||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const ot=x.litHtmlPolyfillSupport;ot?.(J,Q),(x.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;let nt=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new Q(e.insertBefore(D(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};nt._$litElement$=!0,nt.finalized=!0,rt.litElementHydrateSupport?.({LitElement:nt});const at=rt.litElementPolyfillSupport;at?.({LitElement:nt}),(rt.litElementVersions??=[]).push("4.2.2");const lt=1;let ct=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,s){this._$Ct=t,this._$AM=e,this._$Ci=s}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const ht="important",dt=" !"+ht,pt=(t=>(...e)=>({_$litDirective$:t,values:e}))(class extends ct{constructor(t){if(super(t),t.type!==lt||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,s)=>{const i=t[s];return null==i?e:e+`${s=s.includes("-")?s:s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(t,[e]){const{style:s}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?s.removeProperty(t):s[t]=null);for(const t in e){const i=e[t];if(null!=i){this.ft.add(t);const e="string"==typeof i&&i.endsWith(dt);t.includes("-")||e?s.setProperty(t,e?i.slice(0,-11):i,e?ht:""):s[t]=i}}return q}}),ut=new Set(["auto","numeric","categorical"]);const mt={},gt={};function ft(t,e){try{const s=(mt[t]||=new Intl.DateTimeFormat("en-US",{timeZone:t,timeZoneName:"longOffset"}).format)(e).split("GMT")[1];return s in gt?gt[s]:$t(s,s.split(":"))}catch{if(t in gt)return gt[t];const e=t?.match(yt);return e?$t(t,e.slice(1)):NaN}}const yt=/([+-]\d\d):?(\d\d)?/;function $t(t,e){const s=+(e[0]||0),i=+(e[1]||0),o=+(e[2]||0)/60;return gt[t]=60*s+i>0?60*s+i+o:60*s-i-o}class vt extends Date{constructor(...t){super(),t.length>1&&"string"==typeof t[t.length-1]&&(this.timeZone=t.pop()),this.internal=new Date,isNaN(ft(this.timeZone,this))?this.setTime(NaN):t.length?"number"==typeof t[0]&&(1===t.length||2===t.length&&"number"!=typeof t[1])?this.setTime(t[0]):"string"==typeof t[0]?this.setTime(+new Date(t[0])):t[0]instanceof Date?this.setTime(+t[0]):(this.setTime(+new Date(...t)),xt(this,t)):this.setTime(Date.now())}static tz(t,...e){return e.length?new vt(...e,t):new vt(Date.now(),t)}withTimeZone(t){return new vt(+this,t)}getTimezoneOffset(){const t=-ft(this.timeZone,this);return t>0?Math.floor(t):Math.ceil(t)}setTime(t){return Date.prototype.setTime.apply(this,arguments),bt(this),+this}[Symbol.for("constructDateFrom")](t){return new vt(+new Date(t),this.timeZone)}}const _t=/^(get|set)(?!UTC)/;function bt(t){t.internal.setTime(+t),t.internal.setUTCSeconds(t.internal.getUTCSeconds()-Math.round(60*-ft(t.timeZone,t)))}function xt(t,e){const s=Array.isArray(e)?(i=e,Date.UTC(i[0],i.length>1?i[1]:0,i.length>2?i[2]:1,...i.slice(3))):+t.internal;var i;const o=ft(t.timeZone,t),r=o>0?Math.floor(o):Math.ceil(o),n=new Date(+t);n.setUTCHours(n.getUTCHours()-1);const a=-new Date(+t).getTimezoneOffset(),l=-new Date(+n).getTimezoneOffset();let c=a;if(a-l&&a!==r){if(Date.prototype.getHours.apply(t)!==(Array.isArray(e)?e[3]||0:t.internal.getUTCHours())){const e=new Date(+t),s=a-r;s&&e.setUTCMinutes(e.getUTCMinutes()+s);const i=ft(t.timeZone,e);(i>0?Math.floor(i):Math.ceil(i))===r&&(c=l)}}const h=c-r;h&&Date.prototype.setUTCMinutes.call(t,Date.prototype.getUTCMinutes.call(t)+h);const d=new Date(+t);d.setUTCSeconds(0);const p=a>0?d.getSeconds():(d.getSeconds()-60)%60,u=Math.round(-60*ft(t.timeZone,t))%60;(u||p)&&Date.prototype.setUTCSeconds.call(t,Date.prototype.getUTCSeconds.call(t)+u+p);const m=ft(t.timeZone,t),g=m>0?Math.floor(m):Math.ceil(m),f=g!==r,y=-new Date(+t).getTimezoneOffset()-g-h,$=g-r,v=s-60*g*1e3,_=$>0&&wt(t)-s===60*$*1e3&&wt(t,v)!==s;if(f&&y&&!_){Date.prototype.setUTCMinutes.call(t,Date.prototype.getUTCMinutes.call(t)+y);const e=ft(t.timeZone,t),s=g-(e>0?Math.floor(e):Math.ceil(e));s&&y<0&&Date.prototype.setUTCMinutes.call(t,Date.prototype.getUTCMinutes.call(t)+s)}bt(t);const b=(e?s:s+1e3*u)-+t.internal;b&&Math.abs(b)<18e5&&(Date.prototype.setTime.call(t,+t+b),bt(t))}function wt(t,e){const s=new Date(e??+t);return s.setUTCSeconds(s.getUTCSeconds()-Math.round(60*-ft(t.timeZone,s))),+s}Object.getOwnPropertyNames(Date.prototype).forEach(t=>{if(!_t.test(t))return;const e=t.replace(_t,"$1UTC");vt.prototype[e]&&(t.startsWith("get")?vt.prototype[t]=function(){return this.internal[e]()}:(vt.prototype[t]=function(){var t;return Date.prototype[e].apply(this.internal,arguments),t=this,Date.prototype.setFullYear.call(t,t.internal.getUTCFullYear(),t.internal.getUTCMonth(),t.internal.getUTCDate()),Date.prototype.setHours.call(t,t.internal.getUTCHours(),t.internal.getUTCMinutes(),t.internal.getUTCSeconds(),t.internal.getUTCMilliseconds()),xt(t),+this},vt.prototype[e]=function(){return Date.prototype[e].apply(this,arguments),bt(this),+this}))});class St extends vt{static tz(t,...e){return e.length?new St(...e,t):new St(Date.now(),t)}toISOString(){const[t,e,s]=this.tzComponents(),i=`${t}${e}:${s}`;return this.internal.toISOString().slice(0,-1)+i}toString(){return`${this.toDateString()} ${this.toTimeString()}`}toDateString(){const[t,e,s,i]=this.internal.toUTCString().split(" ");return`${t?.slice(0,-1)} ${s} ${e} ${i}`}toTimeString(){const t=this.internal.toUTCString().split(" ")[4],[e,s,i]=this.tzComponents();return`${t} GMT${e}${s}${i} (${function(t,e,s="long"){return new Intl.DateTimeFormat("en-US",{hour:"numeric",timeZone:t,timeZoneName:s}).format(e).split(/\s/g).slice(2).join(" ")}(this.timeZone,this)})`}toLocaleString(t,e){return Date.prototype.toLocaleString.call(this,t,{...e,timeZone:e?.timeZone||this.timeZone})}toLocaleDateString(t,e){return Date.prototype.toLocaleDateString.call(this,t,{...e,timeZone:e?.timeZone||this.timeZone})}toLocaleTimeString(t,e){return Date.prototype.toLocaleTimeString.call(this,t,{...e,timeZone:e?.timeZone||this.timeZone})}tzComponents(){const t=this.getTimezoneOffset();return[t>0?"-":"+",String(Math.floor(Math.abs(t)/60)).padStart(2,"0"),String(Math.abs(t)%60).padStart(2,"0")]}withTimeZone(t){return new St(+this,t)}[Symbol.for("constructDateFrom")](t){return new St(+new Date(t),this.timeZone)}}function At(t){return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`}function Ct(t,e,s){const i=St.tz(s,e),o=i.getFullYear(),r=i.getMonth(),n=i.getDate(),a=At(i),l=[];for(let e=t-1;e>=0;e-=1){const t=new St(o,r,n-e,0,0,0,0,s),i=t.getFullYear(),c=t.getMonth(),h=t.getDate(),d=[];for(let t=0;t<24;t+=1){const e=new St(i,c,h,t,0,0,0,s),o=new St(i,c,h,t+1,0,0,0,s);d.push({hour:t,start:e,end:o,durationSeconds:Math.max(0,(o.getTime()-e.getTime())/1e3)})}const p=At(t);l.push({dateKey:p,date:t,isToday:p===a,cells:d})}return l}function Tt(t,e,s){return Math.max(0,Math.min(t.end,s)-Math.max(t.start,e))/1e3}function Et({history:t,config:e,timeZone:s,now:i}){const o=Ct(e.days,i,s),r="auto"===e.mode?function(t,e){const s=new Set(e),i=t.filter(t=>t.trim()&&!s.has(t));return 0===i.length?"categorical":i.every(t=>Number.isFinite(Number(t)))?"numeric":"categorical"}(t.map(t=>t.s),e.excluded_states):e.mode,n=new Set(e.excluded_states),a=function(t,e){const s=[...t].sort((t,e)=>t.lu-e.lu);return s.map((t,i)=>({state:t.s,start:1e3*t.lu,end:Math.min(1e3*(s[i+1]?.lu??e/1e3),e)}))}(t,i.getTime()),l=[],c=new Set;let h=0,d=0;const p=o.map(t=>({...t,cells:t.cells.map(t=>{const s=t.start.getTime(),o=t.end.getTime(),p=Math.min(o,i.getTime()),u=s>=i.getTime();if(u||0===t.durationSeconds)return{...t,occupiedSeconds:0,intensity:0,future:u};for(;h<a.length&&a[h].end<=s;)h+=1;if("numeric"===r){let i=0;for(let t=h;t<a.length;t+=1){const o=a[t];if(o.start>=p)break;n.has(o.state)||Number(o.state)<=e.numeric_threshold||Number.isFinite(Number(o.state))&&(i+=Tt(o,s,p))}return d+=i,{...t,occupiedSeconds:i,intensity:Math.min(1,i/t.durationSeconds),future:u}}const m=new Map;let g=0;for(let t=h;t<a.length;t+=1){const e=a[t];if(e.start>=p)break;if(!e.state.trim()||n.has(e.state))continue;const i=Tt(e,s,p);if(i<=0)continue;g+=i,c.has(e.state)||(c.add(e.state),l.push(e.state));const o=m.get(e.state)??{seconds:0,latestStart:0};m.set(e.state,{seconds:o.seconds+i,latestStart:Math.max(o.latestStart,e.start)})}d+=g;const f=[...m.entries()].sort((t,e)=>e[1].seconds-t[1].seconds||e[1].latestStart-t[1].latestStart)[0],y=f?.[1].seconds??0;return{...t,occupiedSeconds:y,intensity:Math.min(1,y/t.durationSeconds),state:f?.[0],future:u}})}));return{mode:r,days:p,totalSeconds:d,legendStates:l}}class Mt{constructor(){this.generation=0,this.pending=new Map}load(t,e,s,i){const o=[e,s.toISOString(),i.toISOString()].join("|"),r=this.pending.get(o);if(r)return r;const n=++this.generation,a=t.callWS({type:"history/history_during_period",start_time:s.toISOString(),end_time:i.toISOString(),entity_ids:[e],minimal_response:!0,no_attributes:!0}).then(t=>({states:t[e]??[],stale:n!==this.generation})).catch(t=>{if(n!==this.generation)return{states:[],stale:!0};throw t}).finally(()=>{this.pending.get(o)===a&&this.pending.delete(o)});return this.pending.set(o,a),a}}const Ut=["#e85d9e","#4ea5e0","#57b881","#e5a84b","#9b7ede","#e36a5c","#36a7a0","#c6ae38"];function Dt(t,e){const s=e[t]?.trim();if(s)return s;let i=2166136261;for(const e of t)i^=e.codePointAt(0)??0,i=Math.imul(i,16777619);return Ut[Math.abs(i)%Ut.length]??Ut[0]}class kt extends nt{constructor(){super(...arguments),this.viewState="idle",this.errorMessage="",this.historyService=new Mt,this.history=[]}static{this.styles=r`
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
          24,
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
  `}get hass(){return this._hass}set hass(t){const e=this._hass,s=this.config?.entity,i=s?e?.states[s]?.last_changed:void 0,o=s?t?.states[s]?.last_changed:void 0;this._hass=t,this.requestUpdate("hass",e),this.config&&t&&("idle"===this.viewState||i!==o)&&this.loadHistory()}connectedCallback(){super.connectedCallback(),this.minuteTimer=setInterval(()=>this.recompute(),6e4)}disconnectedCallback(){super.disconnectedCallback(),this.minuteTimer&&clearInterval(this.minuteTimer)}setConfig(t){const e=function(t){const e=t.entity?.trim();if(!e)throw new Error("Entity is required");const s=t.days??7;if(!Number.isInteger(s)||s<1||s>31)throw new Error("Days must be an integer between 1 and 31");const i=t.mode??"auto";if(!ut.has(i))throw new Error("Mode must be auto, numeric, or categorical");const o=t.numeric_threshold??0;if(!Number.isFinite(o))throw new Error("Numeric threshold must be a finite number");const r=Array.from(new Set((t.excluded_states??["unknown","unavailable"]).map(t=>t.trim()).filter(Boolean)));return{type:"custom:occupancy-heatmap-card",entity:e,title:t.title?.trim()||void 0,days:s,mode:i,numeric_threshold:o,numeric_color:t.numeric_color?.trim()||"#03a9f4",state_colors:{...t.state_colors??{}},excluded_states:r,show_legend:t.show_legend??!0}}(t),s=JSON.stringify(e)!==JSON.stringify(this.config);this.config=e,s&&(this.data=void 0,this.history=[],this.selected=void 0,this.viewState="idle",this._hass&&this.loadHistory()),this.requestUpdate()}static getConfigElement(){return document.createElement("occupancy-heatmap-card-editor")}static getStubConfig(t,e,s){return{entity:e?.[0]??s?.[0]??Object.keys(t?.states??{})[0]??"",days:7,mode:"auto"}}getCardSize(){return Math.max(3,Math.min(12,(this.config?.days??7)+2))}getGridOptions(){return{columns:12,min_columns:6,rows:this.getCardSize()}}async loadHistory(){if(!this.config||!this._hass)return;if(!this._hass.states[this.config.entity])return this.viewState="missing",this.data=void 0,void this.requestUpdate();const t=new Date,e=Ct(this.config.days,t,this._hass.config.time_zone),s=e[0]?.cells[0]?.start;if(s){this.viewState=this.data?"ready":"loading",this.errorMessage="",this.requestUpdate();try{const e=await this.historyService.load(this._hass,this.config.entity,s,t);if(e.stale)return;this.history=e.states,0===e.states.length?(this.data=void 0,this.viewState="empty"):(this.recompute(t),this.viewState="ready")}catch(t){this.data=void 0,this.viewState="error",this.errorMessage=t instanceof Error?t.message:"Unable to load history"}this.requestUpdate()}}recompute(t=new Date){this.config&&this._hass&&0!==this.history.length&&(this.data=Et({history:this.history,config:this.config,timeZone:this._hass.config.time_zone,now:t}),this.requestUpdate())}renderState(t){const e={loading:["Loading history","Reading recorder data for this entity."],missing:["Entity not found",`Home Assistant does not contain ${this.config?.entity}.`],empty:["No recorded history","Recorder has no states in the selected date range."],error:["History unavailable",this.errorMessage||"Home Assistant could not load history."]}[t];return j`<ha-card>
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
    </ha-card>`}stateColor(t){return this.config&&this.data?"numeric"===this.data.mode?this.config.numeric_color:Dt(t??"",this.config.state_colors):"var(--primary-color, #03a9f4)"}dayLabel(t,e){const s=this._hass?.locale.language||"en";return e?new Intl.RelativeTimeFormat(s,{numeric:"auto"}).format(0,"day"):new Intl.DateTimeFormat(s,{weekday:this.config&&this.config.days<=7?"short":void 0,month:this.config&&this.config.days>7?"short":void 0,day:this.config&&this.config.days>7?"numeric":void 0,timeZone:this._hass?.config.time_zone}).format(t)}cellDetail(t){const e=this._hass?.locale.language||"en",s=new Intl.DateTimeFormat(e,{month:"short",day:"numeric",timeZone:this._hass?.config.time_zone}).format(t.start),i=Math.round(t.occupiedSeconds/60),o=t.state?`${t.state}, `:"";return`${s}, ${String(t.hour).padStart(2,"0")}:00, ${o}${i} min`}renderCell(t){const e=this.stateColor(t.state),s=t.occupiedSeconds>0,i=this.cellDetail(t),o=this.selected?.start.getTime()===t.start.getTime();return j`<button
      class=${`cell${s?" filled":""}${o?" selected":""}`}
      style=${pt({"--cell-color":e,"--cell-strength":`${Math.round(14+86*t.intensity)}%`})}
      aria-label=${i}
      title=${i}
      ?disabled=${t.future||0===t.durationSeconds}
      @click=${()=>{this.selected=t,this.requestUpdate()}}
      @focus=${()=>{this.selected=t,this.requestUpdate()}}
    ></button>`}render(){if("ready"!==this.viewState)return this.renderState("idle"===this.viewState?"loading":this.viewState);if(!this.data||!this.config)return this.renderState("empty");const t=this._hass?.states[this.config.entity],e=this.config.title||t?.attributes.friendly_name||this.config.entity,s=this.data.totalSeconds/3600,i="numeric"===this.data.mode?"occupied":"recorded",o=this.stateColor(t?.state);return j`<ha-card aria-busy="false">
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
              Past ${this.config.days} days &middot; ${s.toFixed(1)} h ${i}
            </p>
          </div>
          ${"categorical"===this.data.mode&&this.config.show_legend?j`<div class="legend" aria-label="State colors">
                  ${this.data.legendStates.map(t=>j`<span class="legend-item">
                        <span
                          class="swatch"
                          style=${pt({"--state-color":Dt(t,this.config.state_colors)})}
                        ></span>
                        ${t}
                      </span>`)}
                </div>`:F}
        </div>

        <div class="scroll" aria-label="Hourly occupancy heatmap">
          <div class="matrix" role="grid">
            <div class="matrix-row hour-row" role="row">
              <span class="corner"></span>
              ${Array.from({length:24},(t,e)=>e%3==0?j`<span class="hour-label" role="columnheader">${e}</span>`:j`<span class="hour-label" aria-hidden="true"></span>`)}
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
          ${this.selected?j`<strong>${this.selected.state||i}</strong>
                  <span>${this.cellDetail(this.selected)}</span>`:j`<span>Select an hour for details</span>`}
        </div>
      </div>
    </ha-card>`}}class Ot extends nt{constructor(){super(...arguments),this.config={},this.draftState=""}static{this.styles=r`
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
  `}get hass(){return this._hass}set hass(t){const e=this._hass;this._hass=t,this.requestUpdate("hass",e)}setConfig(t){this.config={...t},this.requestUpdate()}emit(t){this.config={...this.config,...t},this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.config},bubbles:!0,composed:!0})),this.requestUpdate()}value(t){return t.currentTarget.value}entityChanged(t){const e=t.detail.value?.trim();e&&this.emit({entity:e})}renameState(t,e){const s=e.trim();if(!s||s===t)return;const i={...this.config.state_colors??{}};i[s]=i[t]??"#03a9f4",delete i[t],this.emit({state_colors:i})}setStateColor(t,e){this.emit({state_colors:{...this.config.state_colors??{},[t]:e}})}removeState(t){const e={...this.config.state_colors??{}};delete e[t],this.emit({state_colors:e})}addState(){const t=this.draftState.trim();t&&(this.setStateColor(t,"#03a9f4"),this.draftState="")}render(){const t=this.config.mode??"auto",e=Object.entries(this.config.state_colors??{});return j`<div class="editor">
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
      </section>

      ${"categorical"!==t?j`<section class="section">
              <h3>Numeric occupancy</h3>
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
    </div>`}}customElements.get("occupancy-heatmap-card-editor")||customElements.define("occupancy-heatmap-card-editor",Ot),customElements.get("occupancy-heatmap-card")||customElements.define("occupancy-heatmap-card",kt),window.customCards=window.customCards??[],window.customCards.some(t=>"occupancy-heatmap-card"===t.type)||window.customCards.push({type:"occupancy-heatmap-card",name:"Occupancy Heatmap Card",description:"Duration-based numeric and categorical history heatmaps.",preview:!0,documentationURL:"https://github.com/wfchan/ha-occupancy-heatmap-card"});export{kt as OccupancyHeatmapCard,Ot as OccupancyHeatmapCardEditor};
//# sourceMappingURL=ha-occupancy-heatmap-card.js.map
