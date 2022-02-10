export type TabItem = {
  id: string;
  path: string;
  label: string;
  closable: boolean;
};

export interface TabState {
  tabs: TabItem[];
  activeTabId: TabItem['id'];
  curTab: []
}
