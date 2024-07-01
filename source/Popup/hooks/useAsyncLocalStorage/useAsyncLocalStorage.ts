// /* eslint-disable import/no-cycle */
// import {asyncLocalStorage} from './asyncLocalStorage';
// import {effect, signal} from '@preact/signals-react';
// import {StoredData} from '../useStorage';

// const todoStoreKey = '@to-do-store-key';

// const initialStore = {
//   tabs: {
//     0: {
//       id: 0,
//       name: 'To Do',
//       content: '',
//     },
//   },
//   currentTabIndex: 0,
//   tabOrder: [0],
// };

// export const storeData = signal<StoredData>({} as StoredData);
// export const dataLoaded = signal<boolean>(false);

// // functions
// export const loadStoredValue = async () => {
//   try {
//     const item = await asyncLocalStorage.getItem(todoStoreKey);
//     storeData.value = item ? JSON.parse(item) : initialStore;
//     dataLoaded.value = true;
//   } catch (error) {
//     console.error(error);
//   } finally {
//     dataLoaded.value = true;
//   }
// };


// const saveStoreValue = async (val: StoredData) => {
//   try {
//     await asyncLocalStorage.setItem(todoStoreKey, JSON.stringify(val));
//   } catch (error) {
//     console.error(error);
//   }
// };

// effect(() => {
//   if (Object.keys(storeData.value).length !== 0)
//     saveStoreValue(storeData.value);
// });
