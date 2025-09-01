import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AboutSection({ bio }) {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader>
        <h3 className="font-semibold text-gray-900">Sobre</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {bio || "Nenhuma biografia adicionada ainda."}
        </p>
      </CardContent>
    </Card>
  );
}