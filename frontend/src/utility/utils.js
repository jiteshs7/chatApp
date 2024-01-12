export const getSenderFull = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[0] : users[1];
};

export const getSender = (users, user) => {
  return users[0].email === user.email ? users[1].name : users[0].name;
};

export const isSameSender = (msgs = [], message, index, userId) => {
  return (
    index < msgs.length - 1 &&
    (msgs[index + 1].sender._id !== message.sender._id ||
      msgs[index + 1].sender._id === undefined) &&
    msgs[index].sender._id !== userId
  );
};

export const isLastMsg = (msgs = [], index, userId) => {
  return (
    index === msgs.length - 1 &&
    msgs[msgs.length - 1].sender_id !== userId &&
    msgs[msgs.length - 1].sender_id
  );
};

export const isSameSenderMargin = (msgs = [], message, index, userId) => {
  if (
    index < msgs.length - 1 &&
    msgs[index + 1].sender._id === message.sender._id &&
    msgs[index].sender._id !== userId
  )
    return 33;
  else if (
    (index < msgs.length - 1 &&
      msgs[index + 1].sender._id !== message.sender._id &&
      msgs[index].sender._id !== userId) ||
    (index === msgs.length - 1 && msgs[index].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

export const isSameUser = (msgs, message, index) => {
  return index > 0 && msgs[index - 1].sender._id === message.sender._id;
};
