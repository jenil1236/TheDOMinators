import { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

function Notification() {
    const containerRef = useRef();
    const animationRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        animationRef.current = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: '/notification_bell.json',
        });

        return () => {
            animationRef.current?.destroy();
        };
    }, []);

    const play = () => {
        animationRef.current?.play();
        setIsPlaying(true);
    };

    const stop = () => {
        animationRef.current?.stop();
        setIsPlaying(false);
    };

    return (
        <>
            <div className="position-relative" style={{ width: '100px', height: '100px' }}>
                <div ref={containerRef} style={{ width: '100px', height: '100px' }}>
                </div>
                <span className="position-absolute top-0 start-0 p-2 bg-danger border border-light rounded-circle"
                    style={{
                        transform: 'translate(50%, 50%)', // custom X and Y offset
                        padding: '0.5rem',
                    }}>
                    <span className="visually-hidden">New alerts</span>
                </span>
            </div>
            <button onClick={play}>Play</button>
            <button onClick={stop}>Stop</button>
        </>
    );
}

export default Notification;
