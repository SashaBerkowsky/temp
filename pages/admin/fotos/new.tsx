import AdminLayout from '@components/Admin/AdminLayout';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const New = () => {

  const [images, setImages] = useState([])
  
  const addFile = (e) => {
    const files = e.target.files;
    setImages(files);
  };

  return (
    <AdminLayout title='Admin - Cargar Fotos '>
      <div className='bg-blanco min-h-screen'>
        <img src="../../images/overtimeLogo_bien.png" alt="logo de overtime" className="m-auto w-16 pt-10" />

        <div className='flex max-w-5xl m-auto items-center pt-5 md:pt-10 justify-center relative'>
         
          <Link href="/admin/home/galeria" className='absolute left-0'>
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
          cargar fotos
        </div>

        <div className='flex justify-center'>
          <div className='my-12 font-din-display '>
            <input type="file" name="" id="fotos" accept=".png, .jpg, .jpeg, .gif" multiple className='hidden' onInput={(e) => addFile(e)} />
            <label htmlFor="fotos" className='font-medium text-violeta text-md font-din-display flex gap-3'> 
              <img src="/logos - iconos/Subir.png" alt="" className='w-6'/>
              {images.length} archivos seleccionados 
            </label>
          </div>
        </div>

        <div className='flex flex-wrap gap-3 mx-auto justify-center items-center max-w-5xl'>
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
        </div>
  
        <div className='flex gap-3 justify-center mt-24'>
          <button className='uppercase font-bold  px-14 py-3 rounded text-naranja border-naranja border-2'>
            Cancelar
          </button>
          <button className='uppercase font-bold bg-naranja px-14 py-3 rounded text-white '>
            Guardar
          </button>
        </div>

      </div>
    </ AdminLayout>
  );
};

export default New;
