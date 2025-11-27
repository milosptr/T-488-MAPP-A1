import { useTheme } from '@/src/hooks/useTheme';
import { GlassViewProps, GlassView as RNGlassView } from 'expo-glass-effect';
import { ReactNode } from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';

type Props = {
    style?: StyleProp<ViewStyle>;
    children: ReactNode;
} & GlassViewProps;

export const GlassView = ({ style, children, ...props }: Props) => {
    const theme = useTheme();

    return (
        <RNGlassView
            glassEffectStyle="clear"
            style={[
                style,
                Platform.select({
                    android: { backgroundColor: theme.surface },
                    default: {},
                }),
            ]}
            {...props}
        >
            {children}
        </RNGlassView>
    );
};
