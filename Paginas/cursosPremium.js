
import React, { useState, useEffect, useCallback } from "react";
import { Course } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, BookOpen, Clock, BarChart3, Filter, Users, Crown, Check, Zap } from "lucide-react";

import CourseCard from "../components/courses/CourseCard";
import CourseFilters from "../components/courses/CourseFilters";
import PricingPlans from "../components/premium/PricingPlans";

export default function CursosPremiumPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    price: "all"
  });

  const loadCourses = async () => {
    setLoading(true);
    try {
      const coursesData = await Course.list('-created_date');
      // Aplicar desconto de 80% nos preços
      const discountedCourses = coursesData.map(course => ({
        ...course,
        original_price: course.price,
        price: Math.round(course.price * 0.2 * 100) / 100 // 80% de desconto
      }));
      setCourses(discountedCourses);
    } catch (error) {
      console.error("Erro ao carregar cursos:", error);
    }
    setLoading(false);
  };

  const applyFilters = useCallback(() => {
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
  }, [courses, searchTerm, filters]);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const totalStudents = courses.reduce((sum, course) => sum + (course.students_count || 0), 0);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header Premium */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-8 mb-8">
          <div className="absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-400 rounded-xl">
                <Crown className="w-8 h-8 text-purple-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Cursos Premium</h1>
                <p className="text-blue-100">Acelere sua carreira com acesso ilimitado</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="flex items-center gap-3 text-white">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span>80% de desconto em todos os cursos</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Check className="w-6 h-6 text-green-400" />
                <span>Certificados reconhecidos</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <BookOpen className="w-6 h-6 text-blue-300" />
                <span>Acesso vitalício aos conteúdos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Planos de Assinatura */}
        <div className="mb-8">
          <PricingPlans />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg"><BookOpen className="w-6 h-6 text-blue-600" /></div>
              <div>
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="text-gray-500 text-sm">Cursos Premium</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg"><Users className="w-6 h-6 text-green-600" /></div>
              <div>
                <p className="text-2xl font-bold">{totalStudents.toLocaleString('pt-BR')}</p>
                <p className="text-gray-500 text-sm">Alunos Premium</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-0 bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg"><Crown className="w-6 h-6 text-yellow-600" /></div>
              <div>
                <p className="text-2xl font-bold">80%</p>
                <p className="text-gray-500 text-sm">Desconto Médio</p>
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
                    <div key={course.id} className="relative">
                      <Badge className="absolute top-3 right-3 z-10 bg-yellow-500 text-black font-bold">
                        80% OFF
                      </Badge>
                      <CourseCard course={course} isPremium={true} />
                    </div>
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
