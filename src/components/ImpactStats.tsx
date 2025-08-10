import React from 'react';
import { Leaf, BarChart3, Globe, Recycle } from 'lucide-react';

const ImpactStats: React.FC = () => {
  const stats = [
    {
      icon: <Recycle className="h-6 w-6" />,
      value: "91%",
      label: "Do plástico não é reciclado globalmente",
      color: "text-red-600"
    },
    {
      icon: <Leaf className="h-6 w-6" />,
      value: "30%",
      label: "Redução de emissão de CO₂ com reciclagem",
      color: "text-secondary"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      value: "300M",
      label: "Toneladas de lixo produzidas anualmente",
      color: "text-amber-600"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      value: "95%",
      label: "De economia de energia reciclando alumínio",
      color: "text-blue-600"
    }
  ];

  return (
    <div className="bg-card rounded-2xl p-8 shadow-card">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Impacto da Reciclagem
        </h2>
        <p className="text-muted-foreground">
          Dados que mostram a importância da classificação correta de resíduos
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center space-y-3">
            <div className={`inline-flex p-3 rounded-xl bg-muted/50 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className={`text-3xl font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground leading-tight">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactStats;