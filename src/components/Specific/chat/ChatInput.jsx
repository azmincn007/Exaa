import { FaTelegram } from "react-icons/fa";

const ChatInput = ({ message, setMessage, onSend }) => (
    <div className="p-4 bg-white flex gap-2 m-2 items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Send a message"
        className="bg-[#0071BC1A] rounded-full flex-1 border px-4 py-2 focus:outline-none"
      />
      <FaTelegram size={30} className="cursor-pointer" onClick={onSend} />
    </div>
  );
export default ChatInput  