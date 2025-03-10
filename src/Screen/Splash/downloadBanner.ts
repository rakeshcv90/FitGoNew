import RNFetchBlob from 'rn-fetch-blob';
import {setDownloadedImage} from '../../Component/ThemeRedux/Actions';
import { Dispatch } from 'redux';

const sanitizeFileName = (fileName: string) => {
  fileName = fileName.replace(/\s+/g, '_');
  return fileName;
};

const StoringData: any = {};

export const downloadImages = async (data: any, dispatch: Dispatch<any>) => {
  try {
    const fileName = data?.image?.substring(data?.image?.lastIndexOf('/') + 1);
    const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/${sanitizeFileName(
      fileName,
    )}`;
    const imageExists = await RNFetchBlob.fs.exists(filePath);
    if (imageExists) {
      StoringData['popupImage'] = `file://${filePath}`;
    } else {
      await RNFetchBlob.config({
        fileCache: true,
        path: filePath,
      })
        .fetch('GET', data?.image, {
          'Content-Type': 'image/png', // Correct content type for PNG images
          // Add headers or other configurations if required
        })
        .then(res => {
          StoringData['popupImage'] = `file://${res.path()}`;
        })
        .catch(err => {
          console.log(err, 'image Download error');
          dispatch(setDownloadedImage({}));
        });
    }
    dispatch(setDownloadedImage(StoringData));
  } catch (error) {
    console.log('ERRRR', error);
    dispatch(setDownloadedImage({}));
  }
};
