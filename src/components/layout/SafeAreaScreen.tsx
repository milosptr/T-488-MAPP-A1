import type { ComponentProps, ReactNode } from 'react';
import React, { useMemo } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { View } from '../ui/Themed';

type SafeAreaScreenProps = {
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
    edges?: readonly Edge[] | undefined;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
} & Omit<ComponentProps<typeof View>, 'style' | 'children'>;

const DEFAULT_EDGES = ['top'] as const;
const DEFAULT_HORIZONTAL_PADDING = 16;

/**
 * USE THIS - Alternative to the default [SafeAreaView](https://github.com/th3rdwave/react-native-safe-area-context#safeareaview)
 * from react-native-safe-area-context which currently has an issue that will cause a flicker / jump on first render on iOS / Android.
 *
 * [SafeAreaProvider](https://github.com/th3rdwave/react-native-safe-area-context#safeareaprovider) should still be higher in the tree.
 *
 * GitHub issues:
 * [219](https://github.com/th3rdwave/react-native-safe-area-context/issues/219),
 * [226](https://github.com/th3rdwave/react-native-safe-area-context/issues/226)
 */
export const SafeAreaScreen = ({
    children,
    style,
    edges = DEFAULT_EDGES,
    paddingTop = 0,
    paddingBottom = 0,
    paddingLeft = DEFAULT_HORIZONTAL_PADDING,
    paddingRight = DEFAULT_HORIZONTAL_PADDING,
    ...rest
}: SafeAreaScreenProps) => {
    const insets = useSafeAreaInsets();
    const defaultEdges = edges === undefined;

    const insetPaddingStyle = useMemo(() => {
        const insetPaddingTop = defaultEdges || edges?.includes('top') ? insets.top : 0;
        const insetPaddingBottom = defaultEdges || edges?.includes('bottom') ? insets.bottom : 0;
        const insetPaddingLeft = defaultEdges || edges?.includes('left') ? insets.left : 0;
        const insetPaddingRight = defaultEdges || edges?.includes('right') ? insets.right : 0;

        return {
            paddingTop: paddingTop + insetPaddingTop,
            paddingBottom: paddingBottom + insetPaddingBottom,
            paddingLeft: paddingLeft + insetPaddingLeft,
            paddingRight: paddingRight + insetPaddingRight,
        };
    }, [
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
        insets.top,
        insets.bottom,
        insets.left,
        insets.right,
        defaultEdges,
        edges,
    ]);

    const _style = useMemo(() => {
        return [insetPaddingStyle, style, { flex: 1 }];
    }, [insetPaddingStyle, style]);

    return (
        <View style={_style} {...rest}>
            {children ?? null}
        </View>
    );
};
