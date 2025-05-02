import { store } from '../flux/Store';
import { CombatActions } from '../flux/Actions';
import { disneyCharacters } from '../data/disneyCharacters';

class AppContainer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.handleRouteChange = this.handleRouteChange.bind(this);
    }
    
    connectedCallback() {
        // inicia los datos si es la primera vez
        CombatActions.loadCombats(disneyCharacters);
        
        // se suscribe a cambios en el store
        store.subscribe(this.handleChange.bind(this));
        
        // maneja cambios en la URL
        window.addEventListener('popstate', this.handleRouteChange);
        
        this.render();
        this.handleRouteChange();
    }
    
    disconnectedCallback() {
        window.removeEventListener('popstate', this.handleRouteChange);
    }
    
    handleChange(state: any) {
        this.render();
    }
    
    handleRouteChange() {
        const state = store.getState();
        const path = state.currentPath;
        
        if (!this.shadowRoot) return;
        const contentContainer = this.shadowRoot.querySelector('#content');
        if (!contentContainer) return;
        
        contentContainer.innerHTML = '';
        
        // la ruta actual
        if (path === '/') {
            contentContainer.innerHTML = /*html*/ `
                <landing-page></landing-page>
            `;
        } else if (path.startsWith('/combat/')) {
            const matches = path.match(/\/combat\/(\d+)/);
            if (matches && matches[1]) {
                const combatId = parseInt(matches[1]);
                contentContainer.innerHTML = `
                    <combat-detail-page combat-id="${combatId}"></combat-detail-page>
                `;
            } else {
                contentContainer.innerHTML = `<h1>Combate no encontrado</h1>`;
            }
        } else {
            contentContainer.innerHTML = `<h1>Página no encontrada</h1>`;
        }
    }
    
    render() {
        if (!this.shadowRoot) return;
        
        this.shadowRoot.innerHTML = /*html*/ `
            <style>
                :host {
                    display: block;
                    font-family: 'Arial', sans-serif;
                    color: #333;
                }
                
                .app-container {
                    min-height: 100vh;
                    background: linear-gradient(to bottom, #e6f2ff, #f0f8ff);
                }
                
                .header {
                    background-color: #0066cc;
                    color: white;
                    padding: 15px 0;
                    text-align: center;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                
                .header-title {
                    margin: 0;
                    font-size: 1.8rem;
                }
                
                .footer {
                    background-color: #333;
                    color: white;
                    text-align: center;
                    padding: 20px;
                    margin-top: 40px;
                }
            </style>
            
            <div class="app-container">
                <header class="header">
                    <h1 class="header-title">Disney Battles</h1>
                </header>
                
                <main id="content">
                </main>
                
                <footer class="footer">
                    <p>Laboratorio con TypeScript y Flux</p>
                </footer>
            </div>
        `;
        
        this.handleRouteChange();
    }
}
export default AppContainer;