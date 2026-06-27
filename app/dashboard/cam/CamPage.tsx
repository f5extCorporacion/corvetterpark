"use client";

import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Tesseract, { PSM } from "tesseract.js";

export default function CamPage() {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(true);
  const [plateInfo, setPlateInfo] = useState<{
    plate: string;
    type: 'car' | 'motorcycle' | 'invalid' | null;
    isValid: boolean;
  } | null>(null);

  // ✅ Función para renderizar icono de vehículo
  const renderVehicleIcon = (type: 'car' | 'motorcycle' | null) => {
    if (type === 'car') return '🚗';
    if (type === 'motorcycle') return '🏍️';
    return '❓';
  };

  // Verificar si el navegador soporta getUserMedia
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Tu navegador no soporta la cámara");
    }
  }, []);

  // Función para validar placa colombiana
  const validateColombianPlate = (text: string) => {
    const cleanText = text
      .toUpperCase()
      .replace(/[-\s]/g, '')
      .replace(/[0O]/g, '0')
      .replace(/[I]/g, '1');

    console.log("🔍 Texto limpio para validar:", cleanText);

    const carPlatePatterns = [
      /^[A-Z]{3}\d{3}$/,
      /^[A-Z]{3}\d{2}[A-Z]$/,
    ];

    const motorcyclePlatePatterns = [
      /^[A-Z]{3}\d{2}[A-Z]$/,
      /^[A-Z]{3}\d{3}$/,
    ];

    let isValid = false;
    let type: 'car' | 'motorcycle' | null = null;
    let formattedPlate = '';

    for (const pattern of carPlatePatterns) {
      if (pattern.test(cleanText)) {
        isValid = true;
        type = 'car';
        formattedPlate = cleanText;
        break;
      }
    }

    if (!isValid) {
      for (const pattern of motorcyclePlatePatterns) {
        if (pattern.test(cleanText)) {
          isValid = true;
          type = 'motorcycle';
          formattedPlate = cleanText;
          break;
        }
      }
    }

    if (isValid && formattedPlate.length >= 6) {
      const firstPart = formattedPlate.substring(0, 3);
      const secondPart = formattedPlate.substring(3);
      formattedPlate = `${firstPart}-${secondPart}`;
    }

    return {
      plate: formattedPlate,
      type,
      isValid,
      rawText: cleanText
    };
  };

  // Función para extraer texto con Tesseract
  const extractTextFromImage = async (imageData: string) => {
    setIsProcessing(true);
    setExtractedText(null);
    setPlateInfo(null);

    try {
      const worker = await Tesseract.createWorker("spa+eng");

      await worker.setParameters({
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789- ",
        tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
      });

      const result = await worker.recognize(imageData);
      await worker.terminate();

      const text = result.data.text.trim();
      console.log("📝 Texto extraído:", text);

      if (text.length > 0) {
        const validationResult = validateColombianPlate(text);

        if (validationResult.isValid) {
          setPlateInfo({
            plate: validationResult.plate,
            type: validationResult.type,
            isValid: true,
          });
          setExtractedText(validationResult.plate);
          setShowImage(false);
        } else {
          const alphanumericText = text
            .replace(/[^A-Za-z0-9]/g, "")
            .toUpperCase();

          const secondValidation = validateColombianPlate(alphanumericText);

          if (secondValidation.isValid) {
            setPlateInfo({
              plate: secondValidation.plate,
              type: secondValidation.type,
              isValid: true,
            });
            setExtractedText(secondValidation.plate);
            setShowImage(false);
          } else {
            setExtractedText("No se detectó una placa válida");
            setPlateInfo({
              plate: "",
              type: null,
              isValid: false,
            });
            setShowImage(true);
          }
        }
      } else {
        setExtractedText("No se detectó texto en la imagen");
        setPlateInfo({
          plate: "",
          type: null,
          isValid: false,
        });
        setShowImage(true);
      }
    } catch (error) {
      console.error("❌ Error al extraer texto:", error);
      setExtractedText("Error al procesar la imagen");
      setPlateInfo({
        plate: "",
        type: null,
        isValid: false,
      });
      setShowImage(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Activar cámara
  const activateCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      stream.getTracks().forEach(track => track.stop());

      setIsCameraActive(true);
      setError(null);
      setExtractedText(null);
      setCapturedImage(null);
      setPlateInfo(null);
    } catch (err) {
      setError("No se pudo acceder a la cámara. Por favor, verifica los permisos.");
      console.error("Error de cámara:", err);
    }
  };

  // Desactivar cámara
  const deactivateCamera = () => {
    setIsCameraActive(false);
    setCapturedImage(null);
    setExtractedText(null);
    setShowImage(true);
    setPlateInfo(null);

    if (webcamRef.current) {
      const stream = webcamRef.current.stream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Capturar foto y procesar con OCR
  const capturePhoto = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setShowImage(true);
        console.log("📸 Foto capturada");
        await extractTextFromImage(imageSrc);
      }
    }
  };

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (webcamRef.current) {
        const stream = webcamRef.current.stream;
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6">🚗 Validación de Placas</h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 border border-red-200">
          ⚠️ {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        {!isCameraActive ? (
          <button
            onClick={activateCamera}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🎥 Activar Cámara
          </button>
        ) : (
          <>
            <button
              onClick={capturePhoto}
              disabled={isProcessing}
              className={`px-6 py-3 text-white rounded-lg font-medium transition-colors ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isProcessing ? "⏳ Procesando..." : "📸 Capturar Placa"}
            </button>

            <button
              onClick={deactivateCamera}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              ⏹️ Desactivar
            </button>
          </>
        )}
      </div>

      {isCameraActive && (
        <div className="relative bg-black rounded-xl overflow-hidden mb-6">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            width="100%"
            height="auto"
            videoConstraints={{
              facingMode: "environment",
              width: 640,
              height: 480
            }}
            onUserMedia={() => {
              console.log("✅ Cámara activada correctamente");
            }}
            onUserMediaError={(error) => {
              console.error("❌ Error:", error);
              setIsCameraActive(false);
              setError("Error al iniciar la cámara");
            }}
            className="w-full h-auto block"
          />

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 h-1/3 border-2 border-dashed border-white/50 rounded-xl flex items-center justify-center pointer-events-none">
            <div className="text-white/70 text-sm text-center">
              📍 Encuadra la placa aquí
            </div>
          </div>

          {isProcessing && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-5xl mb-3">🔍</div>
                <div className="text-xl">Leyendo placa...</div>
              </div>
            </div>
          )}
        </div>
      )}

      {capturedImage && (
        <div className="mt-6 p-4 border-2 border-gray-200 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">
            {plateInfo?.isValid ? "✅ Placa Detectada" : "📷 Imagen Capturada"}
          </h3>

          {plateInfo?.isValid ? (
            <div className="p-5 bg-green-50 rounded-lg border-2 border-green-300 mb-4">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="text-6xl">
                 
                </span>
                <div>
                  <div className="text-4xl font-bold text-green-800">
                    {plateInfo.plate}
                  </div>
                  <div className="text-lg text-green-700 mt-1">
                    {plateInfo.type === 'car' ? '🚗 Automóvil' : '🏍️ Motocicleta'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ✅ Usar showImage para controlar la visualización */}
              {showImage && (
                <img
                  src={capturedImage}
                  alt="Captura"
                  className="w-full rounded-lg mb-4"
                />
              )}
              {extractedText && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200 text-red-800">
                  <strong>❌ No se detectó una placa válida</strong>
                  <div className="mt-2 text-sm">
                    Texto detectado: {extractedText}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    💡 Asegúrate de que la placa esté bien iluminada y enfocada
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={async () => {
                if (capturedImage) {
                  setShowImage(true);
                  await extractTextFromImage(capturedImage);
                }
              }}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              🔄 Re-analizar
            </button>

            <button
              onClick={() => {
                setCapturedImage(null);
                setExtractedText(null);
                setShowImage(true);
                setPlateInfo(null);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              🗑️ Descartar
            </button>

            {plateInfo?.isValid && (
              <>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(plateInfo.plate);
                    alert("✅ Placa copiada al portapapeles");
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  📋 Copiar Placa
                </button>

                <button
                  onClick={() => {
                    console.log("🚗 Placa validada:", {
                      plate: plateInfo.plate,
                      type: plateInfo.type,
                      timestamp: new Date().toISOString()
                    });
                    alert(`✅ Placa ${plateInfo.plate} enviada al servidor`);
                  }}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  📤 Enviar al Servidor
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}