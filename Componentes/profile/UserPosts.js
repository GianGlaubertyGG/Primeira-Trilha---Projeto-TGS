import React from 'react';
import PostCard from '../feed/PostCard';
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from 'lucide-react';

export default function UserPosts({ posts }) {
  return (
    <div className="space-y-6">
      {posts && posts.length > 0 ? (
        posts.map(post => <PostCard key={post.id} post={post} />)
      ) : (
        <Card className="shadow-sm border-0">
          <CardContent className="p-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma atividade recente</h3>
            <p className="text-gray-500">Comece a compartilhar suas conquistas!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}