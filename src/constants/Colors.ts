const primaryColors = {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6ff',
    300: '#c4b4ff',
    400: '#a684ff',
    500: '#8e51ff',
    600: '#7f22fe',
    700: '#7008e7',
    800: '#5d0ec0',
    900: '#4d179a',
    950: '#2f0d68',
};

const grayColors = {
    50: '#D0D0D0',
    100: '#C5C5C5',
    200: '#B1B1B1',
    300: '#9D9D9D',
    400: '#888888',
    500: '#747474',
    600: '#5F5F5F',
    700: '#4B4B4B',
    800: '#373737',
    900: '#222222',
    950: '#181818',
};

export default {
    light: {
        text: '#000',
        background: '#fafafa',
        tint: primaryColors['500'],
        tabIconDefault: '#ccc',
        tabIconSelected: primaryColors['500'],
        border: grayColors['50'],
        surface: '#fff',
    },
    dark: {
        text: '#fff',
        background: grayColors['950'],
        tint: primaryColors['500'],
        tabIconDefault: '#ccc',
        tabIconSelected: primaryColors['500'],
        border: grayColors['700'],
        surface: '#111',
    },
};
