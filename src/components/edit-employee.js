import { connect } from 'pwa-helpers';
import { store } from '../redux/store.js';
import { editEmployee } from "../redux/actions.js";
import { EmployeeForm } from './employee-form.js';
import { t } from '../localization/i18n.js';

class EditEmployee extends connect(store)(EmployeeForm) {
    static properties = {
        id: { type: String },
        showConfirmation: { type: Boolean },
    };
    onBeforeEnter(context) {
        this.id = context.params.id;
        this.fetchEmployee();
    }

    constructor() {
        super();
        this.mode = 'edit';
        this.showConfirmation = false;
        document.addEventListener('language-changed', () => this.requestUpdate());
    }

    fetchEmployee() {
        const state = store.getState();
        const employee = state.employees.find(emp => emp.id === this.id);

        if (employee) {
            this.employee = { ...employee };
        } else {
            console.error(`Employee with ID ${this.id} not found`);
            Router.go('/');
        }
    }

    handleConfirmed() {
        console.log('Employee updated:', this.employee);
        store.dispatch(editEmployee(this.employee));

        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
    }

    handleCancelled() {
        console.log('Edit cancelled by the user');
    }

    handleSubmit(event) {
        event.preventDefault();

        const dialog = this.shadowRoot.querySelector('confirmation-dialog');

        dialog.open(
            t('updateConfirmation').replace(
                '{name}',
                `${this.employee.firstName} ${this.employee.lastName}`
            )
        );
    }
}

customElements.define('edit-employee', EditEmployee);