import CardWithDivider from 'core-components/CardWithDivider';
import styled from '@emotion/styled';
import { Typography, MenuItem, SelectChangeEvent } from '@mui/material';
import MuiCard from '@mui/material/Card';
import Select from 'core-components/Select';
import { useState } from 'react';
import AddUser from '../AddUser/AddUser';

export interface DeviceManageFirmwareResponse {
  version: string;
  status: string;
  notes: {
    title: string;
    content: string;
  };
  timeDate: {
    date: string;
    time: string;
  };
}

const TableHeaderContainer = styled(MuiCard)`
  margin-bottom: 12px;
`;

const Header = styled('header')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const DisplayText = styled('section')`
  display: flex;
  justify-content: space-evenly;
  text-align: left;
  padding: 20px 20px;
`;

const Item = styled(Typography)`
  text-align: left;
`;

const HeaderItem = styled(Typography)`
  text-align: left;
  font-weight: 600;
`;

const DeviceManageFirmwareDetails = styled(CardWithDivider)`
  max-height: 240px;
  overflow-y: auto;

  /* Custom scrollbar styles for WebKit-based browsers */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555; /* Color when hovering over the thumb */
  }

  /* Custom scrollbar styles for Firefox */
  scrollbar-width: thin;
  scrollbar-color: #f1f1f1;
`;

function ProdDeviceManageFirmware() {
  const [value, setValue] = useState('Security');

  const setValueFunc = (event: SelectChangeEvent<unknown>) => {
    setValue(event.target.value as string);
  };
  const DeviceFirmwarelist: DeviceManageFirmwareResponse[] = [
    {
      version: 'V012094.59',
      status: 'Approved',
      notes: {
        title: 'Title',
        content: 'Lorem Impsum'
      },
      timeDate: {
        date: '01.02.2024',
        time: '9.00AM'
      }
    },
    {
      version: 'V012094.59',
      status: 'Waiting for Approval',
      notes: {
        title: 'Title',
        content: 'Lorem Impsum'
      },
      timeDate: {
        date: '01.02.2024',
        time: '9.00AM'
      }
    },
    {
      version: 'V012094.59',
      status: 'Approval',
      notes: {
        title: 'Title',
        content: 'Lorem Impsum'
      },
      timeDate: {
        date: '01.02.2024',
        time: '9.00AM'
      }
    },
    {
      version: 'V012094.59',
      status: 'Approval',
      notes: {
        title: 'Title',
        content: 'Lorem Impsum'
      },
      timeDate: {
        date: '01.02.2024',
        time: '9.00AM'
      }
    },
    {
      version: 'V012094.59',
      status: 'Approval',
      notes: {
        title: 'Title',
        content: 'Lorem Impsum'
      },
      timeDate: {
        date: '01.02.2024',
        time: '9.00AM'
      }
    },
    {
      version: 'V012094.59',
      status: 'Approval',
      notes: {
        title: 'Title',
        content: 'Lorem Impsum'
      },
      timeDate: {
        date: '01.02.2024',
        time: '9.00AM'
      }
    }
  ];

  function createElem(list: DeviceManageFirmwareResponse[] = []) {
    return list.map((element) => {
      if (element) {
        return (
          <DisplayText key={element.version}>
            <Item variant="body2" style={{ flex: 1 }}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  width: 'fit-content',
                  textAlign: 'center',
                  padding: '8px 20px'
                }}
              >
                <Typography variant="body2" color="primary.main">
                  {element.version}
                </Typography>
              </div>
            </Item>
            <Item style={{ flex: 2 }}>
              <div
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  width: 'fit-content',
                  textAlign: 'center',
                  padding: '8px 20px'
                }}
              >
                <Typography variant="body2" sx={{ color: 'primary.main' }}>
                  {element.status}
                </Typography>
              </div>
            </Item>
            <Item sx={{ flex: 2 }}>
              <Item
                variant="body2"
                style={{
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '8px'
                }}
              >
                {element.notes.title}
              </Item>
              <Item
                variant="body2"
                style={{ fontWeight: '400', color: '#333' }}
              >
                {element.notes.content}
              </Item>
            </Item>
            <Item sx={{ flex: 2 }}>
              <Item
                variant="body2"
                style={{
                  fontWeight: '500',
                  color: '#333',
                  marginBottom: '8px'
                }}
              >
                {element.timeDate.date}
              </Item>
              <Item
                variant="body2"
                style={{ fontWeight: '400', color: '#333' }}
              >
                {element.timeDate.time}
              </Item>
            </Item>
          </DisplayText>
        );
      }
      return null;
    });
  }

  return (
    <div style={{ margin: '40px 0px' }}>
      <Header>
        <Typography variant="h3" sx={{ fontWeight: '500', flex: 2 }}>
          MANAGE FIRMWARE
        </Typography>
        <AddUser />
        <Select
          sx={{ width: '160px' }}
          style={{ fontSize: '16px', fontWeight: '500', marginLeft: '16px' }}
          value={value}
          onChange={setValueFunc}
        >
          {' '}
          <MenuItem value="Security">Filter</MenuItem>
          <MenuItem value="Home">Home</MenuItem>
          <MenuItem value="Outdoor">Outdoor</MenuItem>
          <MenuItem value="Baby">Baby</MenuItem>
        </Select>
      </Header>
      <TableHeaderContainer variant="instavisionCardWithBorder">
        <DisplayText>
          <HeaderItem variant="body2" style={{ flex: 1 }}>
            Version
          </HeaderItem>
          <HeaderItem variant="body2" style={{ flex: 2 }}>
            Status
          </HeaderItem>
          <HeaderItem variant="body2" style={{ flex: 2 }}>
            Note
          </HeaderItem>
          <HeaderItem variant="body2" style={{ flex: 2 }}>
            Date
          </HeaderItem>
        </DisplayText>
      </TableHeaderContainer>
      <DeviceManageFirmwareDetails sx={{ height: '264px' }}>
        {createElem(DeviceFirmwarelist)}
      </DeviceManageFirmwareDetails>
    </div>
  );
}

export default ProdDeviceManageFirmware;
