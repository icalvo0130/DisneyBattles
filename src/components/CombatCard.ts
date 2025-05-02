import { Combat } from '../types/types';
import { CombatActions } from '../flux/Actions';

class CombatCard extends HTMLElement {
    private combat: Combat | null = null;
    
    static get observedAttributes() {
        return ['combat-data'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
    }
    
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'combat-data' && newValue) {
            this.combat = JSON.parse(newValue);
            this.render();
        }
    }
    
    handleClick(event: Event) {
        event.preventDefault();
        if (this.combat) {
            CombatActions.navigate(`/combat/${this.combat.id}`);
        }
    }
    
    render() {
        if (!this.shadowRoot || !this.combat) return;
        
        this.shadowRoot.innerHTML = /*html */ `
            <style>
                .combat-card {
                    background-color: #f0f8ff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s, box-shadow 0.3s;
                    cursor: pointer;
                    width: 450px;
                    margin: 15px;
                    box-sizing: border-box;
                }
                
                .combat-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
                }
                
                .combat-content {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px;
                    overflow: hidden;
                    box-sizing: border-box;
                }
                
                .character-container {
                    width: 45%; 
                    display: flex;
                    justify-content: center;
                    box-sizing: border-box;
                }
                
                .vs-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: #0066cc;
                    padding: 0 10px;
                    width: 10%;
                    box-sizing: border-box;
                }
                
                .combat-footer {
                    background-color: #0066cc;
                    color: white;
                    text-align: center;
                    padding: 10px;
                    font-size: 14px;
                }
                
                /* para q todo respete el padding */
                ::slotted(*), ::slotted(character-card) {
                    max-width: 100%;
                    box-sizing: border-box;
                }
            </style>
            
            <div class="combat-card">
                <div class="combat-content">
                    <div class="character-container">
                        <character-card 
                            character-data='${JSON.stringify(this.combat.characters[0])}' 
                            combat-id='${this.combat.id}'
                            detail-mode='false'>
                        </character-card>
                    </div>
                    
                    <div class="vs-container">VS</div>
                    
                    <div class="character-container">
                        <character-card 
                            character-data='${JSON.stringify(this.combat.characters[1])}' 
                            combat-id='${this.combat.id}'
                            detail-mode='false'>
                        </character-card>
                    </div>
                </div>
                <div class="combat-footer">
                    Click para ver detalles y votar
                </div>
            </div>
        `;
        
        const combatCard = this.shadowRoot.querySelector('.combat-card');
        if (combatCard) {
            combatCard.addEventListener('click', this.handleClick.bind(this));
        }
    }
}
export default CombatCard;