import { memo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { IoMdClose } from 'react-icons/io';
import { Image } from '@Components/Image';
import styles from './images.module.scss';
import { IconCamera } from '@Components/icons/iconCamera';

interface IImagesComponent {
  handleSetImages: (files: File[]) => void;
  handleDeleteImage: (index: number) => void;
  _images?: string[];
}

function ImagesComponent({ handleSetImages, handleDeleteImage, _images }: IImagesComponent) {
  const [images, setImages] = useState<(File | string)[]>(_images || []);
  const handleChange = () => (files: File[]) => {
    handleSetImages(files);
    let images: (File | string)[] = [];
    for (const key in files) {
      if (files[key] instanceof File) {
        images = [...images, files[key]];
      }
    }
    setImages(images);
  };
  const handleDelete = (index: number) => {
    const newImages = images?.filter((image, oldIndex) => oldIndex !== index);
    setImages(newImages);
    handleDeleteImage(index);
  };
  return (
    <div
      className="drag-drop-img px-4 pb-4 flex-1 flex flex-col justify-center items-center"
      onDrop={(e) => {
        e.preventDefault();
        const files: File[] = [];
        const fileList = e.dataTransfer.files;
        for (const key in fileList) {
          if (fileList[key] instanceof File) {
            files.push(fileList[key]);
          }
        }
        if (files.length) {
          handleChange()(files);
        }
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      {(images?.length && (
        <>
          <Swiper navigation={true} loop={true} modules={[Navigation]} className={styles['container']}>
            {images.map((image, index) => {
              const preview = image instanceof File ? URL.createObjectURL(image) : image;
              return (
                <SwiperSlide key={index} className="relative">
                  <IoMdClose
                    className={styles['close']}
                    onClick={() => {
                      handleDelete(index);
                    }}
                  />
                  <Image
                    src={preview}
                    onLoad={() => URL.revokeObjectURL(preview)}
                    layout="fill"
                    draggable={false}
                    alt=""
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </>
      )) || (
        <>
          <Image
            alt=""
            src=""
            change
            multiple
            onChange={(e) => {
              e.preventDefault();
              const target = e.target as HTMLInputElement;
              const files: File[] = [];
              const fileList = target.files;
              if (fileList) {
                for (const key in fileList) {
                  if (fileList[key] instanceof File) {
                    files.push(fileList[key]);
                  }
                }
              }
              if (files.length) {
                handleChange()(files);
              }
            }}
          >
            <div className="flex flex-col justify-center items-center">
              <IconCamera width="80%" height="80%" className="text-gray-400" />
              <div>Drag photos here</div>
            </div>
          </Image>
        </>
      )}
    </div>
  );
}

export default memo(ImagesComponent);
