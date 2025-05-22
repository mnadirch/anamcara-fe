import { FiAlertCircle } from "react-icons/fi";

interface LogoutConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}
const LogoutConfirmModal: React.FC<LogoutConfirmProps> = ({isOpen, onClose, onConfirm}) => {
    if (!isOpen) return null;

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 w-80 animate-fade-in border-[#A0FF06]">
            <div className="flex items-center mb-4 text-red-500">
                <FiAlertCircle size={24} className="mr-2" />
                <h3 className="text-lg font-semibold text-[#A0FF06]">Confirm Logout</h3>
            </div>

            <p className="text-[#A0FF06] mb-6">
                Are you sure you want to logout from your account?
            </p>

            <div className="flex justify-end space-x-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    </div>
    )
};

    export default LogoutConfirmModal