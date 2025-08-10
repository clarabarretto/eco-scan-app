import React from 'react';
import { Lightbulb, Target, Zap, Heart } from 'lucide-react';

const SustainabilityTips: React.FC = () => {
  const tips = [
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: "Reduza o Consumo",
      description: "Compre apenas o necessário e prefira produtos com menos embalagens",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200"
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: "Reutilize Criativamente",
      description: "Transforme embalagens em organizadores, vasos ou objetos decorativos",
      color: "bg-purple-100 text-purple-700 border-purple-200"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Recicle Corretamente",
      description: "Separe os materiais adequadamente e limpe-os antes do descarte",
      color: "bg-green-100 text-green-700 border-green-200"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Composte Orgânicos",
      description: "Transforme restos de comida em adubo rico para plantas e hortas",
      color: "bg-rose-100 text-rose-700 border-rose-200"
    }
  ];

  return (
    <div className="bg-card rounded-2xl p-8 shadow-card">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Dicas de Sustentabilidade
        </h2>
        <p className="text-muted-foreground">
          Práticas simples que fazem diferença para o meio ambiente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-card ${tip.color}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 bg-white/70 rounded-lg">
                {tip.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  {tip.title}
                </h3>
                <p className="text-sm leading-relaxed opacity-80">
                  {tip.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-6 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl border border-secondary/20">
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-foreground">
            🌍 Juntos por um Planeta Mais Limpo
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cada ação conta! Ao classificar corretamente seus resíduos, você contribui 
            diretamente para a preservação do meio ambiente e para um futuro mais sustentável.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityTips;