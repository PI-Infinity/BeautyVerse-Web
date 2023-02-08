import React, { useContext } from "react";
import styled from "styled-components";
import { GiConfirmed } from "react-icons/gi";
import { FiEdit } from "react-icons/fi";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { setRerender } from "../../../redux/main";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { AiOutlineMail, AiOutlineDelete } from "react-icons/ai";
import { AuthContext } from "../../../context/AuthContext";
import { setCart, removeItem } from "../../../redux/marketplace/shoppingCart";

const animatedComponents = makeAnimated();

export const InfoSide = ({
  product,
  editField,
  setEditField,
  ShopId,
  currentuser,
  Id,
  setLoading,
  setConfirm,
  images,
}) => {
  const { currentUser } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //import products from redux
  const ps = useSelector((state) => state.storeMarket.currentShopProducts);
  let products;
  if (currentuser?.id === ShopId) {
    const listed = JSON.parse(ps);
    products = listed?.map((item, index) => {
      return {
        value: item?.id,
        label: item?.title,
      };
    });
  }

  // update field
  const [field, setField] = React.useState("");
  const UpdateField = async (value) => {
    if (field?.length > 0) {
      if (value === "title") {
        await updateDoc(
          doc(db, "users", `${currentuser?.id}`, "products", `${Id}`),
          {
            title: field,
          }
        );
        await setField("");
        dispatch(setRerender());
      } else if (value === "brand") {
        await updateDoc(
          doc(db, "users", `${currentuser?.id}`, "products", `${Id}`),
          {
            brand: field,
          }
        );
        await setField("");
        dispatch(setRerender());
      } else if (value === "shortDescription") {
        await updateDoc(
          doc(db, "users", `${currentuser?.id}`, "products", `${Id}`),
          {
            shortDescription: field,
          }
        );
        await setField("");
        dispatch(setRerender());
      } else if (value === "variantes") {
        await updateDoc(
          doc(db, "users", `${currentuser?.id}`, "products", `${Id}`),
          {
            variantes: field,
          }
        );
        await setField("");
        dispatch(setRerender());
      } else if (value === "size") {
        await updateDoc(
          doc(db, "users", `${currentuser?.id}`, "products", `${Id}`),
          {
            size: field,
          }
        );
        await setField("");
        dispatch(setRerender());
      } else if (value === "price") {
        await updateDoc(
          doc(db, "users", `${currentuser?.id}`, "products", `${Id}`),
          {
            price: field,
          }
        );
        await setField("");
        dispatch(setRerender());
      } else if (value === "sale") {
        await updateDoc(
          doc(db, "users", `${currentuser?.id}`, "products", `${Id}`),
          {
            sale: field,
          }
        );
        await setField("");
        dispatch(setRerender());
      } else if (value === "inStock") {
        await updateDoc(
          doc(db, "users", `${currentuser?.id}`, "products", `${Id}`),
          {
            inStock: field,
          }
        );
        await setField("");
        dispatch(setRerender());
      }
    } else {
      alert("Please Input Field");
    }
  };

  // update status

  const UpdateStatus = async () => {
    if (product?.status === "Published") {
      await updateDoc(
        doc(db, "users", `${ShopId}`, "products", `${product?.id}`),
        {
          status: "Not Published",
        }
      );
      dispatch(setRerender());
    } else {
      await updateDoc(
        doc(db, "users", `${ShopId}`, "products", `${product?.id}`),
        {
          status: "Published",
        }
      );
      dispatch(setRerender());
    }
  };

  /**
   * Define item is in shoppin cart or not
   */
  const list = useSelector((state) => state.storeShoppingCart.cart);
  const inCart = list?.find((item) => item.id === Id);

  React.useEffect(() => {
    const cartItems = JSON.stringify(list);
    localStorage.setItem("BeautyVerse:shoppingCart", cartItems);
  }, [list]);

  ///

  return (
    <InformationSection>
      <Back>
        <div onClick={() => navigate(`/marketplace`)}>Market</div> ->{" "}
        <div
          onClick={
            currentUser?.uid === ShopId
              ? () => navigate("/user")
              : () => navigate(`/user/${ShopId}`)
          }
        >
          shop
        </div>{" "}
        ->{" "}
        <div>
          {product?.categories?.length > 0 && product?.categories[0]?.label}
        </div>{" "}
        ->{" "}
        <div
          style={{
            color: "#ccc",
            textDecoration: "none",
            cursor: "auto",
          }}
        >
          Product
        </div>
        {ShopId === currentuser?.id && (
          <AiOutlineDelete
            className="removeIcon"
            onClick={() => setConfirm(product?.id)}
          />
        )}
      </Back>
      <InfoContainer>
        <Title>
          {editField === "editTitle" ? (
            <input
              type="text"
              placeholder={product?.title}
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
          ) : (
            product?.title
          )}{" "}
          {currentuser?.id === ShopId && (
            <>
              {editField === "editTitle" ? (
                <GiConfirmed
                  className="confirm"
                  onClick={async (e) => {
                    e.preventDefault();
                    await UpdateField("title");
                    setEditField(null);
                  }}
                />
              ) : (
                <FiEdit
                  className="edit"
                  onClick={() => {
                    setEditField("editTitle");
                    setField(product?.title);
                  }}
                />
              )}
            </>
          )}
        </Title>
        <Description>
          <h4>ბრენდი: </h4>
          {editField === "editBrand" ? (
            <textarea
              type="text"
              placeholder={product?.brand}
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
          ) : (
            product?.brand
          )}{" "}
          {currentuser?.id === ShopId && (
            <>
              {editField === "editBrand" ? (
                <GiConfirmed
                  className="confirm"
                  onClick={async (e) => {
                    e.preventDefault();
                    await UpdateField("brand");
                    setEditField(null);
                  }}
                />
              ) : (
                <FiEdit
                  className="edit"
                  onClick={() => {
                    setEditField("editBrand");
                    setField(product?.brand);
                  }}
                />
              )}
            </>
          )}
        </Description>
        <Description>
          <h4>მოკლე აღწერა: </h4>
          {editField === "editShortDescription" ? (
            <textarea
              type="text"
              placeholder={product?.shortDescription}
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
          ) : (
            product?.shortDescription
          )}{" "}
          {currentuser?.id === ShopId && (
            <>
              {editField === "editShortDescription" ? (
                <GiConfirmed
                  className="confirm"
                  onClick={async (e) => {
                    e.preventDefault();
                    await UpdateField("shortDescription");
                    setEditField(null);
                  }}
                />
              ) : (
                <FiEdit
                  className="edit"
                  onClick={() => {
                    setEditField("editShortDescription");
                    setField(product?.shortDescription);
                  }}
                />
              )}
            </>
          )}
        </Description>
        {(product?.size?.length > 0 || currentuser?.id === ShopId) && (
          <Description>
            <h4>მახასიათებლები (ზომა/ფერი/წონა/რაოდენობა): </h4>
            {editField === "editSize" ? (
              <textarea
                type="text"
                placeholder={product?.size}
                value={field}
                onChange={(e) => setField(e.target.value)}
              />
            ) : (
              product?.size
            )}{" "}
            {currentuser?.id === ShopId && (
              <>
                {editField === "editSize" ? (
                  <GiConfirmed
                    className="confirm"
                    onClick={async (e) => {
                      e.preventDefault();
                      await UpdateField("size");
                      setEditField(null);
                    }}
                  />
                ) : (
                  <FiEdit
                    className="edit"
                    onClick={() => {
                      setEditField("editSize");
                      setField(product?.size);
                    }}
                  />
                )}
              </>
            )}
          </Description>
        )}
        {(product?.variantes?.length > 0 || currentuser?.id === ShopId) && (
          <Description>
            <h4>ვარიანტები: </h4>
            {editField === "editVariantes" ? (
              <Select
                placeholder={"დაამატე პროდუქტის ვარიანტები"}
                isMulti
                components={animatedComponents}
                onChange={(value) => {
                  setField(value);
                }}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused
                      ? "rgba(0,0,0,0)"
                      : "rgba(0,0,0,0.1)",
                    width: "33vw",
                    minHeight: "2vw",
                    cursor: "pointer",
                    "@media only screen and (max-width: 1200px)": {
                      width: "85vw",
                    },
                  }),
                }}
                options={products}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                {product?.variantes?.length > 0 &&
                  product?.variantes?.map((item, index) => {
                    return (
                      <span
                        style={{ cursor: "pointer" }}
                        key={index}
                        onClick={() => {
                          navigate(
                            `/marketplace/${ShopId}/product/${item.value}`
                          );
                          setLoading(true);
                        }}
                      >
                        {item.label}
                      </span>
                    );
                  })}
              </div>
            )}{" "}
            {currentuser?.id === ShopId && (
              <>
                {editField === "editVariantes" ? (
                  <GiConfirmed
                    className="confirm"
                    onClick={async (e) => {
                      e.preventDefault();
                      await UpdateField("variantes");
                      setEditField(null);
                    }}
                  />
                ) : (
                  <FiEdit
                    className="edit"
                    onClick={() => {
                      setEditField("editVariantes");
                      setField(product?.variantes);
                    }}
                  />
                )}
              </>
            )}
          </Description>
        )}
        <Description>
          <h4>ფასი: </h4>
          {editField === "editPrice" ? (
            <input
              type="number"
              placeholder={product?.price}
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
          ) : (
            product?.price
          )}{" "}
          ლარი
          {currentuser?.id === ShopId && (
            <>
              {editField === "editPrice" ? (
                <GiConfirmed
                  className="confirm"
                  onClick={async (e) => {
                    e.preventDefault();
                    await UpdateField("price");
                    setEditField(null);
                  }}
                />
              ) : (
                <FiEdit
                  className="edit"
                  onClick={() => {
                    setEditField("editPrice");
                    setField(product?.price);
                  }}
                />
              )}
            </>
          )}
        </Description>
        {(product?.sale > 0 || currentuser?.id === ShopId) && (
          <Description>
            <h4>ფასი ფასდაკლებით: </h4>
            {editField === "editSale" ? (
              <input
                type="number"
                placeholder={product?.sale + "%"}
                value={field}
                onChange={(e) => setField(e.target.value)}
              />
            ) : (
              <>
                {product?.sale?.length > 0 ? <>{product?.sale} ლარი</> : null}
              </>
            )}{" "}
            {currentuser?.id === ShopId && (
              <>
                {editField === "editSale" ? (
                  <GiConfirmed
                    className="confirm"
                    onClick={async (e) => {
                      e.preventDefault();
                      await UpdateField("sale");
                      setEditField(null);
                    }}
                  />
                ) : (
                  <FiEdit
                    className="edit"
                    onClick={() => {
                      setEditField("editSale");
                      setField(product?.sale);
                    }}
                  />
                )}
              </>
            )}
          </Description>
        )}
        {(product?.inStock?.length > 0 || currentuser?.id === ShopId) && (
          <Description>
            <h4>მარაგში: </h4>
            {editField === "editStock" ? (
              <input
                type="number"
                placeholder={product?.inStock}
                value={field}
                onChange={(e) => setField(e.target.value)}
              />
            ) : (
              product?.inStock
            )}{" "}
            ცალი
            {currentuser?.id === ShopId && (
              <>
                {editField === "editStock" ? (
                  <GiConfirmed
                    className="confirm"
                    onClick={async (e) => {
                      e.preventDefault();
                      await UpdateField("inStock");
                      setEditField(null);
                    }}
                  />
                ) : (
                  <FiEdit
                    className="edit"
                    onClick={() => {
                      setEditField("editStock");
                      setField(product?.inStock);
                    }}
                  />
                )}
              </>
            )}
          </Description>
        )}
        {ShopId !== currentuser?.id ? (
          <>
            {inCart == undefined ? (
              <AddToCart
                onClick={() => {
                  dispatch(
                    setCart({
                      id: Id,
                      name: product?.title,
                      price: product?.price,
                      sale: product?.sale > 0 ? product.sale : 0,
                      quantity: 1,
                      cover: images[0]?.url,
                      shopId: ShopId,
                    })
                  );
                }}
              >
                Add To Cart
              </AddToCart>
            ) : (
              <AddToCart
                style={{ background: "orange" }}
                onClick={() => {
                  dispatch(removeItem(Id));
                }}
              >
                Remove From Cart
              </AddToCart>
            )}
          </>
        ) : (
          <PublishButton status={product.status} onClick={UpdateStatus}>
            <>
              {product.status === "Not Published"
                ? "გამოქვეყნება"
                : "გამოქვეყნების გაუქმება"}
            </>
          </PublishButton>
        )}
      </InfoContainer>
    </InformationSection>
  );
};

const InformationSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0 1vw 3vw;
  height: 100%;

  @media only screen and (max-width: 621px) {
    padding: 0;
    height: auto;
  }
`;

const Back = styled.div`
  display: flex;
  justify-content: start;
  gap: 15px;

  & > div {
    :hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  @media only screen and (max-width: 621px) {
    margin-top: 5vw;
  }

  .removeIcon {
    position: relative;
    left: 8vw;
    font-size: 1.5vw;
    top: 0.25vw;
    color: #ccc;
    cursor: pointer;

    @media only screen and (max-width: 621px) {
      font-size: 5vw;
      top: 0;
    }
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  height: auto;
  box-sizing: border-box;

  @media only screen and (max-width: 621px) {
    margin-top: 2.5vw;
    flex-direction: column;
    align-items: start;
    padding: 0 2vw;
  }
`;

const Title = styled.h3`
  font-size: 1.3vw;
  font-weight: bold;
  margin-bottom: 5px;

  @media only screen and (max-width: 621px) {
    font-size: 4.5vw;
  }

  .edit {
    cursor: pointer;
    color: orange;
  }

  .confirm {
    cursor: pointer;
    color: green;
  }
`;
const Description = styled.div`
  font-size: 0.8vw;
  white-space: pre-line;

  & > div {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  @media only screen and (max-width: 621px) {
    font-size: 3vw;
  }

  .edit {
    cursor: pointer;
    color: orange;
  }
  .confirm {
    cursor: pointer;
    color: green;
  }

  & > textarea {
    white-space: pre-wrap;
  }
`;

const Variantes = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5vw;
  margin-right: 0.5vw;

  @media only screen and (max-width: 621px) {
    margin-right: 0;
    gap: 2vw;
    font-size: 4vw;
  }

  .variant1 {
    width: 1.5vw;
    height: 1.5vw;
    border-radius: 50%;
    background: ${(props) => props.background};
    cursor: pointer;

    @media only screen and (max-width: 621px) {
      width: 6vw;
      height: 6vw;
    }
  }
  .variant2 {
    width: 1.5vw;
    height: 1.5vw;
    border-radius: 50%;
    background: ${(props) => props.background2};
    cursor: pointer;

    @media only screen and (max-width: 621px) {
      width: 6vw;
      height: 6vw;
    }
  }
`;

const AddToCart = styled.div`
  width: 100%;
  border: none;
  height: 1.7vw;
  background: ${(props) => (props.remove ? "#ccc" : "#31a65e")};
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-top: 15px;
  border-radius: 0.25vw;

  @media only screen and (max-width: 600px) {
    margin-top: 5vw;
    width: 100%;
    height: 7.5vw;
    border-radius: 50vw;
  }
`;

const PublishButton = styled.div`
  width: 100%;
  border: none;
  height: 1.7vw;
  background: ${(props) => (props.status === "Published" ? "orange" : "green")};
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-top: 15px;
  border-radius: 0.25vw;

  @media only screen and (max-width: 600px) {
    margin-top: 5vw;
    width: 100%;
    height: 7.5vw;
    border-radius: 50vw;
  }
`;

/**
 * bottom section
 */

export const BottomSection = ({
  product,
  editField,
  setEditField,
  Id,
  currentuser,
  ShopId,
}) => {
  const dispatch = useDispatch();
  // update field
  const [field, setField] = React.useState("");
  const UpdateField = async (value) => {
    if (value === "fullDescription") {
      await updateDoc(
        doc(db, "users", `${currentuser?.id}`, "products", `${Id}`),
        {
          fullDescription: field,
        }
      );
      await setField("");
      dispatch(setRerender());
    } else if (value === "usage") {
      await updateDoc(
        doc(db, "users", `${currentuser?.id}`, "products", `${Id}`),
        {
          usage: field,
        }
      );
      await setField("");
      dispatch(setRerender());
    } else if (value === "ingredients") {
      await updateDoc(
        doc(db, "users", `${currentuser?.id}`, "products", `${Id}`),
        {
          ingredients: field,
        }
      );
      await setField("");
      dispatch(setRerender());
    }
  };
  return (
    <BottomSectionContainer>
      {(product?.fullDescription?.length > 0 || currentuser?.id === ShopId) && (
        <Description>
          <h4>სრული აღწერა: </h4>
          {editField === "editFullDescription" ? (
            <textarea
              type="text"
              placeholder={product?.fullDescription}
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
          ) : (
            product?.fullDescription
          )}{" "}
          {currentuser?.id === ShopId && (
            <>
              {editField === "editFullDescription" ? (
                <GiConfirmed
                  className="confirm"
                  onClick={async (e) => {
                    e.preventDefault();
                    await UpdateField("fullDescription");
                    setEditField(null);
                  }}
                />
              ) : (
                <FiEdit
                  className="edit"
                  onClick={() => {
                    setEditField("editFullDescription");
                    setField(product?.fullDescription);
                  }}
                />
              )}
            </>
          )}
        </Description>
      )}
      {(product?.usage?.length > 0 || currentuser?.id === ShopId) && (
        <Description>
          <h4>გამოყენების ინსტრუქცია: </h4>
          {editField === "editUsage" ? (
            <textarea
              type="text"
              placeholder={product?.usage}
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
          ) : (
            product?.usage
          )}{" "}
          {currentuser?.id === ShopId && (
            <>
              {editField === "editUsage" ? (
                <GiConfirmed
                  className="confirm"
                  onClick={async (e) => {
                    e.preventDefault();
                    await UpdateField("usage");
                    setEditField(null);
                  }}
                />
              ) : (
                <FiEdit
                  className="edit"
                  onClick={() => {
                    setEditField("editUsage");
                    setField(product?.usage);
                  }}
                />
              )}
            </>
          )}
        </Description>
      )}
      {(product?.ingredients?.length > 0 || currentuser?.id === ShopId) && (
        <Description>
          <h4>შემადგენლობები: </h4>
          {editField === "editIngredients" ? (
            <textarea
              type="text"
              placeholder={product?.ingredients}
              value={field}
              onChange={(e) => setField(e.target.value)}
            />
          ) : (
            product?.ingredients
          )}{" "}
          {currentuser?.id === ShopId && (
            <>
              {editField === "editIngredients" ? (
                <GiConfirmed
                  className="confirm"
                  onClick={async (e) => {
                    e.preventDefault();
                    await UpdateField("ingredients");
                    setEditField(null);
                  }}
                />
              ) : (
                <FiEdit
                  className="edit"
                  onClick={() => {
                    setEditField("editIngredients");
                    setField(product?.ingredients);
                  }}
                />
              )}
            </>
          )}
        </Description>
      )}
    </BottomSectionContainer>
  );
};

const BottomSectionContainer = styled.div`
  border-top: 2px solid #ccc;
  height: auto;
  width: 100%;
  margin-top: 1vw;

  @media only screen and (max-width: 621px) {
    height: auto;
    margin: 5vw 0;
  }
`;
