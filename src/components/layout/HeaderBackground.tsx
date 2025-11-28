import { useTheme } from '@/src/hooks/useTheme';
import { View } from 'react-native';

export const HeaderBackground = () => {
    const theme = useTheme();
    return (
        <View
            pointerEvents="none"
            style={{
                backgroundColor: theme.primary,
                flex: 1,
            }}
        />
    );
};
