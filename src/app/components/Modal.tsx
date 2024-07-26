// src/components/Modal.tsx
"use client";
import { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hours: number, minutes: number) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(hours, minutes);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Time</h2>
        <div>
          <label>
            Hours:
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              min="0"
            />
          </label>
        </div>
        <div>
          <label>
            Minutes:
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              min="0"
            />
          </label>
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
