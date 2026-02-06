import { usersAPI } from '../../services/api';

const initialState = {
  users: [],
  loading: false,
  error: null,
  creatingUser: false,
};

// Action types
const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
const CREATE_USER_REQUEST = 'CREATE_USER_REQUEST';
const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';
const CLEAR_ERROR = 'CLEAR_ERROR';

// Reducer
export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_USERS_SUCCESS:
      return { ...state, loading: false, users: action.payload, error: null };
    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case CREATE_USER_REQUEST:
      return { ...state, creatingUser: true, error: null };
    case CREATE_USER_SUCCESS:
      return {
        ...state,
        creatingUser: false,
        users: [...state.users, action.payload],
        error: null,
      };
    case CREATE_USER_FAILURE:
      return { ...state, creatingUser: false, error: action.payload };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

// Action creators
export const fetchAllUsers = () => async (dispatch) => {
  dispatch({ type: FETCH_USERS_REQUEST });
  try {
    const response = await usersAPI.getAllUsers();
    dispatch({ type: FETCH_USERS_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch users';
    dispatch({ type: FETCH_USERS_FAILURE, payload: errorMessage });
  }
};

export const createUser = (userData) => async (dispatch) => {
  dispatch({ type: CREATE_USER_REQUEST });
  try {
    const response = await usersAPI.createUser(userData);
    dispatch({ type: CREATE_USER_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create user';
    dispatch({ type: CREATE_USER_FAILURE, payload: errorMessage });
    throw error;
  }
};

export const clearError = () => ({ type: CLEAR_ERROR });
