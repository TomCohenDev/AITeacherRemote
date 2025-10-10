import { useState, useRef } from "react";
import type { BoundingBox } from "../types";
import Button from "./common/Button";

interface Props {
  screenshot: string;
  onConfirm: (box: BoundingBox) => void;
  onCancel: () => void;
}

export default function AreaSelectionModal({
  screenshot,
  onConfirm,
  onCancel,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [selection, setSelection] = useState<BoundingBox | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setCurrentPos({ x, y });
    setIsDragging(true);
    setSelection(null); // Clear previous selection
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    setCurrentPos({ x, y });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const box = {
      x: Math.min(startPos.x, currentPos.x),
      y: Math.min(startPos.y, currentPos.y),
      width: Math.abs(currentPos.x - startPos.x),
      height: Math.abs(currentPos.y - startPos.y),
    };

    setSelection(box);
    setIsDragging(false);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    setStartPos({ x, y });
    setCurrentPos({ x, y });
    setIsDragging(true);
    setSelection(null);
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const rect = imageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(touch.clientY - rect.top, rect.height));

    setCurrentPos({ x, y });
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const box = {
      x: Math.min(startPos.x, currentPos.x),
      y: Math.min(startPos.y, currentPos.y),
      width: Math.abs(currentPos.x - startPos.x),
      height: Math.abs(currentPos.y - startPos.y),
    };

    setSelection(box);
    setIsDragging(false);
  };

  const handleConfirm = () => {
    if (selection && selection.width > 0 && selection.height > 0) {
      onConfirm(selection);
    }
  };

  const selectionBox =
    isDragging || selection
      ? {
          left: Math.min(startPos.x, currentPos.x),
          top: Math.min(startPos.y, currentPos.y),
          width: Math.abs(currentPos.x - startPos.x),
          height: Math.abs(currentPos.y - startPos.y),
        }
      : null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-screen overflow-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Select Annotation Area
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Drag on the screenshot to select where annotations should appear
          </p>
        </div>

        {/* Image Area */}
        <div className="p-4 sm:p-6 overflow-auto max-h-[60vh] sm:max-h-[70vh] bg-gray-50">
          <div className="relative inline-block max-w-full">
            <img
              ref={imageRef}
              src={screenshot}
              alt="Screen"
              className="max-w-full h-auto border-2 border-gray-300 rounded cursor-crosshair select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              draggable={false}
            />

            {/* Selection Rectangle */}
            {selectionBox &&
              selectionBox.width > 0 &&
              selectionBox.height > 0 && (
                <div
                  className="absolute border-4 border-purple-500 bg-purple-500 bg-opacity-20 pointer-events-none"
                  style={{
                    left: `${selectionBox.left}px`,
                    top: `${selectionBox.top}px`,
                    width: `${selectionBox.width}px`,
                    height: `${selectionBox.height}px`,
                  }}
                >
                  {/* Dimensions Label */}
                  <div className="absolute -top-8 left-0 bg-purple-500 text-white px-2 py-1 rounded text-xs sm:text-sm font-medium whitespace-nowrap">
                    {Math.round(selectionBox.width)} ×{" "}
                    {Math.round(selectionBox.height)}px
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 h-12 sm:h-14"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selection || selection.width === 0}
            className="flex-1 h-12 sm:h-14"
          >
            Confirm Selection
          </Button>
        </div>
      </div>
    </div>
  );
}
