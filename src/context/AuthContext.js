import { createContext, useEffect, useReducer } from "react";
import { BASE_URL } from "../utils/config";

const inital_state = {
  user: null,
  initializing: true,
  loading: false,
  error: null,
};

export const AuthContext = createContext(inital_state);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_SUCCESS":
      return {
        user: action.payload,
        initializing: false,
        loading: false,
        error: null,
      };
    case "INITIALIZE_FAILURE":
      return {
        user: null,
        initializing: false,
        loading: false,
        error: null,
      };
    case "LOGIN_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        initializing: false,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        initializing: false,
        loading: false,
        error: action.payload,
      };
    case "REGISTER_SUCCESS":
      return {
        user: null,
        initializing: false,
        loading: false,
        error: null,
      };
    case "LOGOUT":
      return {
        user: null,
        initializing: false,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, inital_state);

  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          dispatch({ type: "INITIALIZE_FAILURE" });
          return;
        }

        const result = await res.json();
        dispatch({ type: "INITIALIZE_SUCCESS", payload: result.data });
      } catch {
        dispatch({ type: "INITIALIZE_FAILURE" });
      }
    };

    bootstrapSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        initializing: state.initializing,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
