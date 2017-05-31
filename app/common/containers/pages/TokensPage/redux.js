import { combineReducers } from 'redux';
import { handleAction, createAction } from 'redux-actions';
import * as fromTokens from 'redux/tokens';

export const getTokens = createAction('tokensPage/GET_TOKENS');

export const fetchTokens = () => dispatch =>
  dispatch(fromTokens.fetchTokens())
  .then((action) => {
    if (action.error) throw action;
    dispatch(getTokens(action.payload.result));
    return action;
  });

const tokens = handleAction(getTokens, (state, action) => action.payload, []);

export default combineReducers({
  tokens,
});