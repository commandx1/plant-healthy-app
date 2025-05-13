import styles from './login.module.scss';
import { FormEvent, useState } from 'react';
import Button from 'antd/lib/Button';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { APP_ACTIONS } from 'store';
import { useNavigate } from 'react-router-dom';
import useHttp from 'hooks/use-http';
import notification from 'antd/lib/notification';
import Card from 'antd/lib/Card';
import Input from 'antd/lib/Input';
import zxcvbn from 'zxcvbn';
import { BiEnvelope } from 'react-icons/bi';
import { BsPerson } from 'react-icons/bs';
import { FaArrowRight } from 'react-icons/fa';
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';
import Container from 'components/container';
import PasswordStrengthMeter from 'components/password-meter';

interface IInputs {
    full_name: string;
    email: string;
    password?: string;
}

interface IGoogleUser {
    name: string;
    email: string;
    jti: string;
}

const initialInputs: IInputs = {
    full_name: '',
    email: '',
    password: ''
};

const Login = () => {
    const [inputs, setInputs] = useState<IInputs>(initialInputs);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLogingIn, setIsLogingIn] = useState(false);

    const dispatch = useDispatch();
    const { sendRequest, handleError } = useHttp();

    const navigate = useNavigate();

    const togglePassword = () => setShowPassword(p => !p);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputs(p => ({ ...p, [name]: value }));
    };

    const { score: passwordScore } = zxcvbn(inputs.password as string);

    const validateInputs = (decodedGoogleUser: IGoogleUser | undefined) => {
        if (isRegisterMode) {
            if (!inputs.email) {
                throw new Error('Please enter email');
            }
            if (!inputs.password) {
                throw new Error('Please enter password');
            }
            if (isRegisterMode && passwordScore < 2 && !decodedGoogleUser?.jti) {
                throw new Error('Password is too weak.');
            }
        }
    };

    const handleSubmit = async (e: FormEvent | undefined, decodedGoogleUser: IGoogleUser | undefined) => {
        e?.preventDefault();

        try {
            setIsLogingIn(true);
            validateInputs(decodedGoogleUser);
            const url = isRegisterMode ? 'auth/register' : 'auth/login';

            const body: IGoogleUser | IInputs = decodedGoogleUser
                ? {
                      full_name: decodedGoogleUser.name,
                      email: decodedGoogleUser.email,
                      jti: decodedGoogleUser.jti
                  }
                : inputs;

            const data = await sendRequest(url, 'POST', {}, body, null);

            dispatch({ type: APP_ACTIONS.UPDATE_USER, payload: data });

            localStorage.setItem('user_info', JSON.stringify(data));
            if (!isRegisterMode) {
                navigate('/');
            } else {
                if (data?.message) {
                    notification.success({ message: data.message });
                }
                setIsRegisterMode(false);
            }
        } catch (error) {
            handleError(error as Error);
        } finally {
            setIsLogingIn(false);
        }
    };

    return (
        <Container className={[styles.loginPage, isRegisterMode && styles.registerMode].filter(Boolean).join(' ')}>
            <Card className={styles.card}>
                <div className={styles.left}>
                    <img src='/login-bg.webp' alt='loginbg' />
                    <h3>Welcome to Plant App</h3>
                    <p>
                        We automatically analyze your plants' water and humidity needs using location-based weather
                        data. Healthy leaves are just a click away.
                    </p>
                </div>
                <div className={styles.right}>
                    <div>
                        {isRegisterMode ? <h3>Sign Up</h3> : <h3>Sign In</h3>}
                        {isRegisterMode ? <p>Create your account</p> : <p>Please login to your account</p>}
                        <form onSubmit={e => handleSubmit(e, undefined)}>
                            {isRegisterMode && (
                                <div className={styles.formItem}>
                                    <label>Full Name</label>
                                    <Input
                                        name='full_name'
                                        value={inputs.full_name}
                                        onChange={handleInputChange}
                                        placeholder='Enter your name'
                                        prefix={<BsPerson />}
                                    />
                                </div>
                            )}
                            <div className={styles.formItem}>
                                <label>Email</label>
                                <Input
                                    name='email'
                                    value={inputs.email}
                                    onChange={handleInputChange}
                                    placeholder='Enter your email'
                                    prefix={<BiEnvelope />}
                                />
                            </div>
                            <div className={styles.formItem}>
                                <label>Password</label>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    value={inputs.password}
                                    onChange={handleInputChange}
                                    placeholder='Enter your password'
                                    prefix={
                                        showPassword ? (
                                            <RxEyeOpen onClick={togglePassword} />
                                        ) : (
                                            <RxEyeClosed onClick={togglePassword} />
                                        )
                                    }
                                />
                                {isRegisterMode && !!inputs.password?.length && (
                                    <PasswordStrengthMeter score={passwordScore} />
                                )}
                            </div>

                            <Button
                                loading={isLogingIn}
                                htmlType='submit'
                                color='cyan'
                                style={{ width: '100%' }}
                                type='primary'
                            >
                                {isRegisterMode ? 'Sign Up' : 'Sign In'} <FaArrowRight />
                            </Button>
                            {!isRegisterMode && (
                                <>
                                    <div className={styles.continue}>Or continue with</div>
                                    <GoogleLogin
                                        shape='square'
                                        text={isRegisterMode ? 'signup_with' : 'signin_with'}
                                        onSuccess={credentialResponse => {
                                            const decoded: IGoogleUser = jwtDecode(
                                                credentialResponse.credential as string
                                            );
                                            decoded.jti = credentialResponse.credential as string;
                                            handleSubmit(undefined, decoded);
                                        }}
                                    />
                                </>
                            )}
                        </form>
                        <div onClick={() => setIsRegisterMode(p => !p)} className={styles.changeMode}>
                            {isRegisterMode ? (
                                <>
                                    <p>Have an account?</p>
                                    <p>Log In</p>
                                </>
                            ) : (
                                <>
                                    <p>Don't have an account?</p>
                                    <p>Sign Up</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </Container>
    );
};

export default Login;
