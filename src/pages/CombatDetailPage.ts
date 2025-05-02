import { store } from '../flux/Store';
import { CombatActions } from '../flux/Actions';

class CombatDetailPage extends HTMLElement {
    private combatId: number = 0;
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    static get observedAttributes() {
        return ['combat-id'];
    }
    
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'combat-id' && newValue) {
            this.combatId = parseInt(newValue);
            this.render();
        }
    }
    
    connectedCallback() {
        // tener el ID del combate de la URL 
        if (!this.combatId) {
            const path = window.location.pathname;
            const matches = path.match(/\/combat\/(\d+)/);
            if (matches && matches[1]) {
                this.combatId = parseInt(matches[1]);
            }
        }
        
        store.subscribe(this.handleChange.bind(this));
        this.render();
    }
    
    handleChange(state: any) {
        this.render();
    }
    
    goBack() {
        CombatActions.navigate('/');
    }
    
    render() {
        if (!this.shadowRoot) return;
        
        const state = store.getState();
        const combat = state.combats.find(c => c.id === this.combatId);
        
        if (!combat) {
            this.shadowRoot.innerHTML = /*html*/`
                <style>
                    .error-container {
                        text-align: center;
                        padding: 50px;
                    }
                    
                    .error-message {
                        color: #cc0000;
                        font-size: 1.5rem;
                        margin-bottom: 20px;
                    }
                    
                    .back-button {
                        background-color: #0066cc;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 1rem;
                    }
                </style>
                
                <div class="error-container">
                    <div class="error-message">Combate no encontrado</div>
                    <button class="back-button">Volver al inicio</button>
                </div>
            `;
            
            const backButton = this.shadowRoot.querySelector('.back-button');
            if (backButton) {
                backButton.addEventListener('click', this.goBack.bind(this));
            }
            
            return;
        }
        
        this.shadowRoot.innerHTML = /*html*/`
            <style>
                :host {
                    display: block;
                    font-family: 'Arial', sans-serif;
                    color: #333;
                }
                
                .detail-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 30px;
                }
                
                .back-button {
                    background-color: #0066cc;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    margin-right: 20px;
                }
                
                .title {
                    color: #0066cc;
                    font-size: 2rem;
                    margin: 0;
                }
                
                .characters-container {
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }
                
                .vs-text {
                    display: flex;
                    align-items: center;
                    font-size: 3rem;
                    font-weight: bold;
                    color: #0066cc;
                    padding: 0 20px;
                }
                
                .vote-instructions {
                    background-color: #f0f8ff;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 30px;
                    text-align: center;
                    border-left: 5px solid #0066cc;
                }
            </style>
            
            <div class="detail-container">
                <div class="header">
                    <button class="back-button">← Volver</button>
                    <h1 class="title">Combate Disney</h1>
                </div>
                
                <div class="vote-instructions">
                    <p>¡Vota por tu personaje favorito en este combate! Los resultados se actualizan en tiempo real.</p>
                </div>
                
                <div class="characters-container">
                    <character-card 
                        character-data='${JSON.stringify(combat.characters[0])}' 
                        combat-id='${combat.id}'
                        detail-mode='true'>
                    </character-card>
                    
                    <div class="vs-text">VS</div>
                    
                    <character-card 
                        character-data='${JSON.stringify(combat.characters[1])}' 
                        combat-id='${combat.id}'
                        detail-mode='true'>
                    </character-card>
                </div>
                
                <voting-stats 
                    characters-data='${JSON.stringify(combat.characters)}'
                    combat-id='${combat.id}'>
                </voting-stats>
            </div>
        `;
        
        const backButton = this.shadowRoot.querySelector('.back-button');
        if (backButton) {
            backButton.addEventListener('click', this.goBack.bind(this));
        }
    }
}

export default CombatDetailPage;