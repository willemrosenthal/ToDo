import { getTimeDifference } from '../../utils/utils';
import ls from '../localStorage';
import { BackupData, restoreFromBackup } from './backup';
import { backupKey, maxBackups, minElapsedDaysForNewBackup, minLengthChangesForNewBackup } from './constants';

export const getBackupsFromLocalStorage = (): BackupData[] | null => {
  const existingBackups = ls.getItem(backupKey);
  if (!existingBackups) return null;
  if (!Array.isArray(existingBackups)) {
    throw new Error('Local Storage: backups are not an array');
  }
  console.log('existing backups', existingBackups);
  return existingBackups;
};

export const getMostRecentBackup = (): BackupData | null => {
  const backups = getBackupsFromLocalStorage();
  if (!backups) return null;
  return backups[backups.length - 1];
};

// could track this via recording saves from the app itself.
const wereChangesMade = (dataToCache: BackupData, mostRecent: BackupData): boolean => {
  if (!mostRecent) return true;

  const remove = ['updatedAt', 'timestamp', 'lastTabId', 'backupTimestamp'];

  const latestTimestampsRemoved = deeplyRemoveAllKeys({ ...mostRecent }, remove);
  const toCacheTimestampsRemoved = deeplyRemoveAllKeys({ ...dataToCache }, remove);

  const latestTimestampsRemovedString = JSON.stringify(latestTimestampsRemoved);
  const toCacheTimestampsRemovedString = JSON.stringify(toCacheTimestampsRemoved);

  const changesMade = Math.abs(latestTimestampsRemovedString.length - toCacheTimestampsRemovedString.length);
  console.log('Amount of changes made', changesMade);
  return changesMade > minLengthChangesForNewBackup;
};

const deeplyRemoveAllKeys = (obj: any, keys: string[]) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (keys.includes(key)) {
      delete obj[key];
    }
    if (typeof value === 'object') {
      deeplyRemoveAllKeys(value, keys);
    }
  });
  return obj;
};

const shouldReplaceRecent = (dataToCache: BackupData, mostRecent: BackupData) => {
  // timestamps
  const latestTimestamp = mostRecent.timestamp;
  const toCacheTimestamp = dataToCache.timestamp;
  console.log('latestTimestamp', latestTimestamp);
  console.log('toCacheTimestamp', toCacheTimestamp);
  // compare
  const timeDifference = getTimeDifference(latestTimestamp, toCacheTimestamp);
  const shouldReplace = timeDifference.days < minElapsedDaysForNewBackup;
  console.log('shouldReplace', shouldReplace, 'timeDifference', timeDifference.days);
  return shouldReplace;
};

const saveBackup = (backup: BackupData, existingBackups: BackupData[], replaceRecent: boolean) => {
  const copyOfExistingBackups = [...existingBackups];

  // if updating, change the most recent one, otherwise add to the end
  if (replaceRecent) {
    console.log('replacing most recent backup');
    existingBackups[copyOfExistingBackups.length - 1] = backup;
  } else {
    console.log('adding new backup');
    copyOfExistingBackups.push(backup);
    // if we're over the max, remove the oldest one
    if (copyOfExistingBackups.length > maxBackups) {
      copyOfExistingBackups.shift();
    }
  }
  ls.setItem(backupKey, copyOfExistingBackups);
};

// MAIN FUNCTION
const backupLocally = (backupData: BackupData) => {
  // remove recently deleted items
  const backupToSave = { ...backupData };
  deeplyRemoveAllKeys(backupToSave, ['recentlyDeleted']);

  console.log('DATA TO CACHE AS BACKUPs', backupToSave);
  // get existing backups
  const backups = getBackupsFromLocalStorage() || [];

  // if no backups, add our new backup
  if (backups.length === 0) {
    console.log('no backups found, creating new backup');
    backups.push(backupToSave);
    ls.setItem(backupKey, backups);
    return;
  }

  // get most recent backup
  const mostRecentBackup = backups[backups.length - 1];

  // save backup
  const replaceRecent = shouldReplaceRecent(backupToSave, mostRecentBackup);

  // see if changes were made between the two
  const wereChangesMadeToCache = wereChangesMade(backupToSave, mostRecentBackup);
  if (!wereChangesMadeToCache) {
    console.log('no changes made, not saving backup to local storage');
    return;
  }

  saveBackup(backupToSave, backups, replaceRecent);
};

export const restoreLastCachedBackup = () => {
  // fetch all most recent backups
  const allBackups = getBackupsFromLocalStorage();

  if (!allBackups || allBackups.length === 0) {
    console.log('No backups available');
    return;
  }

  // get most recent backup
  const newBackupList = [...allBackups];
  const backupToRestore = newBackupList.pop();
  console.log('backupToRestore', backupToRestore);
  console.log('newBackupList', newBackupList);
  ls.setItem(backupKey, newBackupList);

  restoreFromBackup(backupToRestore);
};

export default backupLocally;
