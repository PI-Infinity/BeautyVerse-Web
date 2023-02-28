import { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../context/AuthContext";
import { setLoadFeed } from "../../redux/main";
import { db } from "../../firebase";
import { onSnapshot, collectionGroup } from "firebase/firestore";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BiStar } from "react-icons/bi";
import { ProceduresOptions } from "../../data/registerDatas";
import { FaUserEdit } from "react-icons/fa";
import { MdAddBusiness } from "react-icons/md";
import { BsBrush } from "react-icons/bs";
import Tooltip from "@mui/material/Tooltip";

export const SpecialistsCard = (props) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const proceduresOptions = ProceduresOptions();
  const loadFeed = useSelector((state) => state.storeMain.loadFeed);
  const rerender = useSelector((state) => state.storeMain.rerender);

  // import filters
  const cityFilter = useSelector((state) => state.storeFilter.cityFilter);
  const districtFilter = useSelector(
    (state) => state.storeFilter.districtFilter
  );

  /**
   * Define start total
   */
  const [stars, setStars] = useState([]);
  const DefineStars = () => {
    const starsGroupRef = onSnapshot(
      collectionGroup(db, `${props?.id + "+stars"}`),
      (snapshot) => {
        setStars(snapshot.docs.map((doc) => doc.data())?.length);
      }
    );
  };

  useEffect(() => {
    DefineStars();
  }, []);

  // capitalize first letters

  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const name = capitalizeFirstLetter(props?.name);
  const userType = capitalizeFirstLetter(props?.type);

  /// define procedure title
  var mainCategory = props?.filterCategories[0]?.substring(
    0,
    props?.filterCategories[0].indexOf(" -")
  );
  var procedures = proceduresOptions?.find((item) => {
    if (
      item?.value === mainCategory
      // ?.toLowerCase()
      // .includes(props?.filterCategories[0]?.toLowerCase())
    ) {
      return item.label;
    }
  });

  /**
   * define user type icon
   */
  let icon;
  if (props?.type === "user") {
    icon = <FaUserEdit />;
  } else if (props?.type === "specialist") {
    icon = <BsBrush />;
  } else if (props?.type === "beautyCenter") {
    icon = <MdAddBusiness />;
  }

  // define full address
  const fullAddress =
    props?.address?.address + ", " + props?.address?.streetNumber;

  // define all procedures
  const allProcedures = props?.filterCategories
    ?.map((u) => {
      let lab = proceduresOptions?.find((item) => {
        if (item.value === u) {
          return item.label;
        }
      });
      return lab.label;
    })
    .join(", ");

  setTimeout(() => {
    if (props.index === 0) {
      dispatch(setLoadFeed(false));
    }
  }, 700);

  return (
    <Card>
      <Title onClick={() => navigate(`/user/${props.id}`)}>
        {icon}
        {name.substring(0, name.indexOf(" "))?.length > 0
          ? name.substring(0, name.indexOf(" "))
          : name}
      </Title>
      <ImgContainer onClick={() => navigate(`/user/${props.id}`)}>
        {props.cover != undefined ? (
          <Img src={props?.cover} />
        ) : (
          <IconCont>
            <FaUser className="undefinedUserIcon" />
          </IconCont>
        )}
      </ImgContainer>
      <Tooltip title={fullAddress}>
        <City>
          <div>{props?.address?.city}</div>
        </City>
      </Tooltip>
      <Tooltip title={fullAddress}>
        <City>
          <div>
            {props?.address?.district?.length > 0
              ? props?.address?.district
              : props?.address?.address}
          </div>
        </City>
      </Tooltip>
      <Tooltip title={allProcedures}>
        <Category>{procedures?.label}</Category>
      </Tooltip>
      <Review>
        {/* <Rating
          size="small"
          name="simple-controlled"
          value={defineGived?.reiting !== undefined ? defineGived?.reiting : 0}
          onChange={
            currentUser != null
              ? (event, newValue) => SetReiting(newValue)
              : () => navigate("/login")
          }
        /> */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "3px",
          }}
        >
          <BiStar className="likedIcon" />
          <span>({stars})</span>
          {/* <MdOutlineStarPurple500
            size={12}
            color="#ffa534"
            style={{ marginTop: "2px" }}
          /> */}
        </div>
      </Review>
    </Card>
  );
};

