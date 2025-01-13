import { nanoid } from 'nanoid/non-secure';

export const ADD_EMPLOYEE = 'ADD_EMPLOYEE';
export const EDIT_EMPLOYEE = 'EDIT_EMPLOYEE';
export const DELETE_EMPLOYEE = 'DELETE_EMPLOYEE';

export const SET_VIEW_MODE = 'SET_VIEW_MODE';

export const addEmployee = employee => {
    return {
        type: ADD_EMPLOYEE,
        employee: {
            ...employee,
            id: nanoid(),
        }
    };
}

export const editEmployee = employee => {
    return {
        type: EDIT_EMPLOYEE,
        employee: {
            ...employee
        }
    };
}

export const deleteEmployee = id => {
    return {
        type: DELETE_EMPLOYEE,
        id
    };
}

export const setViewMode = (viewMode) => ({
    type: SET_VIEW_MODE,
    payload: viewMode,
});