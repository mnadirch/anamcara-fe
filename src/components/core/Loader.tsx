const Loader = () => {
    return (
        <div className="fixed w-full top-0 left-0 z-50 h-screen flex items-center justify-center min-h-screen bg-secondary">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ADFF00]"></div>
        </div>
    );
};

export default Loader;