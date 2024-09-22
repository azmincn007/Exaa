const ChatInfo = ({ chat }) => (
    <div className='bg-white p-2 flex justify-between text-[#1F1F1F99]'>
      <p>
        <h2 className="font-semibold">{chat.ad?.title}</h2>
      </p>
      <p>price</p>
    </div>
  );

  export default ChatInfo