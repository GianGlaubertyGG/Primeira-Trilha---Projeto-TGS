import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, UserPlus, MessageCircle, Check } from "lucide-react";

export default function ProfileHeader({ user, isMyProfile, isFollowing, onEdit, onFollow }) {
  return (
    <Card className="shadow-sm border-0 overflow-hidden">
      <div className="h-32 md:h-48 bg-gradient-to-r from-blue-500 to-purple-600">
        {user.cover_image && (
          <img src={user.cover_image} alt="Capa do perfil" className="w-full h-full object-cover" />
        )}
      </div>
      <CardContent className="relative pt-0">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 -mt-12 md:-mt-16 border-4 border-white shadow-lg">
            <AvatarImage src={user.profile_image} />
            <AvatarFallback className="text-4xl bg-blue-100 text-blue-700 font-semibold">
              {user.full_name?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.full_name}</h1>
                <p className="text-gray-600">{user.bio}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                  <span>{user.followers_count || 0} seguidores</span>
                  <span>{user.following_count || 0} seguindo</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                {isMyProfile ? (
                  <Button onClick={onEdit}><Edit className="w-4 h-4 mr-2" /> Editar Perfil</Button>
                ) : (
                  <>
                    <Button onClick={onFollow} variant={isFollowing ? 'outline' : 'default'}>
                      {isFollowing ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <UserPlus className="w-4 h-4 mr-2" />
                      )}
                      {isFollowing ? 'Seguindo' : 'Seguir'}
                    </Button>
                    <Button variant="outline"><MessageCircle className="w-4 h-4 mr-2" /> Mensagem</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}