import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import HotelsPage from "./pages/Hotels";
import NewHotelPage from "./pages/NewHotel";
import RoomsPage from "./pages/Rooms";
import NewRoomPage from "./pages/NewRoom";
import TransactionPage from "./pages/Transactions";
import LoginPage from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "/hotels",
        element: <HotelsPage />,
      },
      { path: "/new-hotel", element: <NewHotelPage /> },
      { path: "/rooms", element: <RoomsPage /> },
      { path: "/new-room", element: <NewRoomPage /> },
      { path: "/transactions", element: <TransactionPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
