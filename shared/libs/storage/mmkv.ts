const storageRegistry = new Map<string, Map<string, string>>();

function getNamespace(namespace: string) {
  if (!storageRegistry.has(namespace)) {
    storageRegistry.set(namespace, new Map());
  }
  return storageRegistry.get(namespace)!;
}

export type StorageNamespace = {
  getString: (key: string) => string | undefined;
  get<T>(key: string): T | undefined;
  set: (key: string, value: unknown) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export function createMemoryStorage(namespace: string): StorageNamespace {
  const store = getNamespace(namespace);

  return {
    getString: (key) => store.get(key),
    get: (key) => {
      const value = store.get(key);
      if (!value) {
        return undefined;
      }
      try {
        return JSON.parse(value);
      } catch (error) {
        console.warn('[storage] Failed to parse JSON', error);
        return undefined;
      }
    },
    set: (key, value) => {
      const serialized = JSON.stringify(value);
      store.set(key, serialized);
    },
    remove: (key) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}
