import * as React from 'react';
import styled from 'styled-components';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { BsListCheck } from 'react-icons/bs';
import { ProceduresOptions } from '../../data/registerDatas';

export default function ProceduresPopup(props) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const proceduresOptions = ProceduresOptions();
  return (
    <div>
      <div>
        <BsListCheck
          size={20}
          style={{ cursor: 'pointer' }}
          onClick={() => setOpen(true)}
        />
      </div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {props?.language?.language.User.userPage.service}
        </DialogTitle>
        <DialogContent>
          {props.procedures?.map((item, index) => {
            const langProc = proceduresOptions?.find(
              (it) => it?.value === item?.value
            );
            return (
              <div
                key={index}
                style={{ padding: '10px', borderBottom: '1px solid #f3f3f3' }}
              >
                {langProc?.label}
              </div>
            );
          })}
        </DialogContent>
      </Dialog>
    </div>
  );
}

const Container = styled.div`
  cursor: pointer;

  .item {
    :hover {
      background: #f3f3f3;
    }
  }

  .text {
    font-weight: bold;
  }

  .logo {
    font-size: 1.7vw;
    margin-right: 0.25vw;
    // color: #c743e4;

    @media only screen and (max-width: 600px) {
      font-size: 6.5vw;
      margin-right: 1vw;
    }
  }
`;
