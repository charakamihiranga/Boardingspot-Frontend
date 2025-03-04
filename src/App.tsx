import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./component/RootLayout.tsx";
import HostelriesPage from "./page/HostelriesPage.tsx";
import ErrorPage from "./page/ErrorPage.tsx";
import FoodsPage from "./component/FoodsPage.tsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {Provider} from "react-redux";
import {persistor, store} from "./store/Store.ts";
import {PersistGate} from "redux-persist/integration/react";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <ErrorPage/>,
        children: [
            { index: true, element: <HostelriesPage /> },
            { path: 'hostelries', element: <HostelriesPage /> },
            { path: 'foods', element: <FoodsPage /> },
        ]
    },
    { path: '*', element: <ErrorPage /> },
])

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
    return(
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <RouterProvider router={routes} />
                </GoogleOAuthProvider>
            </PersistGate>
        </Provider>
    );
}

export default App;
