import React, { useState, useEffect } from "react";
import { ChatMessage, User } from "@/entities/all";
import _ from 'lodash';
import ConversationList from "../components/messages/ConversationList";
import ChatWindow from "../components/messages/ChatWindow";
import { MessageSquare, Users } from "lucide-react";

export default function MensagensPage() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);

      if (user) {
        const sentMessages = await ChatMessage.filter({ sender_email: user.email });
        const receivedMessages = await ChatMessage.filter({ receiver_email: user.email });
        const allMessages = _.uniqBy([...sentMessages, ...receivedMessages], 'id');
        
        const groupedMessages = _.groupBy(allMessages, msg => {
          const otherUser = msg.sender_email === user.email ? msg.receiver_email : msg.sender_email;
          return otherUser;
        });

        const convos = Object.entries(groupedMessages).map(([otherUser, messages]) => ({
          otherUserEmail: otherUser,
          messages: _.orderBy(messages, ['created_date'], ['desc']),
        }));
        
        setConversations(_.orderBy(convos, [c => new Date(c.messages[0].created_date)], ['desc']));
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    }
    setLoading(false);
  };

  const handleSendMessage = async (messageContent) => {
    if (!currentChat || !currentUser) return;

    try {
      await ChatMessage.create({
        sender_email: currentUser.email,
        receiver_email: currentChat.otherUserEmail,
        message: messageContent
      });
      loadData();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 flex flex-col">
          <ConversationList
            conversations={conversations}
            currentUser={currentUser}
            onSelectChat={setCurrentChat}
            selectedChat={currentChat}
            loading={loading}
          />
        </div>
        <div className="flex-1 hidden md:flex flex-col">
          {currentChat ? (
            <ChatWindow
              chat={currentChat}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center bg-gray-50">
              <MessageSquare className="w-20 h-20 text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">Selecione uma conversa</h2>
              <p className="text-gray-500 max-w-xs">Escolha uma pessoa na lista ao lado para começar a conversar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}