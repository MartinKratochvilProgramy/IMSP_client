import { useContext } from "react";
import { IsLoggedInContext, RoleContext, UsernameContext } from "../App";

export function useLogout() {
    const { setUsernameState } = useContext(UsernameContext);
    const { setIsLoggedInState } = useContext(IsLoggedInContext);
    const { setRoleState } = useContext(RoleContext);

    setUsernameState(null);
    setIsLoggedInState(false);
    setRoleState(null);
    localStorage.setItem('user', 'null');
}