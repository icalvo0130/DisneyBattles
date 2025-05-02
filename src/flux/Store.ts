import { AppDispatcher, Action } from './Dispatcher';
import { CombatActionTypes } from './Actions';
import { Character, Combat } from '../types/types';

export type AppState = {
    combats: Combat[];
    currentPath: string;
    userVotes: Record<number, boolean>; // registro combates donde el user ya voto
};

type Listener = (state: AppState) => void;

const STORAGE_KEY = 'disney_combats_data';
const USER_VOTES_KEY = 'disney_user_votes';

class CombatStore {
    private _state: AppState = {
        combats: [],
        currentPath: '/',
        userVotes: {}
    };
    
    private _listeners: Listener[] = [];

    constructor() {
        AppDispatcher.register(this._handleActions.bind(this));
        this._loadFromLocalStorage();
    }

    getState(): AppState {
        return this._state;
    }

    // mirar si el usuario ya toco en ese combate
    hasUserVoted(combatId: number): boolean {
        return !!this._state.userVotes[combatId];
    }

    private _handleActions(action: Action): void {
        switch (action.type) {
            case CombatActionTypes.VOTE_FOR_CHARACTER:
                const { combatId, characterId } = action.payload;
                
            
                if (this.hasUserVoted(combatId)) {
                    console.log('Usuario ya votó en este combate.');
                    return; // No hacer nada si ya votó
                }
                
                // se actualizar los votos para el personaje seleccionado
                this._state = {
                    ...this._state,
                    combats: this._state.combats.map(combat => {
                        if (combat.id === combatId) {
                            // encontar personaje y actualiza sus votos :)
                            const updatedCharacters: [Character, Character] = combat.characters.map(character => {
                                if (character.id === characterId) {
                                    return {
                                        ...character,
                                        votes: character.votes + 1
                                    };
                                }
                                return character;
                            }) as [Character, Character];
                            
                            return {
                                ...combat,
                                characters: updatedCharacters
                            };
                        }
                        return combat;
                    }),
                    // registrar que el usuario ya voto en este combate
                    userVotes: {
                        ...this._state.userVotes,
                        [combatId]: true
                    }
                };
                
                this._saveToLocalStorage();
                this._emitChange();
                break;
                
            case CombatActionTypes.LOAD_COMBATS:
                
                if (this._state.combats.length === 0) {
                    this._state = {
                        ...this._state,
                        combats: action.payload
                    };
                    this._saveToLocalStorage();
                    this._emitChange();
                }
                break;
                
            case CombatActionTypes.NAVIGATE:
                const path = action.payload;
                
                // actualizamos la ruta y el historial del navegador
                window.history.pushState(null, '', path);
                
                this._state = {
                    ...this._state,
                    currentPath: path
                };
                
                this._emitChange();
                break;
        }
    }

    private _loadFromLocalStorage(): void {
        // pa cargar datos de combates
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                this._state = {
                    ...this._state,
                    combats: parsedData.combats
                };
            } catch (error) {
                console.error('Error parsing stored data:', error);
            }
        }
        
        // cargar votos del usuario
        const savedVotes = localStorage.getItem(USER_VOTES_KEY);
        if (savedVotes) {
            try {
                const parsedVotes = JSON.parse(savedVotes);
                this._state = {
                    ...this._state,
                    userVotes: parsedVotes
                };
            } catch (error) {
                console.error('Error parsing user votes data:', error);
            }
        }
    }

    private _saveToLocalStorage(): void {
        try {
            // guardar datos de combates
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                combats: this._state.combats
            }));
            
            // guardar datos de votos del usuario
            localStorage.setItem(USER_VOTES_KEY, JSON.stringify(this._state.userVotes));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    }

    private _emitChange(): void {
        const state = this.getState();
        for (const listener of this._listeners) {
            listener(state);
        }
    }

    subscribe(listener: Listener): void {
        this._listeners.push(listener);
        listener(this.getState()); 
    }

    unsubscribe(listener: Listener): void {
        this._listeners = this._listeners.filter(l => l !== listener);
    }
}

export const store = new CombatStore();