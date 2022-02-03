import { createContext, useContext } from 'react';
type AuthProps ={
  token:string|undefined;
  setToken:React.Dispatch<string|undefined>
}
const DEFAULT_VALUE:AuthProps = {
  token: undefined,
  setToken: () => {}
};
export const AuthContext = createContext(DEFAULT_VALUE);

export const useAuth=()=> {
  return useContext(AuthContext);
}