const Card = styled.div`
  background: ${(props) => props.theme.categoryItem};
  // border: 1px solid #ccc;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  width: 10vw;
  border-radius: 0.5vw;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding: 0.25vw 0 0.5vw 0;
  position: relative;

  @media only screen and (max-width: 600px) {
    width: 40vw;
    gap: 1.5vw;
    border-radius: 1.5vw;
    box-shadow: 0 0.3vw 0.9vw rgba(2, 2, 2, 0.1);
    padding: 2vw;
    height: auto;
  }

  .undefinedUserIcon {
    font-size: 4vw;
    color: #ccc;

    @media only screen and (max-width: 600px) {
      font-size: 20vw;
    }
  }
`;

const Title = styled.h2`
  font-size: 0.8vw;
  margin: 0;
  font-weight: bold;
  padding: 0.5vw 0 0.3vw 0;
  transition: ease-in 200ms;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    font-size: 3.7vw;
    padding: 1.25vw;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const City = styled.div`
  width: 85%;
  display: flex;
  justify-content: center;
  min-height: 1.1vw;
  margin-top: 0.25vw;
  overflow: hidden;
  @media only screen and (max-width: 600px) {
    min-height: 5.2vw;
  }

  & div {
    background: #f3f3f3;
    padding: 0 0 0.1vw 0;
    border-radius: 50vw;
    color: #050505;
    font-size: 0.7vw;
    z-index: 9;
    width: 85%;
    white-space: nowrap;
    text-align: center;

    @media only screen and (max-width: 600px) {
      font-size: 3.2vw;
      padding: 0.5vw 1.5vw;
      border-radius: 1vw;
    }
  }
`;

const ImgContainer = styled.div`
  border-radius: 15px;
  overflow: hidden;
  border: 2px solid #f3f3f3;
  margin: 0.5vw 0;
  height: 6vw;
  width: 6vw;

  animation: fadeIn 0.5s;
  -webkit-animation: fadeIn 0.5s;
  -moz-animation: fadeIn 0.5s;
  -o-animation: fadeIn 0.5s;
  -ms-animation: fadeIn 0.5s;

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

  cursor: pointer;
  :hover {
    filter: brightness(0.9);
  }

  @media only screen and (max-width: 600px) {
    height: 30vw;
    width: 30vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Img = styled.img`
  height: 6vw;
  width: 6vw;
  object-fit: cover;
  transition: ease-in 200ms;

  @media only screen and (max-width: 600px) {
    width: 30vw;
    height: 30vw;
  }
`;
const IconCont = styled.div`
  height: 6vw;
  width: 6vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 12vw;
    height: 12vw;
  }

  :hover {
    filter: brightness(0.9);
  }
`;

const Category = styled.div`
  margin-top: 0.5vw;
  width: 85%;
  height: 1vw;
  overflow: hidden;
  display: flex;
  align-items: center;
  white-space: nowrap;
  justify-content: start;
  padding: 0 0 0.5vw 0.3vw;
  font-size: 0.6vw;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    width: 35vw;
    height: 6vw;
    padding: 0 0 0vw 1vw;
    font-size: 3vw;
  }
`;

const Review = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25vw;
  padding: 0.5vw 0 0.2vw 0;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    gap: 5px;
    padding: 1.5vw 0 0vw 0;
  }

  .likedIcon {
    color: #bb3394;
    font-size: 1.2vw;
    margin-right: 0.25vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 4vw;
      margin-right: 1vw;
    }
  }
`;
