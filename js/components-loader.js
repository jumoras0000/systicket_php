/* Charge les composants HTML dans les pages */
(function() {
    'use strict';
    
    /* Objet pour charger les composants */
    const ComponentsLoader = {
        loadedComponents: new Set(),
        
        /* Charge un composant HTML depuis un fichier */
        async loadComponent(componentName, targetSelector, options = {}) {
            if (this.loadedComponents.has(componentName)) {
                return;
            }
            
            try {
                const response = await fetch(`../components/${componentName}.html`);
                if (!response.ok) {
                    console.warn(`Component ${componentName} not found`);
                    return;
                }
                
                const html = await response.text();
                const target = document.querySelector(targetSelector);
                
                if (!target) {
                    console.warn(`Target selector ${targetSelector} not found`);
                    return;
                }
                
                if (options.insertBefore) {
                    target.insertAdjacentHTML('beforebegin', html);
                } else if (options.insertAfter) {
                    target.insertAdjacentHTML('afterend', html);
                } else {
                    target.innerHTML = html;
                }
                
                // Les scripts insérés via innerHTML ne s'exécutent pas - on les charge séquentiellement
                if (componentName === 'scripts') {
                    this.loadedComponents.add(componentName);
                    const scripts = Array.from(target.querySelectorAll('script'));
                    const loadNext = (index) => {
                        if (index >= scripts.length) return;
                        const oldScript = scripts[index];
                        const script = document.createElement('script');
                        if (oldScript.src) {
                            script.src = oldScript.src;
                            script.onload = () => loadNext(index + 1);
                            script.onerror = () => loadNext(index + 1);
                        } else {
                            script.textContent = oldScript.textContent;
                        }
                        document.body.appendChild(script);
                        if (!oldScript.src) loadNext(index + 1);
                    };
                    loadNext(0);
                }
                
                this.loadedComponents.add(componentName);
                
                if (options.callback) {
                    options.callback();
                }
            } catch (error) {
                console.error(`Error loading component ${componentName}:`, error);
            }
        },
        
        initSidebar(activePage) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                const activeItem = sidebar.querySelector(`[data-page="${activePage}"]`);
                if (activeItem) {
                    activeItem.classList.add('active');
                }
            }
        },

        async init() {
            const body = document.body;
            const currentPage = body.getAttribute('data-page');
            const userRole = body.getAttribute('data-role') || 'admin';
            
            const skipLinkTarget = document.querySelector('[data-component="skip-link"]');
            if (skipLinkTarget) {
                await this.loadComponent('skip-link', '[data-component="skip-link"]');
            }
            
            const headerTarget = document.querySelector('[data-component="header"]');
            if (headerTarget) {
                await this.loadComponent('header', '[data-component="header"]');
            }
            
            const overlayTarget = document.querySelector('[data-component="overlay"]');
            if (overlayTarget) {
                await this.loadComponent('overlay', '[data-component="overlay"]');
            }
            
            const sidebarTarget = document.querySelector('[data-component="sidebar"]');
            const sidebarClientTarget = document.querySelector('[data-component="sidebar-client"]');
            
            if (sidebarClientTarget) {
                await this.loadComponent('sidebar-client', '[data-component="sidebar-client"]');
                if (currentPage) {
                    this.initSidebar(currentPage);
                }
            } else if (sidebarTarget) {
                await this.loadComponent('sidebar', '[data-component="sidebar"]');
                if (currentPage) {
                    this.initSidebar(currentPage);
                }
            }
            
            const scriptsTarget = document.querySelector('[data-component="scripts"]');
            if (scriptsTarget) {
                await this.loadComponent('scripts', '[data-component="scripts"]');
            }
        }
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            ComponentsLoader.init();
        });
    } else {
        ComponentsLoader.init();
    }
})();
