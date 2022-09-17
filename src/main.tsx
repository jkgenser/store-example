import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import create from "zustand";
import { persist } from "zustand/middleware";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user: user })),
  removeUser: () => set(() => ({ user: null })),
}));

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user: user }),
      removeUser: (user) => set(() => ({ user: null })),
    }),
    {
      name: "user-storage", // name of item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
    }
  )
);

const Root = () => {
  const user = useUserStore((state) => state.user);
  const removeUser = useUserStore((state) => state.removeUser);
  const navigate = useNavigate();
  const handleClick = () => {
    removeUser();
  };

  useEffect(() => {
    console.log(user);
    if (!user) {
      navigate("/login");
    }
  });

  return (
    <div>
      Welcome Home: {user ? user.name : ""}
      <button type="submit" onClick={handleClick}>
        Logout
      </button>
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const handleClick = () => {
    setUser({ name: "jerry" });
    navigate("/");
  };

  return (
    <div>
      User: {user}
      <button type="submit" onClick={handleClick}>
        Mock Login
      </button>
    </div>
  );
};

const router = createBrowserRouter([
  { path: "/", element: <Root /> },
  { path: "/login", element: <Login /> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
