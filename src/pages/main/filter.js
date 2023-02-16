import React from "react";
import styled from "styled-components";
import { IoMdArrowDropdown } from "react-icons/io";
import { RiShoppingCartFill } from "react-icons/ri";
import { Search } from "../../pages/main/search";
import { useSelector, useDispatch } from "react-redux";
import {
  setCityFilter,
  setDestrictFilter,
  setSpecialist,
  setObject,
  setShop,
  setReiting,
} from "../../redux/filter";
import { setRerender } from "../../redux/main";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { MdOutlineStarPurple500, MdOutlineStarOutline } from "react-icons/md";
import CheckBox from "@mui/material/Checkbox";

export const Filter = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(setCityFilter("ქალაქი"));
    dispatch(setDestrictFilter("უბანი"));
  }, []);

  // import users
  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }

  // define scroll
  const scroll = useSelector((state) => state.storeScroll.scroll);

  // filter cities and not dublicate same cities in map

  const cityFilter = useSelector((state) => state.storeFilter.cityFilter);
  const destrictFilter = useSelector(
    (state) => state.storeFilter.destrictFilter
  );
  const specialist = useSelector((state) => state.storeFilter.specialist);
  const physicalObject = useSelector((state) => state.storeFilter.object);
  const shop = useSelector((state) => state.storeFilter.shop);
  const reiting = useSelector((state) => state.storeFilter.reiting);

  const cities = ["ქალაქი"];

  const Cities = users?.filter((obj) => {
    const isDuplicate = cities.includes(obj.adress.city);

    if (!isDuplicate) {
      cities.push(obj.adress.city);

      return true;
    }

    return false;
  });

  // filter destricts and not dublicate same districts in map

  const distr = ["უბანი"];

  const Districts = users?.filter((obj) => {
    const isDuplicate = distr.includes(obj.adress.destrict);

    if (!isDuplicate) {
      distr.push(obj.adress.destrict);

      return true;
    }

    return false;
  });

  const destricts = distr?.filter((item) => item != "");

  return (
    <FilterContainer scroll={scroll?.toString()}>
      {!props.mobile && <Search />}
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={cities[0]}
        placeholder="ქალაქი"
        isDisabled={false}
        isLoading={false}
        className="react-select-container"
        onChange={(value) => {
          dispatch(setCityFilter(value.label));
          dispatch(setDestrictFilter("უბანი"));
          dispatch(setRerender());
        }}
        // classNames={{
        //   control: (state) =>
        //     state.isFocused ? "border-red-400" : "border-grey-400",
        // }}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? "#333" : "#ddd",
            borderWidth: state.isFocused ? "0.1vw" : "0.1vw",
            borderRadius: "2vw 2vw 2vw 2vw",
            padding: "0 0.1vw 0.1vw 0.5vw",
            cursor: "pointer",
            "@media only screen and (max-width: 1200px)": {
              display: "none",
            },
          }),
        }}
        options={cities?.map((item, index) => {
          return { value: item, label: item };
        })}
      />
      {cityFilter.includes("bilisi") && (
        <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={destricts[0]}
          placeholder="უბანი"
          isDisabled={false}
          isLoading={false}
          onChange={(value) => {
            dispatch(setDestrictFilter(value.value));
            dispatch(setRerender());
          }}
          className="react-select-container"
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isFocused ? "#333" : "#ddd",
              borderWidth: state.isFocused ? "0.1vw" : "0.1vw",
              borderRadius: "2vw 2vw 2vw 2vw",
              padding: "0 0.1vw 0.1vw 0.5vw",

              cursor: "pointer",
              "@media only screen and (max-width: 1200px)": {
                display: "none",
              },
            }),
          }}
          options={destricts?.map((item, index) => {
            return { value: item, label: item };
          })}
        />
      )}
      <CheckBoxContainer>
        <CheckBox
          sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
          type="checkbox"
          name="Specialists"
          id="specialists"
          checked={specialist}
          onChange={() => {
            dispatch(setRerender());
            dispatch(setSpecialist(!specialist));
          }}
        />
        <label
          className="checkbox"
          htmlFor="specialists"
          style={{ cursor: "pointer" }}
        >
          სპეციალისტები
        </label>
      </CheckBoxContainer>
      <CheckBoxContainer>
        <CheckBox
          className="checkbox"
          sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
          type="checkbox"
          id="beautyCenter"
          name="physical"
          checked={physicalObject}
          onChange={() => {
            dispatch(setRerender());
            dispatch(setObject(!physicalObject));
          }}
        />
        <label
          className="checkbox"
          htmlFor="beautyCenter"
          style={{ cursor: "pointer" }}
        >
          ბიუთი ცენტრები
        </label>
      </CheckBoxContainer>
      {/* <CheckBoxContainer>
        <CheckBox
          type="checkbox"
          id="shop"
          name="shop"
          checked={shop}
          onChange={() => {
            dispatch(setRerender());
            dispatch(setShop(!shop));
          }}
        />
        <label htmlFor="shop" style={{ cursor: "pointer" }}>
          მაღაზიები
        </label>
      </CheckBoxContainer> */}
      {/* <Market>
        <ButtonBg onClick={() => navigate("/marketplace")}>
          <MarketButton>Marketplace</MarketButton>
        </ButtonBg>
      </Market> */}
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0.85vw 2vw 0.5vw 2vw;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 2vw;
  box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.shadowColor};
  background: ${(props) => props.theme.background};
  z-index: 15;

  @media only screen and (max-width: 600px) {
    position: fixed;
    // transition: ease-in 150ms;
    top: ${(props) => (props.scroll === "true" ? "calc(15vw - 1px)" : "-15vw")};
    height: auto;
    border-bottom: 0px solid #ddd;
    padding: 5px 0 10px 0;
    box-sizing: border-box;
    justify-content: center;
    background: ${(props) => props.theme.background};

    backdrop-filter: blur(30px);
    box-shadow: none;
    z-index: 900;
  }
