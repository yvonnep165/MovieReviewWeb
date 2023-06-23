import React, { useState } from "react";

export default function PopupWindow() {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openPopup}>Open Popup</button>
      {isOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Popup Window</h2>
            <p>This is a popup window.</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
