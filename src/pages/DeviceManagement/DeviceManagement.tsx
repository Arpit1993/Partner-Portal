import {
  Typography,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  AlertColor
} from '@mui/material';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import AddNewModel from 'components/AddModel/AddModelNew';
import Select from 'core-components/Select';
import {
  createEngineeringDeviceModel,
  createProductionDeviceModel,
  getEngineeringAllDeviceModel,
  getProductionAllDeviceModel
} from 'data/api/zeus';
import Button from 'core-components/Button';
import { getItemFromLocalStorage, isEngineering } from 'utils';
import {
  ICreateDeviceModelResponse,
  IOemModelResponse
} from 'types/response/zeus/deviceTypes';
import DeviceDetails from 'components/DeviceDetails/DeviceDetails';
import CardWithShadow from 'core-components/CardWithShadow';
import InstaSnackBar from 'components/SnackBar';
import { ADD_CAMERA_MODEL_STEPS } from 'enums';

const MainContainer = styled('main')``;

const Header = styled('header')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled('div')``;

const ModelType = styled(Select)`
  height: 56px;
`;

const AddUserFormButton = styled(Button)`
  width: 200px;
  font-size: 16px;
  font-weight: 500;
  height: 56px;
`;

const LoaderWrapper = styled('div')`
  text-align: center;
  padding-bottom: 40px;
`;

