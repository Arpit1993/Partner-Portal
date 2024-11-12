import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

interface InstaSnackBarProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  autoHideDuration?: number;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

export default function InstaSnackBar({
  open,
  message,
  severity = 'success',
  autoHideDuration = 5000, // Default to 5 seconds
  onClose
}: InstaSnackBarProps) {
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={onClose}
          severity={severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
