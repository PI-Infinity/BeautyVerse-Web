import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { MdOutlineCloseFullscreen } from 'react-icons/md';
import { IoMdArrowDropright, IoMdArrowDropleft } from 'react-icons/io';
import { FiSend } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { FcDeleteRow } from 'react-icons/fc';
import { navigate } from 'react-router-dom';
import { AddReview } from '../../../pages/main/feedCard/addReview';
import { ReviewList } from '../../../pages/main/feedCard/reviewList';
import { setFromReviews } from '../../../redux/feed';
import {
  setDoc,
  doc,
  collection,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  deleteField,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { ImagesSide } from '../../../src-marketplace/pages/product/imagesSide';
import {
  InfoSide,
  BottomSection,
} from '../../../src-marketplace/pages/product/infoSide';
import { v4 } from 'uuid';
import { setImgNumber, setOpenFeed } from '../../../redux/feed';
import { setRerender } from '../../../redux/main';
import Loader from 'react-js-loader';
import { db, storage } from '../../../firebase';
import useWindowDimensions from '../../../functions/dimensions';
import { BsFillArrowUpCircleFill } from 'react-icons/bs';
import { IsMobile } from '../../../functions/isMobile';
import { Spinner } from '../../../components/loader';

const Product = (props) => {
  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  const [loading, setLoading] = useState(true);

  const rerender = useSelector((state) => state.storeMain.rerender);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { Id, ShopId } = useParams();

  // import current user & parse it
  const currentuser = useSelector(
    (state) => state.storeMain?.user?.length > 0 && state.storeMain?.user
  );

  //redux states
  const [product, setProduct] = useState([]);
  // remove confirming window
  const [confirm, setConfirm] = useState('');

  const [images, setImages] = useState([]);
  const [mainImg, setMainImg] = useState(0);

  // add review to firebase
  const [reviewText, setReviewText] = React.useState('');

  //get user products from firestore
  const fnc = async () => {
    const docRef = doc(db, 'users', `${ShopId}`, 'products', `${Id}`);
    const product = await getDoc(docRef);
    if (product.exists()) {
      if (product.data().status !== 'Published' && ShopId !== currentuser?.id) {
        navigate('/');
      }
      if (product.exists()) {
        setProduct(product.data());
        if (product?.data()?.images != undefined) {
          setImages(product.data().images.reverse());
          setMainImg(0);
        }
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
      }
    }
  };

  React.useEffect(() => {
    fnc();
  }, [rerender, loading === true]);
  // if product not published defend by visit user

  /**
   *  Add image to firebase
   */

  async function FileConverter(file) {
    //create id
    let imgId = Id + v4();
    // check file
    if (file == null) return;
    // add in cloud
    const imageRef = await ref(
      storage,
      `images/${ShopId}/products/${Id}/${imgId}`
    );
    await uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        updateDoc(doc(db, 'users', `${ShopId}`, 'products', Id), {
          images: arrayUnion({
            id: imgId,
            name: file.name,
            alt: file.name,
            url: url,
          }),
        });
      });
    });
    setLoading(true);
    dispatch(setRerender());
  }

  // remove image from firebase

  async function RemoveImg(itm) {
    // add in cloud
    const imageRef = await ref(
      storage,
      `images/${ShopId}/products/${Id}/${itm?.id}`
    );

    // Delete the file
    if (imageRef != undefined) {
      await deleteObject(imageRef)
        .then(() => {
          // File deleted successfully
        })
        .catch((error) => {
          console.log(error);
        });
    }
    await updateDoc(doc(db, 'users', `${ShopId}`, 'products', Id), {
      images: arrayRemove(itm),
    });
    dispatch(setRerender());
  }

  /** delete product from firestore and cloud */

  const Deleting = async (deleteItem) => {
    /** delete from firestore
     */
    const coll = collection(db, `users/${ShopId}/products/`);
    setConfirm('');
    if (coll !== undefined) {
      await deleteDoc(doc(coll, `${deleteItem}`));
      /** delete from cloude
       */
      // Create a reference to the file to delete
      const desertRef = await ref(
        storage,
        `images/${ShopId}/products/${deleteItem}/`
      );
      // Delete the file
      if (deleteItem?.length > 0 && deleteItem != undefined) {
        await deleteObject(desertRef)
          .then(() => {
            // File deleted successfully
            dispatch(setRerender());
            navigate(`/user/${ShopId}`);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    // window.location.reload();
  };

  /**
   * Edit fields
   */

  const [editField, setEditField] = useState(null);

  setTimeout(() => {
    setLoading(false);
  }, 500);

  return (
    <>
      {confirm?.length > 0 && (
        <Confirm>
          <ConfirmCont>
            <ConfirmText>Are you sure to delete this Product?</ConfirmText>
            <Answers>
              <Answer name="no" onClick={() => setConfirm('')}>
                Cancel
              </Answer>
              <Answer name="yes" onClick={() => Deleting(confirm)}>
                Delete
              </Answer>
            </Answers>
          </ConfirmCont>
        </Confirm>
      )}
      <Container height={height} loading={loading.toString()}>
        {loading ? (
          <Spinner />
        ) : (
          <Content>
            <Wrapper>
              <ImagesSide
                images={images}
                FileConverter={FileConverter}
                mainImg={mainImg}
                setMainImg={setMainImg}
                RemoveImg={RemoveImg}
                ShopId={ShopId}
                currentuser={currentuser}
              />
              <InfoSide
                images={images}
                setConfirm={setConfirm}
                product={product}
                ShopId={ShopId}
                editField={editField}
                setEditField={setEditField}
                currentuser={currentuser}
                Id={Id}
                setLoading={setLoading}
              />
            </Wrapper>
            <BottomSection
              product={product}
              ShopId={ShopId}
              editField={editField}
              setEditField={setEditField}
              currentuser={currentuser}
              Id={Id}
            />
          </Content>
        )}
      </Container>
    </>
  );
};

export default Product;

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
  height: 100vh;
  min-height: 85vh;
  padding: 3vw 0;
  z-index: 10001;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    justify-content: ${(props) =>
      props.loading === 'true' ? 'center' : 'start'};
    overflow-y: scroll;
    padding: 0;
    height: 80vh;
    min-height: ${(props) => props.height}px;
    // background: rgba(255, 255, 255, 1);
    background: #f3f3f3;
    backdrop-filter: blur(40px);
  }
`;

const Content = styled.div`
  opacity: ${(props) => (props.loading ? '0' : '1')};
  transition: ease-in-out 300ms;
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding: 3vw 0vw;
  box-sizing: border-box;
  overflow-x: hidden;

  @media only screen and (max-width: 621px) {
    margin-top: 10vw;
    width: 100vw;
    height: auto;
    flex-direction: column;
    align-items: center;
    padding: 10vw 5vw 5vw 5vw;
  }
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  // overflow-y: scroll;

  @media only screen and (max-width: 600px) {
    width: 90vw;
    height: auto;
    flex-direction: column;
    align-items: start;
  }
`;
