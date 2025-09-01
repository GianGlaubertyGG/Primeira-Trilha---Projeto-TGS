
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/entities/User'; // Corrected import path for User
import { createPageUrl } from '@/utils';
import { GraduationCap, Briefcase, MessageCircle, LogIn } from 'lucide-react';

export default function LoginWall() {
  const handleLogin = () => {
    // Redirect to the Feed page after successful login
    const callbackUrl = window.location.origin + createPageUrl('Feed');
    User.loginWithRedirect(callbackUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-block p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-6">
          <GraduationCap className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Bem-vindo ao Primeira Trilha</h1>
        <p className="mt-3 text-lg text-gray-600">Sua jornada para a primeira oportunidade de carreira começa aqui.</p>
        
        <div className="mt-8 space-y-4 text-left">
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <p className="text-gray-700">Encontre vagas de estágio e primeiro emprego.</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <p className="text-gray-700">Capacite-se com cursos e obtenha certificados.</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <p className="text-gray-700">Conecte-se com recrutadores e outros talentos.</p>
          </div>
        </div>

        <Button 
          onClick={handleLogin}
          size="lg"
          className="mt-10 w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Entrar ou Criar Conta
        </Button>
        <p className="mt-4 text-xs text-gray-500">Ao continuar, você concorda com nossos Termos de Serviço.</p>
      </div>
    </div>
  );
}
