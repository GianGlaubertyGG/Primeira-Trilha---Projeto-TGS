import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default function EducationSection({ education }) {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Formação Acadêmica</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {education && education.length > 0 ? (
          education.map((edu, index) => (
            <div key={index} className="flex gap-4">
              <div className="pt-1">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">{edu.institution}</h4>
                <p className="text-sm text-gray-600">{edu.degree}, {edu.field}</p>
                <p className="text-xs text-gray-500">{edu.start_date} - {edu.current ? 'Presente' : edu.end_date}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Nenhuma formação adicionada.</p>
        )}
      </CardContent>
    </Card>
  );
}