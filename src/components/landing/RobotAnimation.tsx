import { useMemo, MouseEvent as ReactMouseEvent } from 'react'
import { logo, logo_shine, robot } from '../../../public'
import CusrorEffect from './CusrorEffect'

const RobotAnimation = () => {
    const hoverRadius = 10;

    const stars = useMemo(() => (
        Array.from({ length: 150 }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
        }))
    ), []);

    const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>, areaId: string) => {
        const area = document.getElementById(areaId);
        if (area) {
            const rect = area.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
            const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

            stars.forEach((star, i) => {
                const distance = Math.sqrt(
                    Math.pow(star.x - mouseX, 2) + Math.pow(star.y - mouseY, 2)
                );
                const starElement = document.getElementById(`${areaId}-star-${i}`);
                if (starElement) {
                    starElement.style.backgroundColor =
                        distance <= hoverRadius ? "white" : "#00000000";
                }
            });
        }
    };

    const handleMouseLeave = (areaId: string) => {
        stars.forEach((_, i) => {
            const starElement = document.getElementById(`${areaId}-star-${i}`);
            if (starElement) {
                starElement.style.backgroundColor = "#00000000";
            }
        });
    };

    return (
        <div
            className="relative w-full h-auto flex justify-center items-center"
            onMouseMove={(e) => handleMouseMove(e, "robot-element")}
            onMouseLeave={() => handleMouseLeave("robot-element")}
        >
            <CusrorEffect areaId="robot-element" />

            <div className="relative z-10 flex justify-center items-center pt-5">
                <img
                    src={robot}
                    alt="Robot"
                    className="w-[300px] h-[300px] object-contain"
                />
                <img
                    src={logo_shine}
                    alt="Shine Logo"
                    className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blink-shine"
                    style={{ width: "250px", pointerEvents: "none" }}
                />
                <img
                    src={logo}
                    alt="Dull Logo"
                    className="absolute top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2 animate-blink-dull"
                    style={{ width: "50px", height: "50px", pointerEvents: "none" }}
                />
            </div>
        </div>
    )
}

export default RobotAnimation