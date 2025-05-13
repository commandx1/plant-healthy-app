import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { APP_ACTIONS } from 'store';
import useHttp from './use-http';
import notification from 'antd/lib/notification';

const useAccessToken = () => {
    const sessionError = useSelector((state: { sessionError: string }) => state.sessionError);

    const dispatch = useDispatch();

    const { sendRequest, handleError } = useHttp();

    useEffect(() => {
        const jsonData = localStorage.getItem('user_info');
        const data = JSON.parse(jsonData as string);
        if (data?.access_token) {
            (async () => {
                try {
                    const res = await sendRequest(`user/${data._id}`, 'GET', { access_token: data.access_token });
                    dispatch({
                        type: APP_ACTIONS.UPDATE_USER,
                        payload: { ...res.user, access_token: data.access_token }
                    });
                } catch (error) {
                    handleError(error as Error);
                } finally {
                    dispatch({
                        type: APP_ACTIONS.SET_USER_LOADING,
                        payload: false
                    });
                }
            })();
        } else {
            dispatch({
                type: APP_ACTIONS.SET_USER_LOADING,
                payload: false
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (sessionError) {
            notification.error({ message: sessionError });
        }
    }, [sessionError]);
};

export default useAccessToken;
