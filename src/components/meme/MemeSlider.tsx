import { Slider } from "@/components/ui/slider";

interface MemeSliderProps {
  currentSlide: number;
  totalSlides: number;
  onSlideChange: (value: number[]) => void;
}

export const MemeSlider = ({ currentSlide, totalSlides, onSlideChange }: MemeSliderProps) => {
  return (
    <div className="px-4">
      <Slider
        value={[currentSlide]}
        max={Math.max(0, totalSlides - 1)}
        step={1}
        onValueChange={onSlideChange}
        className="w-full"
      />
    </div>
  );
};