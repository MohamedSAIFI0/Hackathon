
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, CameraOff, Pause, Play, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface WebcamMonitoringProps {
  onScreenshot?: (screenshot: string) => void;
  onFaceDetection?: (detected: boolean) => void;
  onLookingAway?: (lookingAway: boolean) => void;
  autoDetect?: boolean;
  screenshotInterval?: number; // in seconds
}

export const WebcamMonitoring = ({
  onScreenshot,
  onFaceDetection,
  onLookingAway,
  autoDetect = false,
  screenshotInterval = 30,
}: WebcamMonitoringProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [lookingAway, setLookingAway] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In a real implementation, we would use a face detection API
  // For demo purposes, we'll simulate face detection
  const simulateFaceDetection = () => {
    // Simulate a 90% chance of detecting a face
    const detected = Math.random() > 0.1;
    setFaceDetected(detected);
    
    // If face is detected, simulate a 20% chance of looking away
    if (detected) {
      const isLookingAway = Math.random() < 0.2;
      setLookingAway(isLookingAway);
      
      if (onLookingAway) {
        onLookingAway(isLookingAway);
      }
    } else {
      setLookingAway(false);
    }
    
    if (onFaceDetection) {
      onFaceDetection(detected);
    }
    
    return detected;
  };

  // Take a screenshot from the webcam feed
  const takeScreenshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Match canvas dimensions to video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame on canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL (base64)
        const screenshot = canvas.toDataURL("image/jpeg");
        
        // Run face detection
        const isDetected = simulateFaceDetection();
        
        // If face is not detected, consider it an alert
        if (!isDetected && autoDetect) {
          console.log("Alert: Face not detected in screenshot");
        }
        
        // Send screenshot to parent component
        if (onScreenshot) {
          onScreenshot(screenshot);
        }
        
        return screenshot;
      }
    }
    return null;
  };

  // Initialize webcam
  const initializeWebcam = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const constraints = {
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCameraPermission(true);
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setError("Impossible d'accéder à la webcam. Vérifiez les permissions.");
      setCameraPermission(false);
    } finally {
      setLoading(false);
    }
  };

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach((track) => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Toggle webcam
  const toggleWebcam = () => {
    if (cameraActive) {
      stopWebcam();
    } else {
      initializeWebcam();
    }
  };

  // Automatic screenshot interval
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (cameraActive && autoDetect) {
      intervalId = setInterval(() => {
        takeScreenshot();
      }, screenshotInterval * 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [cameraActive, autoDetect, screenshotInterval]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div>
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative">
          {/* Video element for webcam feed */}
          <div className="aspect-video bg-muted flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Initialisation de la caméra...
                </p>
              </div>
            ) : !cameraActive ? (
              <div className="flex flex-col items-center justify-center">
                <CameraOff className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Caméra désactivée
                </p>
              </div>
            ) : null}
            
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraActive ? "" : "hidden"}`}
              onLoadedMetadata={() => {
                // Once video is loaded, we can start face detection
                if (autoDetect) {
                  simulateFaceDetection();
                }
              }}
            />
            
            {/* Overlay for status indicators */}
            {cameraActive && (
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {faceDetected ? (
                  <Badge className="bg-success animate-pulse text-white">
                    Visage détecté
                  </Badge>
                ) : (
                  <Badge className="bg-alert animate-pulse text-white">
                    Visage non détecté
                  </Badge>
                )}
                
                {faceDetected && lookingAway && (
                  <Badge className="bg-warning animate-pulse text-white">
                    Regard détourné
                  </Badge>
                )}
              </div>
            )}
          </div>
          
          {/* Canvas for taking screenshots (hidden) */}
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Error message */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {/* Controls */}
          <div className="p-4 flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleWebcam}
              disabled={loading}
              className="flex items-center gap-1"
            >
              {cameraActive ? (
                <>
                  <Pause className="h-4 w-4" /> Désactiver
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" /> Activer
                </>
              )}
            </Button>
            
            {cameraActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => takeScreenshot()}
                disabled={loading}
                className="flex items-center gap-1"
              >
                <Camera className="h-4 w-4" /> Capture
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {cameraPermission === false && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Permissions refusées</AlertTitle>
          <AlertDescription>
            Vous devez autoriser l'accès à la caméra pour utiliser cette fonctionnalité.
            Vérifiez les paramètres de votre navigateur.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default WebcamMonitoring;
