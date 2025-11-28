import { useTheme } from '@/src/hooks/useTheme';
import {
    BottomSheetModalProps,
    BottomSheetModal as RNBottomSheetModal,
} from '@gorhom/bottom-sheet';
import { Backdrop } from './Backdrop';

type Props = {
    children: React.ReactNode;
    ref: React.RefObject<RNBottomSheetModal | null>;
} & Omit<BottomSheetModalProps, 'handleIndicatorStyle'>;

export type BottomSheetModal = RNBottomSheetModal;

// eslint-disable-next-line no-redeclare
export const BottomSheetModal = ({ children, ref, backgroundStyle, ...props }: Props) => {
    const theme = useTheme();

    const _backgroundStyle = [
        backgroundStyle,
        {
            backgroundColor: theme.surface,
        },
    ];

    const handleIndicatorStyle = {
        backgroundColor: theme.outline,
    };

    return (
        <RNBottomSheetModal
            ref={ref}
            backdropComponent={Backdrop}
            enableDynamicSizing
            enablePanDownToClose
            backgroundStyle={_backgroundStyle}
            handleIndicatorStyle={handleIndicatorStyle}
            {...props}
        >
            {children}
        </RNBottomSheetModal>
    );
};
