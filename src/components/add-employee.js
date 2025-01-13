import { connect } from 'pwa-helpers';
import { store } from '../redux/store.js';
import { addEmployee } from "../redux/actions.js";
import { EmployeeForm } from './employee-form.js';

class AddEmployee extends connect(store)(EmployeeForm) {
  constructor() {
    super();
    this.mode = 'add';
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('form-submitted', this.handleSubmit);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('form-submitted', this.handleSubmit);
  }

  handleSubmit(event) {
    event.preventDefault();

    console.log('New employee added:', this.employee);
    store.dispatch(addEmployee(this.employee));

    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

customElements.define('add-employee', AddEmployee);