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

  if (isToday) {
    // Return only the time for today's messages
    return messageDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } else {
    // Return a shortened date and time for older messages
    return messageDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
}


