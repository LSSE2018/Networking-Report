// src/components/SignaturePad.jsx
import React, { useEffect, useRef } from 'react';
import SignaturePad from 'signature_pad';

export function SignatureCanvas({ onSave, clear, width, height }) {
  const canvasRef = useRef(null);
  const signaturePad = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      signaturePad.current = new SignaturePad(canvasRef.current, {
        minWidth: 1,
        maxWidth: 3,
        penColor: 'black',
      });

      // Handle window resize
      const handleResize = () => {
        const canvas = canvasRef.current;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        canvas.getContext('2d').scale(ratio, ratio);
        signaturePad.current.clear(); // Clear on resize
      };

      window.addEventListener('resize', handleResize);
      handleResize(); // Initial sizing

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (clear) {
      signaturePad.current.clear();
    }
  }, [clear]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-md">
      <canvas
        ref={canvasRef}
        width={width || 400}
        height={height || 200}
        className="w-full h-full"
      />
    </div>
  );
}
