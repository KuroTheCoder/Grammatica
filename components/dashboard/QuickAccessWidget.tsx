const QuickAccessWidget = () => {
    return (
        <div className="rounded-lg bg-black/50 border border-neutral-700/80 p-4 flex flex-col">
            <h3 className="font-semibold mb-4 border-b border-neutral-600 pb-2">QUICK ACCESS</h3>
            <div className="grid grid-cols-4 gap-4 flex-1">
                <div className="bg-yellow-500/80 rounded-lg"></div>
                <div className="bg-yellow-500/80 rounded-lg"></div>
                <div className="bg-yellow-500/80 rounded-lg"></div>
                <div className="bg-yellow-500/80 rounded-lg"></div>
                <div className="bg-yellow-500/80 rounded-lg"></div>
                <div className="bg-yellow-500/80 rounded-lg"></div>
                <div className="bg-yellow-500/80 rounded-lg"></div>
                <div className="bg-yellow-500/80 rounded-lg"></div>
            </div>
        </div>
    );
};

export default QuickAccessWidget;