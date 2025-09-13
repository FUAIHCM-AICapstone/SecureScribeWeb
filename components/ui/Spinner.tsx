import React from 'react';
import { Spinner as FluentSpinner, makeStyles } from '@fluentui/react-components';

const useStyles = makeStyles({
    spinner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

interface SpinnerProps {
    size?: 'small' | 'medium' | 'large' | 'extra-large';
    label?: string;
    appearance?: 'primary' | 'inverted';
}

const Spinner: React.FC<SpinnerProps> = ({
    size = 'medium',
    label = 'Loading...',
    appearance = 'primary',
}) => {
    const styles = useStyles();

    const getSize = () => {
        switch (size) {
            case 'small':
                return 'tiny';
            case 'large':
                return 'large';
            case 'extra-large':
                return 'huge';
            default:
                return 'medium';
        }
    };

    return (
        <div className={styles.spinner}>
            <FluentSpinner
                size={getSize()}
                label={label}
                appearance={appearance}
            />
        </div>
    );
};

export default Spinner;

