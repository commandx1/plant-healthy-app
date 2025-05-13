import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { BiSearch } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { APP_ACTIONS, IUser } from 'store';

import Container from 'components/container';
import Spacer from 'components/spacer';

import styles from './navbar.module.scss';
import { Avatar, Input, Popover } from 'antd';

const NavBar = () => {
    const [open, setOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [search, setSearch] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: { user: IUser }) => state.user);

    const toggleAvatar = () => {
        setOpen(p => !p);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(p => !p);
    };

    const handleLogout = () => {
        localStorage.removeItem('user_info');
        dispatch({ type: APP_ACTIONS.CLEAR_USER });
        navigate('/login');
        setOpen(false);
    };

    const updateReduxSearch = (text: string) => {
        dispatch({ type: APP_ACTIONS.SET_SEARCH_TEXT, payload: text });
        if (text) {
            navigate('/');
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(debounce(updateReduxSearch, 1000), []);

    useEffect(() => {
        debouncedSearch(search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <nav className={styles.navbar}>
            <Container>
                <NavLink style={{ color: 'var(--mainColor)', fontWeight: 700 }} to='/'>
                    PLANTAPP
                </NavLink>
                <ul className={styles.navList}>
                    <li className={styles.navListItem}>
                        <NavLink to='/' className={({ isActive }) => (isActive ? styles.isActive : '')}>
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/about' className={({ isActive }) => (isActive ? styles.isActive : '')}>
                            About
                        </NavLink>
                    </li>
                </ul>
                <Spacer />
                <Input
                    className={styles.searchbox}
                    prefix={<BiSearch />}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder='name, type, 60, 1.5 ...'
                />
                <div>
                    <Popover
                        content={!!user.access_token && <div onClick={handleLogout}>Logout</div>}
                        trigger='click'
                        open={open}
                        onOpenChange={toggleAvatar}
                    >
                        <Avatar src='/default-user.jpg' />
                    </Popover>
                </div>
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ y: -30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -30, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={styles.menu}
                        >
                            <ul className={styles.menuInner}>
                                <li className={styles.menuItem}>
                                    <NavLink to='/' className={({ isActive }) => (isActive ? styles.isActive : '')}>
                                        Home
                                    </NavLink>
                                </li>
                                <li className={styles.menuItem}>
                                    <NavLink
                                        to='/about'
                                        className={({ isActive }) => (isActive ? styles.isActive : '')}
                                    >
                                        About
                                    </NavLink>
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div
                    className={[styles.burger, isMobileMenuOpen && styles.isActive].filter(Boolean).join(' ')}
                    onClick={toggleMobileMenu}
                    id='burger'
                >
                    <span className={styles.burgerLine} />
                    <span className={styles.burgerLine} />
                    <span className={styles.burgerLine} />
                </div>
            </Container>
        </nav>
    );
};

export default NavBar;
