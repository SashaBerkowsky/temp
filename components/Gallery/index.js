import { useState, useEffect } from 'react';
import { ImageCarousel } from '@components/ImageCarousel';

const Gallery = () => {
    const jordans = [
        '/jordan/Jordan IA 01.jpg',
        '/jordan/Jordan IA 02.jpg',
        '/jordan/Jordan IA 03.jpg',
        '/jordan/Jordan IA 04.jpg',
        '/jordan/Jordan IA 05.jpg',
        '/jordan/Jordan IA 06.jpg',
        '/jordan/Jordan IA 07.jpg',
        '/jordan/Jordan IA 08.jpg',
        '/jordan/Jordan IA 09.jpg',
    ];

    return (
        <div className="bg-fondo grid place-content-center w-full ">
            <div className="px-3 pb-16">
                <img
                    src="/reparacion.png"
                    alt=""
                    className="w-10 h-10 rotate-6 m-auto mb-5"
                />
                <div className="pb-8 text-center">
                    <p className="font-Helvetica  text-naranja text-lg ">
                        {' '}
                        ESTA PÁGINA VA A ESTAR LISTA <br />{' '}
                        <span className="font-bold "> PRÓXIMAMENTE </span>{' '}
                    </p>
                    <p className="text-newvioleta-claro font-din-display mt-3">
                        {' '}
                        Te dejamos una colección de Jordans trabajando en ella{' '}
                    </p>
                </div>
                <ImageCarousel images={jordans}></ImageCarousel>
            </div>
        </div>
    );
};

export default Gallery;
