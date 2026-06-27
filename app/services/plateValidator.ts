// services/plateValidator.ts
import Tesseract from 'tesseract.js';

export const plateValidator = {
  // Validar si el texto parece una placa
  validatePlate(text: string): { isValid: boolean; cleanedText: string } {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    const plateRegex = /^[A-Z]{3}[0-9]{3}$/;
    const plateRegexWithDash = /^[A-Z]{3}-[0-9]{3}$/;
    const cleanPlate = cleaned.replace(/-/g, '');
    const isValid = plateRegex.test(cleanPlate) || plateRegexWithDash.test(cleaned);
    return { isValid, cleanedText: cleanPlate };
  },

  // Procesar imagen con Tesseract
  async processImage(imageData: string, onProgress?: (progress: number) => void) {
    try {
      const result = await Tesseract.recognize(imageData, 'spa+eng', {
        logger: (m) => {
          if (m.status === 'recognizing text' && onProgress) {
            onProgress(Math.round(m.progress * 100));
          }
        },
      });

      const text = result.data.text;
      const validation = this.validatePlate(text);
      
      return {
        text,
        ...validation
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Error al procesar la imagen');
    }
  }
};