const OrbitingCircleVisual = () => {
    return (
        <div className="relative mx-auto aspect-square w-full max-w-[380px]">
            <div
                className="absolute inset-[8%] rounded-full"
                style={{
                    background:
                        "radial-gradient(circle at 35% 30%, rgba(200,85,61,0.85), rgba(200,85,61,0.12) 60%, transparent 75%)",
                }}
            />
            <div className="absolute inset-0 rounded-full border border-foreground/12" />
            <div className="absolute left-[12%] top-[10%] size-4 rotate-[15deg] rounded-[4px] bg-foreground" />
        </div>
    );
};

export default OrbitingCircleVisual;
