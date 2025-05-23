import React, { useEffect, useRef, useState } from "react";
import { QrCode, Barcode, Camera } from "lucide-react";

interface QrScannerProps {
  onScan: (value: string) => void;
}

export const QrScanner: React.FC<QrScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  useEffect(() => {
    // Import QR Scanner library dynamically to avoid server-side rendering issues
    const loadScanner = async () => {
      try {
        // In a real implementation, you would use a proper QR scanner library
        // For this example, we'll simulate a scan after 3 seconds
        const timer = setTimeout(() => {
          const mockValues = ["12345", "67890", "24680"];
          const randomValue = mockValues[Math.floor(Math.random() * mockValues.length)];
          onScan(randomValue);
        }, 3000);

        // Start the camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode }
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasPermission(true);
          }
        }

        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasPermission(false);
      }
    };

    loadScanner();

    return () => {
      // Clean up video stream when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, onScan]);

  const toggleCamera = () => {
    // Stop current stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Toggle camera
    setFacingMode(prevMode => 
      prevMode === "environment" ? "user" : "environment"
    );
  };
  
  if (hasPermission === false) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg text-center">
        <p className="text-yellow-700 font-medium">Accès à la caméra refusé</p>
        <p className="text-sm mt-2 text-yellow-600">
          Veuillez autoriser l'accès à la caméra pour scanner les codes
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <video 
        ref={videoRef}
        className="w-full h-64 bg-black object-cover"
        autoPlay 
        playsInline
        muted
      />
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-4/5 h-4/5 max-w-xs mx-auto my-4 border-2 border-white opacity-70 rounded-lg"></div>
      </div>
      
      <div className="absolute bottom-2 left-2 right-2 flex justify-between">
        <div className="bg-black/50 text-white p-1 rounded-full">
          <div className="flex items-center space-x-1 px-2 py-1">
            <QrCode className="w-4 h-4" />
            <Barcode className="w-4 h-4" />
            <span className="text-xs">Scanner prêt</span>
          </div>
        </div>
        
        <button
          onClick={toggleCamera}
          className="bg-black/50 text-white p-2 rounded-full"
          type="button"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};