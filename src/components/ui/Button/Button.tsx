import { borderRadius } from '@/src/constants/DesignTokens';
import { useTheme } from '@/src/hooks/useTheme';
import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';

type Props = {
    size?: 'small' | 'medium' | 'large';
    variant?: 'default' | 'outlined' | 'danger' | 'success';
    title: string;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    onPress?: () => void;
};

const sizes = {
    small: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 14,
    },
    medium: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        fontSize: 16,
    },
    large: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        fontSize: 18,
    },
};

export const Button = ({
    size = 'medium',
    variant = 'default',
    title,
    leadingIcon,
    trailingIcon,
    onPress,
}: Props) => {
    const theme = useTheme();
    const sizeStyles = sizes[size];

    const getVariantStyles = () => {
        switch (variant) {
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: theme.button,
                };
            case 'danger':
                return {
                    backgroundColor: theme.error,
                };
            case 'success':
                return {
                    backgroundColor: theme.success,
                };
            default:
                return {
                    backgroundColor: theme.button,
                };
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'outlined':
                return theme.button;
            case 'danger':
            case 'success':
                return '#fff';
            default:
                return theme.onButton;
        }
    };

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
            <View style={[styles.container, getVariantStyles(), sizeStyles]}>
                {leadingIcon}
                <Text
                    style={[styles.title, { color: getTextColor(), fontSize: sizeStyles.fontSize }]}
                >
                    {title}
                </Text>
                {trailingIcon}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.lg,
        gap: 6,
    },
    title: {
        fontWeight: '600',
    },
});
