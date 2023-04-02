import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { BiLocationPlus } from 'react-icons/bi';
import { GrMapLocation, GrLocation } from 'react-icons/gr';
import AddressAutocomplete from '../../components/addresAutocomplete';
import { MdDeleteForever } from 'react-icons/md';
import { setMap } from '../../redux/register';
import axios from 'axios';
import { setRerenderCurrentUser } from '../../redux/rerenders';
import { setTargetUserAddressRemove } from '../../redux/user';
export default function AddAddress({
  language,
  targetUser,
  type,
  address,
  setAddress,
  setOpenAddresses,
}) {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const map = useSelector((state) => state.storeRegister.map);

  const handleClickOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // address

  const Add = async () => {
    try {
      if (map.country?.length > 0) {
        const response = await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/address`,
          {
            country: map.country,
            region: map.region,
            city: map.city,
            district: map.district,
            street: map.street,
            number: map.number,
            latitude: map.latitude,
            longitude: map.longitude,
          }
        );
        const data = await response.data;
        dispatch(setRerenderCurrentUser());
        dispatch(setAddress(''));
        dispatch(setMap(''));
      } else {
        alert('Add address...');
        dispatch(setAddress(''));
        dispatch(setMap(''));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // delete address
  const DeleteAddress = async (itemId) => {
    if (targetUser?.address?.length > 1) {
      try {
        const url = `https://beautyverse.herokuapp.com/api/v1/users/${targetUser._id}/address/${itemId}`;
        const response = await axios.delete(url);
        dispatch(setTargetUserAddressRemove(itemId));
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    } else {
      alert('cant delete last address');
    }
  };

  return (
    <BG onClick={() => setOpenAddresses(false)}>
      <Container
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Title>
          <GrMapLocation
            className="icon"
            style={{ fontSize: '20px', color: 'red', marginRight: '10px' }}
          />{' '}
          {language?.language.User.userPage.address}
        </Title>
        <Address>
          <p style={{ margin: '0 auto 10px auto', fontSize: '14px' }}>
            {language?.language.User.userPage.addAddress} {'N'}
            {targetUser?.address?.length + 1}
          </p>
          <Wrapper>
            <AddressAutocomplete language={language} userMobile={type} />
          </Wrapper>
          <List>
            {targetUser?.address?.map((item, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '5px 0',
                    gap: '5px',
                  }}
                >
                  <GrLocation className="icon" color="orange" />
                  <b>
                    {language?.language.User.userPage.address}
                    {index === 0 ? '' : index}:
                  </b>
                  <div
                    style={{
                      borderRadius: '5px',
                      boxShadow: '0 0.1vw 0.2vw rgba(0,0,0,0.1)',
                    }}
                  >
                    {item?.city}
                    {item?.district?.length > 0 && ', ' + item?.district}
                    {item?.street?.length > 0 && ', ' + item?.street}
                    {item?.number?.length > 0 && ', ' + item?.number}
                  </div>
                  <MdDeleteForever
                    size={20}
                    style={{
                      cursor: 'pointer',
                      color: 'red',
                    }}
                    onClick={() => DeleteAddress(item?._id)}
                  />
                </div>
              );
            })}
          </List>
        </Address>
        <DialogActions>
          <Button
            onClick={() => {
              dispatch(setMap(''));
              setOpenAddresses(false);
            }}
          >
            {language?.language.User.userPage.cancel}
          </Button>
          <Button onClick={Add} autoFocus>
            {language?.language.User.userPage.add}
          </Button>
        </DialogActions>
      </Container>
    </BG>
  );
}

const BG = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
`;

const Title = styled.h4`
  color: ${(props) => props.theme.font};
  .icon {
    color: ${(props) => props.theme.font};
  }
`;
const Address = styled.h4`
  color: ${(props) => props.theme.font};
`;

const Wrapper = styled.div`
  background: ${(props) => props.theme.background};
  border-radius: 5px;
`;

const Container = styled.div`
  background: ${(props) => props.theme.secondLevel};
  border-radius: 5px;
  padding: 1vw;

  @media only screen and (max-width: 600px) {
    padding: 4vw;
  }
`;

const List = styled.div`
  font-size: 14px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 30px;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    font-size: 12px;
    margin-top: 3vw;
  }

  .icon {
    color: ${(props) => props.theme.font};
  }
`;
