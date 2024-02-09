const ConversationDisplay = ({ conversation }) => {
  return (
    <div className="   ">
      <div className="flex flex-col h-[550px]">
        {/* ^^// CHANGE THE HEIGHT TO MATCH USERS VIEWPORT */}{" "}
        {/* Adjust the height as needed */}
        <div className=" ">
          <div
            className={`flex-grow overflow-y-auto border-4 rounded-lg shadow-xl h-[500px]  dark:bg-gray-900					`}>
            {conversation.map((msg, index) => {
              let textColor =
                msg.type === "user"
                  ? "text-blue-500 bg-zinc-200 dark:bg-gray-800 "
                  : "text-green-500 bg-zinc-200 dark:bg-gray-800 ";
              return (
                <div
                  key={index}
                  className={` mt-4 mb-4 pl-4  py-4 ml-2 mr-2 flex justify-start rounded-lg ${textColor}`}>
                  {msg.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationDisplay;
