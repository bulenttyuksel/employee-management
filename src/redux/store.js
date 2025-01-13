import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducer.js';

const persistedState = loadState();

export const store = configureStore({
    reducer,
    preloadedState: persistedState,
});

store.subscribe(() => {
    saveState(store.getState());
});

function loadState() {
    try {
        const serializedState = localStorage.getItem('reduxState');
        return serializedState ? JSON.parse(serializedState) : undefined;
    } catch (e) {
        console.error('Could not load state:', e);
        return undefined;
    }
}
function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('reduxState', serializedState);
    } catch (e) {
        console.error('Could not save state:', e);
    }
}