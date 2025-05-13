import { Routes, Route, Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import NavBar from './components/navbar';
import Footer from './components/footer';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useSelector } from 'react-redux';
import { IUser } from 'store';
import AnimatedRoutes from 'components/animated-routes';
import ScrollToTop from 'components/scroll-to-top';
import { usePageLoading } from 'hooks/use-page-loading';
import useAccessToken from 'hooks/use-access-token';
import './App.css';
import Loader from 'components/loader';

const LoginPage = lazy(() => import('./pages/login'));
const VerifyEmailPage = lazy(() => import('./pages/verify-email'));

export default function App() {
    const { user, isUserLoading } = useSelector(
        (state: { user: IUser; isLoading: boolean; isUserLoading: boolean }) => state
    );

    useAccessToken();
    usePageLoading();

    if (isUserLoading) {
        return <Loader />;
    }

    return (
        <Suspense>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID as string}>
                <ScrollToTop />
                {!user.access_token ? (
                    <Routes>
                        <Route path='/' element={<LoginPage />} />
                        {!user.emailVerified && <Route path='/verify-email' element={<VerifyEmailPage />} />}
                        <Route
                            path='*'
                            element={
                                <div>
                                    Page not found. Go to <Link to='/'>login page</Link>
                                </div>
                            }
                        />
                    </Routes>
                ) : (
                    <main className='appMain'>
                        <NavBar />
                        <section className='appContent'>
                            <AnimatedRoutes />
                        </section>
                        <Footer />
                    </main>
                )}
            </GoogleOAuthProvider>
        </Suspense>
    );
}
