import type { ReactNode, RefObject } from 'react';
import type { LayoutRectangle, StyleProp, View, ViewStyle } from 'react-native';

export type DragAxis = 'x' | 'y' | 'both';

export interface DragVector {
    x: number;
    y: number;
}

export interface DragData {
    id: string | number;
    [key: string]: unknown;
}

export interface DragCallbacks {
    onDragStart?: (data: DragData) => void;
    onDrag?: (position: DragVector) => void;
    onDragEnd?: (data: DragData) => void;
    onDrop?: (payload: { data: DragData; targetId: string | null }) => void;
}

export interface DroppableCallbacks {
    onDragEnter?: (data: DragData) => void;
    onDragLeave?: (data: DragData) => void;
    onDrop?: (data: DragData) => void;
    onDragOver?: (data: DragData) => void;
}

export interface DroppableRegistration extends DroppableCallbacks {
    id: string;
    layout: LayoutRectangle | null;
    collisionPadding?: number;
}

export interface DropProviderProps {
    children: ReactNode;
}

export interface DragOverlayState {
    originX: number;
    originY: number;
    width: number;
    height: number;
    translationX: number;
    translationY: number;
    content: ReactNode | null;
}

export interface DropContextValue {
    activeDrag: DragData | null;
    activeDroppableId: string | null;
    registerDroppable: (registration: DroppableRegistration) => void;
    unregisterDroppable: (id: string) => void;
    updateDroppableLayout: (id: string, layout: LayoutRectangle) => void;
    notifyDragMove: (pointer: DragVector) => void;
    startDrag: (data: DragData) => void;
    endDrag: () => void;
    setDragOverlay: (state: DragOverlayState | null) => void;
    updateDragTranslation: (x: number, y: number) => void;
    providerOffset: DragVector;
}

export interface DraggableProps extends DragCallbacks {
    children: ReactNode;
    data: DragData;
    dragAxis?: DragAxis;
    dragBoundsRef?: RefObject<View>;
    style?: StyleProp<ViewStyle>;
}

export interface DroppableProps extends DroppableCallbacks {
    children: ReactNode;
    droppableId: string;
    style?: StyleProp<ViewStyle>;
    activeStyle?: StyleProp<ViewStyle>;
    collisionPadding?: number;
}
