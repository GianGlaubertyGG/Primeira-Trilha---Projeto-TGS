import React, { useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import _ from 'lodash';

export default function ChatWindow({ chat, currentUser, onSendMessage }) {
  const [message, setMessage] = React.useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chat.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const sortedMessages = _.orderBy(chat.messages, ['created_date'], ['asc']);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
              {chat.otherUserEmail[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{chat.otherUserEmail}</p>
            <p className="text-xs text-green-600">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="space-y-6">
          {sortedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${
                msg.sender_email === currentUser.email ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender_email !== currentUser.email && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gray-300 text-gray-700 text-sm">
                    {msg.sender_email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-md p-3 rounded-2xl ${
                  msg.sender_email === currentUser.email
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none border'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender_email === currentUser.email ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  {format(new Date(msg.created_date), 'HH:mm', { locale: ptBR })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Digite uma mensagem..."
            className="flex-1 bg-gray-100 border-0 rounded-full px-4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="submit" size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}