const PILLS = [
    { label: "Key finding", className: "-right-2 top-[12%]" },
    { label: "Definition", className: "-left-2 top-[44%]" },
    { label: "Context", className: "right-[8%] -bottom-2" },
] as const;

const GeometricBlocksVisual = () => {
    return (
        <div className="relative mx-auto aspect-square w-full max-w-[380px]">
            <div className="absolute left-0 top-0 h-[55%] w-[55%] rounded-3xl bg-(--blue) opacity-90" />
            <div className="absolute bottom-0 right-0 h-[60%] w-[60%] rounded-3xl border border-foreground/15" />
            <div className="absolute right-[5%] top-1/5 h-[36%] w-[36%] rounded-full bg-secondary" />

            {PILLS.map((pill) => (
                <div
                    key={pill.label}
                    className={`absolute rounded-full border border-(--landing-line) bg-background/90 px-3.5 py-1.5 text-xs font-medium text-foreground shadow-lg shadow-black/40 ${pill.className}`}
                >
                    {pill.label}
                </div>
            ))}
        </div>
    );
};

export default GeometricBlocksVisual;
