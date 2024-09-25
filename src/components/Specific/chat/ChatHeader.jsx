import { MoreVertical, Phone } from "lucide-react";
import { BASE_URL } from "../../../config/config";

const ChatHeader = ({ chat }) => (
    <div className="bg-[#0071BC] text-white p-4 flex justify-between items-center rounded-md">
      <div className='flex items-center gap-4'>
        <div className='rounded-full'>
          <img className='rounded-full w-[70px] h-[70px] object-cover' src={`${BASE_URL}${chat.adSeller.profileImage.url}`} alt="" />
        </div>
        <div>
          <h2 className="font-semibold">{chat.adSeller?.name}</h2>
          <p className="text-sm">{chat.adSeller?.location || 'Location not available'}</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <div className='w-[40px] h-[40px] rounded-full bg-white flex justify-center items-center'>
          <Phone className="cursor-pointer text-black" />
        </div>
        <div className='w-[40px] h-[40px] rounded-full bg-white flex justify-center items-center'>
          <MoreVertical className="cursor-pointer text-black" />
        </div>
      </div>
    </div>
  );
  export default ChatHeader