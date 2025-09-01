
import React, { useState, useEffect } from "react";
import { Course } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, BookOpen, Clock, BarChart3, Filter, Users } from "lucide-react";

import CourseCard from "../components/courses/CourseCard";
import CourseFilters from "../components/courses/CourseFilters";

export default function CursosPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    price: "all"
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [courses, searchTerm, filters]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const coursesData = await Course.list('-created_date');
      setCourses(coursesData);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.category !== "all") {
      filtered = filtered.filter(course => course.category === filters.category);
    }
    
    if (filters.level !== "all") {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    if (filters.price === "free") {
      filtered = filtered.filter(course => course.price === 0);
    } else if (filters.price === "paid") {
      filtered = filtered.filter(course => course.price > 0);
    }
    
    setFilteredCourses(filtered);
  };

  const totalStudents = courses.reduce((sum, course) => sum + (course.students_count || 0), 0);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Capacitação Profissional</h1>
            <p className="text-gray-600">Invista em você e desenvolva novas habilidades para o mercado.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg"><BookOpen className="w-6 h-6 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-gray-500 text-sm">Cursos Disponíveis</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg"><Users className="w-6 h-6 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold">{totalStudents.toLocaleString('pt-BR')}</p>
                <p className="text-gray-500 text-sm">Alunos Capacitados</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg"><Star className="w-6 h-6 text-yellow-600" /></div>
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-gray-500 text-sm">Avaliação Média</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filtros laterais */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CourseFilters filters={filters} setFilters={setFilters} />
            </div>
          </div>

          {/* Lista de cursos */}
          <div className="lg:col-span-3">
            {/* Barra de pesquisa */}
            <Card className="shadow-sm border-0 bg-white/90 backdrop-blur-sm mb-6">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar por curso, habilidade ou instrutor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-0 bg-gray-50 focus:bg-white"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading 
                ? Array(6).fill(0).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-40 bg-gray-200 rounded-t-lg"></div>
                      <CardContent className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/4 mt-2"></div>
                      </CardContent>
                    </Card>
                  ))
                : filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))
              }
            </div>

            {filteredCourses.length === 0 && !loading && (
              <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm col-span-full">
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum curso encontrado</h3>
                  <p className="text-gray-500">Tente ajustar os filtros ou termo de busca.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
