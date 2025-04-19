import { SidebarStore } from './types';

export const sidebarMainSelector = (state: SidebarStore) => ({
    ref: state.searchRef,
    value: state.searchValue,
    handleSearch: state.actions.handleSearch,
    resetSearch: state.actions.resetSearch,
    handleLogout: state.actions.handleLogout,
});