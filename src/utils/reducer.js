export const initialState = {
  isSignup: true,
};

const SIGNUP = "SIGNUP";

const reducer = (state, action) => {
  switch (action.type) {
    case SIGNUP:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
