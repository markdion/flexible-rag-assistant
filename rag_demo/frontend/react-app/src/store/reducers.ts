import { combineReducers } from 'redux';
import { SET_API_KEY, SET_RESOURCE_LINKS, AppActions } from './actions';

interface AppState {
  apiKey: string;
  resourceLinks: string[];
}

const initialState: AppState = {
  apiKey: '',
  resourceLinks: [],
};

const apiKeyReducer = (state = initialState.apiKey, action: AppActions): string => {
  switch (action.type) {
    case SET_API_KEY:
      return action.payload;
    default:
      return state;
  }
};

const resourceLinksReducer = (state = initialState.resourceLinks, action: AppActions): string[] => {
  switch (action.type) {
    case SET_RESOURCE_LINKS:
      return action.payload;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  apiKey: apiKeyReducer,
  resourceLinks: resourceLinksReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;