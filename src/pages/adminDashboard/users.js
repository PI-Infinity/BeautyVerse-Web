import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import { useSelector, useDispatch } from 'react-redux';
import { BsListCheck } from 'react-icons/bs';
import { Spinner } from '../../components/loader';
import { AiTwotoneEdit, AiFillDelete } from 'react-icons/ai';
import EditUser from '../../pages/adminDashboard/users-editUser';
import DeleteUser from '../../pages/adminDashboard/users-deleteUser';
import ProceduresList from '../../pages/adminDashboard/users-proceduresList';
import AddressesList from '../../pages/adminDashboard/users-addresses';
import WDaysList from '../../pages/adminDashboard/users-wdays';
import MediaList from '../../pages/adminDashboard/users-media';
import { v4 } from 'uuid';
import { db } from '../../firebase';
import { doc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { setRerenderUserList } from '../../redux/rerenders';
import axios from 'axios';
import { useOutletContext } from 'react-router-dom';

const columns = [
  { field: 'name', headerName: 'Name', width: 180 },
  { field: 'type', headerName: 'Type', width: 180 },
  { field: 'admin', headerName: 'Admin', width: 100 },
  { field: 'country', headerName: 'Country', width: 150 },
  { field: 'region', headerName: 'region', width: 150 },
  { field: 'city', headerName: 'City', width: 150 },
  { field: 'district', headerName: 'District', width: 180 },
  { field: 'address', headerName: 'Address', width: 180 },
  { field: 'streetNumber', headerName: 'Street Number', width: 100 },
  { field: 'active', headerName: 'Active Status', width: 100 },
  { field: 'procedures', headerName: 'Procedures', width: 180 },
  { field: 'registerDate', headerName: 'Register Date', width: 200 },
  { field: 'lastLogin', headerName: 'Last Login', width: 180 },
  { field: 'lastFeed', headerName: 'Last Post Time', width: 180 },
  { field: 'phone', headerName: 'Phone Number', width: 180 },
  { field: 'email', headerName: 'Email Address', width: 180 },
  { field: 'username', headerName: 'Username', width: 180 },
  { field: 'verifiedEmail', headerName: 'Verified Email', width: 100 },
  { field: 'feeds', headerName: 'Feeds Length', width: 100 },
  { field: 'followers', headerName: 'Followers Length', width: 100 },
  { field: 'followings', headerName: 'Followings Length', width: 100 },
  { field: 'id', headerName: 'ID', width: 300 },
];

export default function Users() {
  const [loading, setLoading] = React.useState(true);
  const [users] = useOutletContext();
  const dispatch = useDispatch();

  const rows = users?.map((item, index) => {
    return {
      id: item._id,
      admin: item.admin,
      name: item.name,
      type: item.type,
      country: item.address[0].country,
      region: item.address[0].region,
      city: item.address[0].city,
      district: item.address[0].district,
      address: item.address[0].street,
      streetNumber: item.address[0].number,
      active: item.active,
      procedures: item.procedures[0]?.value,
      registerDate: item.createdAt,
      lastLogin: item.lastLoginAt,
      lastFeed: item.lastPostCreatedAt,
      username: item.username,
      phone: item.phone,
      email: item.email,
      verifiedEmail: item.verifiedEmail,
      feeds: item.feeds?.length,
      followers: item.followers?.length,
      followings: item.followings?.length,
    };
  });

  // define checked user
  const [newSelectionModel, setNewSelectionModel] = React.useState();

  const checkedUsers = users?.find((item, index) => {
    if (newSelectionModel) {
      return item._id === newSelectionModel[0];
    }
  });

  /// edit user
  const [openEdit, setOpenEdit] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [rows]);

  return (
    <div
      style={{ height: 'calc(100% - 3vw)', width: '100%', background: '#fff' }}
    >
      {loading ? (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      ) : (
        <>
          <Header>
            <button>Add user</button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <h4>Users: </h4>
              <h4>{rows?.length}</h4>
            </div>
            {newSelectionModel?.length === 1 &&
              checkedUsers?.type !== 'user' && (
                <ProceduresList procedures={checkedUsers.procedures} />
              )}
            {newSelectionModel?.length === 1 && (
              <AddressesList addresses={checkedUsers.address} />
            )}
            {newSelectionModel?.length === 1 && (
              <MediaList media={checkedUsers.media} />
            )}
            {newSelectionModel?.length === 1 &&
              checkedUsers?.type !== 'user' && (
                <WDaysList WDays={checkedUsers.workingDays} />
              )}
          </Header>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={13}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onSelectionModelChange={(id) => {
              setNewSelectionModel(id);
            }}
          />
        </>
      )}
    </div>
  );
}

const Header = styled.div`
  height: 3vw;
  display: flex;
  align-items: center;
  gap: 2vw;
  box-sizing: border-box;
  padding: 0 1vw;
`;

const LoadingContainer = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
