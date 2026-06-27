// types/vehicle.ts

export type VehicleType = 'car' | 'motorcycle' | null;

export interface PlateInfo {
  plate: string;
  type: VehicleType;
  isValid: boolean;
}

export interface VehicleConfig {
  type: VehicleType;
  icon: string;
  label: string;
  emoji: string;
}

// Configuración de vehículos
export const VEHICLE_CONFIG: Record<string, VehicleConfig> = {
  car: {
    type: 'car',
    icon: '🚗',
    label: 'Automóvil',
    emoji: '🚗'
  },
  motorcycle: {
    type: 'motorcycle',
    icon: '🏍️',
    label: 'Motocicleta',
    emoji: '🏍️'
  }
};

// Funciones helper
export const getVehicleIcon = (type: VehicleType): string => {
  if (type && VEHICLE_CONFIG[type]) {
    return VEHICLE_CONFIG[type].icon;
  }
  return '❓';
};

export const getVehicleLabel = (type: VehicleType): string => {
  if (type && VEHICLE_CONFIG[type]) {
    return VEHICLE_CONFIG[type].label;
  }
  return 'Vehículo desconocido';
};