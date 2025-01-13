import { LitElement, html, css } from "lit-element";
import { connect } from 'pwa-helpers';
import { store } from '../redux/store.js';
import './confirmation-dialog.js';
import { t } from '../localization/i18n.js';

export class EmployeeForm extends connect(store)(LitElement) {
  static properties = {
    id: { type: String },
    employee: { type: Object },
    departments: { type: Array },
    positions: { type: Array },
    mode: { type: String },
  };

  constructor() {
    super();
    this.departments = ["Analytics", "Tech"];
    this.positions = ["Junior", "Medior", "Senior"];
    this.mode = 'add';
    this.employee = {
      id: '',
      firstName: '',
      lastName: '',
      employmentDate: '',
      birthDate: '',
      phone: '',
      email: '',
      department: '',
      position: '',
    };

    document.addEventListener('language-changed', () => this.requestUpdate());
  }

  static styles = css`
      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        margin: 2rem auto;
        padding: 1rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        background: #fff;
      }

      label {
        font-weight: bold;
        color: var(--primary-color, #ff6600);
        width: 100%;
        text-align: left;
      }

      input, select, button {
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        width: 100%;
        box-sizing: border-box;
      }

      input:focus, select:focus, button:focus {
        border-color: var(--primary-color, #ff6600);
        outline: none;
      }

      button {
        background-color: var(--primary-color, #007BFF);
        color: white;
        border: none;
        cursor: pointer;
        padding: 0.7rem 1rem;
        font-size: 1.1rem;
        font-weight: bold;
        border-radius: 5px;
        width: 100%;
      }

      button:hover {
        background-color: var(--primary-hover-color, #0056b3);
      }

      h1 {
        font-size: 1.8em;
        color: var(--primary-color);
        text-align: center;
        margin-bottom: 1rem;
      }

      /* Responsive styles for mobile devices */
      @media (max-width: 768px) {
        form {
          max-width: 100%;
          padding: 1rem;
        }

        h1 {
          font-size: 1.5em;
        }

        button {
          font-size: 1rem;
        }

        input, select {
          font-size: 0.9rem;
          padding: 0.4rem;
        }
      }
    `;

  handleInput(e) {
    const field = e.target.name;
    this.employee = { ...this.employee, [field]: e.target.value };
  }

  handleSubmit(e) {
    e.preventDefault();

    const form = this.shadowRoot.querySelector('form');

    if (form.checkValidity()) {
      console.log('Form is valid:', this.employee);
      
    } else {
      console.error('Form validation failed');
      form.reportValidity();
    }
  }

  handlePhoneInput(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (!value.startsWith('90')) {
      value = '90' + value;
    }
  
    if (value.length <= 3) {
      value = `+${value}`;
    } else if (value.length <= 6) {
      value = `+${value.slice(0, 2)} ${value.slice(2)}`;
    } else if (value.length <= 9) {
      value = `+${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5)}`;
    } else if (value.length <= 11) {
      value = `+${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5, 8)} ${value.slice(8)}`;
    } else {
      value = `+${value.slice(0, 2)} ${value.slice(2, 5)} ${value.slice(5, 8)} ${value.slice(8, 10)} ${value.slice(10, 12)}`;
    }

    e.target.value = value;
    this.employee = { ...this.employee, phone: value };
  }

  render() {
    return html`
      <h1 class="title">${this.mode === 'add' ? t('newEmployeeTitle') : t('editEmployeeTitle')}</h1>
      <form @submit=${this.handleSubmit}>
        <label>
          ${t('firstName')}:
          <input type="text" 
          name="firstName" 
          .value=${this.employee.firstName} 
          @input=${this.handleInput} 
          required 
          pattern="^.{2,30}$"
          title="${t('firstName')} must be between 2 and 20 characters." />
        </label>
 
        <label>
        ${t('lastName')}:
          <input type="text" 
          name="lastName" 
          .value=${this.employee.lastName} 
          @input=${this.handleInput} 
          required 
          pattern="^.{2,20}$"
          title="${t('lastName')} must be between 2 and 20 characters." />
        </label>
         
        <label>
        ${t('employmentDate')}:
          <input type="date" 
          name="employmentDate" 
          .value=${this.employee.employmentDate} 
          @input=${this.handleInput} 
          required 
          max=${new Date().toISOString().split('T')[0]} />
        </label>
 
        <label>
        ${t('birthDate')}:
          <input type="date" 
          name="birthDate" 
          .value=${this.employee.birthDate} 
          @input=${this.handleInput} 
          required 
          max=${new Date().toISOString().split('T')[0]} />
        </label>
 
        <label>
        ${t('phone')}:
          <input type="tel" 
          name="phone" 
          .value=${this.employee.phone} 
          @input=${this.handlePhoneInput} 
          required 
          placeholder="+90 532 123 45 67" />
        </label>
 
        <label>
        ${t('email')}:
          <input type="email" 
          name="email" 
          .value=${this.employee.email} 
          @input=${this.handleInput} 
          required 
          maxlength="50" />
        </label>
 
        <label>
        ${t('department')}:
          <select name="department" 
          .value=${this.employee.department} 
          @change=${this.handleInput} 
          required
          >
            <option value="" disabled>${t('selectDepartment')}</option>
            ${this.departments.map(
      dept => html`
                <option value=${dept} ?selected=${dept === this.employee.department}>${dept}</option>
              `
    )}
          </select>
        </label>

        <label>
        ${t('position')}:
          <select name="position" 
          .value=${this.employee.position} 
          @change=${this.handleInput} 
          required
          >
            <option value="" disabled>${t('selectPosition')}</option>
            ${this.positions.map(
      pos => html`
                <option value=${pos} ?selected=${pos === this.employee.position}>${pos}</option>
              `
    )}
          </select>
        </label>
 
        <button type="submit">${this.mode === 'add' ? t('addEmployeeButton') : t('updateEmployeeButton')}</button>

        <confirmation-dialog
          @confirmed=${this.handleConfirmed}
          @cancelled=${this.handleCancelled}
        ></confirmation-dialog>
      </form>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);