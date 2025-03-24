// export function formatMessageTime(date) {
//   return new Date(date).toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   });
// }

export function formatMessageTime(date) {
  const messageDate = new Date(date);
  const currentDate = new Date();

  // Check if the date is today
  const isToday = messageDate.toDateString() === currentDate.toDateString();

  // Check if the date is yesterday
  const isYesterday = new Date(currentDate.setDate(currentDate.getDate() - 1)).toDateString() === messageDate.toDateString();

  if (isToday) {
    // Return only the time for today's messages
    return messageDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } else if (isYesterday) {
    // Return "Yesterday" with time for yesterday's messages
    return `Yesterday ${messageDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  } else {
    // Return shortened date and time for older messages
    return messageDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
}
