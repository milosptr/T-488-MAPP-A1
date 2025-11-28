import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useDropContext } from '../context/DropContext';
import type { DragVector, DraggableProps } from '../types';

const clamp = (value: number, min: number, max: number) => {
    'worklet';
    return Math.min(Math.max(value, min), max);
};

export const Draggable = ({
    children,
    data,
    dragAxis = 'both',
    dragBoundsRef,
    style,
    onDrag,
    onDragStart,
    onDragEnd,
    onDrop,
}: DraggableProps) => {
    const {
        startDrag,
        notifyDragMove,
        endDrag,
        activeDroppableId,
        setDragOverlay,
        updateDragTranslation,
        providerOffset,
    } = useDropContext();

    const bounds = useSharedValue<{ x: number; y: number; width: number; height: number } | null>(
        null
    );

    const dragActiveRef = useRef(false);
    const containerRef = useRef<View>(null);
    const originRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

    const [isDraggingLocal, setIsDraggingLocal] = useState(false);

    const measureBounds = useCallback(() => {
        if (!dragBoundsRef?.current || !dragBoundsRef.current.measureInWindow) return;
        dragBoundsRef.current.measureInWindow((x, y, width, height) => {
            bounds.value = { x, y, width, height };
        });
    }, [dragBoundsRef, bounds]);

    const measureSelf = useCallback((callback: () => void) => {
        if (!containerRef.current?.measureInWindow) {
            callback();
            return;
        }
        containerRef.current.measureInWindow((x, y, width, height) => {
            originRef.current = { x, y, width, height };
            callback();
        });
    }, []);

    const showOverlay = useCallback(() => {
        // measureInWindow returns screen coordinates, but overlay is positioned
        // relative to the DropProvider container, so subtract the provider's screen offset
        const relativeX = originRef.current.x - providerOffset.x;
        const relativeY = originRef.current.y - providerOffset.y;

        setDragOverlay({
            originX: relativeX,
            originY: relativeY,
            width: originRef.current.width,
            height: originRef.current.height,
            translationX: 0,
            translationY: 0,
            content: children,
        });
        setIsDraggingLocal(true);
    }, [children, providerOffset.x, providerOffset.y, setDragOverlay]);

    const hideOverlay = useCallback(() => {
        setDragOverlay(null);
        setIsDraggingLocal(false);
    }, [setDragOverlay]);

    const handleDragStart = useCallback(() => {
        dragActiveRef.current = true;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        startDrag(data);
        onDragStart?.(data);
        measureBounds();
        measureSelf(() => {
            showOverlay();
        });
    }, [data, measureBounds, measureSelf, onDragStart, showOverlay, startDrag]);

    const handleDragMove = useCallback(
        (translation: DragVector, absolute: DragVector) => {
            updateDragTranslation(
                dragAxis === 'y' ? 0 : translation.x,
                dragAxis === 'x' ? 0 : translation.y
            );
            notifyDragMove(absolute);
            onDrag?.(translation);
        },
        [dragAxis, notifyDragMove, onDrag, updateDragTranslation]
    );

    const handleDragEnd = useCallback(() => {
        if (!dragActiveRef.current) return;
        const targetId = activeDroppableId ?? null;
        onDrop?.({ data, targetId });
        onDragEnd?.(data);
        endDrag();
        dragActiveRef.current = false;
        hideOverlay();
    }, [activeDroppableId, data, endDrag, hideOverlay, onDragEnd, onDrop]);

    const isLongPressActive = useSharedValue(false);

    const longPressGesture = useMemo(() => {
        return Gesture.LongPress()
            .minDuration(200)
            .onStart(() => {
                isLongPressActive.value = true;
                runOnJS(handleDragStart)();
            });
    }, [handleDragStart, isLongPressActive]);

    const panGesture = useMemo(() => {
        return Gesture.Pan()
            .manualActivation(true)
            .onTouchesMove((_, state) => {
                if (isLongPressActive.value) {
                    state.activate();
                } else {
                    state.fail();
                }
            })
            .onUpdate(event => {
                if (!isLongPressActive.value) return;

                let nextX = event.translationX;
                let nextY = event.translationY;

                const limit = bounds.value;
                if (limit) {
                    const clampedX = clamp(event.absoluteX, limit.x, limit.x + limit.width);
                    const clampedY = clamp(event.absoluteY, limit.y, limit.y + limit.height);
                    nextX = event.translationX + (clampedX - event.absoluteX);
                    nextY = event.translationY + (clampedY - event.absoluteY);
                }

                if (dragAxis === 'x') {
                    nextY = 0;
                } else if (dragAxis === 'y') {
                    nextX = 0;
                }

                runOnJS(handleDragMove)(
                    { x: nextX, y: nextY },
                    { x: event.absoluteX, y: event.absoluteY }
                );
            })
            .onFinalize(() => {
                if (isLongPressActive.value) {
                    isLongPressActive.value = false;
                    runOnJS(handleDragEnd)();
                }
            });
    }, [bounds, dragAxis, handleDragEnd, handleDragMove, isLongPressActive]);

    const composedGesture = useMemo(
        () => Gesture.Simultaneous(longPressGesture, panGesture),
        [longPressGesture, panGesture]
    );

    const placeholderStyle = useAnimatedStyle(() => ({
        opacity: isDraggingLocal ? 0.3 : 1,
    }));

    return (
        <GestureDetector gesture={composedGesture}>
            <View ref={containerRef} style={styles.wrapper}>
                <Animated.View style={[styles.container, style, placeholderStyle]}>
                    {children}
                </Animated.View>
            </View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    container: {
        flexGrow: 0,
    },
});
