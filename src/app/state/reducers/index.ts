import { ActionReducerMap } from '@ngrx/store';
import { appReducer } from './app.reducer';
import { metaReducers } from './local-storage-meta.reducer';

export const reducers: ActionReducerMap<any> = {
  appState: appReducer,
};

export { metaReducers };
