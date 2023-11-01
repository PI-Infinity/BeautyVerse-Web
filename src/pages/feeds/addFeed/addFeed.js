import React, { useEffect, useRef, useState } from 'react';
import Headroom from 'react-headroom';
import styled from 'styled-components';
import { Header } from './header';
import { TextEditor } from './textEditor';
import ReactPlayer from 'react-player';
import { BiSolidImage, BiSolidVideos } from 'react-icons/bi';
import { GiFiles } from 'react-icons/gi';
import { DeleteForever } from '@material-ui/icons';
import { MdDelete } from 'react-icons/md';
import { storage } from '../../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import SimpleBackdrop from '../../../components/backDrop';
import { useNavigate } from 'react-router-dom';
import { setRerenderUserFeeds } from '../../../redux/feeds';
import { UploadFile } from '@mui/icons-material';
import { UploaderPercentage } from './uploaderPercentage';
import { Backdrop } from '@mui/material';

const AddFeed = () => {
  // page animation transition
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    setTransition(true);
    window.scrollTo(0, 0);
  }, []);

  // loading
  const [loading, setLoading] = useState(false);

  // dispatch
  const dispatch = useDispatch();

  // navigate
  const navigate = useNavigate();

  // current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // text
  const [text, setText] = useState('');

  /**
   * file upload
   */

  // gallery
  const [files, setFiles] = useState([]);
  // upload porgress state
  const [uploadProgress, setUploadProgress] = useState(0);

  // cancel uploading
  const uploadTaskRef = useRef(null);

  const cancelUpload = () => {
    if (uploadTaskRef.current) {
      uploadTaskRef.current.cancel();
    }
  };

  const [activeFile, setActiveFile] = useState(1);

  const handleFileUpload = async (e) => {
    const uploadedFiles = e.target.files;
    const processedFiles = [];

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];

      if (file.type.startsWith('image/')) {
        // If it's an image file, apply image-specific resizing
        const resizedFile = await resizeImage(file, maxWidth, quality);
        processedFiles.push(resizedFile);
      } else if (file.type.startsWith('video/')) {
        // If it's a video file, get its width and height
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);

        const videoMetadataPromise = new Promise((resolve) => {
          video.onloadedmetadata = () => {
            const width = video.videoWidth;
            const height = video.videoHeight;

            // Create an object that includes the video file, height, and width
            const resizedVideoFile = {
              blob: file,
              height,
              width,
              src: video.src,
            };
            resolve(resizedVideoFile);
          };
        });

        const videoMetadata = await videoMetadataPromise;
        console.log(videoMetadata);
        processedFiles.push(videoMetadata);
      }
    }

    setFiles([...files, ...processedFiles]);
  };

  // Example usage:
  const maxWidth = 1080; // Desired width
  const quality = 0.8; // Image quality (0.0 to 1.0)

  const resizeImage = (file, maxWidth, quality) =>
    new Promise(async (resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          const width = maxWidth;
          const height = (width * image.height) / image.width;

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          canvas.width = width;
          canvas.height = height;

          // Draw the image on the canvas
          ctx.drawImage(image, 0, 0, width, height);

          // Convert the canvas content to a blob with the specified quality
          canvas.toBlob(
            (blob) => {
              // Create an object that includes the Blob, height, and width
              const resizedFile = {
                blob: blob,
                height: height,
                width: width,
              };
              resolve(resizedFile);
            },
            file.type,
            quality
          );
        };
      };
    });

  const scrollRef = useRef();

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  async function FileUpload() {
    if (files?.length < 1) {
      return alert('File not include!');
    }

    setLoading(true);

    const AddFileInCloud = async (index, folder, file) => {
      let imgId = currentUser.name + v4();
      let fileRef = ref(
        storage,
        `images/${currentUser?._id}/feeds/${folder}/${imgId}/`
      );

      if (fileRef) {
        // add desktop version
        const snapshot = await uploadBytesResumable(fileRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return { url: url };
      }
    };

    // check file
    if (files[0].blob && !files[0]?.blob.type.includes('video')) {
      let folderId = currentUser.name + v4();

      const uploadPromises = files.map((_, index) =>
        AddFileInCloud(index, folderId, files[index].blob)
      );

      let w = -1; // Initialize with a low value for width
      let h = -1; // Initialize with a low value for height

      // Assuming you have an array of files with 'height' and 'width' properties
      for (const item of files) {
        if (item.height > h) {
          h = item.height;
        }

        if (item.width > w) {
          w = item.width;
        }
      }

      Promise.all(uploadPromises).then(async (uploadedUrls) => {
        try {
          const newFeed = {
            images: uploadedUrls,
            name: folderId,
            createdAt: new Date().toISOString(),
            post: text,
            fileFormat: 'img',
            fileHeight: h,
            fileWidth: w,
            owner: currentUser._id,
          };
          await axios.post(backendUrl + `/api/v1/feeds`, newFeed);
          await axios.patch(backendUrl + `/api/v1/users/${currentUser?._id}`, {
            lastPostCreatedAt: new Date(),
          });
          setTimeout(() => {
            dispatch(setRerenderUserFeeds());
          }, 1000);
          setTimeout(async () => {
            navigate('/profile/feeds');
            setFiles([]);
            setText('');
            setLoading(false);
          }, 2000);
        } catch (error) {
          console.error(error.response.data.message);
          setTimeout(async () => {
            setLoading(false);
          }, 2000);
        }
      });
    } else if (files[0] && files[0]?.blob.type.includes('video')) {
      let videoId = currentUser?.name + 'video' + v4();

      let videosRef = ref(
        storage,
        `videos/${currentUser?._id}/feeds/${videoId}/`
      );

      const uploadTask = uploadBytesResumable(videosRef, files[0].blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);

          try {
            const newFeed = {
              video: url,
              name: videoId,
              createdAt: new Date().toISOString(),
              post: text,
              fileFormat: 'video',
              fileHeight: files[0].height,
              fileWidth: files[0].width,
              owner: currentUser._id,
            };

            const response = await axios.post(
              backendUrl + `/api/v1/feeds`,
              newFeed
            );

            await axios.patch(
              backendUrl + `/api/v1/users/${currentUser?._id}`,
              {
                lastPostCreatedAt: new Date(),
              }
            );

            setTimeout(() => {
              dispatch(setRerenderUserFeeds());
            }, 1000);

            setTimeout(async () => {
              navigate('/profile/feeds');
              setFiles([]);
              setText('');
              setLoading(false);
            }, 3000);
          } catch (error) {
            console.error(error.response.data.message);
            setTimeout(async () => {
              setLoading(false);
            }, 3000);
          }
        }
      );
    }
  }

  return (
    <>
      {loading && files[0]?.blob.type?.includes('video') && (
        <UploaderPercentage
          loading={loading}
          setLoading={setLoading}
          setFile={setFiles}
          progress={uploadProgress}
          setProgress={setUploadProgress}
          cancelUpload={cancelUpload}
        />
      )}
      {files[0]?.blob.type?.includes('image') && (
        <SimpleBackdrop open={loading} setOpen={setLoading} />
      )}
      <Headroom downTolerance={10} upTolerance={10} styles={{ zIndex: 1000 }}>
        <Header user={currentUser} />
      </Headroom>
      <Container transition={transition ? 'true' : 'false'}>
        <TextEditor text={text} setText={setText} />
        <div
          style={{
            width: '90%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '50%',
              boxSizing: 'border-box',
              color: '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '50px',
              margin: '15px 0 0 0',
            }}
          >
            <label
              htmlFor="image-upload"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                color: '#ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '50px',
                background: 'rgba(255,255,255,0.1)',
                padding: '8px 15px',
                cursor: 'pointer',
              }}
            >
              <BiSolidImage size={18} color={'#ccc'} />
              Image
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
                multiple
                max="10"
              />
            </label>
          </div>
          <div
            style={{
              width: '50%',
              boxSizing: 'border-box',
              color: '#ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '50px',
              margin: '15px 0 0 0',
            }}
          >
            <label
              htmlFor="video-upload"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                color: '#ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                borderRadius: '50px',
                background: 'rgba(255,255,255,0.1)',
                padding: '8px 15px',
                cursor: 'pointer',
              }}
            >
              <BiSolidVideos size={18} color={'#ccc'} />
              Video
              <input
                type="file"
                id="video-upload"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div
            ref={scrollRef}
            style={{
              width: '90vw',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '20px',
              margin: '15px 0 0 0',
              display: 'flex',
              boxSizing: 'border-box',
              overflowX: files?.length > 1 ? 'scroll' : 'hidden',
              overflowY: 'hidden',
            }}
          >
            {files?.length > 1 && (
              <div>
                <GiFiles
                  color="#ccc"
                  size={24}
                  style={{ position: 'absolute', margin: '15px 0 0 15px' }}
                />
              </div>
            )}
            {uploadProgress === 0 &&
              files.map((file, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      zIndex: 100,
                      padding: '5px 15px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      onClick={() => setFiles(files?.filter((i) => i !== file))}
                      style={{
                        width: '25px',
                        height: '25px',
                        padding: '5px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <MdDelete color="red" size={20} style={{}} />
                    </div>
                  </div>

                  {file.blob.type.startsWith('image/') ? ( // Check if it's an image
                    <img
                      src={URL.createObjectURL(file.blob)}
                      alt={`Image ${index}`}
                      style={{
                        width: '90vw',
                        height: 'auto',
                      }}
                    />
                  ) : (
                    // It's a video
                    <ReactPlayer
                      url={URL.createObjectURL(file.blob)}
                      controls={true}
                      loop={true}
                      muted={true}
                      playing={true}
                      playsinline={true}
                      width="90vw"
                      height="auto"
                    />
                  )}
                </div>
              ))}
          </div>
        )}
        {files?.length > 0 && (
          <div
            style={{
              width: '40%',
              boxSizing: 'border-box',
              color: '#fff',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '50px',
              background: '#f866b1',
              padding: '8px 15px',
              margin: '15px 0 0 0',
              cursor: 'pointer',
            }}
            onClick={FileUpload}
          >
            Upload
          </div>
        )}
      </Container>
    </>
  );
};

export default AddFeed;

const Container = styled.div`
  min-height: 100vh;
  padding-bottom: 100px;
  overflow: hidden;
  position: relative;
  right: ${(props) => (props.transition === 'true' ? 0 : '-100vw')};
  opacity: ${(props) => (props.transition === 'true' ? '1' : '0')};
  transition: ease-in-out 200ms;
  display: flex;
  flex-direction: column;
  align-items: center;

  ::-webkit-scrollbar {
    display: none !important;
  }
`;
