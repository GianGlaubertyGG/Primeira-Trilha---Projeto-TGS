import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Award, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const postTypeIcons = {
  achievement: <Award className="w-4 h-4 text-yellow-600" />,
  text: null,
  image: null,
  video: null,
  article: <span className="text-xs">📄</span>
};

const postTypeBadges = {
  achievement: { label: "Conquista", className: "bg-yellow-100 text-yellow-800" },
  article: { label: "Artigo", className: "bg-purple-100 text-purple-800" },
  image: { label: "Foto", className: "bg-blue-100 text-blue-800" },
  video: { label: "Vídeo", className: "bg-red-100 text-red-800" }
};

export default function PostCard({ post, currentUser, onShare }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleShare = () => {
    if (onShare) {
      onShare(post);
    }
  };

  const renderHashtags = (text) => {
    if (!text) return text;
    
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('#')) {
        return (
          <span 
            key={index} 
            className="text-blue-600 hover:text-blue-700 cursor-pointer hover:underline"
            onClick={() => window.location.href = createPageUrl(`Feed?hashtag=${part.slice(1)}`)}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  if (!post.author) {
    return null;
  }

  return (
    <Card className="shadow-sm border-0 bg-white/90 backdrop-blur-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Link to={createPageUrl(`Perfil?id=${post.author.id}`)}>
              <Avatar className="w-12 h-12">
                <AvatarImage src={post.author.profile_image} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                  {post.author.full_name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link to={createPageUrl(`Perfil?id=${post.author.id}`)}>
                  <h3 className="font-semibold text-gray-900 hover:underline">{post.author.full_name}</h3>
                </Link>
                {postTypeBadges[post.post_type] && (
                  <Badge className={`text-xs ${postTypeBadges[post.post_type].className}`}>
                    {postTypeIcons[post.post_type]}
                    {postTypeBadges[post.post_type].label}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {format(new Date(post.created_date), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-gray-400">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          <div className="prose max-w-none">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {renderHashtags(post.content)}
            </p>
          </div>
          
          {post.media_urls && post.media_urls.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {post.media_urls.map((url, index) => (
                <div key={index} className="rounded-xl overflow-hidden bg-gray-100">
                  {url.includes('.mp4') || url.includes('.mov') || url.includes('.avi') ? (
                    <video 
                      src={url} 
                      controls
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <img 
                      src={url} 
                      alt="Post media"
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="text-blue-600 hover:text-blue-700 text-sm cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`flex items-center gap-2 hover:bg-red-50 ${
                  liked ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{(post.likes_count || 0) + (liked ? 1 : 0)}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">{post.comments_count || 0}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-500 hover:bg-green-50 hover:text-green-600"
              >
                <Share2 className="w-5 h-5" />
                <span className="text-sm">{post.shares_count || 0}</span>
              </Button>
            </div>
          </div>
          
          {showComments && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser?.profile_image} />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                    {currentUser?.full_name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 bg-gray-50 rounded-full px-4 py-2">
                  <input
                    type="text"
                    placeholder="Escreva um comentário..."
                    className="w-full bg-transparent text-sm outline-none placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}