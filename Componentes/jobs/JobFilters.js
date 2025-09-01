import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, RotateCcw } from "lucide-react";

export default function JobFilters({ filters, setFilters }) {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      job_type: "all",
      experience_level: "all",
      work_mode: "all",
      location: ""
    });
  };

  return (
    <Card className="shadow-sm border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Filtros</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Limpar
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Tipo de Vaga</Label>
          <Select 
            value={filters.job_type} 
            onValueChange={(value) => handleFilterChange('job_type', value)}
          >
            <SelectTrigger className="border-0 bg-gray-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="fulltime">Tempo Integral</SelectItem>
              <SelectItem value="parttime">Meio Período</SelectItem>
              <SelectItem value="internship">Estágio</SelectItem>
              <SelectItem value="contract">Contrato</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Nível de Experiência</Label>
          <Select 
            value={filters.experience_level} 
            onValueChange={(value) => handleFilterChange('experience_level', value)}
          >
            <SelectTrigger className="border-0 bg-gray-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os níveis</SelectItem>
              <SelectItem value="no_experience">Sem Experiência</SelectItem>
              <SelectItem value="student">Estudante</SelectItem>
              <SelectItem value="entry_level">Júnior</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Modalidade</Label>
          <Select 
            value={filters.work_mode} 
            onValueChange={(value) => handleFilterChange('work_mode', value)}
          >
            <SelectTrigger className="border-0 bg-gray-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="remote">Remoto</SelectItem>
              <SelectItem value="hybrid">Híbrido</SelectItem>
              <SelectItem value="onsite">Presencial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Localização</Label>
          <Input
            placeholder="Cidade ou região"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="border-0 bg-gray-50 focus:bg-white"
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Filtros Rápidos</h4>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs"
                onClick={() => handleFilterChange('job_type', 'internship')}
              >
                🎓 Apenas Estágios
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs"
                onClick={() => handleFilterChange('work_mode', 'remote')}
              >
                🏠 Trabalho Remoto
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start text-xs"
                onClick={() => handleFilterChange('experience_level', 'no_experience')}
              >
                ⭐ Sem Experiência
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}