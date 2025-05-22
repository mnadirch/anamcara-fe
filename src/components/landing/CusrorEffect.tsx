import { useMemo } from 'react'

const CusrorEffect = ({ areaId }: { areaId: string }) => {
    const stars = useMemo(() => (
        Array.from({ length: 150 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
        }))
    ), []);

    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {stars.map((star, index) => (
                <div
                    key={index}
                    id={`${areaId}-star-${index}`}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        top: `${star.y}%`,
                        left: `${star.x}%`,
                        backgroundColor: "#00000000",
                        transition: "background-color 0.3s ease",
                    }}
                ></div>
            ))}
        </div>
    )
}

export default CusrorEffect