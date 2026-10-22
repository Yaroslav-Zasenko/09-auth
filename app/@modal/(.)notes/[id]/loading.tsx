'use client';

import Modal from '@/components/Modal/Modal';

export default function Loading() {
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>Loading note details...</p>
      </div>
    </Modal>
  );
}