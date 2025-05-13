import React, { useState, useRef, useEffect, ReactNode } from 'react';
import styles from './selectbox.module.scss';
import { BiChevronDown } from 'react-icons/bi';

type Option = {
    label: string | ReactNode;
    value: string | number;
};

type Props = {
    options: Option[];
    value: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    className?: string;
};

const SelectBox: React.FC<Props> = ({ options, value, onChange, placeholder = 'Seçiniz...', className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selectedLabel = options.find(opt => opt.value === value)?.label;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`${styles.select} ${className}`} ref={ref}>
            <div
                className={[styles.trigger, isOpen && styles.open].filter(Boolean).join(' ')}
                onClick={() => setIsOpen(prev => !prev)}>
                {selectedLabel || placeholder}
                <BiChevronDown color='var(--placeholderGray)' size={16} className={`${styles.arrow} ${isOpen ? styles.up : styles.down}`} />
            </div>
            <div className={[styles.options, isOpen && styles.open].filter(Boolean).join(' ')}>
                {options.map(opt => (
                    <div
                        key={opt.value}
                        className={`${styles.option} ${opt.value === value ? styles.selected : ''}`}
                        onClick={() => {
                            onChange(opt.value);
                            setIsOpen(false);
                        }}>
                        {opt.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SelectBox;
