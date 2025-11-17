import ROUTES from '../routes'
import { Chatbot } from '@/views/Chatbot'

export const chatbotRoutes = [
  {
    path: ROUTES.CHATBOT,
    children: [
      {
        path: '',
        element: <Chatbot />,
        handle: { title: 'Chatbot' }
      }
    ]
  }
]
