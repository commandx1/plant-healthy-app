/* eslint-disable @typescript-eslint/no-explicit-any */
import { notification } from 'antd/lib';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { APP_ACTIONS, IUser } from 'store';

const useHttp = () => {
    const { user, sessionError } = useSelector((state: { user: IUser; sessionError: string }) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const sendRequest = async (
        url: string = '',
        method: string = 'GET',
        query: any = {},
        payload: any = {},
        signal: any = null
    ) => {
        let data = null;
        let queryString = '';

        const token = query.access_token ?? user.access_token;
        delete query.access_token;

        const isFormData = payload instanceof FormData;

        if (method !== 'GET' && !isFormData) {
            data = JSON.stringify(payload);
        }

        if (query && Object.keys(query).length > 0) {
            queryString = `?${new URLSearchParams(query).toString()}`;
        }

        const URL = `${import.meta.env.VITE_BACKEND_URL}/api/${url}${queryString}`;

        const response = await fetch(URL, {
            method,
            signal,
            body: isFormData ? payload : data,
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(!isFormData && { 'Content-Type': 'application/json' })
            }
        });

        const body = await response.json();

        if (!response.ok) {
            throw new Error(body.message?.join?.(',')?.replaceAll?.(',', '****') ?? body.message);
        }

        return body;
    };

    const handleError = (error: any) => {
        if (error.message.includes('Your session has expired')) {
            dispatch({ type: APP_ACTIONS.CLEAR_USER });
            localStorage.removeItem('user_info');
            navigate('/');

            if (!sessionError) {
                dispatch({ type: APP_ACTIONS.SESSION_ERROR, payload: error.message });
            }
        } else {
            notification.error({
                message: (
                    <div>
                        {error.message.split('****')?.map?.((m: string, i: number) => <div key={i}>{m}</div>) ??
                            error.message}
                    </div>
                )
            });
        }
    };

    return { sendRequest, handleError };
};

export default useHttp;
