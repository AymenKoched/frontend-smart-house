import React, { useEffect, useRef } from 'react';

const TypingEffect = ({ text, speed = 50 }) => {
    const index = useRef(0);
    const typeText = useRef(null);

    useEffect(() => {
        const type = () => {
            if (index.current < text.length && typeText.current != null) {
                typeText.current.innerHTML += text.charAt(index.current);
                index.current++;
                setTimeout(type, speed);
            }
        };
        
        type();
    }, [text, speed]);

    return <p ref={typeText} />;
};

export default TypingEffect;
