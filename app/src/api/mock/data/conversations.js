export const conversations = [
  {
    id: 1, name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?u=alice', unread: 2, online: true,
    messages: [
      { id: 1, text: 'Hey Alice, are we still on for leg day?', isMe: true, time: '10:00' },
      { id: 2, text: 'Absolutely! I am ready to crush it.', isMe: false, time: '10:05' },
      { id: 3, text: 'See you at the gym tomorrow!', isMe: false, time: '10:06' },
    ],
  },
  {
    id: 2, name: 'Coach Mike', avatar: 'https://i.pravatar.cc/150?u=mike', unread: 0, online: false,
    messages: [
      { id: 1, text: 'Check out my latest video, how is my form?', isMe: true, time: 'Yesterday' },
      { id: 2, text: 'Looking solid. Keep your chest up a bit more.', isMe: false, time: 'Yesterday' },
      { id: 3, text: 'Great form on those squats.', isMe: false, time: 'Yesterday' },
    ],
  },
  {
    id: 3, name: 'Sarah Fit', avatar: 'https://i.pravatar.cc/150?u=sarah', unread: 0, online: true,
    messages: [
      { id: 1, text: 'Thanks for the spot!', isMe: false, time: '2d' },
      { id: 2, text: 'Anytime!', isMe: true, time: '2d' },
    ],
  },
]
