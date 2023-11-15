import React, { useEffect, useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropleft } from 'react-icons/io';
import styled from 'styled-components';
import { Input } from './input';
import { BounceLoader } from 'react-spinners';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CategoryList from './categoryList';
import { CategoriesOptions } from '../../datas/productCategories';
import { RemoveCircle, RemoveCircleOutline } from '@material-ui/icons';
import { MdDelete, MdPriceChange, MdRemove } from 'react-icons/md';
import { BiSolidImage } from 'react-icons/bi';
import { GiFiles } from 'react-icons/gi';
import ReactPlayer from 'react-player';
import { v4 } from 'uuid';
import { storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import axios from 'axios';
import { setRerenderProducts } from '../../redux/showroom';
import SimpleBackdrop from '../../components/backDrop';
import ReactCountryFlag from 'react-country-flag';
import Variants from './productVariants';

export const AddProduct = ({ openAddProduct, setOpenAddProduct }) => {
  // current user redux state
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const [currency, setCurrency] = useState(currentUser?.currency);

  // dispatch
  const dispatch = useDispatch();

  // transition
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

  const lang = useSelector((state) => state.storeApp.language);
  // language activator
  const [inputLanguage, setInputLanguage] = useState(
    lang === 'en' ? 'us' : lang === 'ka' ? 'ge' : 'ru'
  );

  // loading when adding product
  const [loading, setLoading] = useState(false);
  // field states
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState('everyone');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');

  const [sale, setSale] = useState('');
  const [inStock, setInStock] = useState('');
  const [sex, setSex] = useState('all');
  const [shortDescription, setShortDescription] = useState('');
  const [shortDescriptionRu, setShortDescriptionRu] = useState('');
  const [shortDescriptionKa, setShortDescriptionKa] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [fullDescriptionRu, setFullDescriptionRu] = useState('');
  const [fullDescriptionKa, setFullDescriptionKa] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [howToUseRu, setHowToUseRu] = useState('');
  const [howToUseKa, setHowToUseKa] = useState('');
  const [compositons, setCompositions] = useState('');
  const [compositonsRu, setCompositionsRu] = useState('');
  const [compositonsKa, setCompositionsKa] = useState('');
  const [variants, setVariants] = useState([]);
  const [files, setFiles] = useState([]);
  const [cover, setCover] = useState(0);

  // open categories list
  const [openCategories, setOpenCategories] = useState(false);

  // categories list of app
  const categoriesList = CategoriesOptions();

  // variants list modal opening state
  const [isModalVisibleVariants, setIsModalVisibleVariants] = useState(false);

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

  /**
   * Add product function
   */

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

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
    // convert file to blob

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
          await axios.post(backendUrl + '/api/v1/marketplace', product);
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
              setOpenAddProduct(false);
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

  return (
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
      <Container openpage={transition ? 'true' : 'false'}>
        <Header>
          <div
            onClick={() => {
              setTransition(true);
              setTimeout(() => {
                setOpenAddProduct(false);
              }, 300);
            }}
            style={{
              padding: '5px',

              zIndex: 1000,
            }}
          >
            <IoMdArrowDropdown size={30} color="#f866b1" />
          </div>
          <div>
            <h3
              style={{
                color: '#ccc',
                margin: 0,
                padding: 0,
                letterSpacing: '0.5px',
              }}
            >
              Add Product
            </h3>
          </div>
          <div
            style={{ width: '40px', display: 'flex', alignItems: 'center' }}
          ></div>
        </Header>
        <Inputs>
          <InputContainer style={{ borderRadius: '5px' }}>
            <h4>Files</h4>
            <div className="inputButton" style={{ justifyContent: 'start' }}>
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
                        onClick={() =>
                          setFiles(files?.filter((i) => i !== file))
                        }
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
                      <div>
                        <img
                          src={URL.createObjectURL(file.blob)}
                          alt={`Image ${index}`}
                          style={{
                            width: '40vw',
                            height: '40vw',
                            borderRadius: '10px',
                            border:
                              index == cover
                                ? '3px solid #f866b1'
                                : '3px solid rgba(255,255,255,0.1)',
                            margin: '0 2px 0 0',
                            objectFit: 'cover',
                          }}
                          onClick={() => setCover(index)}
                        />
                      </div>
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
              className="inputButton"
              onClick={() => setIsModalVisibleVariants(true)}
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h4>Short Description</h4>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode="US"
                  style={{
                    fontSize: '1em',
                    lineHeight: '1em',
                    opacity: inputLanguage === 'en' ? 1 : 0.4,
                  }}
                  aria-label="United States"
                  onClick={() => setInputLanguage('en')}
                />
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode="GE"
                  style={{
                    fontSize: '1em',
                    lineHeight: '1em',
                    opacity: inputLanguage === 'ge' ? 1 : 0.4,
                  }}
                  aria-label="Georgia"
                  onClick={() => setInputLanguage('ge')}
                />
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode="RU"
                  style={{
                    fontSize: '1em',
                    lineHeight: '1em',
                    opacity: inputLanguage === 'ru' ? 1 : 0.4,
                  }}
                  aria-label="Russia"
                  onClick={() => setInputLanguage('ru')}
                />
              </div>
            </div>
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h4>Full Description (optional)</h4>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode="US"
                  style={{
                    fontSize: '1em',
                    lineHeight: '1em',
                    opacity: inputLanguage === 'en' ? 1 : 0.4,
                  }}
                  aria-label="United States"
                  onClick={() => setInputLanguage('en')}
                />
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode="GE"
                  style={{
                    fontSize: '1em',
                    lineHeight: '1em',
                    opacity: inputLanguage === 'ge' ? 1 : 0.4,
                  }}
                  aria-label="Georgia"
                  onClick={() => setInputLanguage('ge')}
                />
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode="RU"
                  style={{
                    fontSize: '1em',
                    lineHeight: '1em',
                    opacity: inputLanguage === 'ru' ? 1 : 0.4,
                  }}
                  aria-label="Russia"
                  onClick={() => setInputLanguage('ru')}
                />
              </div>
            </div>
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h4>How To Use (Optional)</h4>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode="US"
                  style={{
                    fontSize: '1em',
                    lineHeight: '1em',
                    opacity: inputLanguage === 'en' ? 1 : 0.4,
                  }}
                  aria-label="United States"
                  onClick={() => setInputLanguage('en')}
                />
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode="GE"
                  style={{
                    fontSize: '1em',
                    lineHeight: '1em',
                    opacity: inputLanguage === 'ge' ? 1 : 0.4,
                  }}
                  aria-label="Georgia"
                  onClick={() => setInputLanguage('ge')}
                />
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode="RU"
                  style={{
                    fontSize: '1em',
                    lineHeight: '1em',
                    opacity: inputLanguage === 'ru' ? 1 : 0.4,
                  }}
                  aria-label="Russia"
                  onClick={() => setInputLanguage('ru')}
                />
              </div>
            </div>
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h4>Compositions (Optional)</h4>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode="US"
                  style={{
                    fontSize: '1em',
                    lineHeight: '1em',
                    opacity: inputLanguage === 'en' ? 1 : 0.4,
                  }}
                  aria-label="United States"
                  onClick={() => setInputLanguage('en')}
                />
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode="GE"
                  style={{
                    fontSize: '1em',
                    lineHeight: '1em',
                    opacity: inputLanguage === 'ge' ? 1 : 0.4,
                  }}
                  aria-label="Georgia"
                  onClick={() => setInputLanguage('ge')}
                />
                <ReactCountryFlag
                  className="emojiFlag"
                  countryCode="RU"
                  style={{
                    fontSize: '1em',
                    lineHeight: '1em',
                    opacity: inputLanguage === 'ru' ? 1 : 0.4,
                  }}
                  aria-label="Russia"
                  onClick={() => setInputLanguage('ru')}
                />
              </div>
            </div>
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
              'Add Product'
            )}
          </Button>
        </Inputs>
      </Container>
    </div>
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
  padding: 12.5px 8px;
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
