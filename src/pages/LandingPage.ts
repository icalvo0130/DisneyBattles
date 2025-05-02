import { store } from '../flux/Store';

class LandingPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        store.subscribe(this.handleChange.bind(this));
        this.render();
    }
    
    handleChange(state: any) {
        this.render();
    }
    
    render() {
        if (!this.shadowRoot) return;
        
        const state = store.getState();
        const combats = state.combats;
        
        this.shadowRoot.innerHTML = /*html*/`
            <style>
                :host {
                    display: block;
                    font-family: 'Arial', sans-serif;
                    color: #333;
                }
                
                .landing-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    position: relative;
                }
                
                .title {
                    color: #0066cc;
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                }
                
                .subtitle {
                    color: #555;
                    font-size: 1.2rem;
                    margin-bottom: 20px;
                }
                
                .decorative-line {
                    height: 4px;
                    background: linear-gradient(to right, #0066cc, #00ccff);
                    width: 100px;
                    margin: 0 auto 30px;
                    border-radius: 2px;
                }
                
                .combats-grid {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 20px;
                }
            </style>
            
            <div class="landing-container">
                <div class="header">
                    <h1 class="title">Disney Battles</h1>
                    <p class="subtitle">¡Vota por tus personajes favoritos!</p>
                    <div class="decorative-line"></div>
                </div>
                
                <div class="combats-grid">
                    ${combats.map(combat => `
                        <combat-card combat-data='${JSON.stringify(combat)}'></combat-card>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

export default LandingPage;