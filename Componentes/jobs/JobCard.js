import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Building2, DollarSign, Users, Bookmark, ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const jobTypeLabels = {
  fulltime: "Tempo Integral",
  parttime: "Meio Período",
  internship: "Estágio",
  contract: "Contrato",
  freelance: "Freelance"
};

const workModeLabels = {
  remote: "Remoto",
  hybrid: "Híbrido",
  onsite: "Presencial"
};

const experienceLevelLabels = {
  entry_level: "Júnior",
  student: "Estudante",
  no_experience: "Sem Experiência"
};

const jobTypeColors = {
  fulltime: "bg-blue-100 text-blue-800",
  parttime: "bg-green-100 text-green-800",
  internship: "bg-purple-100 text-purple-800",
  contract: "bg-orange-100 text-orange-800",
  freelance: "bg-pink-100 text-pink-800"
};

const workModeColors = {
  remote: "bg-emerald-100 text-emerald-800",
  hybrid: "bg-yellow-100 text-yellow-800",
  onsite: "bg-gray-100 text-gray-800"
};

export default function JobCard({ job, currentUser }) {
  const [saved, setSaved] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleApply = () => {
    // Implementar funcionalidade de candidatura
    console.log("Candidatando-se à vaga:", job.id);
  };

  const truncatedDescription = job.description?.slice(0, 200);
  const needsTruncation = job.description?.length > 200;

  return (
    <Card className="shadow-sm border-0 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-14 h-14">
                <AvatarImage src={job.company_logo} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg">
                  {job.company?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {job.job_type === "internship" && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">E</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Building2 className="w-4 h-4" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(job.created_date), "d MMM", { locale: ptBR })}
                </div>
                {job.salary_range && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {job.salary_range}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={jobTypeColors[job.job_type]}>
                  {jobTypeLabels[job.job_type]}
                </Badge>
                <Badge className={workModeColors[job.work_mode]}>
                  {workModeLabels[job.work_mode]}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {experienceLevelLabels[job.experience_level]}
                </Badge>
                {job.applications_count > 0 && (
                  <Badge variant="outline" className="text-gray-600">
                    <Users className="w-3 h-3 mr-1" />
                    {job.applications_count} candidatos
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={`${saved ? 'text-yellow-600 bg-yellow-50' : 'text-gray-400'}`}
            >
              <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 leading-relaxed">
              {showFullDescription ? job.description : truncatedDescription}
              {needsTruncation && !showFullDescription && '...'}
            </p>
            {needsTruncation && (
              <Button
                variant="link"
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="p-0 h-auto text-blue-600 text-sm mt-1"
              >
                {showFullDescription ? 'Ver menos' : 'Ver mais'}
              </Button>
            )}
          </div>
          
          {job.skills_required && job.skills_required.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Habilidades necessárias:</p>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.slice(0, 5).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    {skill}
                  </Badge>
                ))}
                {job.skills_required.length > 5 && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    +{job.skills_required.length - 5} mais
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Benefícios:</p>
              <div className="flex flex-wrap gap-2">
                {job.benefits.slice(0, 3).map((benefit, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                    {benefit}
                  </Badge>
                ))}
                {job.benefits.length > 3 && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                    +{job.benefits.length - 3} mais
                  </Badge>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {job.application_deadline && (
                <div className="flex items-center gap-1 text-sm text-amber-600">
                  <Clock className="w-4 h-4" />
                  <span>Até {format(new Date(job.application_deadline), "d/MM", { locale: ptBR })}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver detalhes
              </Button>
              <Button 
                onClick={handleApply}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                Candidatar-se
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}