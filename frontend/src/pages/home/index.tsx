import { useDispatch, useSelector } from 'react-redux';
import styles from './home.module.scss';
import { APP_ACTIONS, IUser, Location } from 'store';
import { AnimatePresence, motion } from 'framer-motion';
import AddLocation from './add-location';
import HomeContent from './home-content';
import { useEffect } from 'react';
import useHttp from 'hooks/use-http';

const Home = () => {
    const { locations, newLocationMode, user } = useSelector(
        (state: { locations: Location[]; newLocationMode: 'off' | 'on'; user: IUser }) => state
    );
    const dispatch = useDispatch();
    const { sendRequest, handleError } = useHttp();

    useEffect(() => {
        (async () => {
            try {
                const res = await sendRequest('location', 'GET', { userId: user._id });
                dispatch({ type: APP_ACTIONS.SET_LOCATIONS, payload: res });
            } catch (error) {
                handleError(error as Error);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user._id]);

    return (
        <AnimatePresence mode='wait'>
            {!locations.length || newLocationMode === 'on' ? (
                <AddLocation />
            ) : (
                <motion.main
                    key='content'
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className={styles.home}
                >
                    <HomeContent />
                </motion.main>
            )}
        </AnimatePresence>
    );
};

export default Home;
