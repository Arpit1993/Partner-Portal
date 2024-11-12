// import { requestProductionDeviceModel } from 'data/api/zeus';
import { IOemModelResponse } from 'types/response/zeus/deviceTypes';
import { isEngineering } from 'utils';
// import { useState } from 'react';
// import { DEVICE_MODEL_STATUS } from 'enums';
import { DeviceList } from './DeviceList';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DeviceDetails(props: any) {
  // const [openRequestProductionModal, setOpenRequestProductionModal] =
  //   useState(false);
  // const [isRequestProductionLoading, setIsRequestProductionLoading] =
  //   useState(false);
  // const oem_id = getItemFromLocalStorage('oem_id');
  const isEngineeringFlow = isEngineering();
  const {
    deviceModels,
    setSnackbarOpen,
    setSnackbarMessage,
    setSeverity,
    fetchDeviceList
  } = props;

  // const openRequestProductionModalForm = () => {
  //   console.log('open Request Modal');
  //   setOpenRequestProductionModal(true);
  // };

  // const closeRequestProductionModalForm = () =>
  //   setOpenRequestProductionModal(false);

  // const onRequestProductionButtonClick = async (id: string) => {
  //   setSnackbarOpen(false);
  //   try {
  //     // API call here
  //     setIsRequestProductionLoading(true);
  //     const response = await requestProductionDeviceModel(oem_id, id);
  //     console.log(response);
  //     setSnackbarMessage('Device production model request successfully.');
  //     setSeverity('success');
  //     await fetchDeviceList();
  //   } catch (error) {
  //     console.error('error in request production', error);
  //     setSnackbarMessage('Failed to request production model.');
  //     setSeverity('error');
  //   } finally {
  //     setSnackbarOpen(true);
  //     setIsRequestProductionLoading(false);
  //     closeRequestProductionModalForm();
  //   }
  // };

  return deviceModels.map((deviceDetails: IOemModelResponse) => {
    return (
      <DeviceList
        deviceDetails={deviceDetails}
        isEngineeringFlow={isEngineeringFlow}
        key={deviceDetails.id}
        // openRequestProductionModal={openRequestProductionModal}
        // openRequestProductionModalForm={openRequestProductionModalForm}
        // closeRequestProductionModalForm={closeRequestProductionModalForm}
        // isRequestProductionLoading={isRequestProductionLoading}
        // onRequestProductionButtonClick={onRequestProductionButtonClick}
        fetchDeviceList={fetchDeviceList}
        setSeverity={setSeverity}
        setSnackbarOpen={setSnackbarOpen}
        setSnackbarMessage={setSnackbarMessage}
      />
    );
  });
}

export default DeviceDetails;
