import {
  DynamicFeedSharp,
  EuroRounded,
  InboxOutlined,
  SupervisedUserCircleRounded,
  SupervisedUserCircleTwoTone,
} from '@material-ui/icons';
import {
  AnalyticsRounded,
  MarkEmailReadRounded,
  NotificationAddRounded,
  PieChartOutlineRounded,
  ReplayCircleFilledRounded,
} from '@mui/icons-material';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import * as React from 'react';

export default function DashboardList({ activeState, setActiveState }) {
  console.log(activeState);

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 360,
        // bgcolor: 'red',
        borderRadius: '20px',
        border: '1.5px solid rgba(255,255,255,0.1)',
        margin: '15px',
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          component="div"
          id="nested-list-subheader"
          style={{
            background: 'none',
            color: '#f866b1',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            fontWeight: 500,
            letterSpacing: '0.5px',
            fontSize: '18px',
          }}
        >
          Dashboard
        </ListSubheader>
      }
    >
      <ListItemButton
        onClick={() => setActiveState('Users')}
        style={{
          color: '#ccc',
          border:
            activeState === 'Users'
              ? '1.5px solid #f866b1'
              : '1.5px solid rgba(255,255,255,0.1)',
          margin: '8px',
          borderRadius: '10px',
        }}
      >
        <ListItemIcon>
          <SupervisedUserCircleRounded
            style={{
              color: '#ccc',
            }}
          />
        </ListItemIcon>
        <ListItemText primary="Users" />
      </ListItemButton>
      <ListItemButton
        onClick={() => setActiveState('Feeds')}
        style={{
          color: '#ccc',
          border:
            activeState === 'Feeds'
              ? '1.5px solid #f866b1'
              : '1.5px solid rgba(255,255,255,0.1)',
          margin: '8px',
          borderRadius: '10px',
        }}
      >
        <ListItemIcon>
          <DynamicFeedSharp
            style={{
              color: '#ccc',
            }}
          />
        </ListItemIcon>
        <ListItemText primary="Feeds" />
      </ListItemButton>
      <ListItemButton
        onClick={() => setActiveState('Analytics')}
        style={{
          color: '#ccc',
          border:
            activeState === 'Analytics'
              ? '1.5px solid #f866b1'
              : '1.5px solid rgba(255,255,255,0.1)',
          margin: '8px',
          borderRadius: '10px',
        }}
      >
        <ListItemIcon>
          <AnalyticsRounded
            style={{
              color: '#ccc',
            }}
          />
        </ListItemIcon>
        <ListItemText primary="Analytics" />
      </ListItemButton>
      <ListItemButton
        onClick={() => setActiveState('Corrector')}
        style={{
          color: '#ccc',
          border:
            activeState === 'Corrector'
              ? '1.5px solid #f866b1'
              : '1.5px solid rgba(255,255,255,0.1)',
          margin: '8px',
          borderRadius: '10px',
        }}
      >
        <ListItemIcon>
          <ReplayCircleFilledRounded
            style={{
              color: '#ccc',
            }}
          />
        </ListItemIcon>
        <ListItemText primary="Corrector" />
      </ListItemButton>
      <ListItemButton
        onClick={() => setActiveState('Reports')}
        style={{
          color: '#ccc',
          border:
            activeState === 'Reports'
              ? '1.5px solid #f866b1'
              : '1.5px solid rgba(255,255,255,0.1)',
          margin: '8px',
          borderRadius: '10px',
        }}
      >
        <ListItemIcon>
          <InboxOutlined
            style={{
              color: '#ccc',
            }}
          />
        </ListItemIcon>
        <ListItemText primary="Reports" />
      </ListItemButton>
      <ListItemButton
        onClick={() => setActiveState('Send Notifications')}
        style={{
          color: '#ccc',
          border:
            activeState === 'Send Notifications'
              ? '1.5px solid #f866b1'
              : '1.5px solid rgba(255,255,255,0.1)',
          margin: '8px',
          borderRadius: '10px',
        }}
      >
        <ListItemIcon>
          <NotificationAddRounded
            style={{
              color: '#ccc',
            }}
          />
        </ListItemIcon>
        <ListItemText primary="Send Notifications" />
      </ListItemButton>
      <ListItemButton
        onClick={() => setActiveState('Send Emails')}
        style={{
          color: '#ccc',
          border:
            activeState === 'Send Emails'
              ? '1.5px solid #f866b1'
              : '1.5px solid rgba(255,255,255,0.1)',
          margin: '8px',
          borderRadius: '10px',
        }}
      >
        <ListItemIcon>
          <MarkEmailReadRounded
            style={{
              color: '#ccc',
            }}
          />
        </ListItemIcon>
        <ListItemText primary="Send Emails" />
      </ListItemButton>
      <ListItemButton
        onClick={() => setActiveState('Team')}
        style={{
          color: '#ccc',
          border:
            activeState === 'Team'
              ? '1.5px solid #f866b1'
              : '1.5px solid rgba(255,255,255,0.1)',
          margin: '8px',
          borderRadius: '10px',
        }}
      >
        <ListItemIcon>
          <SupervisedUserCircleTwoTone
            style={{
              color: '#ccc',
            }}
          />
        </ListItemIcon>
        <ListItemText primary="Team" />
      </ListItemButton>
      <ListItemButton
        onClick={() => setActiveState('Partners')}
        style={{
          color: '#ccc',
          border:
            activeState === 'Partners'
              ? '1.5px solid #f866b1'
              : '1.5px solid rgba(255,255,255,0.1)',
          margin: '8px',
          borderRadius: '10px',
        }}
      >
        <ListItemIcon>
          <PieChartOutlineRounded
            style={{
              color: '#ccc',
            }}
          />
        </ListItemIcon>
        <ListItemText primary="Partners" />
      </ListItemButton>
      <ListItemButton
        onClick={() => setActiveState('Financial')}
        style={{
          color: '#ccc',
          border:
            activeState === 'Financial'
              ? '1.5px solid #f866b1'
              : '1.5px solid rgba(255,255,255,0.1)',
          margin: '8px',
          borderRadius: '10px',
        }}
      >
        <ListItemIcon>
          <EuroRounded
            style={{
              color: '#ccc',
            }}
          />
        </ListItemIcon>
        <ListItemText primary="Financial" />
      </ListItemButton>

      <ListItemButton
        onClick={() => setActiveState('Inbox')}
        style={{
          color: '#ccc',
          border:
            activeState === 'Inbox'
              ? '1.5px solid #f866b1'
              : '1.5px solid rgba(255,255,255,0.1)',
          margin: '8px',
          borderRadius: '10px',
        }}
      >
        <ListItemIcon>
          <InboxIcon
            style={{
              color: '#ccc',
            }}
          />
        </ListItemIcon>
        <ListItemText primary="Inbox" />
        {/* {open ? <ExpandLess /> : <ExpandMore />} */}
      </ListItemButton>
      {/* <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton
            sx={{ pl: 4 }}
            style={{
              color: '#ccc',
              border: '1.5px solid rgba(255,255,255,0.1)',
              margin: '0 8px 8px 25px',
              borderRadius: '10px',
            }}
          >
            <ListItemIcon>
              <StarBorder
                style={{
                  color: '#ccc',
                }}
              />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItemButton>
        </List>
      </Collapse> */}
    </List>
  );
}
