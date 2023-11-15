import React, { useEffect, useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropleft } from 'react-icons/io';
import styled from 'styled-components';
import { Input } from './input';
import { BounceLoader } from 'react-spinners';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  MdContentCopy,
  MdDelete,
  MdPriceChange,
  MdRemove,
  MdVisibility,
  MdVisibilityOff,
} from 'react-icons/md';
import axios from 'axios';
import { setRerenderProducts } from '../../redux/showroom';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { storage } from '../../firebase';
import { Configs } from './deleteConfirm';
import { Language } from '../../context/language';
import { v4 as uuidv4 } from 'uuid';
import SimpleBackdrop from '../../components/backDrop';
import { CategoriesOptions } from '../../datas/productCategories';
import CategoryList from './categoryList';
import { BiSolidImage } from 'react-icons/bi';
import { GiFiles } from 'react-icons/gi';
import ReactPlayer from 'react-player';
import { v4 } from 'uuid';
import Variants from './productVariants';

export const EditProduct = ({
  openEditProduct,
  setOpenEditProduct,
  setList,
}) => {
  // dispatch
  const dispatch = useDispatch();

  // language
  const language = Language();

  // transition
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

  // current user redux state
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const [currency, setCurrency] = useState(currentUser?.currency);

  const lang = useSelector((state) => state.storeApp.language);
  // language activator
  const [inputLanguage, setInputLanguage] = useState(
    lang === 'en' ? 'us' : lang === 'ka' ? 'ge' : 'ru'
  );

  // loading when adding product
  const [loading, setLoading] = useState(false);
  // input states
  const [active, setActive] = useState(
    openEditProduct?.product?.active || false
  );
  const [title, setTitle] = useState(openEditProduct?.product?.title || '');
  const [categories, setCategories] = useState(
    openEditProduct?.product?.categories || []
  );
  const [type, setType] = useState(
    openEditProduct?.product?.type || 'everyone'
  );
  const [brand, setBrand] = useState(openEditProduct?.product?.brand || '');
  const [price, setPrice] = useState(openEditProduct?.product?.price || null);
  const [sale, setSale] = useState(openEditProduct?.product?.sale || null);
  const [inStock, setInStock] = useState(
    openEditProduct?.product?.inStock || ''
  );
  const [sex, setSex] = useState(openEditProduct?.product?.sex || 'all');
  const [shortDescription, setShortDescription] = useState(
    openEditProduct?.product?.shortDescription?.en || ''
  );
  const [shortDescriptionRu, setShortDescriptionRu] = useState(
    openEditProduct?.product?.shortDescription?.ru || ''
  );
  const [shortDescriptionKa, setShortDescriptionKa] = useState(
    openEditProduct?.product?.shortDescription?.ka || ''
  );
  const [fullDescription, setFullDescription] = useState(
    openEditProduct?.product?.description?.en || ''
  );
  const [fullDescriptionRu, setFullDescriptionRu] = useState(
    openEditProduct?.product?.description?.ru || ''
  );
  const [fullDescriptionKa, setFullDescriptionKa] = useState(
    openEditProduct?.product?.description?.ka || ''
  );
  const [howToUse, setHowToUse] = useState(
    openEditProduct?.product?.howToUse?.en || ''
  );
  const [howToUseRu, setHowToUseRu] = useState(
    openEditProduct?.product?.howToUse?.ru || ''
  );
  const [howToUseKa, setHowToUseKa] = useState(
    openEditProduct?.product?.howToUse?.ka || ''
  );
  const [compositons, setCompositions] = useState(
    openEditProduct?.product?.compositons?.en || ''
  );
  const [compositonsRu, setCompositionsRu] = useState(
    openEditProduct?.product?.compositons?.ru || ''
  );
  const [compositonsKa, setCompositionsKa] = useState(
    openEditProduct?.product?.compositons?.ka || ''
  );
  const [variants, setVariants] = useState(
    openEditProduct?.product?.variants || []
  );
  const [files, setFiles] = useState(openEditProduct?.product?.gallery || []);
  const [cover, setCover] = useState(openEditProduct?.product?.cover || 0);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Active product
   */
  const ActiveProduct = async (value) => {
    try {
      setActive(value);
      await axios.patch(
        backendUrl + '/api/v1/marketplace/' + openEditProduct?.product?._id,
        {
          active: value,
        }
      );
      dispatch(setRerenderProducts());
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /**
   * Dublicate product
   */
  /**
   * Add product function
   */

  const product = {
    title: openEditProduct?.product?.title + ' (copy)',
    categories: openEditProduct?.product?.categories,
    type: openEditProduct?.product?.type,
    brand: openEditProduct?.product?.brand,
    price: openEditProduct?.product?.price,
    currency: openEditProduct?.product?.currency,
    sale: openEditProduct?.product?.sale,
    inStock: openEditProduct?.product?.inStock,
    sex: openEditProduct?.product?.sex,
    shortDescription: openEditProduct?.product?.shortDescription,
    description: openEditProduct?.product?.description,
    howToUse: openEditProduct?.product?.howToUse,
    compositions: openEditProduct?.product?.compositions,
    variants: openEditProduct?.product?.variants,
    cover: openEditProduct?.product?.cover,
    gallery: openEditProduct?.product?.gallery,
    totalOrders: 0,
    owner: openEditProduct?.product?.owner,
    lastOrderDate: new Date(),
    reviews: [],
  };

  async function duplicateFolder() {
    let folderId = openEditProduct?.product?.gallery[0]?.folder;
    const sourceFolder = `marketplace/${currentUser?._id}/products/images/${folderId}/`;
    let newfolderId = `${currentUser?._id}${title}${brand}${v4()}`;
    const destinationFolder = `marketplace/${currentUser?._id}/products/images/${newfolderId}/`;

    const sourceReference = ref(storage, sourceFolder);
    let listResult;

    try {
      listResult = await listAll(sourceReference);
    } catch (error) {
      console.error('Error listing source folder:', error);
      throw error;
    }

    const newGallery = [];

    const copyPromises = listResult.items.map(async (item) => {
      const sourcePath = `${sourceFolder}${item.name}`;
      const destinationPath = `${destinationFolder}${item.name}`;

      try {
        const url = await getDownloadURL(ref(storage, sourcePath));
        const response = await fetch(url);
        const blob = await response.blob();

        await uploadBytesResumable(ref(storage, destinationPath), blob);
        const newObj = { url: url, imgId: item.name, folder: newfolderId };
        newGallery.push(newObj); // Collect new URLs and meta-data.
        return newObj;
      } catch (error) {
        console.error(`Error copying file ${item.name}:`, error);
        // Handle individual file errors here, if needed
      }
    });

    try {
      await Promise.all(copyPromises);
      console.log('Folder duplicated successfully');
      return newGallery; // Return the new URLs and meta-data.
    } catch (error) {
      console.error('Error during folder duplication:', error);
      throw error; // Throwing the error for higher-level handling.
    }
  }

  const Dublicate = async () => {
    if (files?.length < 1) {
      return alert('The product must have any image!');
    }
    if (title?.length < 3) {
      return alert('Title must include min. 3 symbols!');
    }
    if (categories?.length < 1) {
      return alert('The product must have a category!');
    }
    if (brand?.length < 1) {
      return alert('The product must have a brand!');
    }
    if (price?.length < 1) {
      return alert('The product must have a price!');
    }
    // if (!inStock) {
    //   return Alert.alert("Please add in stock quantity!");
    // }
    if (
      shortDescription?.length < 1 &&
      shortDescriptionKa?.length < 1 &&
      shortDescriptionRu?.length < 1
    ) {
      return alert('Short Description not defined!');
    }
    setLoading(true);

    try {
      const newGallery = await duplicateFolder(); // Await the new URLs from folder duplication.

      // Use the new URLs to create a new product on your backend.
      await axios.post(backendUrl + '/api/v1/marketplace', {
        ...product,
        gallery: newGallery, // Overwrite the gallery with new URLs.
      });

      dispatch(setRerenderProducts());
      setTransition(true);
      setTimeout(() => {
        setOpenEditProduct({ active: false, product: null });
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error(error.response.data.message);
      setTimeout(async () => {
        setLoading(false);
      }, 2000);
    }
  };

  // confirm delete product
  const [confirmPopup, setConfirmPopup] = useState({ active: false });

  const DeleteProduct = async () => {
    try {
      if (openEditProduct?.product?.gallery?.length > 0) {
        const filePath = `marketplace/${currentUser?._id}/products/images/${openEditProduct?.product?.gallery[0].folder}`;
        const fileRef = ref(storage, filePath);

        listAll(fileRef)
          .then((res) => {
            res.items.forEach((itemRef) => {
              deleteObject(itemRef).then(async () => {
                console.log('deleted');
              });
            });
          })
          .catch((error) => {
            console.log('error : ' + error);
          });
      }
      await axios.delete(
        backendUrl + '/api/v1/marketplace/' + openEditProduct?.product?._id
      );

      setList((prev) =>
        prev.filter((i) => i._id !== openEditProduct?.product?._id)
      );
      setTransition(true);
      setTimeout(() => {
        setOpenEditProduct({ active: false, product: null });
      }, 300);
    } catch (error) {
      console.error('Delete Product Error:', error);
      console.log(
        error.response?.data.message ||
          'An error occurred while deleting the product.'
      );
    }
  };

  // open categories list
  const [openCategories, setOpenCategories] = useState(false);

  // categories list of app
  const categoriesList = CategoriesOptions();

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
  const maxWidth = 640; // Desired width
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

  // if delete old files, this function checks and deletes from cloud.
  const func = async () => {
    const filePath = `marketplace/${currentUser?._id}/products/images/${openEditProduct.product.gallery[0].folder}`;
    const fileRef = ref(storage, filePath);

    listAll(fileRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          let imgId =
            itemRef._location.path_.split('/')[
              itemRef._location.path_.split('/')?.length - 1
            ];
          console.log(imgId);
          let imgDefined = files.find((i) => i.imgId === imgId);
          if (!imgDefined) {
            deleteObject(itemRef).then(async () => {
              console.log('deleted');
            });
          }
        });
      })
      .catch((error) => {
        console.log('error : ' + error);
      });
  };

  /**
   * Add product function
   */

  const UploadProduct = async () => {
    if (files?.length < 1) {
      return alert('The product must have any image!');
    }
    if (title?.length < 3) {
      return alert('Title must include min. 3 symbols!');
    }
    if (categories?.length < 1) {
      return alert('The product must have a category!');
    }
    if (brand?.length < 1) {
      return alert('The product must have a brand!');
    }
    if (!price) {
      return alert('The product must have a price!');
    }
    // if (!inStock) {
    //   return alert("Please add in stock quantity!");
    // }
    if (
      shortDescription?.length < 1 &&
      shortDescriptionKa?.length < 1 &&
      shortDescriptionRu?.length < 1
    ) {
      return alert('Short Description not defined!');
    }
    setLoading(true);

    await func();

    const AddFileInCloud = async (index, folder, file) => {
      let imgId = currentUser.name + v4();
      let fileRef = ref(
        storage,
        `marketplace/${currentUser?._id}/products/images/${folder}/${imgId}/`
      );

      if (fileRef) {
        // add desktop version
        const snapshot = await uploadBytesResumable(fileRef, file);
        const url = await getDownloadURL(snapshot.ref);
        return { url: url };
      }
    };

    // check file
    if (files) {
      let folderId = openEditProduct.product.gallery[0].folder;

      const uploadPromises = files.map((file, index) => {
        if (files[index].blob) {
          return AddFileInCloud(index, folderId, files[index].blob);
        } else {
          return {
            url: file.url,
            imgId: file.imgId,
            folder: file.folder,
          };
        }
      });

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
          const product = {
            title: title,
            categories: categories,
            type: type,
            brand: brand,
            price: price,
            currency: currency,
            sale: sale,
            inStock: inStock,
            sex: sex,
            active: true,
            shortDescription: {
              en: shortDescription,
              ru: shortDescriptionRu,
              ka: shortDescriptionKa,
            },
            description: {
              en: fullDescription,
              ru: fullDescriptionRu,
              ka: fullDescriptionKa,
            },
            howToUse: {
              en: howToUse,
              ru: howToUseRu,
              ka: howToUseKa,
            },
            compositions: {
              en: compositons,
              ru: compositonsRu,
              ka: compositonsKa,
            },
            variants: variants?.map((i, x) => {
              return i;
            }),
            cover: cover,
            gallery: uploadedUrls,
            totalOrders: 0,
            owner: currentUser?._id,
            lastOrderDate: new Date(),
            reviews: [],
          };
          await axios.patch(
            backendUrl + '/api/v1/marketplace/' + openEditProduct?.product._id,
            product
          );
          setTimeout(() => {
            setLoading(false);
            dispatch(setRerenderProducts());
            setTitle('');
            setSex('all');
            setCategories([]);
            setBrand('');
            setPrice(null);
            setCurrency(null);
            setSale(null);
            setInStock(null);
            setShortDescription('');
            setShortDescriptionRu('');
            setShortDescriptionKa('');
            setFullDescription('');
            setFullDescriptionRu('');
            setFullDescriptionKa('');
            setHowToUse('');
            setHowToUseRu('');
            setHowToUseKa('');
            setCompositions('');
            setCompositionsRu('');
            setCompositionsKa('');
            setVariants([]);
            setFiles([]);
            setCover(0);
            setType('everyone');
            setTransition(true);
            setTimeout(() => {
              setOpenEditProduct({ active: false, product: null });
            }, 300);
          }, 1000);
        } catch (error) {
          console.error(error.response.data.message);
          setTimeout(async () => {
            setLoading(false);
          }, 1000);
        }
      });
    }
  };

  // variants list modal opening state
  const [isModalVisibleVariants, setIsModalVisibleVariants] = useState(false);

  return (
    <>
      {confirmPopup?.active && (
        <Configs
          openConfig={confirmPopup}
          setOpenConfig={setConfirmPopup}
          Delete={DeleteProduct}
        />
      )}
      {openCategories && (
        <CategoryList
          setOpenCategories={setOpenCategories}
          categories={categories}
          setCategories={setCategories}
        />
      )}
      {isModalVisibleVariants && (
        <Variants
          isModalVisible={isModalVisibleVariants}
          setIsModalVisible={setIsModalVisibleVariants}
          setVariants={setVariants}
          variants={variants}
        />
      )}
      <SimpleBackdrop open={loading} />
      <div
        style={{
          background: 'rgba(1, 2, 12, 0.2)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          zIndex: 1002,
          width: '100vw',
          height: '100%',
          position: 'fixed',
          top: '0',
          left: '0',
        }}
      >
        <Container openpage={transition ? 'true' : 'false'}>
          <Header>
            <div
              onClick={() => {
                setTransition(true);
                setTimeout(() => {
                  setOpenEditProduct({ active: false, product: null });
                }, 300);
              }}
              style={{
                padding: '5px',
                width: '25%',
                zIndex: 1000,
              }}
            >
              <IoMdArrowDropdown size={30} color="#f866b1" />
            </div>
            <div
              style={{
                width: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h3
                style={{
                  color: '#ccc',
                  margin: 0,
                  padding: 0,
                  letterSpacing: '0.5px',
                }}
              >
                Edit Product
              </h3>
            </div>

            <div style={{ width: '25%' }}></div>
          </Header>
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              padding: '5px 15px',
              minHeight: '40px',
            }}
          >
            {(title?.length > 0 ||
              categories?.length > 0 ||
              brand?.length > 0 ||
              price ||
              sale ||
              inStock ||
              sex !== 'all',
            type !== 'everyone' ||
              shortDescription?.length > 0 ||
              shortDescriptionKa?.length > 0 ||
              shortDescriptionRu?.length > 0 ||
              fullDescription?.length > 0 ||
              fullDescriptionKa?.length > 0 ||
              fullDescriptionRu?.length > 0 ||
              howToUse?.length > 0 ||
              howToUseKa?.length > 0 ||
              howToUseRu?.length > 0 ||
              compositons?.length > 0 ||
              compositonsKa?.length > 0 ||
              compositonsRu?.length > 0 ||
              variants?.length > 0 ||
              files?.length > 0) && (
              <div
                onClick={() => {
                  setTitle('');
                  setSex('all');
                  setCategories([]);
                  setBrand('');
                  setPrice(null);
                  setCurrency(null);
                  setSale(null);
                  setInStock(null);
                  setShortDescription('');
                  setShortDescriptionRu('');
                  setShortDescriptionKa('');
                  setFullDescription('');
                  setFullDescriptionRu('');
                  setFullDescriptionKa('');
                  setHowToUse('');
                  setHowToUseRu('');
                  setHowToUseKa('');
                  setCompositions('');
                  setCompositionsRu('');
                  setCompositionsKa('');
                  setVariants([]);
                  setFiles([]);
                  setCover(0);
                  setType('everyone');
                }}
                style={{ position: 'relative' }}
              >
                <span style={{ color: 'red', letterSpacing: 0.3 }}>
                  {language?.language?.Marketplace?.marketplace?.clearAllFields}
                </span>
              </div>
            )}
            <div
              style={{
                position: 'absolute',
                right: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              {active ? (
                <MdVisibility
                  size={24}
                  color="#f866b1"
                  onClick={() => ActiveProduct(false)}
                />
              ) : (
                <MdVisibilityOff
                  size={24}
                  color="#ccc"
                  onClick={() => ActiveProduct(true)}
                />
              )}
              <MdContentCopy size={20} color="#ccc" onClick={Dublicate} />
              <MdDelete
                size={24}
                color="red"
                onClick={() => setConfirmPopup({ active: true })}
              />
            </div>
          </div>
          <Inputs>
            <InputContainer>
              <h4>Files</h4>
              <div
                className="inputButton"
                style={{
                  justifyContent: 'start',
                  border: `1.5px solid ${
                    files?.length > 0 ? '#f866b1' : 'rgba(255,255,255,0.1)'
                  }`,
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
              {files.length > 0 && (
                <div
                  // ref={scrollRef}
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
                        style={{
                          position: 'absolute',
                          margin: '15px 0 0 15px',
                          zIndex: '10000',
                        }}
                      />
                    </div>
                  )}

                  {files.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {index === cover && (
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '500',
                            letterSpacing: '0.5px',
                            color: '#f866b1',
                            zIndex: 1000,
                            height: 0,
                            position: 'relative',
                            top: '15px',
                          }}
                        >
                          Cover
                        </div>
                      )}
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
                          onClick={() => {
                            setCover(index > 0 ? index - 1 : 0);
                            setFiles(files?.filter((i) => i !== file));
                          }}
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

                      {file?.blob?.type.startsWith('image/') || file?.url ? ( // Check if it's an image
                        <div>
                          <img
                            src={
                              file?.blob
                                ? URL.createObjectURL(file.blob)
                                : file?.url
                            }
                            alt={`Image ${index}`}
                            style={{
                              width: '40vw',
                              height: '40vw',
                              borderRadius: '10px',
                              border:
                                index == cover
                                  ? '3px solid #f866b1'
                                  : '3px solid rgba(255,255,255,0.1)',
                              objectFit: 'cover',
                              margin: '0 2px 0 0',
                            }}
                            onClick={() => setCover(index)}
                          />
                        </div>
                      ) : (
                        // It's a video
                        <ReactPlayer
                          url={
                            file?.blob
                              ? URL.createObjectURL(file.blob)
                              : file?.url
                          }
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
            </InputContainer>
            <InputContainer>
              <h4>Product Title</h4>
              <Input
                borderColor={title ? '#f866b1' : 'rgba(255,255,255,0.1)'}
                type="text"
                label="Add Product title"
                value={title}
                onChange={setTitle}
                width="100%"
              />
            </InputContainer>
            <InputContainer>
              <h4>Product Type</h4>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  gap: '10px',
                  cursor: 'pointer',
                }}
              >
                <div
                  onClick={() => setType('everyone')}
                  className="inputButton"
                  style={{
                    border:
                      type === 'everyone'
                        ? '1.5px solid #f866b1'
                        : '1.5px solid rgba(255,255,255,0.1)',
                  }}
                >
                  For Everyone
                </div>
                <div
                  onClick={() => setType('professionals')}
                  className="inputButton"
                  style={{
                    border:
                      type === 'professionals'
                        ? '1.5px solid #f866b1'
                        : '1.5px solid rgba(255,255,255,0.1)',
                  }}
                >
                  For Professionals
                </div>
              </div>
            </InputContainer>
            <InputContainer>
              <h4>Sex</h4>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  gap: '10px',
                  cursor: 'pointer',
                }}
              >
                <div
                  onClick={() => setSex('all')}
                  style={{
                    border:
                      sex === 'all'
                        ? '1.5px solid #f866b1'
                        : '1.5px solid rgba(255,255,255,0.1)',
                  }}
                  className="inputButton"
                >
                  All
                </div>
                <div
                  onClick={() => setSex('women')}
                  style={{
                    border:
                      sex === 'women'
                        ? '1.5px solid #f866b1'
                        : '1.5px solid rgba(255,255,255,0.1)',
                  }}
                  className="inputButton"
                >
                  Women
                </div>
                <div
                  onClick={() => setSex('men')}
                  style={{
                    border:
                      sex === 'men'
                        ? '1.5px solid #f866b1'
                        : '1.5px solid rgba(255,255,255,0.1)',
                  }}
                  className="inputButton"
                >
                  Men
                </div>
              </div>
            </InputContainer>
            <InputContainer>
              <h4>Categories</h4>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {categories?.map((i, x) => {
                  let lab = categoriesList?.find((it) => it.value === i)?.label;

                  return (
                    <div
                      key={x}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '50px',
                        border: '1.5px solid rgba(255,255,255,0.1)',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '14px',
                        color: '#f866b1',
                        fontWeight: 500,
                      }}
                    >
                      {lab}
                      <MdRemove
                        color="red"
                        size={22}
                        onClick={
                          categories?.length > 1
                            ? () =>
                                setCategories((prev) =>
                                  prev.filter((itm) => itm !== i)
                                )
                            : () => alert("You can't delete last category!")
                        }
                      />
                    </div>
                  );
                })}
              </div>
              <div
                className="inputButton"
                onClick={() => setOpenCategories(true)}
                style={{
                  color: categories?.length > 0 ? '#f866b1' : '#ccc',
                  border:
                    categories?.length > 0
                      ? '1.5px solid #f866b1'
                      : '1.5px solid rgba(255,255,255,0.1)',
                }}
              >
                Choice Categories
              </div>
            </InputContainer>
            <InputContainer>
              <h4>Brand</h4>
              <Input
                borderColor={brand ? '#f866b1' : 'rgba(255,255,255,0.1)'}
                type="text"
                label="Add Product brand"
                value={brand}
                onChange={setBrand}
                width="100%"
              />
            </InputContainer>
            <InputContainer>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h4>
                  Price (
                  {currency === 'dollar' ? (
                    '$'
                  ) : currency === 'euro' ? (
                    '€'
                  ) : (
                    <span
                      style={{
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}
                    >
                      {'\u20BE'}
                    </span>
                  )}
                  )
                </h4>
                <MdPriceChange
                  color="#f866b1"
                  size={22}
                  style={{ margin: '0 10px 0 0' }}
                  onClick={() =>
                    setCurrency(
                      currency === 'dollar'
                        ? 'lari'
                        : currency === 'euro'
                        ? 'dollar'
                        : 'euro'
                    )
                  }
                />
              </div>
              <Input
                borderColor={price ? '#f866b1' : 'rgba(255,255,255,0.1)'}
                type="number"
                label="Add Product price"
                value={price}
                onChange={setPrice}
                width="100%"
              />
            </InputContainer>
            <InputContainer>
              <h4>Sale</h4>
              <Input
                borderColor={sale ? '#f866b1' : 'rgba(255,255,255,0.1)'}
                type="number"
                label="Add sale"
                value={sale}
                onChange={setSale}
                width="100%"
              />
            </InputContainer>
            <InputContainer>
              <h4>In Stock</h4>
              <Input
                borderColor={inStock ? '#f866b1' : 'rgba(255,255,255,0.1)'}
                type="number"
                label="In stock"
                value={inStock}
                onChange={setInStock}
                width="100%"
              />
            </InputContainer>
            <InputContainer>
              <h4>Variants</h4>
              <div
                onClick={() => setIsModalVisibleVariants(true)}
                className="inputButton"
                style={{
                  border:
                    variants?.length > 0
                      ? '1.5px solid #f866b1'
                      : '1.5px solid rgba(255,255,255,0.1)',
                }}
              >
                Choice Variants
              </div>
            </InputContainer>
            <InputContainer>
              <h4>Short Description</h4>
              <Input
                borderColor={
                  shortDescriptionKa || shortDescriptionRu || shortDescription
                    ? '#f866b1'
                    : 'rgba(255,255,255,0.1)'
                }
                type="text"
                multiline={true}
                minRows={8}
                label="Add Short Description"
                value={
                  inputLanguage === 'us'
                    ? shortDescription
                    : inputLanguage === 'ru'
                    ? shortDescriptionRu
                    : shortDescriptionKa
                }
                onChange={
                  inputLanguage === 'us'
                    ? setShortDescription
                    : inputLanguage === 'ru'
                    ? setShortDescriptionRu
                    : setShortDescriptionKa
                }
                width="100%"
              />
            </InputContainer>
            <InputContainer>
              <h4>Full Description (Optional)</h4>
              <Input
                borderColor={
                  fullDescriptionKa || fullDescriptionRu || fullDescription
                    ? '#f866b1'
                    : 'rgba(255,255,255,0.1)'
                }
                type="text"
                multiline={true}
                minRows={8}
                label="Add full Description"
                value={
                  inputLanguage === 'us'
                    ? fullDescription
                    : inputLanguage === 'ru'
                    ? fullDescriptionRu
                    : fullDescriptionKa
                }
                onChange={
                  inputLanguage === 'us'
                    ? setFullDescription
                    : inputLanguage === 'ru'
                    ? setFullDescriptionRu
                    : setFullDescriptionKa
                }
                width="100%"
              />
            </InputContainer>
            <InputContainer>
              <h4>How To Use?! (Optional)</h4>
              <Input
                borderColor={
                  howToUse || howToUseKa || howToUseRu
                    ? '#f866b1'
                    : 'rgba(255,255,255,0.1)'
                }
                type="text"
                multiline={true}
                minRows={8}
                label="Add instruction how to use"
                value={
                  inputLanguage === 'us'
                    ? howToUse
                    : inputLanguage === 'ru'
                    ? howToUseRu
                    : howToUseKa
                }
                onChange={
                  inputLanguage === 'us'
                    ? setHowToUse
                    : inputLanguage === 'ru'
                    ? setHowToUseRu
                    : setHowToUseKa
                }
                width="100%"
              />
            </InputContainer>
            <InputContainer>
              <h4>Compositions (Optional)</h4>
              <Input
                borderColor={
                  compositons || compositonsKa || compositonsRu
                    ? '#f866b1'
                    : 'rgba(255,255,255,0.1)'
                }
                type="text"
                multiline={true}
                minRows={8}
                label="Add product's compositions"
                value={
                  inputLanguage === 'us'
                    ? compositons
                    : inputLanguage === 'ru'
                    ? compositonsRu
                    : compositonsKa
                }
                onChange={
                  inputLanguage === 'us'
                    ? setCompositions
                    : inputLanguage === 'ru'
                    ? setCompositionsRu
                    : setCompositionsKa
                }
                width="100%"
              />
            </InputContainer>
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
                marginTop: '20px',
                height: '40px',
              }}
              onClick={UploadProduct}
              //   {...props}
            >
              {loading ? (
                <BounceLoader color={'#f866b1'} loading={loading} size={20} />
              ) : (
                'Edit Product'
              )}
            </Button>
          </Inputs>
        </Container>
      </div>
    </>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100%;
  padding: 0 0 50px 0;
  z-index: 1000;
  background: rgba(1, 2, 12, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: ease-in 200ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  position: fixed;
  top: ${(props) => (props.openpage === 'false' ? 0 : '100vh')};
`;

const Header = styled.div`
  width: 100%;
  padding: 12.5px 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 15px;
  padding-bottom: 50px;
`;

const InputContainer = styled.div`
  color: #ccc;
  border-radius: 15px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;

  h4 {
    margin: 5px 10px;
    letter-spacing: 0.5px;
  }

  .inputButton {
    padding: 8px 15px;
    border-radius: 50px;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    text-align: center;
    font-size: 14px;
    letter-spacing: 0.5px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
  }
`;
