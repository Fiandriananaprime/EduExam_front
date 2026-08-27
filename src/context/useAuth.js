import { useContext } from "react";
import { AuthContext } from "./authContextValue";

export const useAuth = () => useContext(AuthContext);
