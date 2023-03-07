import styled from "styled-components";
import { Search } from "../../pages/main/search";
import { useSelector, useDispatch } from "react-redux";
import {
  setCityFilter,
  setDistrictFilter,
  setSpecialist,
  setObject,
} from "../../redux/filter";
import { setRerender } from "../../redux/main";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import CheckBox from "@mui/material/Checkbox";
import { Language } from "../../context/language";
import { GiFlexibleStar } from "react-icons/gi";

export const Filter = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = Language();

  const lang = useSelector((state) => state.storeMain.language);

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

  const districtFilter = useSelector(
    (state) => state.storeFilter.districtFilter
  );

  const specialist = useSelector((state) => state.storeFilter.specialist);
  const physicalObject = useSelector((state) => state.storeFilter.object);
  const shop = useSelector((state) => state.storeFilter.shop);
  const reiting = useSelector((state) => state.storeFilter.reiting);

  const cities = [`${language?.language.Main.filter.city}`];

  const Cities = users?.filter((obj) => {
    const isDuplicate = cities.includes(obj.address.city);

    if (!isDuplicate) {
      cities.push(obj.address.city);

      return true;
    }

    return false;
  });

  // filter districts and not dublicate same districts in map

  const distr = [`${language?.language.Main.filter.district}`];

  const Districts = users?.filter((obj) => {
    const isDuplicate = distr.includes(obj.address.district);

    if (!isDuplicate) {
      distr.push(obj.address.district);

      return true;
    }

    return false;
  });

  const districts = distr?.filter((item) => item != "");

  // color mode
  const theme = useSelector((state) => state.storeMain.theme);

  const CustomStyle = {
    singleValue: (base, state) => ({
      ...base,
      color: state.isSelected
        ? theme
          ? "#333"
          : "#f3f3f3"
        : theme
        ? "#f3f3f3"
        : "#333",
    }),
    menuList: (base, state) => ({
      ...base,
      backgroundColor: theme ? "#333" : "#f3f3f3",
    }),
    input: (base, state) => ({
      ...base,
      color: theme ? "#f3f3f3" : "#333",
      fontSize: "16px",
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "14px",
      backgroundColor: state.isSelected
        ? theme
          ? "#f3f3f3"
          : "#333"
        : theme
        ? "#333"
        : "#f3f3f3",
      color: state.isSelected
        ? theme
          ? "#333"
          : "#f3f3f3"
        : theme
        ? "#f3f3f3"
        : "#333",
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      borderColor: state.isFocused ? "#333" : theme ? "#050505" : "gray",
      borderWidth: state.isFocused ? "0.1vw" : "0.1vw",
      borderRadius: "2vw 2vw 2vw 2vw",
      padding: "0 0.1vw 0.1vw 0.5vw",
      backgroundColor: theme ? "#333" : "#fff",
      color: theme ? "auto" : "#f3f3f3",
      cursor: "pointer",
      fontSize: "14px",
      "@media only screen and (max-width: 1200px)": {
        display: "none",
      },
    }),
  };

  return (
    <FilterContainer scroll={scroll?.toString()}>
      {!props.mobile && <Search />}
      <Select
        className="basic-single"
        classNamePrefix="select"
        defaultValue={cityFilter}
        placeholder={
          cityFilter === "City"
            ? language?.language.Main.filter.city
            : cityFilter
        }
        isDisabled={false}
        isLoading={false}
        className="react-select-container"
        styles={CustomStyle}
        onChange={(value) => {
          dispatch(setCityFilter(value.value));
          dispatch(
            setDistrictFilter(`${language?.language.Main.filter.district}`)
          );
          dispatch(setRerender());
        }}
        // classNames={{
        //   control: (state) =>
        //     state.isFocused ? "border-red-400" : "border-grey-400",
        // }}
        options={cities?.map((item, index) => {
          if (item === "T'bilisi") {
            return { value: item, label: "Tbilisi" };
          } else {
            return { value: item, label: item };
          }
        })}
      />
      {cityFilter.includes("bilisi") && (
        <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={districtFilter}
          placeholder={
            districtFilter === "District"
              ? language?.language.Main.filter.district
              : districtFilter
          }
          isDisabled={false}
          isLoading={false}
          onChange={(value) => {
            dispatch(setDistrictFilter(value.value));
            dispatch(setRerender());
          }}
          className="react-select-container"
          styles={CustomStyle}
          options={districts?.map((item, index) => {
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
          {language?.language.Main.filter.specialist}
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
          {language?.language.Main.filter.beautySalon}
        </label>
      </CheckBoxContainer>
      <RecomendedActive
        active={window.location.pathname === "/recomended" ? "true" : "false"}
      >
        <GiFlexibleStar
          color="f2cd38"
          onClick={
            window.location.pathname === "/recomended"
              ? () => navigate("/")
              : () => navigate("/recomended")
          }
          size={22}
          style={{ cursor: "pointer" }}
        />
      </RecomendedActive>

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
    display: none;
    // position: fixed;
    // // transition: ease-in 150ms;
    // top: ${(props) => (props.scroll === "true" ? "calc(14vw - 1px)" : "-15vw")};
    // height: auto;
    // border-bottom: 0px solid #ddd;
    // padding: 5px 0 10px 0;
    // box-sizing: border-box;
    // justify-content: center;
    // background: ${(props) => props.theme.background};

    // backdrop-filter: blur(30px);
    // box-shadow: none;
    // z-index: 900;
  }
`;

const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;

  @media only screen and (max-width: 600px) {
    display: none;
  }
  .checkbox {
    color: ${(props) => props.theme.logo};
    font-size: 14px;
  }
`;

const RecomendedActive = styled.div`
  width: 30px;
  height: 30px;
  padding: 3px;
  background: ${(props) =>
    props.active === "true" ? props?.theme.secondLevel : "none"};
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    display: none;
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
