import { cn } from "@/lib/utils";

interface BookFlipVisualProps {
    className?: string;
}

const lineStyle = (opacity: number): React.CSSProperties => ({
    background: `rgba(26,25,24,${opacity})`,
});

const lineStyleLight = (opacity: number): React.CSSProperties => ({
    background: `rgba(247,244,238,${opacity})`,
});

const BookFlipVisual = ({ className }: BookFlipVisualProps) => {
    return (
        <div
            className={cn(
                "relative mx-auto flex aspect-[4/3] w-full max-w-[420px] items-center justify-center",
                className
            )}
        >
            <div
                className="pointer-events-none absolute inset-0 animate-[glowPulse_5s_ease-in-out_infinite]"
                style={{ backgroundImage: "var(--landing-glow)", backgroundPosition: "60% 40%" }}
                aria-hidden
            />

            <div className="relative h-[250px] w-[340px] [perspective:1000px]">
                {/* Back cover */}
                <div className="absolute inset-0 rounded-r-[10px] bg-card shadow-[0_34px_70px_-18px_rgba(0,0,0,0.7)]" />

                {/* Left cover half */}
                <div className="absolute inset-y-0 left-0 w-1/2 rounded-l-[10px] bg-foreground" />
                <div className="absolute left-4 top-[22px] h-1 w-[36%] rounded-full" style={lineStyle(0.15)} />
                <div className="absolute left-4 top-[38px] h-1 w-[30%] rounded-full" style={lineStyle(0.1)} />

                {/* Right cover half (dark) lines */}
                <div className="absolute right-4 top-[22px] h-1 w-[36%] rounded-full" style={lineStyleLight(0.2)} />
                <div className="absolute right-4 top-[38px] h-1 w-[30%] rounded-full" style={lineStyleLight(0.14)} />

                {/* Spine divider */}
                <div className="absolute inset-y-0 left-1/2 w-px bg-black/25" />

                {/* Receding page stack */}
                <div
                    className="absolute left-1/2 rounded-r-lg"
                    style={{ top: 4, width: "calc(50% - 4px)", height: "calc(100% - 8px)", background: "#efe8d8", transform: "translateZ(-4px)" }}
                />
                <div
                    className="absolute left-1/2 rounded-r-lg"
                    style={{ top: 8, width: "calc(50% - 8px)", height: "calc(100% - 16px)", background: "#e4ddce", transform: "translateZ(-8px)" }}
                />
                <div
                    className="absolute left-1/2 rounded-r-lg"
                    style={{ top: 12, width: "calc(50% - 12px)", height: "calc(100% - 24px)", background: "#dcd3bf", transform: "translateZ(-12px)" }}
                />

                {/* Flipping page (slower, underneath) */}
                <div
                    className="absolute left-1/2 top-0 h-full w-1/2 animate-[pageFlip2_3.6s_ease-in-out_infinite] [transform-origin:left_center] [transform-style:preserve-3d]"
                >
                    <div className="absolute inset-0 rounded-r-[10px] [backface-visibility:hidden]" style={{ background: "#f2ece0" }}>
                        <div className="absolute left-4 top-[22px] h-1 w-[65%] rounded-full" style={lineStyle(0.12)} />
                        <div className="absolute left-4 top-[38px] h-1 w-1/2 rounded-full" style={lineStyle(0.08)} />
                    </div>
                    <div
                        className="absolute inset-0 rounded-l-[10px] [backface-visibility:hidden]"
                        style={{ background: "#e4ddce", transform: "rotateY(180deg)" }}
                    >
                        <div className="absolute right-4 top-[22px] h-1 w-[65%] rounded-full" style={lineStyle(0.1)} />
                    </div>
                </div>

                {/* Flipping page (front) */}
                <div
                    className="absolute left-1/2 top-0 h-full w-1/2 animate-[pageFlip_3.6s_ease-in-out_infinite] [transform-origin:left_center] [transform-style:preserve-3d]"
                >
                    <div
                        className="absolute inset-0 rounded-r-[10px] bg-card [backface-visibility:hidden]"
                        style={{ boxShadow: "2px 0 10px rgba(0,0,0,0.15)" }}
                    >
                        <div className="absolute left-4 top-[22px] h-1 w-[70%] rounded-full" style={lineStyle(0.15)} />
                        <div className="absolute left-4 top-[38px] h-1 w-[55%] rounded-full" style={lineStyle(0.1)} />
                        <div className="absolute left-4 top-[54px] h-1 w-[60%] rounded-full" style={lineStyle(0.1)} />
                    </div>
                    <div
                        className="absolute inset-0 rounded-l-[10px] [backface-visibility:hidden]"
                        style={{ background: "#e4ddce", transform: "rotateY(180deg)" }}
                    >
                        <div className="absolute right-4 top-[22px] h-1 w-[70%] rounded-full" style={lineStyle(0.12)} />
                        <div className="absolute right-4 top-[38px] h-1 w-[55%] rounded-full" style={lineStyle(0.08)} />
                    </div>
                </div>

                {/* Page edge striping */}
                <div
                    className="absolute -left-0.5 top-1.5 bottom-1.5 w-[11px] rounded-l-[3px]"
                    style={{
                        background: "repeating-linear-gradient(#f7f4ee,#f7f4ee 2px,#e0d8c4 2px,#e0d8c4 3px)",
                        transform: "translateZ(-2px)",
                    }}
                />

                {/* Spine binding */}
                <div
                    className="absolute -left-3 top-2.5 bottom-2.5 w-3 rounded-l-md"
                    style={{ background: "linear-gradient(to right,#7a4528,#5a2f1e)" }}
                />
            </div>
        </div>
    );
};

export default BookFlipVisual;
