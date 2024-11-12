import styled from '@emotion/styled';
import { CircularProgress, Typography } from '@mui/material';
import MuiCard from '@mui/material/Card';
import Button from 'core-components/Button';
import CardWithDivider from 'core-components/CardWithDivider';
import CardWithShadow from 'core-components/CardWithShadow';
import Input from 'core-components/Input';
import { editOemUser, removeOemUser } from 'data/api/zeus';
import { UI_USER_ROLES, USER_ROLES } from 'enums';
import { useState } from 'react';
import { IGetOEMUserResponse } from 'types/response/zeus/userTypes';
import {
  getItemFromLocalStorage,
  logout,
  parseJwt,
  setItemInLocalStorage
} from 'utils';
import { useNavigate } from 'react-router-dom';
import EditUser from '../EditUser/EditUser';
import RemoveUser from '../RemoveUser/RemoveUser';

const DisplayText = styled('section')`
  display: flex;
  justify-content: space-between;
  text-align: left;
  padding: 20px 24px;
`;

const Item = styled(Typography)`
  text-align: left;
  font-weight: 500;
`;

const UserDetailsContainer = styled(CardWithDivider)``;

const ItemContainer = styled('div')``;

const ButtonContainer = styled('div')`
  display: flex;
  gap: 16px;
`;

const SearchContainer = styled(MuiCard)`
  margin-bottom: 20px;
`;

const SearchField = styled(Input)`
  padding: 12px 24px;
`;

const EditUserFormButton = styled(Button)`
  width: 140px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
`;

const RemoveUserFormButton = styled(Button)`
  width: 140px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
`;

