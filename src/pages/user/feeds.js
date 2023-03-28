import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlineDelete } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase';
import useWindowDimensions from '../../functions/dimensions';
import { IsMobile } from '../../functions/isMobile';
import { useNavigate } from 'react-router-dom';
import { HiOutlineViewGridAdd } from 'react-icons/hi';
import { useOutletContext } from 'react-router-dom';
import { isWebpSupported } from 'react-image-webp/dist/utils';
import AlertDialog from '../../components/dialog';
import { Language } from '../../context/language';
import { Spinner } from '../../components/loader';

export const UserFeeds = () => {
  const language = Language();
  const [loading, setLoading] = useState(true);
  const [targetUser] = useOutletContext();
  const isMobile = IsMobile();
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // alert dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [feedData, setFeedData] = useState('');

  // current user info from redux
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  const [render, setRender] = useState(false);

  // remove confirming window
  const [confirm, setConfirm] = useState('');
  const [feeds, setFeeds] = useState('');
  useEffect(() => {
    async function GetUser(userId) {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${userId}/feeds`
      )
        .then((response) => response.json())
        .then((data) => {
          setFeeds(data.data.feeds);
        })
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
    }
    if (targetUser) {
      GetUser(targetUser?._id);
    }
  }, [targetUser, render]);

  /** after getting files from firestore define list */
  const DefineList = (gall) => {
    if (gall?.length > 0 && currentUser?.type !== 'user') {
      let list = gall
        ?.sort((a, b) => {
          return b?.addTime?.seconds - a?.addTime?.seconds;
        })
        .map((item, index) => {
          return (
            <GalleryImg key={index}>
              {currentUser?._id === currentUser?._id && (
                <div
                  style={{ height: 0, display: 'flex', justifyContent: 'end' }}
                >
                  <RemoveIconContainer
                    onClick={() => {
                      setOpenDialog(true);
                      setFeedData({
                        id: item._id,
                        name: item.name,
                        fileFormat: item.fileFormat,
                      });
                    }}
                  >
                    <AiOutlineDelete className="removeIcon" />
                  </RemoveIconContainer>
                  <AlertDialog
                    title={language?.language.User.userPage.removeTitle}
                    open={openDialog}
                    setOpen={setOpenDialog}
                    text={language?.language.User.userPage.removeText}
                    function={() =>
                      Deleting(
                        feedData?.id,
                        feedData?.name,
                        feedData?.fileFormat
                      )
                    }
                    language={language}
                  />
                </div>
              )}
              {item.fileFormat === 'video' ? (
                <Video
                  width="100%"
                  height="auto"
                  controls
                  onClick={() =>
                    navigate(
                      `/api/v1/users/${currentUser?._id}/feeds/${item?._id}/profile`
                    )
                  }
                >
                  <source src={item?.videoUrl} type="video/mp4" />
                </Video>
              ) : (
                <>
                  {isMobile ? (
                    isWebpSupported() ? (
                      <Img
                        src={item?.mobileWebp}
                        alt="item"
                        style={{ zIndex: 5 }}
                        onClick={() =>
                          navigate(
                            `/api/v1/users/${currentUser?._id}/feeds/${item?._id}/profile`
                          )
                        }
                      />
                    ) : (
                      <Img
                        src={item?.mobileJpeg}
                        alt="item"
                        style={{ zIndex: 5 }}
                        onClick={() =>
                          navigate(
                            `/api/v1/users/${currentUser?._id}/feeds/${item?._id}/profile`
                          )
                        }
                      />
                    )
                  ) : (
                    <Img
                      src={item?.desktopUrl}
                      alt="item"
                      style={{ zIndex: 5 }}
                      onClick={() =>
                        navigate(
                          `/api/v1/users/${currentUser?._id}/feeds/${item?._id}/profile`,
                          {
                            state: {
                              data: item,
                              targetUser: targetUser,
                            },
                          }
                        )
                      }
                    />
                  )}
                </>
              )}
            </GalleryImg>
          );
        });
      return list;
    }
  };

  const list = DefineList(feeds);

  /** delete image from firestore and cloud */
  const Deleting = async (itemId, itemName, itemFormat) => {
    const values = [];
    /** delete from mongodb
     */
    // remove feed
    const url = `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/feeds/${itemId}`;
    const response = await fetch(url, { method: 'DELETE' })
      .then((response) => response.json())
      .then(async (data) => {
        setRender(!render);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });

    /** delete from cloude
     */
    // Create a reference to the file to delete
    let fileRef;
    if (itemFormat === 'video') {
      fileRef = ref(storage, `videos/${currentUser?._id}/feeds/${itemName}/`);
    } else {
      fileRef = ref(storage, `images/${currentUser?._id}/feeds/${itemName}/`);
    }

    // Delete the file
    if (itemFormat === 'video') {
      deleteObject(fileRef).then(() => {
        console.log('object deleted');
      });
    } else {
      listAll(fileRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            deleteObject(itemRef).then(() => {
              console.log('storage success');
            });
          });
        })
        .catch((error) => {
          console.log('error : ' + error);
        });
    }
    // window.location.reload();
  };

  setTimeout(() => {
    setLoading(false);
  }, 300);

  return (
    <>
      {loading ? (
        <Container
          height={height}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner />
        </Container>
      ) : (
        <Container height={height}>
          <Content listLength={list?.length}>
            {currentUser?._id === currentUser?._id &&
              currentUser?.type != 'user' && (
                <GalleryImg
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => navigate('/add')}
                >
                  <HiOutlineViewGridAdd id="add" />
                </GalleryImg>
              )}
            {list?.length > 0 == true ? list : ''}
          </Content>
        </Container>
      )}
    </>
  );
};

const Confirm = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: rgba(2, 2, 2, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: ease-in-out 300ms;
`;

const ConfirmCont = styled.div`
  width: 50%;
  height: 20vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap 3vw;

  animation: fadeIn 0.25s;
  -webkit-animation: fadeIn 0.25s;
  -moz-animation: fadeIn 0.25s;
  -o-animation: fadeIn 0.25s;
  -ms-animation: fadeIn 0.25s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 600px) {
    width: 80vw;
    height: 50vw;
    border-radius: 1.5vw;
    gap: 6vw;
  }
`;

const ConfirmText = styled.h2`
  @media only screen and (max-width: 600px) {
    font-size: 3.6vw;
  }
`;

const Answers = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 20vw;

  @media only screen and (max-width: 600px) {
    width: 60vw;
  }
`;

const Answer = styled.div`
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  background: ${(props) => (props.name != 'yes' ? '#35B453' : '#de4360')};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8vw;
  height: 2vw;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    width: 25vw;
    height: 7vw;
    border-radius: 1.5vw;
  }

  :hover {
    filter: ${(props) =>
      props.name === 'yes' ? 'brightness(1.05)' : 'brightness(0.95)'};
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 29vw;
  padding-bottom: 5vw;

  @media only screen and (max-width: 600px) {
    height: calc(${(props) => props.height}px - 60vw);
    box-sizing: border-box;
    padding: 2vw 4vw;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 0.3vw;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.secondLevel};
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #1e1e1e;
  }
`;

// const AddImg = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 14vw;
//   height: 14vw;
//   border: 0.25vw solid #fff;
//   border-radius: 0.5vw;

//   @media only screen and (max-width: 600px) {
//     width: 27vw;
//     height: 27vw;
//     border-radius: 1.5vw;
//     border: 0.75vw solid #fff;
//   }

//   .uploaderIcon {
//     font-size: 5vw;
//     color: #ccc;
//     position: relative;
//     left: 5vw;

//     @media only screen and (max-width: 600px) {
//       font-size: 12vw;
//       left: 2vw;
//     }
//   }
// `;

const Content = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 1.5vw;
  width: 100%;
  height: 100%;
  min-height: 50vh;
  flex-wrap: wrap;
  gap: 0.5vw;
  height: auto;
  margin-bottom: 7vw;

  @media only screen and (max-width: 600px) {
    min-height: auto;
    gap: 2vw;
    padding-left: 1vw;
  }

  .loadingIcon {
    font-size: 3vw;
  }
`;

const GalleryImg = styled.div`
  width: 14vw;
  height: 14vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  overflow: hidden;
  border: 0.15vw solid ${(props) => props.theme.frameColor};
  cursor: pointer;

  animation: fadeIn 1s;
  -webkit-animation: fadeIn 1s;
  -moz-animation: fadeIn 1s;
  -o-animation: fadeIn 1s;
  -ms-animation: fadeIn 1s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 600px) {
    width: 28vw;
    height: 28vw;
    border-radius: 1.5vw;
    border: 0.25vw solid ${(props) => props.theme.frameColor};
  }

  :hover {
    filter: brightness(0.99);
  }

  #add {
    font-size: 3.5vw;
    color: #ccc;
    @media only screen and (max-width: 600px) {
      font-size: 9vw;
    }
  }
`;

const RemoveIconContainer = styled.div`
  background: rgba(2, 2, 2, 0.5);
  width: 2vw;
  height: 2vw;
  z-index: 6;
  position: relative;
  right: 0.5vw;
  top: 0.5vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  transition: ease-in-out 200ms;

  @media only screen and (max-width: 600px) {
    width: 6vw;
    height: 6vw;
    top: 1.5vw;
    right: 1.5vw;
  }

  :hover {
    background: rgba(2, 2, 2, 0.2);
  }

  .removeIcon {
    font-size: 1.2vw;
    color: #fff;
    transition: ease-in-out 200ms;

    @media only screen and (max-width: 600px) {
      font-size: 3.6vw;
    }

    :hover {
      color: #de4360;
    }
  }
`;

const Img = styled.img`
  object-fit: cover;
  width: 14vw;
  height: 14vw;
  position: relative;
  z-index: 5;
  background: #f6f7ff;

  @media only screen and (max-width: 600px) {
    width: 28vw;
    height: 28vw;
    border-radius: 1.5vw;
  }
`;

const Video = styled.video`
  width: 14vw;
  height: 14vw;
  position: relative;
  z-index: 5;
  background: #050505;

  @media only screen and (max-width: 600px) {
    width: 28vw;
    height: 28vw;
    border-radius: 1.5vw;
  }
`;

const LoadingContainer = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
