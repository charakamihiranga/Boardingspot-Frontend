import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import CategoryBar from "./CategoryBar";

function RootLayout() {
    const location = useLocation();
    const showCategoryBar = location.pathname.startsWith("/hostelries");
    return (
        <div className="h-screen flex flex-col">
            <div className="fixed top-0 w-full z-50">
                <NavBar />
            </div>
            {showCategoryBar && (
                <div className="sticky top-44 z-40 bg-white scroll:shadow-sm py-2 px-[4vw]">
                    <CategoryBar />
                </div>
            )}
            <main className={`flex-1 overflow-y-auto w-full py-6 ${showCategoryBar ? "mt-[14vh]" : "mt-[8vh]"}`}>
                <Outlet />
            </main>
        </div>
    );
}

export default RootLayout;
