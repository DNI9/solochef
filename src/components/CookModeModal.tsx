import React from 'react';
import { MealPlan } from '../utils/schema';

export interface CookModeModalProps {
  meal: MealPlan | null;
  onClose: () => void;
}

export const CookModeModal: React.FC<CookModeModalProps> = ({ meal, onClose }) => {
  return null;
};
