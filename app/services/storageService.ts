// services/storageService.ts
export interface SavedPlate {
  id: string;
  plate: string;
  image: string;
  timestamp: number;
  date: string;
}

export const storageService = {
  // Guardar placas
  savePlates(plates: SavedPlate[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('validatedPlates', JSON.stringify(plates));
    } catch (error) {
      console.error('Error saving plates:', error);
    }
  },

  // Obtener placas guardadas
  getPlates(): SavedPlate[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('validatedPlates');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading plates:', error);
      return [];
    }
  },

  // Agregar una nueva placa
  addPlate(plate: string, image: string): SavedPlate {
    const newEntry: SavedPlate = {
      id: Date.now().toString(),
      plate,
      image,
      timestamp: Date.now(),
      date: new Date().toLocaleString()
    };
    
    const currentPlates = this.getPlates();
    const updated = [newEntry, ...currentPlates];
    this.savePlates(updated);
    return newEntry;
  },

  // Eliminar una placa
  deletePlate(id: string): void {
    const currentPlates = this.getPlates();
    const updated = currentPlates.filter(p => p.id !== id);
    this.savePlates(updated);
  },

  // Limpiar todas las placas
  clearPlates(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('validatedPlates');
    } catch (error) {
      console.error('Error clearing plates:', error);
    }
  }
};