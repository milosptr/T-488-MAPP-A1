import { borderRadius } from '@/src/constants/DesignTokens';
import { useTheme } from '@/src/hooks/useTheme';
import React from 'react';
import {
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import { Text } from '../Themed';

type TextInputProps = {
    label?: string;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
} & RNTextInputProps;

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
    ({ label, error, containerStyle, style, ...textInputProps }, ref) => {
        const theme = useTheme();

        return (
            <View style={[styles.container, containerStyle]}>
                {label && <Text style={styles.label}>{label}</Text>}
                <RNTextInput
                    ref={ref}
                    style={[
                        styles.input,
                        {
                            backgroundColor: theme.surface,
                            borderColor: error ? theme.error : theme.border,
                            color: theme.text,
                        },
                        style,
                    ]}
                    placeholderTextColor={theme.textMuted}
                    {...textInputProps}
                />
                {error && <Text style={[styles.error, { color: theme.error }]}>{error}</Text>}
            </View>
        );
    }
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: borderRadius.lg,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    error: {
        fontSize: 12,
        marginTop: 4,
    },
});
