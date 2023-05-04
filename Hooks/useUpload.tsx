import { toastConfig } from '@utils/toastConfig';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import useAuthentication from './useAuthentication';

function useUpload() {
  const [percent, setPercent] = useState({
    total: 0,
    loaded: 0,
  });
  const auth = useAuthentication({});
  const [urls, setUrls] = useState<string[]>([]);
  const currentUrls = useRef<{ images: string[]; quantity: number }>({ images: [], quantity: 0 });

  const Upload = (files: File[], { folder }: { folder?: string }) => {
    currentUrls.current.quantity = files.length;
    files.map((file) => {
      setPercent((prev) => ({
        loaded: 0,
        total: prev.total + file.size,
      }));
    });

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    // formData.append('upload_preset', 'ml_default');
    formData.append('userId', auth.data?._userId || '');
    if (folder) {
      formData.append('id', folder);
    }
    files.map((file, index) => {
      formData.append('images', file);
    });
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        setPercent((prev) => ({
          ...prev,
          loaded: event.loaded,
        }));
      }
    });
    xhr.addEventListener('loadend', () => {
      const res = JSON.parse(xhr.responseText);
      const newUrl = res.urls as string;
      setUrls((prev) => {
        return [...newUrl];
      });
      setPercent({
        loaded: 0,
        total: 0,
      });
    });

    xhr.addEventListener('error', () => toast.error('upload failed', toastConfig));
    // xhr.open('POST', 'https://api.cloudinary.com/v1_1/ntnguyen710/image/upload', true);
    xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/api/posts/images?userId=nguyentest`, true);
    xhr.send(formData);
  };
  return { percent, urls, Upload };
}

export default useUpload;
