import { useEffect, useState } from "react";
import { engine } from "./dataEngine";

export function useAgriGuardData() {
  const [state, setState] = useState(null);

  useEffect(() => {
    const unsubscribe = engine.subscribe(setState);
    return unsubscribe;
  }, []);

  return state;
}
