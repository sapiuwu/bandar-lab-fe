"use client";

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileOverlay({ isOpen, onClose }: MobileOverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
      onClick={onClose}
      aria-hidden="true"
    />
  );
}
