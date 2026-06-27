// hooks/useCamera.ts
import { useState, useCallback, useRef, useEffect } from 'react';

export const useCamera = () => {
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const checkCameraPermissions = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Tu navegador no soporta acceso a la cámara.');
        return;
      }

      try {
        const permissionStatusResult = await navigator.permissions.query({
          name: 'camera' as PermissionName
        });

        setPermissionStatus(permissionStatusResult.state as 'prompt' | 'granted' | 'denied');

        if (permissionStatusResult.state === 'denied') {
          setCameraError('Permiso de cámara denegado. Por favor, permite el acceso en la configuración del navegador.');
        } else if (permissionStatusResult.state === 'granted') {
          setCameraError(null);
        }

        permissionStatusResult.addEventListener('change', () => {
          setPermissionStatus(permissionStatusResult.state as 'prompt' | 'granted' | 'denied');
          if (permissionStatusResult.state === 'granted') {
            setCameraError(null);
          }
        });
      } catch (error) {
        console.warn('Permissions API not supported, trying direct access:', error);
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop());
          setPermissionStatus('granted');
          setCameraError(null);
        } catch (err) {
          setCameraError('No se pudo acceder a la cámara. Verifica los permisos.');
        }
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setCameraError('Error al verificar permisos de cámara.');
    }
  }, []);

  const handleCameraError = useCallback((error: any) => {
    console.error('Camera error:', error);
    
    if (error?.name === 'PermissionDeniedError' || error?.name === 'NotAllowedError') {
      setCameraError('Permiso de cámara denegado. Por favor, permite el acceso en la configuración del navegador.');
      setPermissionStatus('denied');
    } else if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
      setCameraError('No se encontró ninguna cámara en tu dispositivo.');
    } else if (error?.name === 'NotReadableError' || error?.name === 'TrackStartError') {
      setCameraError('La cámara está siendo usada por otra aplicación.');
    } else {
      setCameraError(`Error al acceder a la cámara: ${error?.message || 'Error desconocido'}`);
    }
    
    setIsCameraReady(false);
  }, []);

  const handleUserMedia = useCallback(() => {
    setIsCameraReady(true);
    setCameraError(null);
    setPermissionStatus('granted');
  }, []);

  const requestCameraPermission = useCallback(async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      stream.getTracks().forEach(track => track.stop());
      setPermissionStatus('granted');
      window.location.reload();
    } catch (error) {
      console.error('Error requesting permission:', error);
      setCameraError('No se pudo obtener permiso para acceder a la cámara.');
    }
  }, []);

  const captureImage = useCallback((webcamRef: any) => {
    if (webcamRef.current) {
      const image = webcamRef.current.getScreenshot();
      if (image) {
        setImageSrc(image);
        return image;
      }
    }
    return null;
  }, []);

  const resetImage = useCallback(() => {
    setImageSrc(null);
  }, []);

  return {
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
  };
};