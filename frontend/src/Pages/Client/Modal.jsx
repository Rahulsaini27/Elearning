
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react'; // Assuming Lucide-React is installed
import gsap from 'gsap'; // Assuming GSAP is installed

const Modal = ({ isOpen, onClose, children }) => {
  const modalOverlayRef = useRef(null);
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';

      // GSAP animation for modal entry
      gsap.fromTo(modalOverlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(modalContentRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" });
    } else {
      // GSAP animation for modal exit before unmounting
      const timeline = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = 'unset'; // Restore body scrolling after animation
        }
      });
      timeline.to(modalContentRef.current, { y: 50, opacity: 0, duration: 0.3, ease: "power2.in" })
              .to(modalOverlayRef.current, { opacity: 0, duration: 0.2 }, "<");
    }
  }, [isOpen]); // Effect runs when isOpen changes

  // Don't render anything if not open and not currently animating out
  // (check for opacity style to ensure component stays mounted during exit animation)
  if (!isOpen && (!modalOverlayRef.current || parseFloat(modalOverlayRef.current.style.opacity) === 0)) {
    return null;
  }

  const handleOverlayClick = (e) => {
    // Close modal if clicking on the overlay, not on the modal content itself
    if (modalOverlayRef.current && e.target === modalOverlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={modalOverlayRef}
      // Use pointer-events-none when closing to prevent clicks during exit animation
      className={`fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-4 ${isOpen ? '' : 'pointer-events-none'}`}
      onClick={handleOverlayClick}
    >
      <div
        ref={modalContentRef}
        className="relative bg-white shadow-xl rounded-xl p-8 max-w-sm w-full" // MODIFIED: Changed background to white and adjusted shadow
      >
        {/* Close button positioned top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10" // MODIFIED: Changed color for visibility on white
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
        {children} {/* Render the form component here */}
      </div>
    </div>
  );
};

export default Modal;