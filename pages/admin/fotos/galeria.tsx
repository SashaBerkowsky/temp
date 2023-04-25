import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AdminLayout from '@components/Admin/AdminLayout';

const Galeria = () => {

  const imagenes = ['/boca-equipo.png','/boca-equipo.png','/boca-equipo.png','/boca-equipo.png','/boca-equipo.png','/boca-equipo.png','/boca-equipo.png','/boca-equipo.png','/boca-equipo.png','/boca-equipo.png','/boca-equipo.png','/boca-equipo.png','/boca-equipo.png']

  return (
    <AdminLayout title='Admin - Fotos'>
      <div className='bg-blanco min-h-screen'>
        <img src="../../images/overtimeLogo_bien.png" alt="logo de overtime" className="m-auto w-16 pt-10" />

        <div className='flex max-w-5xl m-auto items-center pt-5 md:pt-10 justify-center relative'>
         
          <Link href="/admin/home" className='absolute left-0'>
            <p className='text-naranja font-bold flex items-center font-din-display uppercase'>
              <img src="../../logos - iconos/Flecha.png" alt=""  className='w-6 rotate-180'/>
              volver
            </p>
          </Link>
          
          <div className='m-auto text-center '>
            <span className='font-Helvetica text-lg text-[#837fa0] font-bold'>PANEL ADMINISTRATIVO / </span> <span className='font-Helvetica text-lg text-violeta font-bold'> FOTOS </span>
          </div>
        </div>

        <div className="text-9xl text-center m-auto my-6 uppercase font-Fixture-ultra text-violeta">
          fotos
        </div>

        <div className='flex gap-3 mx-auto justify-center items-center max-w-5xl'>
          <span className='font-din-display mr-3 font-bold'>Filtrar </span>
          <select name="" className=' bg-blanco border-2 border-naranja text-naranja font-bold uppercase rounded-md focus:ring-naranja w-44 focus:border-naranja block py-2.5 px-8'  id="tipoDeTorneo" defaultValue="torneo">
            <option className='font-bold p-2' selected disabled>torneo</option>
            <option className='font-bold p-2' value="opcion 1 ">opcion 1</option>
            <option className='font-bold p-2' value="opcion 2">opcion 2</option>
            <option className='font-bold p-2' value="opcion 3 ">opcion 3</option>
          </select>
          <select name="" className=' bg-blanco border-2 border-naranja text-naranja  font-bold uppercase rounded-md focus:ring-naranja w-48 focus:border-naranja block py-2.5 px-8'  id="tipoDeTorneo" defaultValue="subtorneo">
            <option className='font-bold p-2' selected disabled>subtorneo</option>
            <option className='font-bold p-2' value="opcion 1 ">opcion 1</option>
            <option className='font-bold p-2' value="opcion 2">opcion 2</option>
            <option className='font-bold p-2' value="opcion 3 ">opcion 3</option>
          </select>
          <select name="" className=' bg-blanco border-2 border-naranja text-naranja font-bold uppercase rounded-md focus:ring-naranja w-44 focus:border-naranja block py-2.5 px-8'  id="tipoDeTorneo" defaultValue="fecha">
            <option className='font-bold p-2' selected disabled>fecha</option>
            <option className='font-bold p-2' value="opcion 1 ">opcion 1</option>
            <option className='font-bold p-2' value="opcion 2">opcion 2</option>
            <option className='font-bold p-2' value="opcion 3 ">opcion 3</option>
          </select>

          <Link href={'/admin/fotos/new'} className='bg-naranja px-5 py-3 rounded'>
            <img src="/logos - iconos/Nueva Foto.png" alt="" className='w-8 '/>
          </Link>
        </div>

        <div className='grid grid-cols-4 gap-2 mx-auto max-w-7xl w-max py-20'>
          {
            imagenes.map((imagen) => {
              return(
                <img src={imagen} alt="" className='max-h-[150px] mx-auto' />
              )
            })
          }
        </div>

      </div>
    </AdminLayout>

  );
};

export default Galeria;
