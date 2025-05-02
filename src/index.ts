
import CharacterCard from '../src/components/CharacterCard';
import CombatCard from '../src/components/CombatCard';
import VotingStats from '../src/components/VotingStats';
import AppContainer from '../src/components/AppContainer';
import LandingPage from '../src/pages/LandingPage';
import CombatDetailPage from '../src/pages/CombatDetailPage';
import Root from '../src/components/Root';

//registro d componentes
customElements.define('character-card', CharacterCard);
customElements.define('combat-card', CombatCard);
customElements.define('voting-stats', VotingStats);
customElements.define('app-container', AppContainer); 

// registro d paginas
customElements.define('landing-page', LandingPage);
customElements.define('combat-detail-page', CombatDetailPage);
customElements.define('app-root', Root);


//iniciar 
window.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = '<app-root></app-root>';
});
