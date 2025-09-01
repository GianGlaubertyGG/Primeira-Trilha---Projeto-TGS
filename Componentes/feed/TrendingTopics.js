import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Hash } from "lucide-react";

const trendingTopics = [
  { tag: "PrimeiroEmprego", posts: 234, growth: "+15%" },
  { tag: "EstágioTech", posts: 189, growth: "+23%" },
  { tag: "RecémFormado", posts: 156, growth: "+8%" },
  { tag: "CarreiraIniciante", posts: 142, growth: "+12%" },
  { tag: "OportunidadeJunior", posts: 98, growth: "+31%" }
];

export default function TrendingTopics() {
  return (
    <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-900">Trending</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div key={index} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-blue-600" />
              <div>
                <p className="font-medium text-sm text-gray-900">#{topic.tag}</p>
                <p className="text-xs text-gray-500">{topic.posts} posts</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 text-xs">
              {topic.growth}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}