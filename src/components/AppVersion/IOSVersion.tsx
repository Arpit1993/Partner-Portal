import CardWithDivider from 'core-components/CardWithDivider';
import styled from '@emotion/styled';
import { ReactComponent as LinkIcon } from 'assets/new-assets/link.svg';
import { Typography } from '@mui/material';
import MuiCard from '@mui/material/Card';

export interface IOSAppVersionResponse {
  version: string;
  version_notes: string;
  link: string;
}

const LinkIconBlack = styled(LinkIcon)`
  path {
    stroke: #000;
  }
`;

const DisplayText = styled('section')`
  display: flex;
  justify-content: space-evenly;
  text-align: left;
  padding: 20px 20px;
`;

const Item = styled(Typography)`
  text-align: left;
  font-weight: 500;
  color: #333;
`;

const HeaderItem = styled(Typography)`
  text-align: left;
  font-weight: 600;
  color: #333;
`;

const HeaderContainer = styled(MuiCard)`
  margin-bottom: 12px;
`;
const AppVersionDetails = styled(CardWithDivider)`
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

function IOSVersion() {
  const AppVersionlist: IOSAppVersionResponse[] = [
    {
      version: 'V012094.59',
      version_notes: 'app released on 20 Aug',
      link: 'https://localhost/link1'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 19 Feb',
      link: 'https://localhost/link2'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 19 Jan',
      link: 'https://localhost/link3'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 20 Aug',
      link: 'https://localhost/link1'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 19 Feb',
      link: 'https://localhost/link2'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 19 Jan',
      link: 'https://localhost/link3'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 20 Aug',
      link: 'https://localhost/link1'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 19 Feb',
      link: 'https://localhost/link2'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 19 Jan',
      link: 'https://localhost/link3'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 20 Aug',
      link: 'https://localhost/link1'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 19 Feb',
      link: 'https://localhost/link2'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 19 Jan',
      link: 'https://localhost/link3'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 20 Aug',
      link: 'https://localhost/link1'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 19 Feb',
      link: 'https://localhost/link2'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 19 Jan',
      link: 'https://localhost/link3'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 20 Aug',
      link: 'https://localhost/link1'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 19 Feb',
      link: 'https://localhost/link2'
    },
    {
      version: 'V012094.59',
      version_notes: 'app released on 19 Jan',
      link: 'https://localhost/link3'
    }
  ];

  function createElem(list: IOSAppVersionResponse[] = []) {
    return list.map((element) => {
      if (element) {
        return (
          <DisplayText key={element.version}>
            <Item variant="body2" style={{ flex: 1 }}>
              {element.version}
            </Item>
            <Item variant="body2" style={{ flex: 2 }}>
              {element.version_notes}
            </Item>
            <Item variant="body2" style={{ flex: 1 }}>
              <a href={element.link} target="_blank" rel="noopener noreferrer">
                <LinkIcon /> {element.link}
              </a>
            </Item>
          </DisplayText>
        );
      }
      return null;
    });
  }

  return (
    <div>
      <Typography variant="h3" sx={{ fontWeight: '500', marginBottom: '24px' }}>
        ANDROID APP VERSION
      </Typography>
      <HeaderContainer variant="instavisionCardWithBorder">
        <DisplayText>
          <HeaderItem variant="body2" style={{ flex: 1 }}>
            Version
          </HeaderItem>
          <HeaderItem variant="body2" style={{ flex: 2 }}>
            Version Notes
          </HeaderItem>
          <HeaderItem variant="body2" style={{ flex: 1 }}>
            <LinkIconBlack /> Link
          </HeaderItem>
        </DisplayText>
      </HeaderContainer>
      <AppVersionDetails sx={{ height: '242px', overflowY: 'scroll' }}>
        {createElem(AppVersionlist)}
      </AppVersionDetails>
    </div>
  );
}

export default IOSVersion;
