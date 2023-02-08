import React, { useState } from "react";
import styled from "styled-components";
import { BsImages } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { categoriesOptions } from "../../data/registerDatas";
import { useSelector, useDispatch } from "react-redux";
import { doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { v4 } from "uuid";
import useWindowDimensions from "../../functions/dimensions";

const animatedComponents = makeAnimated();

export const AddProduct = (props) => {
  const { height, width } = useWindowDimensions();
  // current user
  const userUnparsed = useSelector((state) => state.storeMain.user);

  let user;
  if (userUnparsed?.length > 0) {
    user = JSON.parse(userUnparsed);
  }

  //

  const [categories, setCategories] = useState("");
  const [variantes, setVariantes] = useState([]);
  //import products from redux
  const ps = useSelector((state) => state.storeMarket.currentShopProducts);
  let products;
  if (user) {
    const listed = JSON.parse(ps);
    products = listed?.map((item, index) => {
      return {
        value: item.id,
        label: item.title,
      };
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    var title = e.target[0]?.value;
    var brand = e.target[1]?.value;
    var shortDescription = e.target[3]?.value;
    var size = e.target[4]?.value;
    var inStock = e.target[5]?.value;
    var price = e.target[6]?.value;
    var sale = e.target[7]?.value;
    var fullDescription = e.target[8]?.value;
    var usage = e.target[9]?.value;
    var ingredients = e.target[10]?.value;

    AddInFirebase({
      title,
      brand,
      shortDescription,
      size,
      inStock,
      price,
      sale,
      fullDescription,
      usage,
      ingredients,
    });
  };

  const AddInFirebase = async (prop) => {
    // var imgs = await FileConverter(prop.title);
    // console.log(imgs);
    let Id = prop.title.replace(/\s/g, "") + "." + v4();
    await setDoc(doc(db, "users", `${user?.id}`, "products", Id), {
      id: Id,
      title: prop?.title,
      brand: prop?.brand,
      shortDescription: prop?.shortDescription,
      size: prop.size,
      categories: categories,
      inStock: prop.inStock,
      price: prop.price,
      sale: prop.sale,
      fullDescription: prop.fullDescription,
      usage: prop?.usage,
      ingredients: prop?.ingredients,
      status: "Not Published",
      addTime: serverTimestamp(),
      variantes: variantes,
      shop: user?.id,
    });
    props.setAdd(false);
  };

  return (
    <Container height={height}>
      <Header>
        <h3>პროდუქტის დამატება</h3>
        <AiOutlineCloseCircle id="close" onClick={() => props.setAdd(false)} />
      </Header>
      <Fields onSubmit={handleSubmit}>
        <Title>
          <h4>დასახელება</h4>
          <div>
            <InputText placeholder="დასახელება" required />
          </div>
        </Title>
        <ShortDescription>
          <h4>ბრენდი</h4>
          <InputText type="text" placeholder="ბრენდი" required />
        </ShortDescription>
        <Category>
          <h4>კატეგორიები</h4>

          <Select
            placeholder="კატეგორიები"
            isMulti
            components={animatedComponents}
            required
            onChange={(value) => {
              setCategories(value);
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
                  width: "100%",
                },
              }),
            }}
            options={categoriesOptions}
          />
        </Category>
        <ShortDescription>
          <h4>მოკლე აღწერა</h4>
          <InputTextArea type="text" placeholder="მოკლე აღწერა" required />
        </ShortDescription>
        <ShortDescription>
          <h4>
            მახასიათებლები (ზომა/ფერი/წონა/რაოდენობა){" "}
            <span style={{ color: "#ccc", fontWeight: "normal" }}>
              (optional)
            </span>
          </h4>{" "}
          <InputTextArea type="text" placeholder="ზომა/ფერი/წონა/რაოდენობა" />
        </ShortDescription>
        <InStock>
          <h4>
            რაოდენობა მარაგში{" "}
            <span style={{ color: "#ccc", fontWeight: "normal" }}>
              (optional)
            </span>
          </h4>

          <InputNumbers type="text" placeholder="მარაგში" />
        </InStock>
        <Price>
          <h4>ფასი</h4>
          <InputNumbers type="number" placeholder="ფასი" required /> ლარი
        </Price>
        <Sale>
          <h4>
            ფასი ფასდაკლებით{" "}
            <span style={{ color: "#ccc", fontWeight: "normal" }}>
              (optional)
            </span>
          </h4>
          <InputNumbers type="number" placeholder="ფასდაკლება" /> ლარი
        </Sale>
        <Desciption>
          <h4>
            სრული აღწერა{" "}
            <span style={{ color: "#ccc", fontWeight: "normal" }}>
              (optional)
            </span>
          </h4>
          <InputTextArea type="text" placeholder="აღწერა" />
        </Desciption>
        <HowToUse>
          <h4>
            გამოყენების ინსტრუქცია{" "}
            <span style={{ color: "#ccc", fontWeight: "normal" }}>
              (optional)
            </span>
          </h4>

          <InputTextArea type="text" placeholder="ინსტრუქცია" />
        </HowToUse>
        <Ingredients>
          <h4>
            ინგრედიენტები{" "}
            <span style={{ color: "#ccc", fontWeight: "normal" }}>
              (optional)
            </span>
          </h4>

          <InputTextArea type="text" placeholder="ინგრედიენტები" />
        </Ingredients>
        <Variants>
          <h4>
            ვარიანტები{" "}
            <span style={{ color: "#ccc", fontWeight: "normal" }}>
              (optional)
            </span>
          </h4>

          <Select
            placeholder={"დაამატე პროდუქტის ვარიანტები"}
            isMulti
            components={animatedComponents}
            onChange={(value) => {
              setVariantes(value);
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
        </Variants>
        <AddButton type="submit">Add</AddButton>
      </Fields>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 57vh;
  padding: 1vw 2vw 3vw 2vw;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: scroll;
  background: white;

  @media only screen and (max-width: 600px) {
    padding: 0 4vw 4vw 4vw;
    height: calc(${(props) => props.height}px - 62vw);
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  #close {
    font-size: 1.4vw;
    cursor: pointer;
    transition: ease 300ms;

    &:hover {
      color: #ddd;
    }

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;

const Fields = styled.form``;
const Title = styled.div``;
const Category = styled.div``;
const Img = styled.div`
  #img {
    display: none;
  }
  #imgLabel {
    font-size: 3vw;
    color: #ddd;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 9vw;
    }
  }
`;
const Gallery = styled.div``;
const ShortDescription = styled.div``;
const InStock = styled.div``;
const Price = styled.div``;
const Sale = styled.div``;
const Desciption = styled.div``;
const Variants = styled.div``;
const HowToUse = styled.div``;
const Ingredients = styled.div``;

const AddButton = styled.button`
  width: 15vw;
  height: 2.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ease-in 200ms;
  color: green;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  margin-top: 1vw;

  @media only screen and (max-width: 600px) {
    width: 45vw;
    height: 8vw;
    border-radius: 1.5vw;
    box-shadow: 0 0.3vw 0.6vw rgba(2, 2, 2, 0.2);
    font-size: 3.8vw;
    margin-top: 3vw;
  }

  :hover {
    box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.2);
  }
`;

const InputText = styled.input`
  border: none;
  padding: 0.5vw;
  width: 15vw;
  border: 1px solid #f1f1f1;
  font-size: 16px;
  border-radius: 0.1vw;
  box-sizing: border-box;

  :focus {
    outline: none;
  }

  @media only screen and (max-width: 600px) {
    width: 100%;
    padding: 1.5vw;
  }
`;
const InputNumbers = styled.input`
  border: none;
  padding: 0.5vw;
  width: 5vw;
  border: 1px solid #f1f1f1;
  font-size: 16px;
  border-radius: 0.1vw;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    width: 100%;
    padding: 1.5vw;
  }

  :focus {
    outline: none;
  }
`;

const InputTextArea = styled.textarea`
  border: none;
  padding: 0.5vw;
  width: 30vw;
  height: 10vw;
  border: 1px solid #f1f1f1;
  font-size: 16px;
  border-radius: 0.1vw;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    width: 100%;
    padding: 1.5vw;
    height: 30vw;
  }

  :focus {
    outline: none;
  }
`;
