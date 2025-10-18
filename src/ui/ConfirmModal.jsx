import React from 'react';
import Modal from './Modal';

export default function ConfirmModal({ open, title, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <Modal open={open}>
      <h3>{title}</h3>
      <div>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </Modal>
  );
}
