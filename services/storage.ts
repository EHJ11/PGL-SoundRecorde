import AsyncStorage from "@react-native-async-storage/async-storage";

const RECORDINGS_KEY = "@PGL_SOUNDRECORDER_RECORDINGS";

async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    console.error(`Storage getItem error (${key}):`, error);
    return null;
  }
}

async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Storage setItem error (${key}):`, error);
  }
}

async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Storage removeItem error (${key}):`, error);
  }
}

export async function loadRecordings(): Promise<import("@/types").Recording[]> {
  return (await getItem<import("@/types").Recording[]>(RECORDINGS_KEY)) ?? [];
}

export async function saveRecordings(
  recordings: import("@/types").Recording[],
): Promise<void> {
  await setItem(RECORDINGS_KEY, recordings);
}

export async function clearRecordings(): Promise<void> {
  await removeItem(RECORDINGS_KEY);
}
