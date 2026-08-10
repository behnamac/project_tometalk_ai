import { KNOWLEDGE_TOPICS } from "./content";

const NODES = [
    { x: 80, y: 60 },
    { x: 210, y: 36 },
    { x: 330, y: 70 },
    { x: 90, y: 230 },
    { x: 215, y: 258 },
    { x: 335, y: 214 },
] as const;

const EDGES = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 0, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 4 },
] as const;

const KnowledgeGraphSvg = () => {
    return (
        <svg viewBox="0 0 400 300" className="w-full max-w-lg" role="img" aria-label="Diagram of connected knowledge topics extracted from a document">
            {EDGES.map((edge) => {
                const from = NODES[edge.from];
                const to = NODES[edge.to];
                return (
                    <line
                        key={`${edge.from}-${edge.to}`}
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke="var(--landing-line)"
                        strokeWidth={1.5}
                    />
                );
            })}

            {NODES.map((node, index) => (
                <g key={KNOWLEDGE_TOPICS[index]}>
                    <circle cx={node.x} cy={node.y} r={5} fill="var(--blue)" />
                    <text
                        x={node.x}
                        y={node.y - 14}
                        textAnchor="middle"
                        className="fill-foreground text-[11px] font-medium"
                    >
                        {KNOWLEDGE_TOPICS[index]}
                    </text>
                </g>
            ))}
        </svg>
    );
};

export default KnowledgeGraphSvg;
