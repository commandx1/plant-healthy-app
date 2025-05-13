import React from 'react';

import styles from './container.module.scss';

const Container = ({
    children,
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    className?: string;
}) => (
    <div {...props} className={[styles.container, className].filter(Boolean).join(' ')}>
        {children}
    </div>
);

export default Container;
