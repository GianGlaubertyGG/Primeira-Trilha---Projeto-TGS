
import React, { useState, useEffect } from "react";
import { Post, User } from "@/entities/all";
import _ from 'lodash';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Share2, Send, Image as ImageIcon, Video, Award } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import CreatePostCard from "../components/feed/CreatePostCard";
import PostCard from "../components/feed/PostCard";
import SuggestedConnections from "../components/feed/SuggestedConnections";
import TrendingTopics from "../components/feed/TrendingTopics";

export default function FeedPage({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    try {
      const postsData = await Post.list('-created_date', 20);
      
      // Get author info for each post
      const authorEmails = _.uniq(postsData.map(p => p.author_email));
      const authors = await User.filter({ email: { '$in': authorEmails } });
      const authorsMap = _.keyBy(authors, 'email');

      const postsWithAuthors = postsData.map(post => ({
        ...post,
        author: authorsMap[post.author_email] || { email: post.author_email, full_name: 'Usuário Desconhecido' }
      }));
      
      setPosts(postsWithAuthors);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setLoading(false);
  };

  const handleCreatePost = async (postData) => {
    try {
      await Post.create({
        ...postData,
        author_email: currentUser.email
      });
      loadData(); // Recarrega os posts
    } catch (error) {
      console.error("Erro ao criar post:", error);
    }
  };

  const handleSharePost = async (originalPost) => {
    try {
      await Post.create({
        content: `Compartilhado de ${originalPost.author.full_name}: ${originalPost.content}`,
        post_type: "text",
        author_email: currentUser.email,
        visibility: "public"
      });
      loadData();
    } catch (error) {
      console.error("Erro ao compartilhar post:", error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar esquerda */}
          <div className="hidden lg:block space-y-6">
            {currentUser && (
              <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div 
                    className="h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg -mx-6 -mt-6 mb-4"
                    style={{
                      backgroundImage: currentUser.cover_image ? `url(${currentUser.cover_image})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  ></div>
                  <Avatar className="w-16 h-16 mx-auto -mt-8 border-4 border-white">
                    <AvatarImage src={currentUser.profile_image} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-lg">
                      {currentUser.full_name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-gray-900 mt-3">{currentUser.full_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{currentUser.bio}</p>
                  <div className="flex justify-around mt-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="font-semibold text-sm">{currentUser.followers_count || 0}</p>
                      <p className="text-xs text-gray-500">Seguidores</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">{currentUser.following_count || 0}</p>
                      <p className="text-xs text-gray-500">Seguindo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <TrendingTopics />
          </div>

          {/* Feed principal */}
          <div className="lg:col-span-2 space-y-6">
            {currentUser && (
              <CreatePostCard 
                currentUser={currentUser} 
                onCreatePost={handleCreatePost} 
              />
            )}

            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  currentUser={currentUser}
                  onShare={handleSharePost}
                />
              ))}
              
              {posts.length === 0 && !loading && (
                <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum post encontrado</h3>
                    <p className="text-gray-500">Seja o primeiro a compartilhar algo interessante!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar direita */}
          <div className="hidden lg:block space-y-6">
            <SuggestedConnections />
            
            <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <h3 className="font-semibold text-gray-900">Atividade Recente</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">5 novas vagas disponíveis</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">2 novos seguidores</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">Curso "React Avançado" disponível</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