function DeviceManagement() {
  const [openAddDeviceModal, setAddDeviceModal] = useState(false);
  const [value, setValue] = useState('All');
  const [filterCategory, setFilterCategory] = useState('');
  const [deviceModelsList, setDeviceModelsList] = useState<IOemModelResponse[]>(
    []
  );
  const [isAddingDeviceModelLoading, setIsAddingDeviceModelLoading] =
    useState(false);
  const [isLoadingDeviceModelList, setIsLoadingDeviceModelList] =
    useState(false);
  const [dIdReceivedFromAdd, setDidReceivedFromAdd] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');
  const isEngineeringFlow = isEngineering();
  const [currentStep, setCurrentStep] = useState(
    ADD_CAMERA_MODEL_STEPS.STEP_ONE
  );
  const oemId = getItemFromLocalStorage('oem_id');

  const fetchDeviceModelListApi = isEngineeringFlow
    ? getEngineeringAllDeviceModel
    : getProductionAllDeviceModel;

  const createDeviceModelApi = isEngineeringFlow
    ? createEngineeringDeviceModel
    : createProductionDeviceModel;

  // console.log('EngineeringDeviceManagement: ', isEngineeringFlow);
  // console.log('oemId: ', oemId);

  const fetchDeviceModels = async () => {
    const param = '';
    try {
      setIsLoadingDeviceModelList(true);
      const deviceModelsListResponse = await fetchDeviceModelListApi(
        oemId,
        param
      );
      // console.log('Response', deviceModelsListResponse);
      const items = deviceModelsListResponse?.items;
      // console.log('Items after extraction:', items);
      setDeviceModelsList(items);

      // if (Array.isArray(items)) {
      //   console.log('Items after extraction:', items);
      //   setDeviceModelsList(items);
      // } else {
      //   console.warn('Items is not an array or is undefined:', items);
      //   setDeviceModelsList([]);
      // }
    } catch (error) {
      console.log('Error in loading device model list: ', error);
    } finally {
      setIsLoadingDeviceModelList(false);
    }
  };

  const fetchDeviceModelsOnFilter = async () => {
    setIsLoadingDeviceModelList(true);
    setDeviceModelsList([]);
    let param = '';
    try {
      let deviceModelsListResponse;
      if (filterCategory === 'All' || !filterCategory) {
        // Call API without product_type parameter
        deviceModelsListResponse = await fetchDeviceModelListApi(oemId, param);
      } else {
        // Call API with product_type parameter
        param = `?product_type=${filterCategory}`;
        deviceModelsListResponse = await fetchDeviceModelListApi(oemId, param);
      }
      setDeviceModelsList(deviceModelsListResponse?.items);
    } catch (error) {
      console.log('Error in loading device model list: ', error);
    } finally {
      setIsLoadingDeviceModelList(false);
    }
  };

  useEffect(() => {
    fetchDeviceModelsOnFilter();
  }, [filterCategory]);

  useEffect(() => {
    setDeviceModelsList([]);
    fetchDeviceModels();
  }, [isEngineeringFlow]);

  const handleOpenAddDeviceModal = () => {
    setAddDeviceModal(true);
  };

  const handleCloseAddDeviceModal = () => {
    setAddDeviceModal(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddButtonClick = async (values: any) => {
    setSnackbarOpen(false);
    let addDeviceModelResponse: ICreateDeviceModelResponse | string = '';
    setIsAddingDeviceModelLoading(true);
    try {
      addDeviceModelResponse = await createDeviceModelApi(oemId, values);
      const { id } = addDeviceModelResponse;
      setDidReceivedFromAdd(id);
      setSnackbarMessage(
        'Model created successfully. Please add device model image and datasheet.'
      );
      setSeverity('success');
      setSnackbarOpen(true);
      setCurrentStep(ADD_CAMERA_MODEL_STEPS.STEP_TWO);
    } catch (error) {
      console.log('Error: ', error);
      setSnackbarMessage('Failed to create device model. Please try again.');
      setSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsAddingDeviceModelLoading(false);
    }
    console.log('addDeviceResponse: ', addDeviceModelResponse);
    // setAddDeviceModal(false);
  };

  const setValueFunc = (event: SelectChangeEvent<unknown>) => {
    const selectedCategory = event.target.value as string;
    setValue(selectedCategory);
    setFilterCategory(selectedCategory);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Close the snackbar
  };

  // const filteredDeviceModels = deviceModelsList.filter(
  //   (deviceModel: IGetDeviceModelResponse) => {
  //     if (!filterCategory || filterCategory === 'All') return true;

  //     return deviceModel.product_type
  //       .toLowerCase()
  //       .includes(filterCategory.toLowerCase());
  //   }
  // );

  const handleCloseAddDeviceSecondForm = () => {
    setAddDeviceModal(false);
    setCurrentStep(ADD_CAMERA_MODEL_STEPS.STEP_ONE);
    setDeviceModelsList([]);
    fetchDeviceModels();
  };

  return (
    <MainContainer>
      <Header>
        <Typography variant="h2" sx={{ fontWeight: '500' }}>
          {isEngineeringFlow
            ? 'Engineering Device Management'
            : 'Production Device Management'}
        </Typography>
        <ButtonContainer>
          <ModelType
            id="product_type"
            style={{ fontSize: '16px', fontWeight: '500', marginRight: '20px' }}
            value={value}
            onChange={setValueFunc}
            defaultValue="All"
            sx={{
              width: '200px',
              '& .MuiSelect-select span::before': {
                content: "'All'",
                color: 'text.title'
              }
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="HomeSecurity">Home Security</MenuItem>
            <MenuItem value="Baby">Baby</MenuItem>
          </ModelType>
          {isEngineeringFlow && (
            <AddUserFormButton
              label="Add new Model"
              handleClick={handleOpenAddDeviceModal}
              sx={{ fontSize: '16px' }}
            >
              Add New Model
            </AddUserFormButton>
          )}
          <AddNewModel
            openModal={openAddDeviceModal}
            closeModal={handleCloseAddDeviceModal}
            addModelButtonClick={handleAddButtonClick}
            isAddingDeviceModelLoading={isAddingDeviceModelLoading}
            dId={dIdReceivedFromAdd}
            handleCloseAddDeviceSecondForm={handleCloseAddDeviceSecondForm}
            currentStep={currentStep}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            setSeverity={setSeverity}
          />
        </ButtonContainer>
      </Header>
      {isLoadingDeviceModelList && (
        <CardWithShadow style={{ padding: '40px 0px' }}>
          <LoaderWrapper>
            <CircularProgress color="inherit" />
          </LoaderWrapper>
          <Typography
            variant="h4"
            sx={{ textAlign: 'center', fontWeight: '500' }}
          >
            Loading
          </Typography>
        </CardWithShadow>
      )}

      {!isLoadingDeviceModelList &&
      (!deviceModelsList || deviceModelsList.length === 0) ? (
        <CardWithShadow>
          <Typography
            variant="h4"
            sx={{ textAlign: 'center', margin: '80px 0px', fontWeight: '500' }}
          >
            No Devices Are Available
          </Typography>
        </CardWithShadow>
      ) : (
        <DeviceDetails
          deviceModels={deviceModelsList}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
          setSeverity={setSeverity}
          fetchDeviceList={fetchDeviceModelsOnFilter}
        />
      )}
      {snackbarOpen && (
        <InstaSnackBar
          message={snackbarMessage}
          severity={severity}
          open={snackbarOpen}
          onClose={handleSnackbarClose}
        />
      )}
    </MainContainer>
  );
}

export default DeviceManagement;
