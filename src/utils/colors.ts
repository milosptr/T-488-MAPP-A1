export function withOpacity(hexColor: string, opacity: number): string {
    if (opacity < 0 || opacity > 1) {
        throw new Error('Opacity must be between 0 and 1');
    }

    const hex = hexColor.replace('#', '');
    const fullHex =
        hex.length === 3
            ? hex
                  .split('')
                  .map(c => c + c)
                  .join('')
            : hex;

    if (!/^[0-9A-F]{6}$/i.test(fullHex)) {
        throw new Error('Invalid hex color format');
    }

    const opacityHex = Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0');

    return `#${fullHex}${opacityHex}`;
}