const LoaderWrapper = styled(MuiCard)`
  text-align: center;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UserDetails(props: any) {
  const [openEditUserModal, setEditUserModal] = useState(false);
  const [openRemoveUserModal, setRemoveUserModal] = useState(false);
  const [isEditingUserLoading, setIsEditingUserLoading] = useState(false);
  const [isRemovingUserLoading, setIsRemovingUserLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IGetOEMUserResponse | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');

  const {
    users,
    isLoading,
    fetchOemUsers,
    setSnackbarMessage,
    setSnackbarOpen,
    setSeverity,
    userId
  } = props;

  const navigate = useNavigate();

  const openEditModalForm = (user: IGetOEMUserResponse) => {
    setSelectedUser(user);
    setEditUserModal(true);
  };

  const closeEditModalForm = () => {
    setEditUserModal(false);
  };

  const handleEditButtonClick = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    values: any,
    user: IGetOEMUserResponse
  ) => {
    setIsEditingUserLoading(true);
    try {
      const response = await editOemUser(user?.oem_id, user?.id, values);
      setSeverity('success');
      setSnackbarMessage('User Details has been updated successfully.');
      setSnackbarOpen(true);

      if (
        response?.id ===
        parseJwt(getItemFromLocalStorage('auth-token'))?.user_id
      ) {
        setItemInLocalStorage('first_name', response?.name?.first);
        setItemInLocalStorage('last_name', response?.name?.last);
        setItemInLocalStorage('role', response?.role);
        window.location.reload();
      }
      fetchOemUsers();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('response status:', error?.response?.status);
      console.error('Failed to add user', error);

      // Error Handling for 400 and Other Status Codes
      if (error.response?.status === 400) {
        setSeverity('error');

        setSnackbarMessage(
          'Invalid Input Values. Failed to update user details.'
        );
        setSnackbarOpen(true);
      } else if (error?.response?.status === 401) {
        setSeverity('error');

        setSnackbarMessage(
          'Authorization failed: Please check your credentials.'
        );
        setSnackbarOpen(true);
      } else if (error?.response?.status === 500) {
        setSeverity('error');

        setSnackbarMessage('Server error: Please try again later.');
        setSnackbarOpen(true);
      } else {
        setSeverity('error');
        setSnackbarMessage('An unexpected error occurred. Please try again.');
        setSnackbarOpen(true);
      }
    } finally {
      setIsEditingUserLoading(false);
      setEditUserModal(false);
    }
  };

  const openRemoveUserModalForm = (user: IGetOEMUserResponse) => {
    setSelectedUser(user);
    setRemoveUserModal(true);
  };

  const closeRemoveModalForm = () => {
    setRemoveUserModal(false);
  };

  const handleRemoveUserButtonClick = async () => {
    if (!selectedUser) return;
    console.log('user email', selectedUser?.email);
    setIsRemovingUserLoading(true);
    try {
      await removeOemUser(selectedUser?.oem_id, selectedUser?.id);
      setEditUserModal(false);
      fetchOemUsers();
      setSeverity('success');
      setSnackbarMessage('User removed successfully.');
      setSnackbarOpen(true);
      if (userId === selectedUser?.id) {
        logout();
        navigate('/login');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log('Error:', error);
      if (error?.response?.status === 400) {
        setSeverity('error');

        setSnackbarMessage('User cannot be removed');
        setSnackbarOpen(true);
      } else if (error?.response?.status === 401) {
        setSeverity('error');

        setSnackbarMessage(
          'Authorization failed: Please check your credentials.'
        );
        setSnackbarOpen(true);
      } else if (error?.response?.status === 500) {
        setSeverity('error');
        setSnackbarMessage('Server error: Please try again later.');
        setSnackbarOpen(true);
      } else {
        setSeverity('error');
        setSnackbarMessage('An unexpected error occurred. Please try again.');
        setSnackbarOpen(true);
      }
    } finally {
      setIsRemovingUserLoading(false);
      setRemoveUserModal(false);
    }
  };

  const returnUserRole = (userRole: string) => {
    if (userRole === USER_ROLES.OEM_ADMIN) {
      return UI_USER_ROLES.OEM_ADMIN;
    }
    if (userRole === USER_ROLES.OEM_VIEWER) {
      return UI_USER_ROLES.OEM_VIEWER;
    }
    if (userRole === USER_ROLES.OEM_SUPER_ADMIN) {
      return UI_USER_ROLES.OEM_SUPER_ADMIN;
    }
    return '';
  };

  const userDetails = (usersList: IGetOEMUserResponse[]) => {
    return usersList?.map((user) => {
      if (user) {
        return (
          <DisplayText key={user?.id}>
            <ItemContainer style={{ flexGrow: 3, flexDirection: 'row' }}>
              <Item variant="body2" sx={{ color: 'text.title' }}>
                {user?.name?.first} {user?.name?.last}
              </Item>
              <Item variant="body2" sx={{ color: 'primary.main' }}>
                {returnUserRole(user?.role)}
              </Item>
            </ItemContainer>
            <ButtonContainer>
              <EditUserFormButton
                label="Edit User"
                handleClick={() => openEditModalForm(user)}
                sx={{ fontSize: '16px' }}
              >
                Edit
              </EditUserFormButton>
              {selectedUser && (
                <EditUser
                  openModal={openEditUserModal}
                  closeModal={closeEditModalForm}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onEditButtonClick={(values: any) =>
                    handleEditButtonClick(values, selectedUser)
                  }
                  isEditingUserLoading={isEditingUserLoading}
                  userData={selectedUser}
                />
              )}
              <RemoveUserFormButton
                label="Remove"
                handleClick={() => openRemoveUserModalForm(user)}
                sx={{ fontSize: '16px' }}
                disabled={user?.role === USER_ROLES.OEM_SUPER_ADMIN}
              >
                Remove
              </RemoveUserFormButton>
              <RemoveUser
                openModal={openRemoveUserModal}
                closeModal={closeRemoveModalForm}
                isRemovingUserLoading={isRemovingUserLoading}
                onRemoveButtonClick={handleRemoveUserButtonClick}
              />
            </ButtonContainer>
          </DisplayText>
        );
      }
      return null;
    });
  };

  const filteredUserDetails = users?.filter((user: IGetOEMUserResponse) => {
    const fullName = `${user?.name.first} ${user?.name?.last}`.toLowerCase();
    const lowerCaseRole = user?.role.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return (
      fullName.includes(lowerCaseSearchTerm) ||
      lowerCaseRole.includes(lowerCaseSearchTerm)
    );
  });

  return (
    <CardWithShadow sx={{ padding: '24px' }}>
      <SearchContainer variant="instavisionCardWithBorder">
        <SearchField
          placeholder="Search Users"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>
      {isLoading && (
        <LoaderWrapper
          variant="instavisionCardWithBorder"
          sx={{ padding: '40px 0px' }}
        >
          <CircularProgress color="inherit" />
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              margin: '40px 0px',
              fontWeight: '500'
            }}
          >
            Loading
          </Typography>
        </LoaderWrapper>
      )}

      {!isLoading && filteredUserDetails?.length === 0 ? (
        <Typography
          variant="h4"
          sx={{ textAlign: 'center', margin: '40px 0px', fontWeight: '500' }}
        >
          No Users available.
        </Typography>
      ) : (
        <UserDetailsContainer
          sx={{ display: filteredUserDetails?.length === 0 ? 'none' : '' }}
        >
          {userDetails(filteredUserDetails)}
        </UserDetailsContainer>
      )}
    </CardWithShadow>
  );
}

export default UserDetails;
