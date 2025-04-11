import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Popconfirm = ({ title, onConfirm, children }) => {
  const [visible, setVisible] = useState(false);

  const showConfirm = () => setVisible(true);
  const hideConfirm = () => setVisible(false);

  const handleConfirm = () => {
    onConfirm();
    hideConfirm();
  };

  return (
    <div className="relative inline-block">
      <span onClick={showConfirm}>{children}</span>

      {visible &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Card className="p-5 w-80 text-center shadow-lg bg-white rounded-lg">
              <p className="text-lg font-semibold">{title}</p>
              <div className="mt-4 flex justify-center gap-4">
                <Button variant="outline" onClick={hideConfirm}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirm}>
                  Confirm
                </Button>
              </div>
            </Card>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Popconfirm;
