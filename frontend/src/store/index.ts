import { createStore } from 'redux';

export interface IUser {
    _id: string;
    access_token: string;
    createdAt: string;
    email: string;
    full_name: string;
    emailVerified?: boolean;
}

export interface Location {
    name: string;
    latitude: string;
    longitude: string;
    _id?: string;
}

interface AppState {
    user: IUser;
    locations: Location[];
    sessionError: string;
    isLoading: boolean;
    searchText: string;
    newLocationMode: 'on' | 'off';
    isUserLoading: boolean;
}

const initialState: AppState = {
    isLoading: false,
    sessionError: '',
    searchText: '',
    newLocationMode: 'off',
    locations: [],
    isUserLoading: true,
    user: {
        _id: '',
        access_token: '',
        createdAt: '',
        email: '',
        full_name: ''
    }
};

export const APP_ACTIONS = {
    UPDATE_USER: 'UPDATE_USER',
    CLEAR_USER: 'CLEAR_USER',
    SET_LOADING: 'SET_LOADING',
    SESSION_ERROR: 'SESSION_ERROR',
    ADD_LOCATION: 'ADD_LOCATION',
    SET_LOCATIONS: 'SET_LOCATIONS',
    SET_USER_LOADING: 'SET_USER_LOADING',
    SET_SEARCH_TEXT: 'SET_SEARCH_TEXT',
    SET_NEW_LOCATION_MODE: 'SET_NEW_LOCATION_MODE'
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rootReducer = (state = initialState, action: { type: string; payload: any }) => {
    switch (action.type) {
        case APP_ACTIONS.UPDATE_USER:
            return { ...state, user: action.payload as IUser };
        case APP_ACTIONS.CLEAR_USER:
            return { ...state, user: initialState.user };
        case APP_ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload as boolean };
        case APP_ACTIONS.SET_USER_LOADING:
            return { ...state, isUserLoading: action.payload as boolean };
        case APP_ACTIONS.SESSION_ERROR:
            return { ...state, sessionError: action.payload as string };
        case APP_ACTIONS.SET_SEARCH_TEXT:
            return { ...state, searchText: action.payload as string };
        case APP_ACTIONS.SET_LOCATIONS:
            return { ...state, locations: action.payload as Location[] };
        case APP_ACTIONS.ADD_LOCATION:
            return { ...state, locations: [...state.locations, action.payload as Location] };
        case APP_ACTIONS.SET_NEW_LOCATION_MODE:
            return { ...state, newLocationMode: action.payload as 'off' | 'on' };
        default:
            return state;
    }
};

const store = createStore(rootReducer);

export default store;
