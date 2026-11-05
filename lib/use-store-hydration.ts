"use client";

import { useCallback, useSyncExternalStore } from "react";

type PersistApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (listener: () => void) => () => void;
};

export function useStoreHydration(persist: PersistApi): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => persist.onFinishHydration(onStoreChange),
    [persist],
  );
  const getSnapshot = useCallback(() => persist.hasHydrated(), [persist]);

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
