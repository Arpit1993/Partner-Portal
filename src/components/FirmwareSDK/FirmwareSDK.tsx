import CardWithDivider from 'core-components/CardWithDivider';
import styled from '@emotion/styled';
import { ReactComponent as DownloadIcon } from 'assets/new-assets/documentDownload.svg';
import { Typography } from '@mui/material';
import MuiCard from '@mui/material/Card';

export interface FirmwareSDKResponse {
  version: string;
  download_link: string;
  version_notes: {
    title: string;
    content: string;
  };
}

const DownloadIconBlack = styled(DownloadIcon)`
  path {
    stroke: #000;
  }
  margin-right: 10px;
`;

const HeaderContainer = styled(MuiCard)`
  margin-bottom: 12px;
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

const FirwareAndSDKDetails = styled(CardWithDivider)`
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

function FirmwareSDK() {
  const Firwarelist: FirmwareSDKResponse[] = [
    {
      version: 'V012094.59',
      download_link: 'https://localhost/link1',
      version_notes: {
        title: 'App Released on 20 Aug',
        content:
          'Details about this app release new feature bug fixes new modes'
      }
    },
    {
      version: 'V012094.59',
      download_link: 'https://localhost/link2',
      version_notes: {
        title: 'App Released on 19 Feb',
        content:
          'Details about this app release new feature bug fixes new modes'
      }
    },
    {
      version: 'V012094.59',
      download_link: 'https://localhost/link3',
      version_notes: {
        title: 'App Released on 19 Jan',
        content:
          'Details about this app release new feature bug fixes new modes'
      }
    },
    {
      version: 'V012094.59',
      download_link: 'https://localhost/link3',
      version_notes: {
        title: 'App Released on 19 Jan',
        content:
          'Details about this app release new feature bug fixes new modes'
      }
    },
    {
      version: 'V012094.59',
      download_link: 'https://localhost/link3',
      version_notes: {
        title: 'App Released on 19 Jan',
        content:
          'Details about this app release new feature bug fixes new modes'
      }
    }
  ];

  function createElem(list: FirmwareSDKResponse[] = []) {
    return list.map((element) => {
      if (element) {
        return (
          <DisplayText key={element.version}>
            <Item variant="body2" style={{ flex: 1 }}>
              <span style={{ fontWeight: '500' }}>{element.version}</span>
            </Item>
            <Item variant="body2" style={{ flex: 1 }}>
              <a
                href={element.download_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span style={{ fontWeight: '500' }}>
                  <DownloadIcon style={{ marginRight: '8px' }} /> Download
                </span>
              </a>
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
                {element.version_notes.title}
              </Item>
              <Item
                variant="body2"
                style={{ fontWeight: '400', color: '#333' }}
              >
                {element.version_notes.content}
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
      <HeaderContainer variant="instavisionCardWithBorder">
        <DisplayText>
          <HeaderItem variant="body2" style={{ flex: 1 }}>
            Version
          </HeaderItem>
          <HeaderItem variant="body2" style={{ flex: 1 }}>
            <DownloadIconBlack /> Download
          </HeaderItem>
          <HeaderItem variant="body2" style={{ flex: 2 }}>
            Version Notes
          </HeaderItem>
        </DisplayText>
      </HeaderContainer>
      <FirwareAndSDKDetails sx={{ height: '264px' }}>
        {createElem(Firwarelist)}
      </FirwareAndSDKDetails>
    </div>
  );
}

export default FirmwareSDK;
