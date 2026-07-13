import { createContext } from "react";

import type { UIMenuBorderRadius } from "./menu-radius";
import type { UIMenuSize } from "./menu-size";

export type MenuContextValue = {
  requestClose: () => void;
  activeItemId: string | null;
  setActiveItemId: (id: string | null) => void;
  size: UIMenuSize;
  borderRadius: UIMenuBorderRadius;
};

export const MenuContext = createContext<MenuContextValue>({
  requestClose: () => undefined,
  activeItemId: null,
  setActiveItemId: () => undefined,
  size: "lg",
  borderRadius: "lg",
});
