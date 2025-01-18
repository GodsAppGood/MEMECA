export interface WheelState {
  currentSlot: number;
  nextUpdateIn: number;
  imageUrl: string | null;
  totalSlots: number;
  isActive: boolean;
}