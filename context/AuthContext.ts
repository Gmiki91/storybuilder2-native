import { createContext, useContext } from 'react';
type AuthProps ={
  authToken:string|undefined;
  setToken:React.Dispatch<string|undefined>
}
const DEFAULT_VALUE:AuthProps = {
  authToken: undefined,
  setToken: () => {}
};
export const AuthContext = createContext(DEFAULT_VALUE);

export const useAuth=()=> {
  return useContext(AuthContext);
}