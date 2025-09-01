import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ConversationList({ conversations, currentUser, onSelectChat, selectedChat, loading }) {
  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Mensagens</h2>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Pesquisar conversas" className="pl-9 bg-gray-100 border-0" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map(convo => {
          const lastMessage = convo.messages[0];
          const unreadCount = convo.messages.filter(m => !m.read && m.sender_email !== currentUser.email).length;
          
          return (
            <div
              key={convo.otherUserEmail}
              onClick={() => onSelectChat(convo)}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors
                ${selectedChat?.otherUserEmail === convo.otherUserEmail ? 'bg-blue-50 border-r-4 border-blue-600' : ''}
              `}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                  {convo.otherUserEmail[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800 truncate">{convo.otherUserEmail}</p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(lastMessage.created_date), 'HH:mm', { locale: ptBR })}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate">{lastMessage.message}</p>
                  {unreadCount > 0 && (
                    <Badge className="bg-green-500 text-white px-2 py-0.5 text-xs">{unreadCount}</Badge>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}