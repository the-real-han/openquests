import { useEffect, useRef, useState, useMemo } from 'react';

export const Sprite = function ({
    src,
    frameSize = 192,
    frames = 6,
    speed = 0.7,
    cropRatio = 0.7,
}: {
    src: string,
    frameSize?: number,
    frames?: number,
    speed?: number,
    cropRatio?: number
}) {
    const frameW = frameSize;
    const frameH = frameSize;
    const cropW = cropRatio;
    const cropH = cropRatio;
    const croppedAspectRatio = (frameW * cropW) / (frameH * cropH);
    const fullAspectRatio = frameW / frameH;

    // Use useMemo to create a stable animation name that doesn't change on re-renders
    const animName = useMemo(() => `sprite-anim-${Math.random().toString(36).substr(2, 9)}`, []);

    const ref = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState(0);

    useEffect(() => {
        if (!ref.current) return;

        const updateHeight = () => {
            if (ref.current) {
                const height = ref.current.offsetHeight;
                // Only update if height actually changed to avoid unnecessary re-renders
                setContainerHeight(prev => prev !== height ? height : prev);
            }
        };

        // Initial measurement with requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            updateHeight();
        });

        // Use ResizeObserver for more reliable updates
        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(ref.current);

        // Fallback to window resize
        window.addEventListener('resize', updateHeight);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateHeight);
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
                            from { background-position: 0 center; }
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
                            backgroundPosition: '0 center',
                            animation: `${animName} ${speed}s steps(${frames}) infinite`
                        }}
                    />
                </>
            )}
        </div>
    );
};