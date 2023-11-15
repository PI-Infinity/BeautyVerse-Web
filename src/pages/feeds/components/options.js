import React, { useEffect, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { TextEditor } from '../addFeed/textEditor';
import axios from 'axios';
import { Button } from '@mui/material';
import { BounceLoader } from 'react-spinners';
import { setFeeds, setRerenderUserFeeds } from '../../../redux/feeds';
import { storage } from '../../../firebase';
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { DeleteForever } from '@material-ui/icons';

export const Options = ({
  openOption,
  setOpenOption,
  width,
  height,
  setItem,
  setOpenFeed,
}) => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();
  // dispatch
  const dispatch = useDispatch();

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // feeds state
  const feeds = useSelector((state) => state.storeFeeds.feeds);

  // loading when updating
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // post new text
  const [text, setText] = useState('');

  // transition
  const [transition, setTransition] = useState(true);
  useEffect(() => {
    if (openOption?.data?.post?.original) {
      setText(openOption?.data?.post?.original);
    }

    setTransition(false);
  }, []);

  // update post
  const UpdatePost = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(
        backendUrl + `/api/v1/feeds/${openOption?.data?._id}`,
        {
          post: text,
        }
      );
      if (setItem) {
        const updatedFeed = { ...openOption.data, post: { original: text } };
        console.log(updatedFeed);
        setItem(updatedFeed);
      }
      // const updatedFeeds = feeds.map((feed) => {
      //   if (feed._id === openOption.data._id) {
      //     return { ...feed, post: { original: text } };
      //   } else {
      //     return feed; // Return the original feed if it doesn't match the condition
      //   }
      // });

      // dispatch(setFeeds(updatedFeeds));
      setTransition(true);
      dispatch(setRerenderUserFeeds());
      setTimeout(() => {
        setLoading(false);
        setOpenOption(null);
      }, 300);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /*
   * Delete post
   */
  const Deleting = async () => {
    setDeleteLoading(true);

    // Create a reference to the file to delete
    let fileRef;
    if (openOption?.data?.fileFormat === 'video') {
      fileRef = ref(
        storage,
        `videos/${currentUser?._id}/feeds/${openOption?.data?.name}/`
      );
    } else {
      fileRef = ref(
        storage,
        `images/${currentUser?._id}/feeds/${openOption?.data?.name}`
      );
    }

    // remove feed from DB
    try {
      const url = backendUrl + `/api/v1/feeds/${openOption?.data?._id}`;
      const resp = await axios.delete(url);

      if (resp) {
        // Delete the file from cloud
        if (openOption?.data?.fileFormat === 'video') {
          deleteObject(fileRef).then(() => {
            setTransition(true);
            setOpenFeed(false);
            dispatch(setRerenderUserFeeds());
            setTimeout(() => {
              setDeleteLoading(false);
              setOpenOption(null);
              navigate('/profile/feeds');
            }, 300);
          });
        } else {
          listAll(fileRef)
            .then((res) => {
              res.items.forEach((itemRef) => {
                deleteObject(itemRef).then(() => {
                  setTransition(true);
                  setOpenFeed(false);
                  dispatch(setRerenderUserFeeds());
                  setTimeout(() => {
                    setDeleteLoading(false);
                    setOpenOption(null);
                    navigate('/profile/feeds');
                  }, 300);
                });
              });
            })
            .catch((error) => {
              console.log('error : ' + error);
            });
        }
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        background: 'rgba(1, 2, 12, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1001,
        height: height,
        width: width,
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container transition={transition ? 'true' : 'false'}>
        <h3 style={{ color: '#888', letterSpacing: '0.5px' }}>
          {openOption?.data?.owner?._id === currentUser._id
            ? 'Options'
            : 'Reports'}
        </h3>
        <Button
          variant="contained"
          style={{
            backgroundColor: loading ? '#ccc' : 'rgba(255,255,255,0.1)',
            color: 'red',
            position: 'absolute',
            top: '10px',
            right: '10px',
          }}
          className="button"
          sx={{
            width: '10%',
            borderRadius: '50px',
          }}
          onClick={Deleting}
        >
          {deleteLoading ? (
            <BounceLoader color={'#f866b1'} loading={deleteLoading} size={20} />
          ) : (
            <DeleteForever />
          )}
        </Button>
        {openOption?.data?.owner?._id === currentUser._id && (
          <>
            <TextEditor text={text} setText={setText} />
            <Button
              variant="contained"
              style={{
                backgroundColor: loading ? '#ccc' : '#f866b1',
                color: 'white',
              }}
              className="button"
              sx={{
                width: '40%',
                borderRadius: '50px',
                marginTop: '10px',
                height: '40px',
              }}
              onClick={UpdatePost}
              //   {...props}
            >
              {loading ? (
                <BounceLoader color={'#f866b1'} loading={loading} size={20} />
              ) : (
                'Save'
              )}
            </Button>

            <div>Delete Feed</div>
          </>
        )}
      </Container>
    </div>
  );
};

const Container = styled.div`
  z-index: 1000;
  background: rgba(1, 2, 12, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: ease-in 200ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${(props) => (props.transition === 'false' ? '1' : '0')};
  transform: scale(${(props) => (props.transition === 'false' ? '1' : '0')});
  //   overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 20px;
  width: 97%;
  height: 97%;
`;
