const ChatInfo = ({ chat }) => {
  
  return (
    <div className='bg-white p-2 flex justify-between text-[#1F1F1F99]'>
      <p>
        <h2 className="font-semibold">{chat.ad?.title}</h2>
      </p>
      <p>
        {chat.ad?.price ? (
          <>₹{chat.ad.price}</>
        ) : (
          <span className="text-green-500 text-sm">Service</span>
        )}
      </p>
    </div>
  );
};

export default ChatInfo