import React from "react";
import styled from "styled-components";
import { CategoryFilter } from "../../pages/main/categoryFilter";
import { useSelector, useDispatch } from "react-redux";
import {
  setCityFilter,
  setDistrictFilter,
  setSpecialist,
  setObject,
  setSearch,
  setFilter,
} from "../../redux/filter";
import { setRerender } from "../../redux/main";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { setFilterOpen } from "../../redux/main";
import { Button } from "../../components/button";
import useWindowDimensions from "../../functions/dimensions";
import CheckBox from "@mui/material/Checkbox";
import { Language } from "../../context/language";
import { Search } from "../../pages/main/search";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Badge from "@mui/material/Badge";
import { MdDeleteForever } from "react-icons/md";

export const FilterMobile = () => {
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = React.useState(true);
  const dispatch = useDispatch();
  const reiting = useSelector((state) => state.storeFilter.reiting);

  const language = Language();

  const [value, setValue] = React.useState("filter");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const StyledTab = styled(Tab)({
    "&.Mui-selected": {
      color: "secondary",
      fontSize: "14px",
      "@media only screen and (max-width: 1200px)": {
        fontSize: "12px",
      },
    },
    "&.MuiTab-root": {
      color: "#ee99fc",
      fontSize: "14px",
      "@media only screen and (max-width: 1200px)": {
        fontSize: "12px",
      },
    },
  });
  const StyledSearchBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: 10,
      top: 10,
      // border: `1px solid #fff`,
      padding: "0 3px",
    },
  }));

  // define signed filter length
  const filterMobile = useSelector((state) => state.storeFilter.filter);
  let filterBadge;
  if (filterMobile !== "") {
    filterBadge = 1;
  } else {
    filterBadge = 0;
  }
  const search = useSelector((state) => state.storeFilter.search);
  let searchBadge;
  if (search !== "") {
    searchBadge = 1;
  } else {
    searchBadge = 0;
  }
  const city = useSelector((state) => state.storeFilter.cityFilter);
  let cityBadge;
  if (city !== "City") {
    cityBadge = 1;
  } else {
    cityBadge = 0;
  }
  const specialist = useSelector((state) => state.storeFilter.specialist);
  const object = useSelector((state) => state.storeFilter.object);
  let typeBadge;
  if (!specialist || !object) {
    typeBadge = 1;
  } else {
    typeBadge = 0;
  }

  setTimeout(() => {
    setLoading(false);
  }, 1000);

  return (
    <Container loading={loading.toString()} height={height}>
      <div
        style={{
          margin: "3vw 0 0 0",
          width: "94%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Tabs value={value} onChange={handleChange} centered>
          <StyledTab
            label={language?.language.Main.filter.title}
            value="filter"
          />
          <StyledSearchBadge
            badgeContent={filterBadge + cityBadge + typeBadge}
            overlap="circular"
            color="secondary"
          />

          <StyledTab
            label={language?.language.Main.filter.search}
            value="search"
          />
          <StyledSearchBadge
            badgeContent={searchBadge}
            overlap="circular"
            color="secondary"
          />
        </Tabs>
        <div
          style={{ width: "50px", display: "flex", justifyContent: "center" }}
        >
          {filterBadge + cityBadge + typeBadge + searchBadge > 0 && (
            <MdDeleteForever
              color="red"
              size={22}
              onClick={() => {
                dispatch(setCityFilter("City"));
                dispatch(setFilter(""));
                dispatch(setSearch(""));
                dispatch(setSpecialist("true"));
                dispatch(setObject("true"));
              }}
            />
          )}
        </div>
      </div>
      {value === "filter" ? (
        <>
          <Filter />
          <CategoryFilter />
        </>
      ) : (
        <div style={{ width: "100%" }}>
          <Search />
        </div>
      )}
      {/* <div style={{ margin: "5vw 0 10vw 0" }}>
        <Button
          function={() => {
            dispatch(setFilterOpen(false));
          }}
          title={`${language?.language.Main.filter.search}`}
        />
      </div> */}
    </Container>
  );
};

const Container = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme.font};
    backdrop-filter: blur(40px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    gap: 5vw;
    width: 100vw;
    height: auto;
    min-height: 100vh;
    margin-top: 15vw;
    padding-bottom: 20vw;
    z-index: 99999;
    overflow-x: hidden;
    overflow-y: visible;
  }
`;

export const Filter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const language = Language();

  // import users
  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }

  // filter cities and not dublicate same cities in map

  const cityFilter = useSelector((state) => state.storeFilter.cityFilter);

  const districtFilter = useSelector(
    (state) => state.storeFilter.districtFilter
  );
  const specialist = useSelector((state) => state.storeFilter.specialist);
  const physicalObject = useSelector((state) => state.storeFilter.object);
  const shop = useSelector((state) => state.storeFilter.shop);

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
      cursor: "pointer",
      backgroundColor: theme ? "#333" : "#fff",
      // "@media only screen and (max-width: 1200px)": {
      //   display: "none",
      // },
    }),
  };

  return (
    <FilterContainer>
      <Select
        classNamePrefix="select"
        defaultValue={cityFilter}
        value={
          cityFilter === "City"
            ? language?.language.Main.filter.city
            : cityFilter
        }
        placeholder={
          cityFilter === "City"
            ? language?.language.Main.filter.city
            : cityFilter === "T'bilisi"
            ? "Tbilisi"
            : cityFilter
        }
        isDisabled={false}
        isLoading={false}
        className="react-select-container"
        onChange={(value) => {
          dispatch(setCityFilter(value.value));
          dispatch(
            setDistrictFilter(`${language?.language.Main.filter.district}`)
          );
          dispatch(setRerender());
        }}
        styles={CustomStyle}
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
          className="react-select-container"
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
          styles={CustomStyle}
          options={districts?.map((item, index) => {
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
          <label htmlFor="specialists">
            {language?.language.Main.filter.specialist}
          </label>
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
          <label htmlFor="beautyCenters">
            {language?.language.Main.filter.beautySalon}
          </label>
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
    gap: 3vw;
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
  font-size: 14px;
`;
// const CheckBox = styled.input`
//   cursor: pointer;
// `;
