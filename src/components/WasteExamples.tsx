import React from 'react';
import plasticExample from '@/assets/plastic-example.jpg';
import cardboardExample from '@/assets/cardboard-example.jpg';
import glassExample from '@/assets/glass-example.jpg';
import metalExample from '@/assets/metal-example.jpg';
import paperExample from '@/assets/paper-example.jpg';
import organicExample from '@/assets/organic-example.jpg';

const WasteExamples: React.FC = () => {
  const wasteTypes = [
    {
      name: 'Plástico',
      icon: '♻️',
      image: plasticExample,
      examples: ['Garrafas PET', 'Embalagens', 'Sacolas'],
      tip: 'Limpe antes de reciclar para evitar contaminação',
      color: 'border-red-200 bg-red-50'
    },
    {
      name: 'Papelão',
      icon: '📦',
      image: cardboardExample,
      examples: ['Caixas', 'Embalagens', 'Cartões'],
      tip: 'Remova fitas adesivas e grampos antes do descarte',
      color: 'border-amber-200 bg-amber-50'
    },
    {
      name: 'Vidro',
      icon: '🍶',
      image: glassExample,
      examples: ['Garrafas', 'Potes', 'Frascos'],
      tip: 'Pode ser reciclado infinitas vezes sem perder qualidade',
      color: 'border-emerald-200 bg-emerald-50'
    },
    {
      name: 'Metal',
      icon: '🥫',
      image: metalExample,
      examples: ['Latas', 'Alumínio', 'Ferro'],
      tip: 'Metais são 100% recicláveis e economizam muita energia',
      color: 'border-slate-200 bg-slate-50'
    },
    {
      name: 'Papel',
      icon: '📄',
      image: paperExample,
      examples: ['Jornais', 'Revistas', 'Documentos'],
      tip: 'Papel pode ser reciclado até 7 vezes antes de perder fibras',
      color: 'border-blue-200 bg-blue-50'
    },
    {
      name: 'Orgânico',
      icon: '🍎',
      image: organicExample,
      examples: ['Cascas', 'Restos de comida', 'Folhas'],
      tip: 'Pode virar adubo através da compostagem doméstica',
      color: 'border-green-200 bg-green-50'
    }
  ];

  return (
    <div className="bg-card rounded-2xl p-8 shadow-card">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-3">
          Exemplos de Classificação
        </h2>
        <p className="text-muted-foreground">
          Aprenda a identificar cada tipo de resíduo corretamente
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wasteTypes.map((type, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 ${type.color}`}
          >
            <div className="text-center space-y-4">
              <div className="relative">
                <img
                  src={type.image}
                  alt={`Exemplo de ${type.name}`}
                  className="w-full h-32 object-cover rounded-lg shadow-subtle"
                />
                <div className="absolute -top-2 -right-2 bg-card rounded-full p-2 shadow-card">
                  <span className="text-2xl">{type.icon}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {type.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {type.examples.map((example, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/70 text-xs rounded-full text-muted-foreground"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    💡 {type.tip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WasteExamples;