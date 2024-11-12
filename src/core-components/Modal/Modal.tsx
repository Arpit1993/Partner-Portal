import React from 'react';
import { Backdrop, Fade } from '@mui/material';
import Modal, { ModalProps } from '@mui/material/Modal';

interface ICoreModalProps extends ModalProps {
  open: boolean;
  onClose: () => void;
}

function CoreModal(props: ICoreModalProps) {
  const { open, onClose, children, ...restOfProps } = props;
  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') {
          return;
        }
        onClose();
      }}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      closeAfterTransition
      slots={{
        backdrop: Backdrop
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
            // ...slotProps?.backdrop?.sx // Merge the sx object so user-defined styles override defaults
          }
        }
      }}
      {...restOfProps}
    >
      <Fade in={open}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#F1F1F1',
            outline: 'none',
            padding: '24px',
            borderRadius: '30px',
            boxSizing: 'border-box',
            margin: '20px'
          }}
        >
          {children}
        </div>
      </Fade>
    </Modal>
  );
}

export default CoreModal;
