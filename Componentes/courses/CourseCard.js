import React from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, BarChart3, Users } from "lucide-react";

const categoryColors = {
  technology: "bg-blue-100 text-blue-800",
  business: "bg-green-100 text-green-800",
  design: "bg-purple-100 text-purple-800",
  marketing: "bg-orange-100 text-orange-800",
  communication: "bg-pink-100 text-pink-800",
  leadership: "bg-yellow-100 text-yellow-800",
};

const levelColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800", 
  advanced: "bg-red-100 text-red-800",
};

export default function CourseCard({ course, isPremium = false }) {
  return (
    <Card className="shadow-sm border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative">
          <img 
            src={course.cover_image || 'https://images.unsplash.com/photo-1517694712202-1428bcda850e?q=80&w=800&auto=format&fit=crop'} 
            alt={course.title}
            className="w-full h-40 object-cover"
          />
          <Badge className={`absolute top-3 left-3 ${categoryColors[course.category] || 'bg-gray-100 text-gray-800'}`}>
            {course.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 flex-grow">
        <h3 className="font-bold text-lg text-gray-900 mb-2">{course.title}</h3>
        <p className="text-sm text-gray-600 mb-3">com {course.instructor_name}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            <span>{course.level}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-yellow-500 font-bold">
            <Star className="w-4 h-4 fill-current" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Users className="w-4 h-4" />
            <span>{course.students_count.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 border-t-0 flex items-center justify-between">
        <div className="flex flex-col">
          {isPremium && course.original_price && (
            <p className="text-sm text-gray-400 line-through">
              De R$ {course.original_price.toFixed(2).replace('.', ',')}
            </p>
          )}
          <p className="text-xl font-bold text-blue-600">
            {course.price > 0 ? `R$ ${course.price.toFixed(2).replace('.', ',')}` : "Grátis"}
          </p>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          Ver Curso
        </Button>
      </CardFooter>
    </Card>
  );
}