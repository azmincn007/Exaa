import { IMAGES } from "../../constants/logoimg";
import { Link } from "react-router-dom";

export default function MarketplaceLogo() {
    return (
      <Link to="/home">
        <div className="inline-flex items-center justify-center bg-sky-100  border-[3px]  border-[#94CAED] rounded-2xl px-6 py-4 fixed bottom-8 right-11 z-50">
          <div className="flex items-center gap-1">
            <img className="h-[40px]" src={IMAGES.ExaLogoBlack} alt="Logo" />
          </div>
        </div>
      </Link>
    )
  }
  
  