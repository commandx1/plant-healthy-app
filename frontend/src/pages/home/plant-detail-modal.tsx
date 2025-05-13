/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography, Spin, DatePicker } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import useHttp from 'hooks/use-http';
import { Location } from 'store';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface IPlant {
    _id?: string;
    name: string;
    type: string;
    weeklyWaterNeed: string;
    expectedHumidity: number;
}

interface Props {
    plant: IPlant;
    location: Location;
}

const { RangePicker } = DatePicker;

const PlantDetailModal = ({ plant, location }: Props) => {
    const { handleError } = useHttp();
    const [dateRange, setDateRange] = useState<any>([]);
    const [humidityHistory, setHumidityHistory] = useState<number[]>([]);
    const [precipitation, setPrecipitation] = useState<number[]>([]);
    const [dateLabels, setDateLabels] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!plant || !location) return;

        const fetchWeather = async () => {
            try {
                if (!dateRange?.length) {
                    return;
                }

                setLoading(true);

                const lat = location.latitude;
                const lon = location.longitude;
                const startDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
                const endDate = dayjs(dateRange[1]).format('YYYY-MM-DD');

                const res = await fetch(
                    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=relative_humidity_2m_max,precipitation_sum&timezone=auto`
                );
                const data = await res.json();
                setHumidityHistory(data.daily.relative_humidity_2m_max);
                setPrecipitation(data.daily.precipitation_sum);
                setDateLabels(data.daily.time);
            } catch (err) {
                handleError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plant, location, dateRange]);

    const chartData = {
        labels: dateLabels,
        datasets: [
            {
                label: 'Actual Humidity',
                data: humidityHistory,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)'
            },
            {
                label: 'Expected Humidity',
                data: dateLabels.map(() => plant.expectedHumidity),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderDash: [5, 5],
                fill: false
            },
            {
                label: 'Rainfall (ml)',
                data: precipitation,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)'
            },
            {
                label: 'Weekly Water Need (ml)',
                data: dateLabels.map(() => +plant.weeklyWaterNeed),
                borderColor: 'rgba(255, 206, 86, 1)',
                borderDash: [3, 3],
                fill: false
            }
        ]
    };

    return (
        <>
            <>
                {loading && <Spin />}
                <Typography.Paragraph>
                    <strong>Name:</strong> {plant.name}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Type:</strong> {plant.type}
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Weekly Water Need:</strong> {plant.weeklyWaterNeed}ml
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <strong>Expected Humidity:</strong> {plant.expectedHumidity}%
                </Typography.Paragraph>
                <motion.div
                    animate={
                        !dateRange?.length
                            ? {
                                  x: [5, -5],
                                  transition: {
                                      duration: 0.6,
                                      repeat: Infinity,
                                      repeatType: 'reverse',
                                      ease: 'linear'
                                  }
                              }
                            : {}
                    }
                >
                    <RangePicker style={{ marginBottom: '1rem' }} value={dateRange} onChange={setDateRange} />
                </motion.div>
                <Line data={chartData} />
            </>
        </>
    );
};

export default PlantDetailModal;
