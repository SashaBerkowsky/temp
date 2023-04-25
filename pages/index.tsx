
import Layout from '@components/Layout/Layout';
import Wordings from '@utils/wordings/wordings';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import type { Page } from '../types';
import { API_URL, IMAGE_URL } from '@constants';
import { ImageCarousel } from '@components/ImageCarousel';




const Home = ({ page, props }) => {
  return (
    <Layout title={page.title} id={page.id}>
      <div className='bg-fondo w-full relative overflow-hidden'>
        <div className="absolute top-[80px] inset-x-0 mx-auto ">
          <p className='text-naranja font-bold mb-4 text-sm tracking-tight   uppercase inset-x-0 mx-auto text-center hidden md:block font-Helvetica'>{Wordings.DESCRIPTION}</p>
          
          <img src="/overtime.png"  className=' inset-x-0 mx-auto md:w-[700px] w-[80%] max-w-[700px]' alt={Wordings.APP_NAME} />
        </div>
        {
          props.images && 
          <div className='absolute md:bottom-0 inset-x-0 mx-auto mt-[300px]  w-[432px] max-w-[80vw] h-96'>
            <ImageCarousel images={props.images} time={400}></ImageCarousel>
          </div>
        }
        {/* <img src="/jordan.png" alt="michael jordan" className='absolute md:bottom-0 inset-x-0 mx-auto mt-[300px] hidden md:block' />
        <img src="/jordanFull.png" alt="michael jordan" className='absolute md:bottom-0 inset-x-0 mx-auto mt-[200px] md:hidden ' /> */}
      </div>
      <p className="[writing-mode:vertical-lr] absolute top-[40%] right-2 text-[12px] opacity-30 hidden lg:block">
        {Wordings.EDITION}
      </p>
    </Layout>
  );
}

export const getServerSideProps = async (context) => {

  const props = {
    page: {
      title: "Home",
      id: "home",
    },
    props: {
      images: []
    }
  };
  
  const images = await fetch(`${API_URL}/images/delegates`)
    .then((images) => images.json())
    .then((images) => {
      images.forEach(image => {
        props.props.images.push(`${IMAGE_URL}/${image}`)
      });
    })

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Custom compare function to randomly sort array
  function randomSort(a, b) {
    return getRandomInt(-1, 1);
  }

  props.props.images.sort(randomSort)


  return {
    props,
  }
}

export default Home;