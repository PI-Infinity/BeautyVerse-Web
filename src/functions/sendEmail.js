// import React, { useState } from "react";
// import { send } from "@sendgrid/mail";

// function EmailForm() {
//   const [recipient, setRecipient] = useState("");
//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");
//   const [isSent, setIsSent] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await send({
//         to: recipient,
//         from: "your_email@your_domain.com",
//         subject: subject,
//         text: message,
//       });
//       setIsSent(true);
//     } catch (error) {
//       setError(error);
//     }
//   };

//   if (error) {
//     return (
//       <div>
//         <p>Error sending email:</p>
//         <p>{error.message}</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {isSent ? (
//         <p>Email sent!</p>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <label>
//             Recipient:
//             <input
//               type="email"
//               value={recipient}
//               onChange={(e) => setRecipient(e.target.value)}
//             />
//           </label>
//           <label>
//             Subject:
//             <input
//               type="text"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//             />
//           </label>
//           <label>
//             Message:
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             />
//           </label>
//           <button type="submit">Send</button>
//         </form>
//       )}
//     </>
//   );
// }

// export default EmailForm;
