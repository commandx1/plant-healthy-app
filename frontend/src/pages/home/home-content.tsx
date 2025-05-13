import Container from 'components/container';
import styles from './home.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { APP_ACTIONS, IUser, Location } from 'store';
import { Button, Card, notification, Pagination, Space, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useHttp from 'hooks/use-http';
import PlantDetailModal from './plant-detail-modal';
import LocationSidebar from './location-sidebar';
import { IPlant } from './types';
import PlantForm from './plant-form';


const initialPlant = {
    name: '',
    type: '',
    weeklyWaterNeed: '',
    expectedHumidity: 0
};

const HomeContent = () => {
    const { locations, user, searchText } = useSelector(
        (state: { locations: Location[]; user: IUser; searchText: string }) => state
    );

    const [selectedPlace, setSelectedPlace] = useState(locations[0]);
    const [selectedPlant, setSelectedPlant] = useState<null | IPlant>(null);
    const [plants, setPlants] = useState<{ list: IPlant[]; count: number }>({ list: [], count: 0 });
    const [newPlantFormVisible, setNewPlantFormVisible] = useState(false);
    const [page, setPage] = useState({ no: 1, size: 2 });
    const [isLoading, setIsLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [newPlant, setNewPlant] = useState<IPlant>(initialPlant);

    const openNewPlantForm = () => {
        setNewPlantFormVisible(true);
        if (selectedPlant) {
            setNewPlant({
                name: selectedPlant.name,
                type: selectedPlant.type,
                weeklyWaterNeed: selectedPlant.weeklyWaterNeed,
                expectedHumidity: selectedPlant.expectedHumidity
            });
        }
    };

    const { sendRequest, handleError } = useHttp();
    const dispatch = useDispatch();

    const addLoc = () =>
        dispatch({
            type: APP_ACTIONS.SET_NEW_LOCATION_MODE,
            payload: 'on'
        });

    const cancelNewPlant = () => {
        setNewPlantFormVisible(false);
        setNewPlant(initialPlant);
    };

    const refresh = () => setRefreshTrigger(p => p + 1);

    const addPlant = async () => {
        try {
            if (!+newPlant.weeklyWaterNeed) {
                throw new Error('Weekly water need should be a number');
            }

            setIsLoading(true);

            let endpoint = 'plant';

            if (selectedPlant) {
                endpoint += `/${selectedPlant._id}`;
            }

            const method = selectedPlant ? 'PATCH' : 'POST';

            (await sendRequest(
                endpoint,
                method,
                {},
                {
                    ...newPlant,
                    weeklyWaterNeed: +newPlant.weeklyWaterNeed,
                    userId: user._id,
                    locationId: selectedPlace._id
                }
            )) as { list: IPlant; count: number };

            notification.success({ message: selectedPlant ? 'Plant updated!' : 'Plant added!' });
            cancelNewPlant();
            refresh();
        } catch (error) {
            handleError(error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    const deletePlant = async () => {
        try {
            setIsLoading(true);

            await sendRequest(`plant/${selectedPlant?._id}`, 'DELETE');

            setSelectedPlant(null);
            notification.success({ message: 'Plant deleted!' });
            refresh();
        } catch (error) {
            handleError(error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const res = await sendRequest('plant', 'GET', {
                    locationId: selectedPlace._id,
                    searchText,
                    limit: page.size,
                    skip: (page.no - 1) * page.size
                });
                setPlants(res);
            } catch (error) {
                handleError(error as Error);
            } finally {
                setIsLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPlace._id, searchText, refreshTrigger, page]);

    const handlePlaceChange = (l: Location) => {
        setSelectedPlace(l);
        setSelectedPlant(null);
    };

    return (
        <Container className={styles.homeContent}>
            <LocationSidebar
                locations={locations}
                selectedPlaceId={selectedPlace._id ?? ''}
                onSelect={handlePlaceChange}
                onAdd={addLoc}
            />
            <Card className={styles.plantCard}>
                <AnimatePresence mode='wait'>
                    {newPlantFormVisible ? (
                        <motion.div
                            key='newplant'
                            initial={{ x: -200, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -200, opacity: 0 }}
                        >
                            <PlantForm
                                plant={newPlant}
                                onChange={(field, value) => setNewPlant(prev => ({ ...prev, [field]: value }))}
                                onCancel={cancelNewPlant}
                                onSubmit={addPlant}
                                loading={isLoading}
                                isEditing={!!selectedPlant}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key='plants'
                            initial={{ x: 200, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 200, opacity: 0 }}
                        >
                            <Typography role='heading'>My Plants</Typography>
                            <Space className={styles.header} align='center' direction='horizontal'>
                                <div>
                                    {isLoading ? <Spin /> : plants.count} plants for <b>{selectedPlace.name}</b>
                                </div>
                                <Space direction='horizontal'>
                                    {!!selectedPlant && (
                                        <Button color='orange' variant='filled' onClick={() => setSelectedPlant(null)}>
                                            Go Back
                                        </Button>
                                    )}
                                    <Button color='purple' variant='filled' onClick={openNewPlantForm}>
                                        {selectedPlant ? 'Edit' : 'Add'} Plant
                                    </Button>
                                    {!!selectedPlant && (
                                        <Button
                                            color='danger'
                                            variant='outlined'
                                            loading={isLoading}
                                            onClick={deletePlant}
                                        >
                                            Delete Plant
                                        </Button>
                                    )}
                                </Space>
                            </Space>

                            {selectedPlant ? (
                                <motion.div
                                    key='selected'
                                    initial={{ y: 200, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 200, opacity: 0 }}
                                >
                                    <PlantDetailModal plant={selectedPlant as IPlant} location={selectedPlace} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key='all'
                                    initial={{ y: 200, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 200, opacity: 0 }}
                                >
                                    <Space direction='horizontal' wrap style={{ textTransform: 'capitalize' }}>
                                        {plants.list.map(plant => (
                                            <Card
                                                style={{ marginTop: 8 }}
                                                key={plant._id}
                                                onClick={() => setSelectedPlant(plant)}
                                                hoverable
                                            >
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
                                            </Card>
                                        ))}
                                    </Space>
                                    <Pagination
                                        total={plants.count}
                                        current={page.no}
                                        pageSize={page.size}
                                        showSizeChanger
                                        pageSizeOptions={[2, 5, 10, 20]}
                                        onChange={(no, size) => setPage({ no, size })}
                                        style={{ marginTop: 16 }}
                                    />
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </Container>
    );
};

export default HomeContent;
