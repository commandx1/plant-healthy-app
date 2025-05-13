import { useEffect, useState } from 'react';
import { CiCircleAlert } from 'react-icons/ci';
import { TbCircleCheckFilled } from 'react-icons/tb';
import { useNavigate, useSearchParams } from 'react-router-dom';

import useHttp from 'hooks/use-http';

import { Card, notification, Spin } from 'antd';

import Container from 'components/container';

import styles from './verify-email.module.scss';

const VerifyEmail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { sendRequest, handleError } = useHttp();

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const token = searchParams.get('token');
                const email = searchParams.get('email');

                if (token) {
                    const res = await sendRequest('user/verify-email', 'GET', { token, email });

                    if (res?.user?.emailVerified) {
                        setIsVerified(res.user.emailVerified);

                        if (res?.message) {
                            notification.success({ message: res.message });
                        }

                        setTimeout(() => {
                            navigate('/');
                        }, 3000);
                    }
                }
            } catch (error) {
                handleError(error as Error);
            } finally {
                setIsLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className={styles.main}>
            <Container>
                {isLoading ? (
                    <Card>
                        <Spin />
                        <h1>Email Verificating</h1>
                        <p>Your verification is in progress. Please wait.</p>
                    </Card>
                ) : isVerified ? (
                    <Card>
                        <TbCircleCheckFilled color='#1c6257' size='4em' />
                        <h1>Email Verification</h1>
                        <p>Your email was verified. You are directed to the login page.</p>
                    </Card>
                ) : (
                    <Card>
                        <CiCircleAlert color='var(--black)' size='4em' />
                        <h1>Email Verification</h1>
                        <p>Your email could not be verified.</p>
                    </Card>
                )}
            </Container>
        </main>
    );
};

export default VerifyEmail;
