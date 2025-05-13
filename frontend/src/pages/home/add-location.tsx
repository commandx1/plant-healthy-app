import { FC, ReactNode, useState } from 'react';
import styles from './home.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, Input, Space } from 'antd';
import { APP_ACTIONS, IUser, Location } from 'store';
import LocationPicker from './location-picker';
import Container from 'components/container';
import useHttp from 'hooks/use-http';
import { useDispatch, useSelector } from 'react-redux';

const AnimatedDiv: FC<{ children: ReactNode; motionKey: string }> = ({ children, motionKey }) => (
    <motion.div key={motionKey} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
        {children}
    </motion.div>
);

const AddLocation = () => {
    const { user, locations } = useSelector((state: { user: IUser; locations: Location[] }) => state);
    const dispatch = useDispatch();

    const [newLocation, setNewLocation] = useState<Location>({ name: '', latitude: '', longitude: '' });
    const [mode, setMode] = useState<'name' | 'map' | null>(null);

    const { sendRequest, handleError } = useHttp();

    const addLocation = async () => {
        try {
            const res = await sendRequest('location', 'POST', {}, { ...newLocation, userId: user._id });
            dispatch({
                type: APP_ACTIONS.SET_NEW_LOCATION_MODE,
                payload: 'off'
            });
            dispatch({
                type: APP_ACTIONS.ADD_LOCATION,
                payload: res
            });
            setNewLocation({ name: '', latitude: '', longitude: '' });
        } catch (error) {
            handleError(error as Error);
        }
    };

    const goBack = () => {
        dispatch({ type: APP_ACTIONS.SET_NEW_LOCATION_MODE, payload: 'off' });
    };

    return (
        <div className={styles.addLocation}>
            <AnimatePresence mode='wait'>
                {!mode ? (
                    <AnimatedDiv motionKey='add'>
                        <Space direction='vertical'>
                            <div onClick={() => setMode('name')}>Add location</div>
                            {locations.length > 0 && (
                                <div onClick={goBack} style={{ color: '#1c1c1e' }}>
                                    Go Back to Home
                                </div>
                            )}
                        </Space>
                    </AnimatedDiv>
                ) : (
                    <AnimatedDiv motionKey='new'>
                        <Container>
                            <Card>
                                {mode === 'name' ? (
                                    <AnimatedDiv motionKey='name'>
                                        <Space direction='vertical'>
                                            <label htmlFor='name'>Name</label>
                                            <Input
                                                id='name'
                                                value={newLocation.name}
                                                onChange={e =>
                                                    setNewLocation(prev => ({ ...prev, name: e.target.value }))
                                                }
                                            />
                                            <div onClick={() => setMode('map')}>Continue to Map</div>
                                        </Space>
                                    </AnimatedDiv>
                                ) : (
                                    <AnimatedDiv motionKey='map'>
                                        <Space direction='vertical' style={{ width: '100%' }}>
                                            <LocationPicker
                                                onSelect={coords =>
                                                    setNewLocation(prev => ({
                                                        ...prev,
                                                        latitude: coords.lat.toString(),
                                                        longitude: coords.lon.toString()
                                                    }))
                                                }
                                            />
                                            {newLocation.latitude && (
                                                <AnimatedDiv motionKey='props'>
                                                    <Space direction='horizontal' style={{ marginTop: '1rem' }}>
                                                        <span>Lat:</span> <span>{newLocation.latitude}</span>
                                                    </Space>
                                                    <br />
                                                    <Space direction='horizontal'>
                                                        <span>Lon:</span> <span>{newLocation.longitude}</span>
                                                    </Space>
                                                </AnimatedDiv>
                                            )}
                                            <Space direction='horizontal' style={{ marginTop: '1rem' }}>
                                                <div onClick={() => setMode('name')}>Back to Name</div>
                                                <div onClick={addLocation}>Add Location</div>
                                            </Space>
                                        </Space>
                                    </AnimatedDiv>
                                )}
                            </Card>
                        </Container>
                    </AnimatedDiv>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AddLocation;
