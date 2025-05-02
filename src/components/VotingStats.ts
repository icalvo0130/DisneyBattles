import { Character } from '../types/types';
import { store } from '../flux/Store';

class VotingStats extends HTMLElement {
    private characters: [Character, Character] | null = null;
    
    static get observedAttributes() {
        return ['characters-data'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        // suscribirse a cambios de store
        store.subscribe((state) => {
            // solo actualizar si hay personajes y uno ha cambiado
            if (this.characters) {
                const combatId = parseInt(this.getAttribute('combat-id') || '0');
                const combat = state.combats.find(c => c.id === combatId);
                
                if (combat) {
                    this.characters = combat.characters;
                    this.render();
                }
            }
        });
        
        this.render();
    }
    
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'characters-data' && newValue) {
            this.characters = JSON.parse(newValue);
            this.render();
        }
    }
    
    render() {
        if (!this.shadowRoot || !this.characters) return;

        const totalVotes = this.characters[0].votes + this.characters[1].votes;
        const percentage1 = totalVotes === 0 ? 50 : Math.round((this.characters[0].votes / totalVotes) * 100);
        const percentage2 = totalVotes === 0 ? 50 : Math.round((this.characters[1].votes / totalVotes) * 100);
        
        this.shadowRoot.innerHTML = /*html*/ `
            <style>
                .stats-container {
                    font-family: 'Arial', sans-serif;
                    background-color: #f0f8ff;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 600px;
                    margin: 20px auto;
                }
                
                .stats-title {
                    color: #0066cc;
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 1.5rem;
                }
                
                .progress-container {
                    margin-bottom: 15px;
                }
                
                .character-label {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }
                
                .character-name {
                    font-weight: bold;
                    color: #333;
                }
                
                .character-percentage {
                    color: #0066cc;
                }
                
                .progress-bar {
                    height: 25px;
                    background-color: #e0e0e0;
                    border-radius: 5px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background-color: #1e90ff;
                    transition: width 0.5s ease-in-out;
                }
                
                .total-votes {
                    text-align: center;
                    margin-top: 20px;
                    color: #555;
                    font-style: italic;
                }
            </style>
            
            <div class="stats-container">
                <h2 class="stats-title">Estadisticas de Votacion</h2>
                
                <div class="progress-container">
                    <div class="character-label">
                        <span class="character-name">${this.characters[0].name}</span>
                        <span class="character-percentage">${percentage1}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage1}%"></div>
                    </div>
                </div>
                
                <div class="progress-container">
                    <div class="character-label">
                        <span class="character-name">${this.characters[1].name}</span>
                        <span class="character-percentage">${percentage2}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage2}%"></div>
                    </div>
                </div>
                
                <div class="total-votes">
                    Total de votos: ${totalVotes}
                </div>
            </div>
        `;
    }
}

export default VotingStats;