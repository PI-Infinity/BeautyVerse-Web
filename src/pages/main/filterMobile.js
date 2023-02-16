import React from "react";
import styled from "styled-components";
import { CategoryFilter } from "../../pages/main/categoryFilter";
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
import { VscListFilter } from "react-icons/vsc";
import { setFilterOpen } from "../../redux/main";
import { Button } from "../../components/button";
import { MdOutlineStarPurple500, MdOutlineStarOutline } from "react-icons/md";
import useWindowDimensions from "../../functions/dimensions";
import CheckBox from "@mui/material/Checkbox";

export const FilterMobile = () => {
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = React.useState(true);
  const dispatch = useDispatch();
  const reiting = useSelector((state) => state.storeFilter.reiting);

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  return (
    <Container loading={loading.toString()} height={height}>
      <div style={{ margin: "3vw 0 0 0" }}>
        <h3>Filter</h3>
      </div>

      <CategoryFilter />

      <Filter />
      <div style={{ margin: "5vw 0 10vw 0" }}>
        <Button
          function={() => {
            dispatch(setFilterOpen(false));
          }}
          title="გაფილტვრა..."
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    opacity: ${(props) => (props.loading === "true" ? "0" : "1")};
    transition: ease-in-out 300ms;
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme.font};
    backdrop-filter: blur(40px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    gap: 5vw;
    position: fixed;
    top: 1vw;
    left: -100%;
    bottom: 0;
    padding-bottom: 15vw;
    width: 100%;
    height: ${(props) => props.height}px;
    z-index: 99999;
    overflow-x: hidden;
    overflow-y: scroll;
    -webkit-animation: slide 0.2s forwards;
    animation: slide 0.2s forwards;
    @-webkit-keyframes slide {
      100% {
        left: 0;
      }
    }

    @keyframes slide {
      100% {
        left: 0;
      }
    }
  }
`;

export const Filter = () => {
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

  // filter cities and not dublicate same cities in map

  const cityFilter = useSelector((state) => state.storeFilter.cityFilter);
  const destrictFilter = useSelector(
    (state) => state.storeFilter.destrictFilter
  );
  const specialist = useSelector((state) => state.storeFilter.specialist);
  const physicalObject = useSelector((state) => state.storeFilter.object);
  const shop = useSelector((state) => state.storeFilter.shop);

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
    <FilterContainer>
      <Select
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
        classNames={{
          control: (state) =>
            state.isFocused ? "border-red-600" : "border-grey-300",
        }}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.1)",
            cursor: "pointer",
            // "@media only screen and (max-width: 1200px)": {
            //   display: "none",
            // },
          }),
        }}
        options={cities?.map((item, index) => {
          return { value: item, label: item };
        })}
      />
      {cityFilter.includes("bilisi") && (
        <Select
          className="react-select-container"
          classNamePrefix="select"
          defaultValue={destricts[0]}
          placeholder="უბანი"
          isDisabled={false}
          isLoading={false}
          onChange={(value) => {
            dispatch(setDestrictFilter(value.value));
            dispatch(setRerender());
          }}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isFocused
                ? "rgba(0,0,0,0)"
                : "rgba(0,0,0,0.1)",
              cursor: "pointer",
            }),
          }}
          options={destricts?.map((item, index) => {
            return { value: item, label: item };
          })}
        />
      )}
      <div style={{ marginTop: "3vw" }}>
        <CheckBoxContainer>
          <CheckBox
            id="specialists"
            type="checkbox"
            name="Specialists"
            checked={specialist}
            onChange={() => {
              dispatch(setRerender());
              dispatch(setSpecialist(!specialist));
            }}
          />
          <label htmlFor="specialists">სპეციალისტები</label>
        </CheckBoxContainer>
        <CheckBoxContainer>
          <CheckBox
            id="beautyCenters"
            type="checkbox"
            name="physical"
            checked={physicalObject}
            onChange={() => {
              dispatch(setRerender());
              dispatch(setObject(!physicalObject));
            }}
          />
          <label htmlFor="beautyCenters">ბიუთი ცენტრები</label>
        </CheckBoxContainer>
      </div>
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
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  @media only screen and (max-width: 600px) {
    width: 88vw;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 0vw;
    margin-top: 4vw;
    z-index: 10000;
  }

  .react-select-container {
    background: ${(props) => props.theme.secondLevel};
  }
`;

const CheckBoxContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8vw;

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
  }
`;
// const CheckBox = styled.input`
//   cursor: pointer;
// `;
