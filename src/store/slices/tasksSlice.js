import { projectsAPI } from '../../services/api';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  availableUsers: [],
  usersLoading: false,
};

// Action types
const CREATE_TASK_REQUEST = 'CREATE_TASK_REQUEST';
const CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS';
const CREATE_TASK_FAILURE = 'CREATE_TASK_FAILURE';
const FETCH_AVAILABLE_USERS_REQUEST = 'FETCH_AVAILABLE_USERS_REQUEST';
const FETCH_AVAILABLE_USERS_SUCCESS = 'FETCH_AVAILABLE_USERS_SUCCESS';
const FETCH_AVAILABLE_USERS_FAILURE = 'FETCH_AVAILABLE_USERS_FAILURE';
const CLEAR_ERROR = 'CLEAR_ERROR';

// Reducer
export default function tasksReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_TASK_REQUEST:
      return { ...state, loading: true, error: null };
    case CREATE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: [...state.tasks, action.payload],
        error: null,
      };
    case CREATE_TASK_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_AVAILABLE_USERS_REQUEST:
      return { ...state, usersLoading: true };
    case FETCH_AVAILABLE_USERS_SUCCESS:
      return {
        ...state,
        usersLoading: false,
        availableUsers: action.payload,
      };
    case FETCH_AVAILABLE_USERS_FAILURE:
      return { ...state, usersLoading: false, error: action.payload };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

// Action creators
export const createTask = (projectId, taskData) => async (dispatch) => {
  dispatch({ type: CREATE_TASK_REQUEST });
  try {
    const response = await projectsAPI.createTask(projectId, taskData);
    dispatch({ type: CREATE_TASK_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to create task';
    dispatch({ type: CREATE_TASK_FAILURE, payload: errorMessage });
    throw error;
  }
};

export const fetchAvailableUsers = (userRole) => async (dispatch) => {
  dispatch({ type: FETCH_AVAILABLE_USERS_REQUEST });
  try {
    const response = await projectsAPI.getAvailableUsersForTask(userRole);
    dispatch({ type: FETCH_AVAILABLE_USERS_SUCCESS, payload: response.data });
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch users';
    dispatch({ type: FETCH_AVAILABLE_USERS_FAILURE, payload: errorMessage });
  }
};

export const clearError = () => ({ type: CLEAR_ERROR });
