import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Gift } from "lucide-react";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/sempre",
    description: "Para começar sua jornada",
    features: [
      "Acesso a 3 cursos básicos",
      "Certificados básicos",
      "Suporte via email",
      "Conteúdo limitado"
    ],
    icon: Gift,
    buttonText: "Começar Grátis",
    buttonVariant: "outline",
    popular: false
  },
  {
    name: "Premium Mensal",
    price: "R$ 29,90",
    period: "/mês",
    description: "Flexibilidade total",
    features: [
      "Acesso ilimitado a todos os cursos",
      "80% de desconto em cursos individuais",
      "Certificados premium",
      "Suporte prioritário",
      "Downloads offline",
      "Novos cursos toda semana"
    ],
    icon: Zap,
    buttonText: "Assinar Mensal",
    buttonVariant: "default",
    popular: false
  },
  {
    name: "Premium Anual",
    price: "R$ 19,90",
    period: "/mês",
    originalPrice: "R$ 29,90",
    yearlyPrice: "R$ 239,90/ano",
    description: "Melhor custo-benefício",
    features: [
      "Tudo do plano mensal",
      "2 meses grátis (economia de 33%)",
      "Acesso antecipado a novos cursos",
      "Mentoria individual mensal",
      "Workshops exclusivos",
      "Certificado de conclusão diferenciado"
    ],
    icon: Crown,
    buttonText: "Assinar Anual",
    buttonVariant: "default",
    popular: true
  }
];

export default function PricingPlans() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Escolha seu plano</h2>
        <p className="text-gray-600">Invista em seu futuro com o plano ideal para você</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card key={index} className={`relative shadow-sm border-0 ${
            plan.popular 
              ? 'ring-2 ring-blue-500 bg-gradient-to-b from-blue-50 to-white' 
              : 'bg-white'
          }`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1">
                  <Crown className="w-3 h-3 mr-1" />
                  Mais Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`inline-flex p-3 rounded-2xl mx-auto mb-4 ${
                plan.popular 
                  ? 'bg-blue-100' 
                  : index === 0 
                    ? 'bg-gray-100' 
                    : 'bg-purple-100'
              }`}>
                <plan.icon className={`w-8 h-8 ${
                  plan.popular 
                    ? 'text-blue-600' 
                    : index === 0 
                      ? 'text-gray-600' 
                      : 'text-purple-600'
                }`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="text-gray-500 text-sm">{plan.description}</p>
              <div className="mt-4">
                {plan.originalPrice && (
                  <div className="text-sm text-gray-400 line-through">{plan.originalPrice}</div>
                )}
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
                {plan.yearlyPrice && (
                  <div className="text-sm text-gray-600 mt-1">{plan.yearlyPrice}</div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full mt-6 ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : plan.buttonVariant === 'outline'
                      ? ''
                      : 'bg-purple-600 hover:bg-purple-700'
                }`}
                variant={plan.buttonVariant}
              >
                {plan.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}