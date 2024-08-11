import { Action } from "redux";

export const SET_API_KEY = 'SET_API_KEY';
export const SET_RESOURCE_LINKS = 'SET_RESOURCE_LINKS';

interface SetApiKeyAction extends Action {
  type: typeof SET_API_KEY;
  payload: string;
}

interface SetResourceLinksAction extends Action {
  type: typeof SET_RESOURCE_LINKS;
  payload: string[];
}

export type AppActions = SetApiKeyAction | SetResourceLinksAction;

export const setApiKey = (apiKey: string): SetApiKeyAction => ({
  type: SET_API_KEY,
  payload: apiKey,
});

export const setResourceLinks = (resourceLinks: string[]): SetResourceLinksAction => ({
  type: SET_RESOURCE_LINKS,
  payload: resourceLinks,
});