import { useTheme } from '@/src/hooks/useTheme';
import { View } from 'react-native';

export const HeaderBackground = () => {
    const theme = useTheme();
    return (
        <View
            style={{
                backgroundColor: theme.headerBackground,
                flex: 1,
            }}
        />
    );
};
