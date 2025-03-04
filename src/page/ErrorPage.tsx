import { useRouteError, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function ErrorPage() {
    const error: any = useRouteError();
    const navigate = useNavigate();

    console.error(error);

    const errorStatus = error?.status || 404;
    const errorMessage = error?.statusText || "Page Not Found";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
            >
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-24 h-24 text-orange-500"
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                >
                    <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM9.293 9.293a1 1 0 011.414 0L12 10.586l1.293-1.293a1 1 0 111.414 1.414L13.414 12l1.293 1.293a1 1 0 11-1.414 1.414L12 13.414l-1.293 1.293a1 1 0 11-1.414-1.414L10.586 12 9.293 10.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </motion.svg>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl font-extrabold text-gray-900"
            >
                {errorStatus}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-gray-700 mt-4 text-lg"
            >
                {errorMessage}
            </motion.p>

            <div className="mt-6 flex space-x-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 text-white bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 transition"
                >
                    Retry
                </motion.button>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/")}
                    className="px-6 py-3 text-gray-900 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition"
                >
                    Back to Home
                </motion.button>
            </div>
        </div>
    );
}

export default ErrorPage;
