import { useEffect, useState } from 'react';

// export default function VisitorId({ targetUserId, path }) {
//   const [uniqueId, setUniqueId] = useState('');
//   function GetUniqueId() {
//     fetch(`https://beautyverse.herokuapp.com/uniqueId`)
//       .then((response) => response.json())
//       .then((data) => {
//         setUniqueId(data);
//       })
//       .catch((error) => {
//         console.log('Error fetching data:', error);
//       });
//   }
//   GetUniqueId();

/// add to firebase

// let userUniqueId;
// if (currentUser !== null) {
//   userUniqueId = currentUser?.uid;
// } else {
//   userUniqueId = uniqueId;
// }

// useEffect(() => {
//   if (userUniqueId?.length > 0) {
//     const indicator = new Date().toString().slice(4, 10) + "-" + userUniqueId;
//     if (targetUserId !== currentUser?.uid) {
//       const DefineVisitor = async () => {
//         await setDoc(doc(db, "users", targetUserId, path, indicator), {
//           indicator: indicator,
//           date: serverTimestamp(),
//           type: currentUser !== null ? "registered" : "visitor",
//         });
//       };
//       DefineVisitor();
//     }
//   }
// }, [userUniqueId]);
// }
