import { useState, useEffect } from "react";

export const ImageCarousel = ({ images, time = 2000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, time);

        return () => clearInterval(interval);
    }, [images]);

    return <img src={images[currentIndex]} alt="carousel" />;
};
