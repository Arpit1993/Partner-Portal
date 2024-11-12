import styled from 'styled-components';
import CircularProgress from '@mui/material/CircularProgress';

const Container = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
function Spinner() {
  return (
    <Container>
      <CircularProgress />
    </Container>
  );
}
export default Spinner;
