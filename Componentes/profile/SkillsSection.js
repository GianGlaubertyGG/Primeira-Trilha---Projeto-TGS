import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SkillsSection({ skills }) {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Habilidades</h3>
      </CardHeader>
      <CardContent>
        {skills && skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1 text-sm bg-blue-100 text-blue-800">
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nenhuma habilidade adicionada.</p>
        )}
      </CardContent>
    </Card>
  );
}