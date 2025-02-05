import { LitElement, html } from 'da-lit';
import { getNx, setNx } from '../../scripts/utils.js';

// Initialize nx path before using getNx()
setNx('/nx');

// Styles
const { default: getStyle } = await import(`${getNx()}/utils/styles.js`);
const STYLE = await getStyle(import.meta.url);

class DaFeedback extends LitElement {
  static properties = {
    showModal: { type: Boolean },
    selectedMood: { type: String },
  };

  constructor() {
    super();
    this.showModal = false;
    this.selectedMood = '';
  }

  async connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.adoptedStyleSheets = [STYLE];
  }

  _handleClick() {
    this.showModal = true;
  }

  _handleClose() {
    this.showModal = false;
    this.selectedMood = '';
  }

  _handleMoodSelect(mood) {
    this.selectedMood = mood;
  }

  _handleSubmit(e) {
    e.preventDefault();
    const comment = this.shadowRoot.querySelector('textarea').value;
    console.log('Feedback submitted:', {
      mood: this.selectedMood,
      comment,
    });
    this.showModal = false;
    this.selectedMood = '';
  }

  render() {
    const moods = [
      { emoji: '😢', value: 'sad' },
      { emoji: '😕', value: 'confused' },
      { emoji: '😐', value: 'neutral' },
      { emoji: '🙂', value: 'happy' },
      { emoji: '😄', value: 'very-happy' },
    ];

    return html`
      ${!this.showModal ? html`<button @click=${this._handleClick}>Feedback</button>` : ''}
      
      ${this.showModal ? html`
        <div class="modal-overlay">
          <div class="modal" style="background: white; width: 400px; padding: 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
                </svg>
                <h2 style="margin: 0; font-size: 18px;">Feedback</h2>
              </div>
              <button 
                @click=${this._handleClose}
                style="
                  border: none;
                  background: none;
                  padding: 4px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #666;
                "
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: block;">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <hr style="border: none; border-top: 1px solid #ddd; margin: 0 -24px 24px -24px;">

            <h3 style="margin-top: 0; font-size: 16px; text-align: center;">How are you feeling?</h3>
            <p style="color: #666; margin-bottom: 24px; text-align: center;">Your input is valuable to improve our platform. Let us know your thoughts and how we can make things better.</p>
            
            <div class="mood-selector" style="display: flex; justify-content: space-between; margin: 24px 0;">
              ${moods.map((mood) => html`
                <button 
                  class="mood-button ${this.selectedMood === mood.value ? 'selected' : ''}"
                  @click=${() => this._handleMoodSelect(mood.value)}
                  style="
                    padding: 8px;
                    font-size: 24px;
                    border: none;
                    background: ${this.selectedMood === mood.value ? '#e8f2ff' : 'white'};
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    transform-origin: center;
                    transform: ${this.selectedMood === mood.value ? 'scale(2)' : 'scale(1)'};
                  "
                  onmouseover="this.style.transform='scale(2)'"
                  onmouseout="this.style.transform='${this.selectedMood === mood.value ? 'scale(2)' : 'scale(1)'}'"
                >
                  ${mood.emoji}
                </button>
              `)}
            </div>

            <form @submit=${this._handleSubmit}>
              <textarea 
                placeholder="Add a Comment..."
                rows="4"
                style="
                  width: 100%;
                  padding: 12px;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  margin-bottom: 16px;
                  font-family: inherit;
                  box-sizing: border-box;
                "
              ></textarea>
              <button 
                type="submit" 
                class="submit-button"
                style="
                  background: #1473e6;
                  color: white;
                  border: none;
                  padding: 12px 24px;
                  border-radius: 4px;
                  cursor: pointer;
                  width: 100%;
                "
              >Submit Now</button>
            </form>
          </div>
        </div>
      ` : ''}
    `;
  }
}

customElements.define('da-feedback', DaFeedback);

export default async function initFeedbackBot(document) {
  const feedback = document.createElement('da-feedback');
  document.body.appendChild(feedback);
}
