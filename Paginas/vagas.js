import React, { useState, useEffect } from "react";
import { Job, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Clock, Building2, DollarSign, Filter, Briefcase, Users } from "lucide-react";

import JobCard from "../components/jobs/JobCard";
import JobFilters from "../components/jobs/JobFilters";
import CreateJobModal from "../components/jobs/CreateJobModal";

export default function VagasPage() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    job_type: "all",
    experience_level: "all",
    work_mode: "all",
    location: ""
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, filters]);

  const loadData = async () => {
    try {
      const [jobsData, userData] = await Promise.all([
        Job.list('-created_date'),
        User.me()
      ]);
      
      setJobs(jobsData);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setLoading(false);
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.job_type !== "all") {
      filtered = filtered.filter(job => job.job_type === filters.job_type);
    }

    if (filters.experience_level !== "all") {
      filtered = filtered.filter(job => job.experience_level === filters.experience_level);
    }

    if (filters.work_mode !== "all") {
      filtered = filtered.filter(job => job.work_mode === filters.work_mode);
    }

    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const handleCreateJob = async (jobData) => {
    try {
      await Job.create({
        ...jobData,
        recruiter_email: currentUser.email
      });
      loadData();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Erro ao criar vaga:", error);
    }
  };

  const isRecruiter = currentUser?.user_type === "recruiter";

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
            <div className="md:col-span-3 space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Oportunidades para Iniciantes</h1>
            <p className="text-gray-600">Encontre sua primeira oportunidade ou estágio dos sonhos</p>
          </div>
          {isRecruiter && (
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Publicar Vaga
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total de Vagas</p>
                  <p className="text-2xl font-bold">{jobs.length}</p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Estágios</p>
                  <p className="text-2xl font-bold">
                    {jobs.filter(job => job.job_type === "internship").length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Remoto</p>
                  <p className="text-2xl font-bold">
                    {jobs.filter(job => job.work_mode === "remote").length}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Sem Experiência</p>
                  <p className="text-2xl font-bold">
                    {jobs.filter(job => job.experience_level === "no_experience").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filtros laterais */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <JobFilters filters={filters} setFilters={setFilters} />
            </div>
          </div>

          {/* Lista de vagas */}
          <div className="lg:col-span-3">
            {/* Barra de pesquisa */}
            <Card className="shadow-sm border-0 bg-white/90 backdrop-blur-sm mb-6">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Buscar por vaga, empresa ou palavra-chave..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-0 bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <Button variant="outline" className="px-4">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de vagas */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  currentUser={currentUser}
                />
              ))}
              
              {filteredJobs.length === 0 && !loading && (
                <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma vaga encontrada</h3>
                    <p className="text-gray-500">Tente ajustar os filtros ou termo de busca</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de criação de vaga */}
      <CreateJobModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
}