import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export const AuthSection = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link to="/submit">
        <Button
          variant="default"
          className="bg-[#FFB74D] text-black hover:bg-[#FFB74D]/90 transition-all duration-300 hover:scale-105 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.2)] hover:shadow-lg"
        >
          Submit Meme
        </Button>
      </Link>
    </div>
  );
};