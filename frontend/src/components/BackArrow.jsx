import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackArrow = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="text-base font-medium">Volver</span>
    </button>
  );
};

export default BackArrow;
