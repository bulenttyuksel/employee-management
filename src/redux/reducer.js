import {
    ADD_EMPLOYEE,
    EDIT_EMPLOYEE,
    DELETE_EMPLOYEE,
    SET_VIEW_MODE
} from './actions.js';

import { data } from '../assets/employee-data.js';

const INITIAL_STATE = {
    employees: data,
    viewMode: 'table'
};

export const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_EMPLOYEE:
            return {
                ...state,
                employees: [...state.employees, action.employee]
            }
        case EDIT_EMPLOYEE:
            return {
                ...state,
                employees: state.employees.map((employee) => action.employee.id === employee.id ? { ...action.employee } : employee)
            }
        case DELETE_EMPLOYEE:
            return {
                ...state,
                employees: state.employees.filter((employee) => action.id !== employee.id
                )
            }
        case SET_VIEW_MODE:
            return { ...state, viewMode: action.payload };
        default:
            return state;
    }
}