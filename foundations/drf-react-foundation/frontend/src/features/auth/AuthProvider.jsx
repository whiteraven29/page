import { useCallback, useEffect, useMemo, useState } from "react";
import { refreshAccess, setAccessToken, setOnAuthLost } from "../../api/client.js";
import { authApi } from "./api.js";
import { AuthContext } from "./AuthContext.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | signed-in | signed-out

  const signOutLocally = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setStatus("signed-out");
  }, []);

  // On page load, the refresh cookie (if any) gets us back in without a password.
  useEffect(() => {
    setOnAuthLost(signOutLocally);
    refreshAccess()
      .then((token) => (token ? authApi.me() : null))
      .then((me) => {
        setUser(me);
        setStatus(me ? "signed-in" : "signed-out");
      })
      .catch(signOutLocally);
  }, [signOutLocally]);

  const login = useCallback(async (email, password) => {
    const { access } = await authApi.login(email, password);
    setAccessToken(access);
    setUser(await authApi.me());
    setStatus("signed-in");
  }, []);

  const register = useCallback(
    async (data) => {
      await authApi.register(data);
      await login(data.email, data.password);
    },
    [login],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      signOutLocally();
    }
  }, [signOutLocally]);

  const value = useMemo(() => ({ user, status, login, register, logout }), [user, status, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
