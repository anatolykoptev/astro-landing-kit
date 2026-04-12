const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/router-Cnt1MPn2.js","assets/tab-selector-DNXWfa90.js","assets/accordion-DIc5WzAF.js","assets/dialog-DICfvtvK.js","assets/menu-CszY2JC7.js","assets/toast-wOCbaTB3.js","assets/tooltip-D3cTCXV0.js"])))=>i.map(i=>d[i]);
const f="modulepreload",b=function(e){return"/"+e},p={},h=function(t,n,i){let s=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),a=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));s=Promise.allSettled(n.map(r=>{if(r=b(r),r in p)return;p[r]=!0;const l=r.endsWith(".css"),c=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${c}`))return;const m=document.createElement("link");if(m.rel=l?"stylesheet":f,l||(m.as="script"),m.crossOrigin="",m.href=r,a&&m.setAttribute("nonce",a),document.head.appendChild(m),l)return new Promise((v,w)=>{m.addEventListener("load",v),m.addEventListener("error",()=>w(new Error(`Unable to preload CSS for ${r}`)))})}))}function d(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return s.then(o=>{for(const a of o||[])a.status==="rejected"&&d(a.reason);return t().catch(d)})};function y(){const e=`
  <nav class="pm7-docs-nav">
    <div class="pm7-docs-nav-inner" style="display: flex; justify-content: space-between; align-items: center;">
      <!-- Left side: Menu button and Logo -->
      <div style="display: flex; align-items: center; gap: var(--pm7-spacing-3);">
        <!-- PM7 Menu Component -->
        <div class="pm7-menu pm7-docs-header-menu" data-pm7-menu>
          <button class="pm7-menu-trigger pm7-button pm7-button--outline pm7-button--sm pm7-menu-trigger--gradient-hover" aria-label="Toggle menu" aria-expanded="false" style="display: inline-flex; align-items: center; cursor: pointer;">
            <svg width="16" height="16" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 6px;">
              <rect width="18" height="2.5" rx="1.25" fill="currentColor"/>
              <rect y="6.25" width="18" height="2.5" rx="1.25" fill="currentColor"/>
              <rect y="12.5" width="18" height="2.5" rx="1.25" fill="currentColor"/>
            </svg>
            <span>Menu</span>
          </button>
          <div class="pm7-menu-content pm7-menu-content--start pm7-gradient-border">
            <a href="/" class="pm7-menu-item">
              <span class="pm7-menu-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </span>
              Home
            </a>
            <a href="/getting-started.html" class="pm7-menu-item">
              <span class="pm7-menu-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </span>
              Getting Started
            </a>
            <a href="/components.html" class="pm7-menu-item">
              <span class="pm7-menu-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </span>
              Components
            </a>
            <a href="/faq.html" class="pm7-menu-item">
              <span class="pm7-menu-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v.01M12 13c0-1 .5-1.5 1-2 1.5-1.5 2-2 2-3.5C15 5.5 13.5 4 11.5 4S8 5.5 8 7.5"/>
                </svg>
              </span>
              FAQ
            </a>
            <a href="/ai-guide.html" class="pm7-menu-item">
              <span class="pm7-menu-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="6" width="20" height="12" rx="2"/>
                  <path d="M9 10h6M8 14h1m2 0h2m2 0h1"/>
                </svg>
              </span>
              AI Guide
            </a>
            <a href="/framework-integration.html" class="pm7-menu-item">
              <span class="pm7-menu-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 2v10M16.24 7.76l-4.24 4.24M21 12h-10M16.24 16.24l-4.24-4.24M12 22v-10M7.76 16.24l4.24-4.24M2 12h10M7.76 7.76l4.24 4.24"/>
                </svg>
              </span>
              Framework Integration
            </a>
            <a href="/style-guide.html" class="pm7-menu-item">
              <span class="pm7-menu-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="2" width="18" height="20" rx="2"/>
                  <path d="M8 6h8M8 10h8M8 14h5"/>
                </svg>
              </span>
              Style Guide
            </a>
            <a href="/upgrade.html" class="pm7-menu-item">
              <span class="pm7-menu-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 20V10M6 14l6-6 6 6"/>
                </svg>
              </span>
              Upgrade to v2
            </a>
            <a href="/readme-links.html" class="pm7-menu-item">
              <span class="pm7-menu-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </span>
              README Links
            </a>
            <div class="pm7-menu-separator"></div>
            <a href="#" class="pm7-menu-item" id="version-info-trigger">
              <span class="pm7-menu-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M12 8h.01M11 12h1v4h1"/>
                </svg>
              </span>
              Version Info
            </a>
            <div class="pm7-menu-separator"></div>
            <div class="pm7-submenu-wrapper">
              <button class="pm7-menu-item pm7-menu-item--has-submenu">
                <span class="pm7-menu-item-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                  </svg>
                </span>
                Theme
              </button>
              <div class="pm7-submenu">
                <button class="pm7-menu-item pm7-menu-item--radio" data-name="theme" data-value="light" onclick="window.setTheme('light')">
                  <span class="pm7-menu-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="5"/>
                      <line x1="12" y1="1" x2="12" y2="3"/>
                      <line x1="12" y1="21" x2="12" y2="23"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                      <line x1="1" y1="12" x2="3" y2="12"/>
                      <line x1="21" y1="12" x2="23" y2="12"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                  </span>
                  Light
                </button>
                <button class="pm7-menu-item pm7-menu-item--radio" data-name="theme" data-value="dark" onclick="window.setTheme('dark')">
                  <span class="pm7-menu-item-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                  </span>
                  Dark
                </button>
              </div>
            </div>
            <div class="pm7-submenu-wrapper">
              <button class="pm7-menu-item pm7-menu-item--has-submenu">
                <span class="pm7-menu-item-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </span>
                Language
              </button>
              <div class="pm7-submenu">
                <button class="pm7-menu-item pm7-menu-item--radio" data-name="language" data-value="en" data-checked="true">
                  <span class="pm7-menu-item-icon">🇬🇧</span>
                  English
                </button>
                <button class="pm7-menu-item pm7-menu-item--radio" data-name="language" data-value="es">
                  <span class="pm7-menu-item-icon">🇪🇸</span>
                  Español
                </button>
                <button class="pm7-menu-item pm7-menu-item--radio" data-name="language" data-value="fr">
                  <span class="pm7-menu-item-icon">🇫🇷</span>
                  Français
                </button>
                <button class="pm7-menu-item pm7-menu-item--radio" data-name="language" data-value="de">
                  <span class="pm7-menu-item-icon">🇩🇪</span>
                  Deutsch
                </button>
                <button class="pm7-menu-item pm7-menu-item--radio" data-name="language" data-value="nl">
                  <span class="pm7-menu-item-icon">🇳🇱</span>
                  Nederlands
                </button>
                <button class="pm7-menu-item pm7-menu-item--radio" data-name="language" data-value="nl-be">
                  <span class="pm7-menu-item-icon">🇧🇪</span>
                  Nederlands (België)
                </button>
                <button class="pm7-menu-item pm7-menu-item--radio" data-name="language" data-value="zh">
                  <span class="pm7-menu-item-icon">🇨🇳</span>
                  中文
                </button>
              </div>
            </div>
            <div class="pm7-menu-separator"></div>
            <a href="https://www.npmjs.com/package/@pm7/core" class="pm7-menu-item" target="_blank" rel="noopener noreferrer">
              <span class="pm7-menu-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 0v24h24v-24h-24zm11.5 18.5h-6v-13h13v13h-3.5v-9.5h-3.5v9.5z"/>
                </svg>
              </span>
              NPM Package
            </a>
            <a href="https://github.com/patrickmast/pm7-ui" class="pm7-menu-item" target="_blank" rel="noopener noreferrer">
              <span class="pm7-menu-item-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </span>
              GitHub
            </a>
          </div>
        </div>
      </div>

      <!-- Right side: Navigation menu -->
      <ul class="pm7-docs-nav-menu">
        <li>
          <a href="/" class="${window.location.pathname==="/"?"active":""}" style="display: flex; align-items: center; gap: 4px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
              <path d="M27 15a3 3 0 0 0-3-3h-5V3a3 3 0 1 0-6 0v9H8a3 3 0 0 0-3 3v6h2L6 32h20l-1-11h2zm-6 15v-6h-1v6h-6v-6h-1v6h-1v-8h-1v8H8.19l.909-10h13.802l.909 10zm4-11H7v-4c0-.551.449-1 1-1h7V3c0-.551.449-1 1-1s1 .449 1 1v11h7c.551 0 1 .449 1 1z"/>
            </svg>
            pm7-ui
          </a>
        </li>
        <li><a href="/getting-started.html" class="${window.location.pathname==="/getting-started.html"?"active":""}">Getting Started</a></li>
        <li><a href="/components.html" class="${window.location.pathname.startsWith("/components")?"active":""}">Components</a></li>
        <li><a href="/framework-integration.html" class="${window.location.pathname==="/framework-integration.html"?"active":""}">Framework</a></li>
        <li><a href="https://www.npmjs.com/package/@pm7/core" target="_blank" rel="noopener noreferrer">NPM</a></li>
        <li><a href="https://github.com/patrickmast/pm7-ui" target="_blank" rel="noopener noreferrer">GitHub</a></li>
      </ul>
    </div>
  </nav>`,t=document.getElementById("header-placeholder");t&&(t.innerHTML=e)}function x(){const e=`
  <footer class="pm7-footer">
    <div class="pm7-footer-content">
      <div class="pm7-footer-left">
        <span>© 2025 pm7-ui</span>
        <span class="pm7-footer-version">v<span data-pm7-version>2.0.0</span></span>
      </div>
      <div class="pm7-footer-center">
        <a href="https://pm7.dev" target="_blank" rel="noopener noreferrer" class="pm7-footer-logo-link">
          <span style="font-weight: normal;">By</span>
          <img src="/dancing-patrick-logo.svg" alt="pm7.dev" class="pm7-footer-logo">
          <span>pm7.dev</span>
        </a>
        <span style="margin: 0 var(--pm7-spacing-3); color: var(--pm7-text-secondary);">-</span>
        <a href="https://www.npmjs.com/package/@pm7/core" target="_blank" rel="noopener noreferrer" class="pm7-footer-github">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0v24h24v-24h-24zm11.5 18.5h-6v-13h13v13h-3.5v-9.5h-3.5v9.5z"/>
          </svg>
          <span>NPM</span>
        </a>
        <span style="margin: 0 var(--pm7-spacing-3); color: var(--pm7-text-secondary);">-</span>
        <a href="https://github.com/patrickmast/pm7-ui" target="_blank" rel="noopener noreferrer" class="pm7-footer-github">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span>GitHub</span>
        </a>
      </div>
      <div class="pm7-footer-right">
      </div>
    </div>
  </footer>`,t=document.getElementById("footer-placeholder");t&&(t.innerHTML=e)}function u(){const e=window.location.pathname,t=e.split("/");let n="";t[1]==="components"&&t[2]&&(n=t[2],n.endsWith(".html")&&(n=n.replace(".html",""))),(e==="/components.html"||e==="/components")&&(n="");const i=[{name:"Accordion",componentName:"accordion"},{name:"Button",componentName:"button"},{name:"Callout",componentName:"callout"},{name:"Card",componentName:"card"},{name:"Dialog",componentName:"dialog"},{name:"Icons",componentName:"icons"},{name:"Input",componentName:"input"},{name:"Menu",componentName:"menu"},{name:"Sidebar",componentName:"sidebar"},{name:"Tab Selector",componentName:"tab-selector"},{name:"Theme Switch",componentName:"theme-switch"},{name:"Toast",componentName:"toast"},{name:"Tooltip",componentName:"tooltip"}];i.map(a=>{const l=a.componentName===n?' style="justify-content: flex-start; background-color: var(--pm7-primary); color: var(--pm7-primary-foreground);"':' style="justify-content: flex-start;"',c=`/components/${a.componentName}/documentation`,m=` data-pm7-route="${a.componentName}"`;return`<a href="${c}" class="pm7-button pm7-button--ghost pm7-button--full"${l}${m}>${a.name}</a>`}).join(`
            `);const s=e==="/faq.html",d=`
    <aside class="pm7-sidebar">
      <div class="pm7-sidebar-content">
        <div class="pm7-sidebar-section">
          <h3 class="pm7-sidebar-section-title">Components</h3>
          <nav class="pm7-sidebar-nav">
            ${i.map(a=>{const l=a.componentName===n?" pm7-sidebar-item--active":"",c=`/components/${a.componentName}/documentation`,m=` data-pm7-route="${a.componentName}"`;return`<a href="${c}" class="pm7-sidebar-item${l}"${m}>${a.name}</a>`}).join(`
            `)}
          </nav>
        </div>
        <div class="pm7-sidebar-divider"></div>
        <div class="pm7-sidebar-section">
          <nav class="pm7-sidebar-nav">
            <a href="/faq.html" class="pm7-sidebar-item${s?" pm7-sidebar-item--active":""}" data-pm7-route="faq">FAQ</a>
          </nav>
        </div>
      </div>
    </aside>`,o=document.getElementById("sidebar-placeholder");if(o){o.innerHTML=d;const a=o.querySelectorAll(".pm7-sidebar-item");a.forEach(r=>{r.addEventListener("click",function(l){a.forEach(c=>c.classList.remove("pm7-sidebar-item--active")),this.classList.add("pm7-sidebar-item--active"),this.style.pointerEvents="none",this.offsetHeight,this.style.pointerEvents="",document.activeElement===this&&this.blur()})})}}function k(){if(document.querySelector('[data-pm7-dialog="version-dialog"]'))return;document.body.insertAdjacentHTML("beforeend",`
  <div class="pm7-dialog" 
       data-pm7-dialog="version-dialog"
       data-pm7-dialog-size="sm">
    <div data-pm7-header
         data-pm7-dialog-title="Version Info"
         data-pm7-dialog-subtitle="pm7-ui Component Library"
         data-pm7-dialog-icon="info"
         data-pm7-header-separator>
    </div>
    <div data-pm7-body>
      <p><strong>Version:</strong> <span data-pm7-version>2.0.0</span></p>
      <p><strong>Package:</strong> pm7-ui</p>
      <p><strong>License:</strong> <a href="https://opensource.org/licenses/ISC" target="_blank" rel="noopener noreferrer" style="color: var(--pm7-primary);">https://opensource.org/licenses/ISC</a></p>
    </div>
    <div data-pm7-footer>
      <button class="pm7-button pm7-button--primary" onclick="closeDialog('version-dialog')">
        Close
      </button>
    </div>
  </div>`)}window.showVersionDialog=async function(){await window.loadDialogIfNeeded(),window.openDialog&&window.openDialog("version-dialog")};window.closeVersionDialog=function(){window.closeDialog&&window.closeDialog("version-dialog")};function C(){try{y(),x(),u(),k(),M()}catch{}setTimeout(async()=>{try{const e=document.querySelector("[data-pm7-menu]");e&&window.PM7Menu&&(e.hasAttribute("data-pm7-menu-initialized")||(new window.PM7Menu(e),e.setAttribute("data-pm7-menu-initialized","true")));const t=document.querySelector("[data-pm7-theme-switch]");t&&window.PM7ThemeSwitch&&(t.hasAttribute("data-pm7-theme-switch-initialized")||(new window.PM7ThemeSwitch(t,{onChange:function(i){window.setTheme(i)}}),t.setAttribute("data-pm7-theme-switch-initialized","true"))),setTimeout(()=>{const i=document.querySelector(".pm7-theme-switch--fixed-icon");i&&window.PM7ThemeSwitch&&(i.hasAttribute("data-pm7-theme-switch-initialized")||(new window.PM7ThemeSwitch(i,{onChange:function(s){window.setTheme(s)}}),i.setAttribute("data-pm7-theme-switch-initialized","true")))},100),window.loadDialogIfNeeded=async()=>{if(!window.openDialog||!window.closeDialog){const i=await h(()=>import("./dialog-DICfvtvK.js"),[]);window.openDialog=i.openDialog,window.closeDialog=i.closeDialog}};const n=document.getElementById("version-info-trigger");n&&n.addEventListener("click",async i=>{i.preventDefault(),i.stopPropagation();const s=document.querySelector("[data-pm7-menu]");s&&s.PM7Menu&&s.PM7Menu.close(),await window.loadDialogIfNeeded(),window.showVersionDialog()})}catch{}},10),setTimeout(()=>{g()},50)}function M(){if(document.querySelector(".pm7-theme-switch--fixed-icon"))return;const e=document.createElement("div");e.className="pm7-theme-switch--fixed-icon pm7-theme-switch--sm",e.setAttribute("data-pm7-theme-switch",""),document.body.appendChild(e),window.PM7ThemeSwitch&&new window.PM7ThemeSwitch(e,{onChange:function(t){window.setTheme(t)}})}window.setTheme=function(e){e==="dark"?(document.documentElement.classList.add("dark"),localStorage.setItem("pm7-theme","dark")):(document.documentElement.classList.remove("dark"),localStorage.setItem("pm7-theme","light"));const t=e==="dark";document.querySelectorAll('.pm7-menu-item--radio[data-name="theme"]').forEach(n=>{n.getAttribute("data-value")==="light"?n.setAttribute("data-checked",t?"false":"true"):n.getAttribute("data-value")==="dark"&&n.setAttribute("data-checked",t?"true":"false")}),document.querySelectorAll("[data-pm7-theme-switch]").forEach(n=>{n.PM7ThemeSwitch&&n.PM7ThemeSwitch.updateTheme()})};setTimeout(()=>{const e=document.documentElement.classList.contains("dark");document.querySelectorAll('.pm7-menu-item--radio[data-name="theme"]').forEach(t=>{t.getAttribute("data-value")==="light"?t.setAttribute("data-checked",!e):t.getAttribute("data-value")==="dark"&&t.setAttribute("data-checked",e)})},100);window.loadSidebar=u;window.initializeComponentRouting=g;function g(){h(()=>import("./router-Cnt1MPn2.js"),__vite__mapDeps([0,1,2,3,4,5,6])).then(()=>{document.querySelectorAll("[data-pm7-route]").forEach(t=>{const n=t.getAttribute("data-pm7-route");t.addEventListener("click",i=>{if(window.PM7Router){i.preventDefault(),i.stopPropagation();const s=localStorage.getItem("pm7-docs-last-tab")||"documentation";window.PM7Router.navigateToComponent(n,s)}})})}).catch(e=>{})}export{h as _,x as a,u as b,C as c,y as l};
