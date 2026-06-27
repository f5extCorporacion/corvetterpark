// components/WebcamCapture.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import { useCamera } from "@/app/hooks/useCamera";
import { plateValidator } from "@/app/services/plateValidator";
import { storageService } from "@/app/services/storageService";

interface WebcamCaptureProps {
  onCapture?: (imageSrc: string, text: string) => void;
}

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user" as const,
};

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const {
    isCameraReady,
    cameraError,
    permissionStatus,
    imageSrc,
    checkCameraPermissions,
    handleCameraError,
    handleUserMedia,
    requestCameraPermission,
    captureImage,
    resetImage,
    setImageSrc
  } = useCamera();

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isValidPlate, setIsValidPlate] = useState<boolean | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Marcar cuando el componente está montado
  useEffect(() => {
    setIsMounted(true);
    checkCameraPermissions();
  }, [checkCameraPermissions]);

  // Procesar la imagen
  const processImage = useCallback(async (imageData: string) => {
    setIsProcessing(true);
    setProgress(0);
    setExtractedText(null);
    setIsValidPlate(null);
    setShowAlert(false);

    try {
      const result = await plateValidator.processImage(imageData, (progress) => {
        setProgress(progress);
      });

      setExtractedText(result.text);
      setIsValidPlate(result.isValid);
      setShowAlert(true);

      if (result.isValid) {
        storageService.addPlate(result.cleanedText, imageData);
        
        if (onCapture) {
          onCapture(imageData, result.cleanedText);
        }

        setTimeout(() => {
          alert(`✅ ¡Placa detectada correctamente!\n\nPlaca: ${result.cleanedText}`);
        }, 500);
      } else {
        setTimeout(() => {
          alert(`❌ No se pudo identificar una placa válida.\n\nTexto detectado: "${result.text.trim()}"`);
        }, 500);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('❌ Error al procesar la imagen. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  }, [onCapture]);

  const handleCapture = useCallback(() => {
    const image = captureImage(webcamRef);
    if (image) {
      setImageSrc(image);
      processImage(image);
    }
  }, [captureImage, setImageSrc, processImage]);

  const handleRetake = useCallback(() => {
    resetImage();
    setExtractedText(null);
    setIsValidPlate(null);
    setShowAlert(false);
    setProgress(0);
  }, [resetImage]);

  // Si no está montado, no renderizar nada
  if (!isMounted) {
    return null;
  }

  // Renderizar error de permisos
  if (cameraError) {
    return (
      <div className="flex flex-col items-center justify-center bg-black w-full min-h-[400px] rounded-lg p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-white text-xl font-semibold mb-2">Error de Cámara</h3>
          <p className="text-white/70 mb-4">{cameraError}</p>
          
          {permissionStatus === 'denied' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 text-sm text-yellow-400">
              💡 Para solucionarlo:
              <ol className="text-left mt-2 space-y-1 list-decimal list-inside text-white/70">
                <li>Haz clic en el ícono de candado 🔒 en la barra de direcciones</li>
                <li>Busca &quot;Cámara&quot; y cambia a &quot;Permitir&quot;</li>
                <li>Recarga la página</li>
              </ol>
            </div>
          )}
          
          <button
            onClick={requestCameraPermission}
            className="bg-[#FF3E00] hover:bg-[#e63500] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Solicitar permiso de cámara
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="ml-3 bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-black w-full min-h-[400px] rounded-lg">
      <div className="relative w-full max-w-3xl">
        {!imageSrc ? (
          <div className="relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              height={360}
              screenshotFormat="image/jpeg"
              width={720}
              videoConstraints={videoConstraints}
              className="w-full h-auto rounded-lg"
              onUserMedia={handleUserMedia}
              onUserMediaError={handleCameraError}
            />
            
            {!isCameraReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#FF3E00] border-t-transparent mb-2"></div>
                  <p className="text-white/60">Iniciando cámara...</p>
                </div>
              </div>
            )}
            
            <button
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-[#FF3E00] hover:bg-[#e63500] px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCapture}
              disabled={!isCameraReady}
            >
              📸 Capturar y validar placa
            </button>
          </div>
        ) : (
          <div className="relative">
            {isProcessing && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-3/4 bg-[#1a1a2e] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#FF3E00] h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
                <span className="absolute text-xs text-white/60 -bottom-6 left-1/2 transform -translate-x-1/2">
                  Procesando... {progress}%
                </span>
              </div>
            )}

            <img 
              src={imageSrc} 
              alt="Captura" 
              className="w-full h-auto rounded-lg"
            />

            {showAlert && !isProcessing && (
              <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 rounded-lg font-medium text-center text-sm w-3/4 ${
                isValidPlate 
                  ? 'bg-green-500/90 text-white' 
                  : 'bg-red-500/90 text-white'
              }`}>
                {isValidPlate 
                  ? `✅ Placa detectada: ${extractedText?.replace(/\s+/g, ' ').trim()}`
                  : `❌ No se detectó placa válida`
                }
              </div>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
              <button
                className="text-white bg-red-500 hover:bg-red-600 px-6 py-3 rounded-full font-medium transition-colors disabled:opacity-50"
                onClick={handleRetake}
                disabled={isProcessing}
              >
                🔄 Reintentar
              </button>
              <button
                className={`text-white px-6 py-3 rounded-full font-medium transition-colors ${
                  isValidPlate 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-500 cursor-not-allowed'
                }`}
                disabled={!isValidPlate || isProcessing}
                onClick={() => {
                  if (onCapture && imageSrc && extractedText) {
                    const cleaned = extractedText.replace(/\s+/g, ' ').trim();
                    onCapture(imageSrc, cleaned);
                    setTimeout(() => {
                      window.location.reload();
                    }, 1000);
                  }
                }}
              >
                ✅ Guardar placa
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;