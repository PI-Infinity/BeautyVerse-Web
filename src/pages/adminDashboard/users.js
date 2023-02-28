import * as React from "react";
import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { BsListCheck } from "react-icons/bs";
import { Spinner } from "../../components/loader";
import { AiTwotoneEdit, AiFillDelete } from "react-icons/ai";
import EditUser from "../../pages/adminDashboard/users-editUser";
import DeleteUser from "../../pages/adminDashboard/users-deleteUser";
import ProceduresList from "../../pages/adminDashboard/users-proceduresList";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 180 },
  { field: "type", headerName: "Type", width: 180 },
  { field: "country", headerName: "Country", width: 150 },
  { field: "region", headerName: "region", width: 150 },
  { field: "city", headerName: "City", width: 150 },
  { field: "district", headerName: "District", width: 180 },
  { field: "address", headerName: "Address", width: 180 },
  { field: "streetNumber", headerName: "Street Number", width: 70 },
  { field: "procedures", headerName: "Procedures", width: 180 },
  { field: "registerDate", headerName: "Register Date", width: 200 },
  { field: "lastLogin", headerName: "Last Login", width: 180 },
  { field: "lastFeed", headerName: "Last Post Time", width: 180 },
  { field: "phone", headerName: "Phone Number", width: 180 },
  { field: "email", headerName: "Email Address", width: 180 },
  { field: "password", headerName: "Password", width: 180 },
  { field: "uid", headerName: "Uid", width: 180 },
];

// const rows = [
//   { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
//   { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
//   { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
//   { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
//   { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
//   { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
//   { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
//   { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
//   { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
// ];

export default function Users() {
  const [loading, setLoading] = React.useState(true);

  const users = useSelector((state) => state.storeMain.userList);
  let rows;
  if (users?.length > 0) {
    rows = JSON.parse(users)?.map((item, index) => {
      return {
        id: index + 1,
        name: item?.name,
        type: item?.type,
        country: item?.address?.country,
        region: item?.address?.region,
        city: item?.address?.city,
        district: item?.address?.district,
        address: item?.address?.address,
        streetNumber: item?.address?.streetNumber,
        registerDate: new Date(item?.registerDate?.seconds * 1000)
          .toString()
          .slice(3, 21),
        lastLogin: new Date(item?.lastLogin?.seconds * 1000)
          .toString()
          .slice(3, 21),
        lastFeed: new Date(item?.lastPost?.seconds * 1000)
          .toString()
          .slice(3, 21),
        phone: item?.phone,
        email: item?.email,
        password: item?.password,
        uid: item?.id,
      };
    });
  }

  // define checked user
  const [newSelectionModel, setNewSelectionModel] = React.useState();

  const checkedUsers = newSelectionModel?.map((x, y) => {
    const user = rows?.find((item, index) => {
      return index + 1 === x;
    });
    return user;
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
      style={{ height: "calc(100% - 3vw)", width: "100%", background: "#fff" }}
    >
      {loading ? (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      ) : (
        <>
          <Header>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <h4>Users: </h4>
              <h4>{rows?.length}</h4>
            </div>
            {checkedUsers?.length === 1 && checkedUsers[0]?.type !== "user" && (
              <ProceduresList id={checkedUsers[0]?.uid} />
            )}
            {/* {checkedUsers?.length === 1 && checkedUsers[0]?.type !== "user" && (
              <EditUser />
            )}
            {checkedUsers?.length > 0 && <DeleteUser />} */}
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
