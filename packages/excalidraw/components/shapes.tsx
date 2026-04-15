import { KEYS } from "@excalidraw/common";

import {
  SelectionIcon,
  RectangleIcon,
  DiamondIcon,
  EllipseIcon,
  ArrowIcon,
  FortifyDoubleArrowIcon,
  LineIcon,
  FreedrawIcon,
  TextIcon,
  ImageIcon,
  EraserIcon,
  laserPointerToolIcon,
  handIcon,
  LassoIcon,
} from "./icons";

import type { AppClassProperties } from "../types";

/** Main dock tools when `fortifyWhiteboard` is enabled (hand is rendered separately in LayerUI). */
export const FORTIFY_TOOLBAR_ORDER_NO_HAND = [
  "selection",
  "lasso",
  "freedraw",
  "eraser",
  "line",
  "arrow",
  "fortifyArrowDouble",
  "text",
  "image",
] as const;

export const SHAPES = [
  {
    icon: handIcon,
    value: "hand",
    key: KEYS.H,
    numericKey: null,
    fillable: false,
    toolbar: true,
  },
  {
    icon: SelectionIcon,
    value: "selection",
    key: KEYS.V,
    numericKey: KEYS["1"],
    fillable: true,
    toolbar: true,
  },
  {
    icon: RectangleIcon,
    value: "rectangle",
    key: KEYS.R,
    numericKey: KEYS["2"],
    fillable: true,
    toolbar: true,
  },
  {
    icon: DiamondIcon,
    value: "diamond",
    key: KEYS.D,
    numericKey: KEYS["3"],
    fillable: true,
    toolbar: true,
  },
  {
    icon: EllipseIcon,
    value: "ellipse",
    key: KEYS.O,
    numericKey: KEYS["4"],
    fillable: true,
    toolbar: true,
  },
  {
    icon: ArrowIcon,
    value: "arrow",
    key: KEYS.A,
    numericKey: KEYS["5"],
    fillable: true,
    toolbar: true,
  },
  {
    icon: LineIcon,
    value: "line",
    key: KEYS.L,
    numericKey: KEYS["6"],
    fillable: true,
    toolbar: true,
  },
  {
    icon: FreedrawIcon,
    value: "freedraw",
    key: [KEYS.P, KEYS.X],
    numericKey: KEYS["7"],
    fillable: false,
    toolbar: true,
  },
  {
    icon: TextIcon,
    value: "text",
    key: KEYS.T,
    numericKey: KEYS["8"],
    fillable: false,
    toolbar: true,
  },
  {
    icon: ImageIcon,
    value: "image",
    key: null,
    numericKey: KEYS["9"],
    fillable: false,
    toolbar: true,
  },
  {
    icon: EraserIcon,
    value: "eraser",
    key: KEYS.E,
    numericKey: KEYS["0"],
    fillable: false,
    toolbar: true,
  },
  {
    icon: laserPointerToolIcon,
    value: "laser",
    key: KEYS.K,
    numericKey: null,
    fillable: false,
    toolbar: false,
  },
] as const;

type ToolbarShape = (typeof SHAPES)[number];

/** Fortify-only dock entry; `value` is not in upstream SHAPES. */
export type FortifyDoubleArrowToolbarItem = {
  icon: typeof FortifyDoubleArrowIcon;
  value: "fortifyArrowDouble";
  key: null;
  numericKey: null;
  fillable: boolean;
  toolbar: boolean;
};

export type ToolbarToolItem = ToolbarShape | FortifyDoubleArrowToolbarItem;

const getFortifyToolbarToolsWithoutHand = (): ToolbarToolItem[] => {
  const list: ToolbarToolItem[] = [];
  for (const value of FORTIFY_TOOLBAR_ORDER_NO_HAND) {
    if (value === "lasso") {
      list.push({
        icon: LassoIcon,
        value: "lasso",
        key: KEYS.V,
        numericKey: null,
        fillable: true,
        toolbar: true,
      } as unknown as ToolbarToolItem);
      continue;
    }
    if (value === "fortifyArrowDouble") {
      list.push({
        icon: FortifyDoubleArrowIcon,
        value: "fortifyArrowDouble",
        key: null,
        numericKey: null,
        fillable: true,
        toolbar: true,
      });
      continue;
    }
    const found = SHAPES.find((s) => s.value === value);
    if (found) {
      list.push(found);
    }
  }
  return list;
};

export const getToolbarTools = (app: AppClassProperties) => {
  if (app.props.fortifyWhiteboard) {
    return getFortifyToolbarToolsWithoutHand();
  }

  const tools =
    app.state.preferredSelectionTool.type === "lasso"
      ? ([
          {
            value: "lasso",
            icon: SelectionIcon,
            key: KEYS.V,
            numericKey: KEYS["1"],
            fillable: true,
            toolbar: true,
          },
          ...SHAPES.slice(1),
        ] as const)
      : SHAPES;

  return tools;
};

export const findShapeByKey = (key: string, app: AppClassProperties) => {
  if (app.props.fortifyWhiteboard) {
    const handShape = SHAPES[0];
    if (
      handShape.key &&
      (typeof handShape.key === "string"
        ? handShape.key === key
        : (handShape.key as readonly string[]).includes(key))
    ) {
      return "hand";
    }
  }
  const shape = getToolbarTools(app).find((shape, index) => {
    return (
      (shape.numericKey != null && key === shape.numericKey.toString()) ||
      (shape.key &&
        (typeof shape.key === "string"
          ? shape.key === key
          : (shape.key as readonly string[]).includes(key)))
    );
  });
  return shape?.value || null;
};
