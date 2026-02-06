import { useEffect, useRef, useState } from 'react';

export const Sprite = function ({
    src,
    framesize = 192,
    frames = 6,
    speed = 0.7,
    cropRatio = 0.7,
}: {
    src: string,
    framesize?: number,
    frames?: number,
    speed?: number,
    cropRatio?: number
}) {
    const frameW = framesize;
    const frameH = framesize;
    const cropW = cropRatio;
    const cropH = cropRatio;
    const croppedAspectRatio = (frameW * cropW) / (frameH * cropH);
    const fullAspectRatio = frameW / frameH;
    const animName = `sprite-anim-${Date.now()}`;
    const ref = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState(0);

    useEffect(() => {
        if (!ref.current) return;

        const updateHeight = () => {
            if (ref.current) {
                setContainerHeight(ref.current.offsetHeight);
            }
        };

        // Initial measurement
        updateHeight();

        // Use ResizeObserver for more reliable updates
        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(ref.current);

        // Fallback to window resize
        window.addEventListener('resize', updateHeight);

        // Also trigger after a short delay to catch late renders
        const timeoutId = setTimeout(updateHeight, 100);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateHeight);
            clearTimeout(timeoutId);
        };
    }, []);

    // Calculate the actual size needed for the inner sprite
    const innerHeight = containerHeight / cropH;
    const innerWidth = innerHeight * fullAspectRatio;
    const totalWidth = innerWidth * frames;

    return (
        <div
            ref={ref}
            style={{
                height: '100%',
                aspectRatio: croppedAspectRatio.toString(),
                position: 'relative'
            }}
        >
            {containerHeight > 0 && (
                <>
                    <style>{`
                        @keyframes ${animName} {
                            to { background-position: -${totalWidth}px center; }
                        }
                    `}</style>
                    <div
                        className="sprite-anim"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: innerWidth,
                            height: innerHeight,
                            backgroundImage: `url("${src}")`,
                            backgroundSize: `${totalWidth}px ${innerHeight}px`,
                            animation: `${animName} ${speed}s steps(${frames}) infinite`
                        }}
                    />
                </>
            )}
        </div>
    );
};