export interface TabType {
  id: string; // uuid
  order: number; // order in tab list
  title: string; // title of the tab
  createdAt: string; // utc timestamp
  updatedAt: string; // utc timestamp
}

export interface RecentlyDeleted {
  tabName: string; // name of deleted tab
  deletedAt: string; // utc timestamp
  data: any; // data of the tab
}
