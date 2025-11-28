import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { LayoutRectangle } from 'react-native';
import { View } from 'react-native';
import { useDropContext } from '../context/DropContext';
import type { DroppableProps } from '../types';

const expandLayout = (layout: LayoutRectangle, padding: number) => {
    return {
        x: layout.x - padding,
        y: layout.y - padding,
        width: layout.width + padding * 2,
        height: layout.height + padding * 2,
    };
};

export const Droppable = ({
    children,
    droppableId,
    style,
    activeStyle,
    collisionPadding = 0,
    onDrop,
    onDragEnter,
    onDragLeave,
    onDragOver,
}: DroppableProps) => {
    const viewRef = useRef<View>(null);
    const layoutRef = useRef<LayoutRectangle | null>(null);

    const {
        registerDroppable,
        unregisterDroppable,
        updateDroppableLayout,
        activeDroppableId,
        activeDrag,
        measurementEpoch,
    } = useDropContext();

    const handleMeasure = useCallback(() => {
        if (!viewRef.current?.measureInWindow) return;
        viewRef.current.measureInWindow((x, y, width, height) => {
            const layout = expandLayout({ x, y, width, height }, collisionPadding);
            layoutRef.current = layout;
            updateDroppableLayout(droppableId, layout);
        });
    }, [collisionPadding, droppableId, updateDroppableLayout]);

    useEffect(() => {
        registerDroppable({
            id: droppableId,
            layout: layoutRef.current,
            collisionPadding,
            onDrop,
            onDragEnter,
            onDragLeave,
            onDragOver,
        });

        return () => unregisterDroppable(droppableId);
    }, [
        droppableId,
        onDrop,
        onDragEnter,
        onDragLeave,
        collisionPadding,
        onDragOver,
        registerDroppable,
        unregisterDroppable,
    ]);

    useEffect(() => {
        handleMeasure();
    }, [handleMeasure]);

    useEffect(() => {
        if (measurementEpoch > 0) {
            handleMeasure();
        }
    }, [measurementEpoch, handleMeasure]);

    const handleLayout = useCallback(() => {
        handleMeasure();
    }, [handleMeasure]);

    const isActive = !!activeDrag && activeDroppableId === droppableId;
    const combinedStyle = useMemo(() => {
        if (isActive && activeStyle) {
            return [style, activeStyle];
        }
        return style;
    }, [activeStyle, isActive, style]);

    return (
        <View ref={viewRef} onLayout={handleLayout} style={combinedStyle}>
            {children}
        </View>
    );
};
