import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProjectsSection({ projects }) {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Projetos</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects && projects.length > 0 ? (
          projects.map((proj, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-800">{proj.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {proj.technologies?.map(tech => <Badge key={tech} variant="outline">{tech}</Badge>)}
                  </div>
                </div>
                {proj.url && (
                  <a href={proj.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 text-blue-600" />
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Nenhum projeto adicionado.</p>
        )}
      </CardContent>
    </Card>
  );
}