`;

const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8vw;

  @media only screen and (max-width: 600px) {
    display: none;
  }
  .checkbox {
    color: ${(props) => props.theme.logo};
  }
`;
// const CheckBox = styled.input`
//   cursor: pointer;
// `;

// const Market = styled.div`
//   flex: 1;
//   display: flex;
//   justify-content: flex-end;

//   @media only screen and (max-width: 600px) {
//     display: none;
//   }
// `;

// const MarketButton = styled.div`
//   height: 1.5vw;
//   width: 7vw;
//   padding-bottom: 0.05vw;
//   border-radius: 0.2vw;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   gap: 0.3vw;
//   color: white;
//   font-size: 0.8vw;
//   font-weight: bold;
//   cursor: pointer;
//   background: white;
//   color: #222;
// `;

// const ButtonBg = styled.div`
//   height: 1.8vw;
//   width: 7.2vw;
//   border-radius: 0.3vw;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: white;
//   cursor: pointer;

//   :hover {
//     filter: brightness(1.1);
//   }

//   background: linear-gradient(323deg, #438ee4, #c743e4, #e4b643, #43e457);
//   background-size: 800% 800%;

//   -webkit-animation: AnimationName 5s ease infinite;
//   -moz-animation: AnimationName 5s ease infinite;
//   animation: AnimationName 5s ease infinite;

//   @-webkit-keyframes AnimationName {
//     0% {
//       background-position: 7% 0%;
//     }
//     50% {
//       background-position: 94% 100%;
//     }
//     100% {
//       background-position: 7% 0%;
//     }
//   }
//   @-moz-keyframes AnimationName {
//     0% {
//       background-position: 7% 0%;
//     }
//     50% {
//       background-position: 94% 100%;
//     }
//     100% {
//       background-position: 7% 0%;
//     }
//   }
//   @keyframes AnimationName {
//     0% {
//       background-position: 7% 0%;
//     }
//     50% {
//       background-position: 94% 100%;
//     }
//     100% {
//       background-position: 7% 0%;
//     }
//   }
// `;
