import { useState, useEffect } from 'react';

const useScreenWidth = () => {
    // Initialise avec une valeur par défaut de bureau au lieu de 0 pour éviter le flash mobile
    const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        // Vérifie si on est côté client
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setWidth(window.innerWidth);
            };

            // Initialise la valeur
            handleResize();

            window.addEventListener('resize', handleResize);

            // Cleanup listener on component unmount
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    return width;
};

export default useScreenWidth;