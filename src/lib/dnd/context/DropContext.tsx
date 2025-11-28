import * as Haptics from 'expo-haptics';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    type SharedValue,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import type {
    DragData,
    DragOverlayState,
    DragVector,
    DropContextValue,
    DropProviderProps,
    DroppableRegistration,
} from '../types';

const DropContext = createContext<DropContextValue | null>(null);

type RegistryMap = Record<string, DroppableRegistration>;

const isPointInside = (point: DragVector, layout?: DroppableRegistration['layout']) => {
    if (!layout) return false;
    return (
        point.x >= layout.x &&
        point.x <= layout.x + layout.width &&
        point.y >= layout.y &&
        point.y <= layout.y + layout.height
    );
};

const DragOverlay = ({
    overlay,
    translationX,
    translationY,
}: {
    overlay: DragOverlayState;
    translationX: SharedValue<number>;
    translationY: SharedValue<number>;
}) => {
    const animatedStyle = useAnimatedStyle(() => ({
        position: 'absolute',
        left: overlay.originX,
        top: overlay.originY,
        width: overlay.width,
        height: overlay.height,
        transform: [{ translateX: translationX.value }, { translateY: translationY.value }],
        zIndex: 9999,
    }));

    return (
        <Animated.View pointerEvents="none" style={animatedStyle}>
            {overlay.content}
        </Animated.View>
    );
};

export const DropProvider = ({ children }: DropProviderProps) => {
    const droppablesRef = useRef<RegistryMap>({});
    const activeDroppableRef = useRef<string | null>(null);
    const activeDragRef = useRef<DragData | null>(null);
    const containerRef = useRef<View>(null);

    const [activeDroppableId, setActiveDroppableId] = useState<string | null>(null);
    const [activeDrag, setActiveDrag] = useState<DragData | null>(null);
    const [dragOverlay, setDragOverlayState] = useState<DragOverlayState | null>(null);
    const [providerOffset, setProviderOffset] = useState<DragVector>({ x: 0, y: 0 });
    const [measurementEpoch, setMeasurementEpoch] = useState(0);

    const overlayTranslationX = useSharedValue(0);
    const overlayTranslationY = useSharedValue(0);

    const measureProvider = useCallback(() => {
        if (!containerRef.current?.measureInWindow) return;
        containerRef.current.measureInWindow((x, y) => {
            setProviderOffset({ x, y });
        });
    }, []);

    const setDragOverlay = useCallback(
        (state: DragOverlayState | null) => {
            if (state) {
                overlayTranslationX.value = state.translationX;
                overlayTranslationY.value = state.translationY;
            }
            setDragOverlayState(state);
        },
        [overlayTranslationX, overlayTranslationY]
    );

    const updateDragTranslation = useCallback(
        (x: number, y: number) => {
            overlayTranslationX.value = x;
            overlayTranslationY.value = y;
        },
        [overlayTranslationX, overlayTranslationY]
    );

    const registerDroppable = useCallback((registration: DroppableRegistration) => {
        const existing = droppablesRef.current[registration.id];
        droppablesRef.current[registration.id] = {
            ...existing,
            ...registration,
            layout: existing?.layout ?? registration.layout ?? null,
        };
    }, []);

    const unregisterDroppable = useCallback((id: string) => {
        const entry = droppablesRef.current[id];
        const wasActive = activeDroppableRef.current === id;
        delete droppablesRef.current[id];

        if (wasActive) {
            const dragData = activeDragRef.current;
            if (dragData) {
                entry?.onDragLeave?.(dragData);
            }
            activeDroppableRef.current = null;
            setActiveDroppableId(null);
        }
    }, []);

    const updateDroppableLayout = useCallback(
        (id: string, layout: DroppableRegistration['layout']) => {
            const existing = droppablesRef.current[id];
            if (existing) {
                existing.layout = layout || null;
            } else {
                droppablesRef.current[id] = { id, layout: layout || null };
            }
        },
        []
    );

    const findDroppableAtPoint = useCallback((point: DragVector) => {
        return Object.values(droppablesRef.current).find(entry =>
            isPointInside(point, entry.layout)
        );
    }, []);

    const notifyDragMove = useCallback(
        (point: DragVector) => {
            const dragData = activeDragRef.current;
            if (!dragData) return;

            const target = findDroppableAtPoint(point);
            const currentId = activeDroppableRef.current;
            const nextId = target?.id ?? null;

            if (currentId !== nextId) {
                if (currentId) {
                    droppablesRef.current[currentId]?.onDragLeave?.(dragData);
                }
                if (nextId) {
                    Haptics.selectionAsync();
                    target?.onDragEnter?.(dragData);
                }
                activeDroppableRef.current = nextId;
                setActiveDroppableId(nextId);
            }

            if (target) {
                target.onDragOver?.(dragData);
            }
        },
        [findDroppableAtPoint]
    );

    const startDrag = useCallback((data: DragData) => {
        activeDragRef.current = data;
        setActiveDrag(data);
        setMeasurementEpoch(prev => prev + 1);
    }, []);

    const endDrag = useCallback(() => {
        const dragData = activeDragRef.current;
        const targetId = activeDroppableRef.current;

        if (dragData && targetId) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            droppablesRef.current[targetId]?.onDrop?.(dragData);
            droppablesRef.current[targetId]?.onDragLeave?.(dragData);
        }

        activeDroppableRef.current = null;
        activeDragRef.current = null;
        setActiveDroppableId(null);
        setActiveDrag(null);
    }, []);

    const value = useMemo<DropContextValue>(
        () => ({
            activeDrag,
            activeDroppableId,
            registerDroppable,
            unregisterDroppable,
            updateDroppableLayout,
            notifyDragMove,
            startDrag,
            endDrag,
            setDragOverlay,
            updateDragTranslation,
            providerOffset,
            measurementEpoch,
        }),
        [
            activeDrag,
            activeDroppableId,
            registerDroppable,
            unregisterDroppable,
            updateDroppableLayout,
            notifyDragMove,
            startDrag,
            endDrag,
            setDragOverlay,
            updateDragTranslation,
            providerOffset,
            measurementEpoch,
        ]
    );

    return (
        <DropContext.Provider value={value}>
            <View ref={containerRef} onLayout={measureProvider} style={styles.wrapper}>
                <View style={styles.content}>{children}</View>
                {dragOverlay && (
                    <View pointerEvents="none" style={styles.overlayContainer}>
                        <DragOverlay
                            overlay={dragOverlay}
                            translationX={overlayTranslationX}
                            translationY={overlayTranslationY}
                        />
                    </View>
                )}
            </View>
        </DropContext.Provider>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
    },
});

export const useDropContext = () => {
    const ctx = useContext(DropContext);
    if (!ctx) {
        throw new Error('Drop components must be wrapped inside a <DropProvider>.');
    }

    return ctx;
};
