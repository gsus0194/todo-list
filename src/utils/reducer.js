export const initialState = {
  loading: false,
  active: false,
  error: null,
  user: null,
};

const LOADING = "LOADING";
const USER_ERROR = "USER_ERROR";
const USER_SUCCESS = "USER_SUCCESS";
const SIGN_OUT = "SIGN_OUT";

const reducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return { ...state, loading: true };
    case USER_ERROR:
      return { ...initialState, error: action.payload };
    case USER_SUCCESS:
      return { ...state, loading: false, user: action.payload, active: true };
    case SIGN_OUT:
      return { ...initialState };
    default:
      return { ...state };
  }
};

export default reducer;
