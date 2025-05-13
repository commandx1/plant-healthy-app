import styles from './password-meter.module.scss';

const strengthLabels = ['Çok zayıf', 'Zayıf', 'Orta', 'İyi', 'Harika!'];

export default function PasswordStrengthMeter({ score }: { score: number }) {
    return (
        <div className={styles.container}>
            <div className={styles.bar}>
                {Array(5)
                    .fill(0)
                    .map((_, i) => (
                        <div
                            key={i}
                            className={`${styles.strengthSegment} ${
                                i <= score ? styles[`strength${score}`] : styles.strengthEmpty
                            }`}
                        ></div>
                    ))}
            </div>

            <p className={styles.label}>
                Güç: <strong>{strengthLabels[score]}</strong>
            </p>
        </div>
    );
}
