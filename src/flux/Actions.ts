import { AppDispatcher } from './Dispatcher';
import { Character } from '../types/types';

export const CombatActionTypes = {
    VOTE_FOR_CHARACTER: 'VOTE_FOR_CHARACTER',
    LOAD_COMBATS: 'LOAD_COMBATS',
    NAVIGATE: 'NAVIGATE'
};

export const CombatActions = {
    voteForCharacter: (combatId: number, characterId: number) => {
        AppDispatcher.dispatch({
            type: CombatActionTypes.VOTE_FOR_CHARACTER,
            payload: {
                combatId,
                characterId
            }
        });
    },
    
    loadCombats: (combats: { id: number; characters: [Character, Character]; }[]) => {
        AppDispatcher.dispatch({
            type: CombatActionTypes.LOAD_COMBATS,
            payload: combats
        });
    },

    navigate: (path: string) => {
        AppDispatcher.dispatch({
            type: CombatActionTypes.NAVIGATE,
            payload: path
        });
    }
};
