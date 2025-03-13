import { motion } from "framer-motion";

const DotsLoader = () => {
    return (
        <div className="flex items-center justify-center space-x-2 h-full">
            {[0, 1, 2].map((index) => (
                <motion.div
                    key={index}
                    className="w-[6px] h-[6px] rounded-full bg-gradient-to-r from-white to-gray-300 shadow-lg"
                    animate={{
                        y: [-6, 6, -6],
                        scale: [1, 1.2, 1],
                        opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2,
                    }}
                />
            ))}
        </div>
    );
};

export default DotsLoader;
