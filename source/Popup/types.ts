export interface TabType {
  id: string; // uuid
  order: number; // order in tab list
  title: string; // title of the tab
  createdAt: string; // utc timestamp
  updatedAt: string; // utc timestamp
  // content: string;
}

export interface RecentlyDeleted {
  id: string; // uuid
  tabName: string; // name of deleted tab
  deletedAt: string; // utc timestamp
  createdAt: string; // utc timestamp
  data: any; // data of the tab
}

export interface TabContent {
  id: string;
  content: string;
}

export interface UserData {
  lastTabId?: string;
}
