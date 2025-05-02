class Root extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    
    connectedCallback() {
        this.render();
    }
    
    render() {
        if (!this.shadowRoot) return;
        
        this.shadowRoot.innerHTML = /*html*/`
            <style>
                :host {
                    display: block;
                    width: 100%;
                    min-height: 100vh;
                }
                
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
            </style>
            
            <app-container></app-container>
        `;
    }
}
export default Root;