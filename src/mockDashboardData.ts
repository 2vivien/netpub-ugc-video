import { v4 as uuidv4 } from 'uuid';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  userId: string;
  userName: string;
  messages: ChatMessage[];
  hasAppointment: boolean;
  hasCallScheduled: boolean;
  hasOrderPlaced: boolean;
  lastActivity: string;
}

export const mockConversations: ChatConversation[] = [
  {
    id: uuidv4(),
    userId: 'user-1',
    userName: 'Alice Smith',
    messages: [
      { id: uuidv4(), sender: 'user', text: 'Hello, I\'m interested in your video services.', timestamp: '2023-10-26T10:00:00Z' },
      { id: uuidv4(), sender: 'bot', text: 'Great! What kind of video are you looking for?', timestamp: '2023-10-26T10:00:15Z' },
      { id: uuidv4(), sender: 'user', text: 'I need a 4K spot for social media. Can I schedule a call?', timestamp: '2023-10-26T10:01:00Z' },
      { id: uuidv4(), sender: 'bot', text: 'Certainly! Please provide your availability.', timestamp: '2023-10-26T10:01:30Z' },
      { id: uuidv4(), sender: 'user', text: 'How about next Tuesday at 2 PM?', timestamp: '2023-10-26T10:02:00Z' },
      { id: uuidv4(), sender: 'bot', text: 'Confirmed! We\'ll send you a calendar invite.', timestamp: '2023-10-26T10:02:30Z' },
    ],
    hasAppointment: false,
    hasCallScheduled: true,
    hasOrderPlaced: false,
    lastActivity: '2023-10-26T10:02:30Z',
  },
  {
    id: uuidv4(),
    userId: 'user-2',
    userName: 'Bob Johnson',
    messages: [
      { id: uuidv4(), sender: 'user', text: 'Hi, I\'m looking for UGC video examples.', timestamp: '2023-10-27T11:05:00Z' },
      { id: uuidv4(), sender: 'bot', text: 'You can check our portfolio for UGC examples.', timestamp: '2023-10-27T11:05:30Z' },
      { id: uuidv4(), sender: 'user', text: 'Okay, thanks. I\'d like to place an order for a basic package.', timestamp: '2023-10-27T11:10:00Z' },
      { id: uuidv4(), sender: 'bot', text: 'Excellent! Please proceed to our order page.', timestamp: '2023-10-27T11:10:30Z' },
    ],
    hasAppointment: false,
    hasCallScheduled: false,
    hasOrderPlaced: true,
    lastActivity: '2023-10-27T11:10:30Z',
  },
  {
    id: uuidv4(),
    userId: 'user-3',
    userName: 'Charlie Brown',
    messages: [
      { id: uuidv4(), sender: 'user', text: 'I have a question about pricing.', timestamp: '2023-10-28T14:20:00Z' },
      { id: uuidv4(), sender: 'bot', text: 'Our pricing details are available on the services page.', timestamp: '2023-10-28T14:20:30Z' },
    ],
    hasAppointment: false,
    hasCallScheduled: false,
    hasOrderPlaced: false,
    lastActivity: '2023-10-28T14:20:30Z',
  },
  {
    id: uuidv4(),
    userId: 'user-4',
    userName: 'Diana Prince',
    messages: [
      { id: uuidv4(), sender: 'user', text: 'I\'d like to book an appointment for a consultation.', timestamp: '2023-10-29T09:00:00Z' },
      { id: uuidv4(), sender: 'bot', text: 'Please choose a date and time from the calendar.', timestamp: '2023-10-29T09:00:30Z' },
      { id: uuidv4(), sender: 'user', text: 'November 5th at 10 AM works for me.', timestamp: '2023-10-29T09:01:00Z' },
      { id: uuidv4(), sender: 'bot', text: 'Appointment confirmed for November 5th at 10 AM.', timestamp: '2023-10-29T09:01:30Z' },
    ],
    hasAppointment: true,
    hasCallScheduled: false,
    hasOrderPlaced: false,
    lastActivity: '2023-10-29T09:01:30Z',
  },
];
