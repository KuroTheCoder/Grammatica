const GoalsWidget = () => {
    return (
        <div className="rounded-lg bg-black/50 border border-neutral-700/80 p-4 flex flex-col">
            <h3 className="font-semibold mb-4 border-b border-neutral-600 pb-2">GOALS AND STATUS</h3>
            <div className="space-y-3">
                <div className="h-8 bg-orange-600/80 rounded"></div>
                <div className="h-8 bg-orange-600/80 rounded"></div>
                <div className="h-8 bg-orange-600/80 rounded"></div>
            </div>
        </div>
    );
};

export default GoalsWidget;