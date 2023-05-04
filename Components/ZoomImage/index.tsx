import Image, { StaticImageData } from 'next/image';
import styles from './zoomImage.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Swiper as s } from 'swiper';
import defaultAvatar from '@public/images/backgroundDefault.jpg';
import clsx from 'clsx';
import 'swiper/css';
import 'swiper/css/navigation';
import { useState, useRef, useEffect } from 'react';
import { IconLeftArrow } from '@Components/icons/iconLeftArrow';
import { IconRightArrow } from '@Components/icons/iconRightArrow';
import { IconClose } from '@Components/icons/iconClose';

type ZoomImageI = { images: (string | StaticImageData)[]; cb: () => void };
const arr = [1, 1];
export const ZoomImage = ({ images, cb }: ZoomImageI) => {
  const prevRef = useRef<HTMLDivElement | null>(null);
  const nextRef = useRef<HTMLDivElement | null>(null);

  return (
    <section
      className={clsx(styles['ZoomImage'])}
      onClick={() => {
        cb();
      }}
    >
      <div
        ref={prevRef}
        className={clsx(styles['arrow'], styles['left'])}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles['arrow-wrapper']}>
          <IconLeftArrow width="40px" height="40px" />
        </div>
      </div>
      <div
        ref={nextRef}
        className={clsx(styles['arrow'], styles['right'])}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles['arrow-wrapper']}>
          <IconClose className={styles['icon']} onClick={cb} />
          <IconRightArrow width="40px" height="40px" />
        </div>
      </div>
      <Swiper
        navigation={{
          prevEl: prevRef?.current,
          nextEl: nextRef?.current,
        }}
        loop={true}
        modules={[Navigation]}
        className={clsx(styles['list'], 'mySwiper')}
        onInit={(swiper) => {
          // @ts-ignore
          // eslint-disable-next-line no-param-reassign
          swiper.params.navigation.prevEl = prevRef.current;
          // @ts-ignore
          // eslint-disable-next-line no-param-reassign
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.update();
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {images.map((image, i) => (
          <SwiperSlide key={i} className={styles['item']}>
            <div
              className={styles['image']}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <Image src={image} alt="" layout="fill" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
