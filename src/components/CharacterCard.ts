import { Character } from '../types/types';
import { CombatActions } from '../flux/Actions';
import { store } from '../flux/Store';

class CharacterCard extends HTMLElement {
    private character: Character | null = null;
    private combatId: number = 0;
    private detailMode: boolean = false;
    private hasVoted: boolean = false;
    
    static get observedAttributes() {
        return ['character-data', 'combat-id', 'detail-mode'];
    }
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        // se uscribirse a los cambios del store para actualizar el estado 
        store.subscribe((state) => {
            if (this.combatId) {
                this.hasVoted = store.hasUserVoted(this.combatId);
                this.render();
            }
        });
        
        this.render();
    }
    
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === 'character-data' && newValue) {
            this.character = JSON.parse(newValue);
        }
        
        if (name === 'combat-id' && newValue) {
            this.combatId = parseInt(newValue);
            // mira si el usuario ya voto ahi
            this.hasVoted = store.hasUserVoted(this.combatId);
        }
        
        if (name === 'detail-mode') {
            this.detailMode = newValue === 'true';
        }
        
        this.render();
    }
    
    handleVote(event: Event) {
        event.preventDefault();
        if (this.character && this.combatId && !this.hasVoted) {
            CombatActions.voteForCharacter(this.combatId, this.character.id);
            this.hasVoted = true;
            this.render();
        }
    }
    
    render() {
        if (!this.shadowRoot || !this.character) return;
        
        // se ajustan tamaños según el modo
        const cardWidth = this.detailMode ? '300px' : '100%';
        const maxWidth = this.detailMode ? '300px' : '180px';
        const imageHeight = this.detailMode ? '300px' : '180px';
        const fontSize = this.detailMode ? '1.5rem' : '1rem';
        
        //si ya voto seria asi
        const buttonText = this.hasVoted ? 'Ya votaste' : 'Votar';
        const buttonStyle = this.hasVoted 
            ? 'background-color: #cccccc; cursor: not-allowed;' 
            : 'background-color: #1e90ff; cursor: pointer;';
        
        this.shadowRoot.innerHTML = /*html */ `
            <style>
                .character-card {
                    font-family: 'Arial', sans-serif;
                    background-color: #f0f8ff;
                    border-radius: 10px;
                    overflow: hidden;
                    width: ${cardWidth};
                    max-width: ${maxWidth};
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s, box-shadow 0.3s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: ${this.detailMode ? '10px' : '0'};
                    box-sizing: border-box;
                }
                
                .character-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
                }
                
                .character-image {
                    width: 100%;
                    height: ${imageHeight};
                    object-fit: contain; 
                    max-width: 100%;
                }
                
                .character-info {
                    padding: 15px;
                    text-align: center;
                    width: 100%;
                    box-sizing: border-box;
                }
                
                .character-name {
                    font-size: ${fontSize};
                    color: #0066cc;
                    margin-bottom: 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .vote-button {
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    transition: background-color 0.3s;
                    margin-top: 10px;
                    display: ${this.detailMode ? 'block' : 'none'};
                    ${buttonStyle}
                }
                
                .vote-button:hover:not([disabled]) {
                    background-color: #0066cc;
                }
                
                .vote-count {
                    font-size: 0.9rem;
                    color: #555;
                    margin-top: 5px;
                    display: ${this.detailMode ? 'block' : 'none'};
                }
                
                .vote-message {
                    font-size: 0.85rem;
                    color: #666;
                    margin-top: 8px;
                    font-style: italic;
                    display: ${(this.detailMode && this.hasVoted) ? 'block' : 'none'};
                }
            </style>
            
            <div class="character-card">
                <img class="character-image" src="${this.character.image}" alt="${this.character.name}">
                <div class="character-info">
                    <h3 class="character-name">${this.character.name}</h3>
                    ${this.detailMode ? `<div class="vote-count">Votos: ${this.character.votes}</div>` : ''}
                    ${this.detailMode ? `
                        <button class="vote-button" ${this.hasVoted ? 'disabled' : ''}>${buttonText}</button>
                        <div class="vote-message">${this.hasVoted ? 'Solo se permite un voto por batalla' : ''}</div>
                    ` : ''}
                </div>
            </div>
        `;
        
        if (this.detailMode && !this.hasVoted) {
            const voteButton = this.shadowRoot.querySelector('.vote-button');
            if (voteButton) {
                voteButton.addEventListener('click', this.handleVote.bind(this));
            }
        }
    }
}

export default CharacterCard;