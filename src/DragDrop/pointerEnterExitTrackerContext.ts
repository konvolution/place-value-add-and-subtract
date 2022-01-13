import { createContext } from "react";
import { SimplePointerEnterExitTracker } from "./pointerEnterExitTracker";

export const PointerEnterExitTrackerContext = createContext<
  SimplePointerEnterExitTracker
>(new SimplePointerEnterExitTracker());
