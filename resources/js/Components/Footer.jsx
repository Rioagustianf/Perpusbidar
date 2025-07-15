export default function Footer({ bgColor = "gradient", textColor = "auto" }) {
    const getBackgroundClass = () => {
        // Jika bgColor dimulai dengan "bg-" atau mengandung "gradient", gunakan langsung
        if (bgColor.startsWith("bg-") || bgColor.includes("gradient")) {
            return bgColor;
        }

        // Fallback ke preset jika diperlukan
        switch (bgColor) {
            case "gradient":
                return "bg-gradient-to-b from-[#ffc987] to-[#6a1523]";
            case "gray":
                return "bg-[#d9d9d9]";
            case "white":
                return "bg-white";
            default:
                return bgColor; // Gunakan langsung jika tidak cocok dengan preset
        }
    };

    const getTextColor = () => {
        if (textColor !== "auto") {
            return textColor;
        }

        // Auto detect berdasarkan background
        if (
            bgColor.includes("#d9d9d9") ||
            bgColor.includes("white") ||
            bgColor === "gray" ||
            bgColor === "white"
        ) {
            return "text-gray-800";
        }
        return "text-white";
    };

    const getCopyrightTextColor = () => {
        if (textColor !== "auto" && textColor.includes("text-")) {
            return textColor.replace("text-", "text-") + " opacity-75";
        }

        // Auto detect berdasarkan background
        if (
            bgColor.includes("#d9d9d9") ||
            bgColor.includes("white") ||
            bgColor === "gray" ||
            bgColor === "white"
        ) {
            return "text-gray-600";
        }
        return "text-white opacity-90";
    };

    return (
        <footer className={`${getBackgroundClass()} ${getTextColor()} py-8`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex justify-center px-4 md:px-0">
                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl md:rounded-full shadow-lg w-full max-w-sm md:max-w-none md:w-auto">
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 p-6 md:p-0 md:py-0">
                            <div className="bg-[#8a3837] text-white px-6 py-3 rounded-full">
                                <span className="font-semibold text-base">
                                    Kontak
                                </span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <span className="text-xl">📞</span>
                                <span className="text-[#bd8757] font-medium text-base">
                                    +62 895-3422-78028
                                </span>
                            </div>

                            <span className="text-gray-400 hidden md:block">
                                |
                            </span>

                            <div className="flex items-center space-x-3 md:pr-10">
                                <span className="text-xl">📧</span>
                                <span className="text-[#bd8757] font-medium text-base text-center md:text-left">
                                    perpustakaan@binadarma.ac.id
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center mt-6 md:mt-8">
                    <p
                        className={`${getCopyrightTextColor()} font-medium text-sm md:text-base`}
                    >
                        @2025 Copyright Perpus Bina Darma
                    </p>
                </div>
            </div>
        </footer>
    );
}
