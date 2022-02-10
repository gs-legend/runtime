import { TabItem, TabState } from '@kagami/core';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: TabState = {
  activeTabId: '',
  tabs: [],
  curTab: []
};

const tabsViewSlice = createSlice({
  name: 'tabsView',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTabId = action.payload;
    },
    addTab(state, action: PayloadAction<TabItem>) {
      if (!state.tabs.find(tab => tab.id === action.payload.id)) {
        state.tabs.push(action.payload);
      }
    },
    removeTab(state, action: PayloadAction<string>) {
      const targetKey = action.payload;
      // dashboard cloud't be closed
      if (targetKey === state.tabs[0].id) {
        return;
      }

      let activeTabId = state.activeTabId;
      let lastIndex = 0;

      state.tabs.forEach((tab, i) => {
        if (tab.id === targetKey) {
          state.tabs.splice(i, 1);
          lastIndex = i - 1;
        }
      });
      const tabList = state.tabs.filter(tab => tab.id !== targetKey);
      if (tabList.length && activeTabId === targetKey) {
        if (lastIndex >= 0) {
          state.activeTabId = tabList[lastIndex].id;
        } else {
          state.activeTabId = tabList[0].id;
        }
      }
    },
    removeAllTab(state) {
      state.activeTabId = state.tabs[0].id;
      state.tabs = [state.tabs[0]];
    },
    removeOtherTab(state) {
      const activeTab = state.tabs.find(tab => tab.id === state.activeTabId);
      const activeIsDashboard = activeTab!.id === state.tabs[0].id;

      state.tabs = activeIsDashboard ? [state.tabs[0]] : [state.tabs[0], activeTab!];
    }
  }
});

export const { setActiveTab, addTab, removeTab, removeAllTab, removeOtherTab } = tabsViewSlice.actions;

export default tabsViewSlice.reducer;
