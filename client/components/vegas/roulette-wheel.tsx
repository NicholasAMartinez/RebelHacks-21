import type { Item } from "@/lib/vegas-data";

type RouletteWheelProps = {
  items: Item[];
  isSpinning: boolean;
  spinAngle: number;
};

const colors = ["#7f1d1d", "#991b1b", "#b91c1c", "#dc2626", "#f59e0b", "#7c3aed"];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [`M ${cx} ${cy}`, `L ${start.x} ${start.y}`, `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`, "Z"].join(" ");
}

export function RouletteWheel({ items, isSpinning, spinAngle }: RouletteWheelProps) {
  const size = 320; // px
  const radius = 140;
  const center = size / 2;

  const transition = isSpinning ? "transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)" : "none";

  return (
    <div className="relative mx-auto h-80 w-80">
      <div className="absolute inset-0 rounded-full border-8 border-yellow-400 shadow-2xl shadow-yellow-400/30 flex items-center justify-center">
        <div
          style={{ width: size, height: size }}
          className="relative"
        >
          <div
            style={{
              width: size,
              height: size,
              transform: `rotate(${spinAngle}deg)`,
              transition,
              transformOrigin: "50% 50%",
            }}
          >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
              {items.length === 0 ? null : items.map((item, index) => {
                const segment = 360 / items.length;
                const start = index * segment;
                const end = (index + 1) * segment;
                const path = describeArc(center, center, radius, start, end);
                const mid = (start + end) / 2;
                const labelPos = polarToCartesian(center, center, radius - 40, mid);

                return (
                  <g key={item.id}>
                    <path d={path} fill={colors[index % colors.length]} stroke="#000" strokeWidth={1} />
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      fill="#fff"
                      fontSize={12}
                      fontWeight={700}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ userSelect: "none" }}
                    >
                      ${item.price}
                    </text>
                  </g>
                );
              })}

              {/* center circle */}
              <circle cx={center} cy={center} r={36} fill="#f59e0b" stroke="#fff" strokeWidth={4} />
              <text x={center} y={center} textAnchor="middle" dominantBaseline="middle" fontSize={22} fontWeight={700} fill="#000">🎰</text>
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-2">
        <div className="h-0 w-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-yellow-400" />
      </div>
    </div>
  );
}
