import { createContext } from "react";
import { DragDropController } from "./dragDropController";

export const DragDropControllerContext = createContext<DragDropController>(
  new DragDropController()
);
