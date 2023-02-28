import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  collectionGroup,
  query,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector, useDispatch } from "react-redux";
import { AiTwotoneEdit, AiFillDelete } from "react-icons/ai";
import AlertDialog from "../../components/dialog";
import { Language } from "../../context/language";
import { Spinner } from "../../components/loader";

export default function AllFeeds() {
  const [loading, setLoading] = React.useState(true);

  const language = Language();
  const [feeds, setFeeds] = useState();
  const [lim, setLim] = useState(50);
  useEffect(() => {
    const Getting = async () => {
      const ref = query(collectionGroup(db, "feeds"), limit(lim));
      const docs = await getDocs(ref);
      let list = [];
      docs.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        list.push(doc.data());
      });
      setFeeds(list?.sort((a, b) => b.addTime - a.addTime));
    };
    Getting();
  }, [lim]);

  // users
  const users = useSelector((state) => state.storeMain.userList);
  let Data;
  if (users?.length > 0) {
    Data = JSON.parse(users);
  }

  // open delete dialog
  const [openDelete, setOpenDelete] = useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [feeds]);

  return (
    <div>
      {loading ? (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      ) : (
        <>
          <div
            style={{
              padding: "20px 20px 10px 20px",
              boxSizing: "border-box",
              display: "flex",
              gap: "10px",
            }}
          >
            <AlertDialog
              open={openDelete}
              setOpen={setOpenDelete}
              title="Confirm delete!"
              language={language}
              text="პოსტის ხარისხი არღვევს ბიუთივერსის წესებს!"
            />
            Limit:
            <input onChange={(e) => setLim(e.target.value)} value={lim} />
          </div>
          <div
            style={{
              overflowY: "scroll",
              height: "100vh",
              padding: "20px 20px 50px 20px",
              boxSizing: "border-box",
            }}
          >
            {feeds?.map((item, index) => {
              let user = Data?.find((it) => it.id === item?.owner);
              return (
                <div key={index}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <img
                      src={item.desktopJPEGurl}
                      alt={item.name}
                      width={400}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <b>{user?.name}</b>
                      <span>{user?.type}</span>
                      <div>
                        {new Date(item.addTime?.seconds * 1000)
                          .toString()
                          .slice(3, 21)}
                      </div>
                      <div>{item?.post}</div>
                    </div>
                    <AiFillDelete
                      size={30}
                      color="#ccc"
                      cursor="pointer"
                      onClick={() => setOpenDelete(true)}
                    />
                  </div>
                  <div
                    style={{
                      height: "0.3vw",
                      background: "#333",
                      width: "100%",
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

const LoadingContainer = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
