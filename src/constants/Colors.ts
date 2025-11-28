export const PRESET_COLORS = [
    '#E53935',
    '#FB8C00',
    '#FDD835',
    '#7CB342',
    '#43A047',
    '#00897B',
    '#00ACC1',
    '#29B6F6',
    '#3949AB',
    '#8E24AA',
    '#D81B60',
    '#F06292',
];

const palette = {
    primary: '#2D2F4C',
    primaryLight: '#464A6E',
    primaryDark: '#1E1F33',

    secondary: '#3D6B7D',
    secondaryLight: '#5A8A9C',
    secondaryDark: '#2A4D5A',

    white: '#F2F6F1',
    gray: '#8C8C8C',
    black: '#272825',

    neutral100: '#E8ECE7',
    neutral200: '#D4D8D3',
    neutral300: '#B0B4AF',

    error: '#B44146',
    errorLight: '#D4666A',
    errorContainer: '#F8E8E9',

    success: '#4A8B5C',
    successLight: '#6AAE7A',
    successContainer: '#E8F4EB',
};

export default {
    light: {
        primary: palette.primary,
        onPrimary: palette.white,
        primaryContainer: '#E8EAF0',
        onPrimaryContainer: palette.primaryDark,

        secondary: palette.secondary,
        onSecondary: palette.white,
        secondaryContainer: '#E0EFF3',
        onSecondaryContainer: palette.secondaryDark,

        background: palette.white,
        onBackground: palette.black,
        surface: '#FFFFFF',
        onSurface: palette.black,
        surfaceVariant: palette.neutral100,
        onSurfaceVariant: palette.gray,

        outline: palette.neutral200,
        outlineVariant: palette.neutral300,

        error: palette.error,
        onError: palette.white,
        errorContainer: palette.errorContainer,
        onErrorContainer: palette.error,
        success: palette.success,
        onSuccess: palette.white,
        successContainer: palette.successContainer,
        onSuccessContainer: palette.success,

        scrim: 'rgba(39, 40, 37, 0.5)',
        inverseSurface: palette.black,
        inverseOnSurface: palette.white,
        inversePrimary: palette.primaryLight,
    },
    dark: {
        primary: palette.primaryLight,
        onPrimary: palette.white,
        primaryContainer: palette.primaryDark,
        onPrimaryContainer: palette.primaryLight,

        secondary: palette.secondaryLight,
        onSecondary: palette.white,
        secondaryContainer: palette.secondaryDark,
        onSecondaryContainer: palette.secondaryLight,

        background: palette.black,
        onBackground: palette.white,
        surface: '#1F1F1D',
        onSurface: palette.white,
        surfaceVariant: '#2A2A28',
        onSurfaceVariant: palette.neutral300,

        outline: '#3A3A38',
        outlineVariant: '#4A4A48',

        error: palette.errorLight,
        onError: palette.white,
        errorContainer: '#4A1F22',
        onErrorContainer: palette.errorLight,
        success: palette.successLight,
        onSuccess: palette.white,
        successContainer: '#1E3A26',
        onSuccessContainer: palette.successLight,

        scrim: 'rgba(0, 0, 0, 0.7)',
        inverseSurface: palette.white,
        inverseOnSurface: palette.black,
        inversePrimary: palette.primary,
    },
};
