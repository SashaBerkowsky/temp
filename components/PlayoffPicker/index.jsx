import { useEffect, useRef } from 'react';
import styles from './playoffPicker.module.scss';

const PlayoffPicker = ({ brackets, onChange, selectedItem, isPlayoff }) => {
    const ref = useRef(null);
    const slide = (direction) => {
        if (brackets.length !== 0) {
            const scrollOffset = ref.current.firstChild.clientWidth;
            ref.current.scrollLeft += scrollOffset * direction;
        }
    };

    useEffect(() => {
        ref.current.scrollLeft += ref.current.scrollWidth;
    }, []);

    return (
        <div className={styles.playoffPicker__container}>
            <img
                src="/images/playoff-picker-arrow.png"
                className={styles.playoffPicker__arrowL}
                onClick={(e) => slide(-1)}
            />
            <ul className={styles.playoffPicker__picker} ref={ref}>
                {brackets.map((stage, idx) => (
                    <li
                        className={
                            idx === selectedItem
                                ? styles.playoffPicker__itemS
                                : styles.playoffPicker__item
                        }
                        onClick={(e) => onChange(idx)}
                        key={idx}
                    >
                        {isPlayoff ? stage : 'Fecha ' + stage}
                    </li>
                ))}
            </ul>
            <img
                src="/images/playoff-picker-arrow.png"
                onClick={(e) => slide(1)}
            />
        </div>
    );
};

export default PlayoffPicker;
