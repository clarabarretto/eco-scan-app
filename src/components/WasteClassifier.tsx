import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Leaf, Recycle, AlertCircle, CheckCircle2, Camera, X } from 'lucide-react';
import { toast } from "sonner";
import wasteExamplesHero from '@/assets/interactive-waste-collection.jpg';
import ImpactStats from './ImpactStats';
import WasteExamples from './WasteExamples';
import SustainabilityTips from './SustainabilityTips';

interface ClassificationResult {
  category: string;
  confidence: number;
  tips: string;
  icon: string;
  allPredictions: {
    [key: string]: number;
  };
}

const WasteClassifier: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const wasteCategories = {
    'papelao': { name: 'Papelão', icon: '📦', color: 'text-amber-600' },
    'vidro': { name: 'Vidro', icon: '🍶', color: 'text-emerald-600' },
    'metal': { name: 'Metal', icon: '🥫', color: 'text-slate-600' },
    'papel': { name: 'Papel', icon: '📄', color: 'text-blue-600' },
    'plastico': { name: 'Plástico', icon: '🥤', color: 'text-red-600' },
    'organico': { name: 'Orgânico', icon: '🍎', color: 'text-green-600' }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setResult(null);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success("Imagem carregada com sucesso!");
    } else {
      toast.error("Por favor, selecione um arquivo de imagem válido.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  const classifyImage = async () => {
    if (!selectedImage) {
      toast.error("Por favor, selecione uma imagem primeiro.");
      return;
    }

    setIsClassifying(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      // Simulação da API call - substitua pela URL real do seu backend
      const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro na classificação');
      }

      const data = await response.json();
      
      // Enhanced mock results with tips and icons
      const categories = Object.keys(wasteCategories);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const categoryData = wasteCategories[randomCategory as keyof typeof wasteCategories];
      
      // Generate mock predictions for all categories
      const allPredictions: { [key: string]: number } = {};
      const mainConfidence = Math.random() * 0.3 + 0.7; // 70-100%
      let remainingConfidence = 1 - mainConfidence;
      
      // Set main category confidence
      allPredictions[randomCategory] = mainConfidence;
      
      // Distribute remaining confidence among other categories
      const otherCategories = categories.filter(cat => cat !== randomCategory);
      otherCategories.forEach((cat, index) => {
        if (index === otherCategories.length - 1) {
          // Last category gets remaining confidence
          allPredictions[cat] = remainingConfidence;
        } else {
          const categoryConfidence = Math.random() * remainingConfidence * 0.6;
          allPredictions[cat] = categoryConfidence;
          remainingConfidence -= categoryConfidence;
        }
      });
      
      const mockResult = {
        category: categoryData.name,
        confidence: mainConfidence,
        tips: `${categoryData.name} detectado! Certifique-se de separar corretamente para reciclagem.`,
        icon: categoryData.icon,
        allPredictions
      };
      
      setResult(mockResult);
      
      // Save to history and update points
      saveClassificationToHistory(mockResult);
      toast.success("Classificação realizada com sucesso!");
      
    } catch (error) {
      console.error('Erro na classificação:', error);
      toast.error("Erro ao classificar a imagem. Tente novamente.");
    } finally {
      setIsClassifying(false);
    }
  };

  const saveClassificationToHistory = (result: ClassificationResult) => {
    const historyItem = {
      id: Date.now().toString(),
      category: result.category,
      confidence: result.confidence,
      timestamp: new Date(),
      points: Math.round(result.confidence * 100) // Points based on confidence
    };
    
    // Save to localStorage
    const existingHistory = JSON.parse(localStorage.getItem('classification-history') || '[]');
    const updatedHistory = [historyItem, ...existingHistory];
    localStorage.setItem('classification-history', JSON.stringify(updatedHistory));
    
    // Update total points
    const currentPoints = parseInt(localStorage.getItem('eco-points') || '0');
    const newTotalPoints = currentPoints + historyItem.points;
    localStorage.setItem('eco-points', newTotalPoints.toString());
  };

  const resetClassifier = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-secondary/10 p-3 rounded-2xl">
              <Recycle className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">EcoClassify</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Classificação inteligente de resíduos utilizando IA para promover 
            <span className="text-secondary font-medium"> sustentabilidade</span> e 
            gestão ambiental eficiente
          </p>
          
          {/* Hero Image */}
          <div className="max-w-2xl mx-auto mb-8">
            <img
              src={wasteExamplesHero}
              alt="Exemplos de resíduos recicláveis organizados"
              className="w-full h-64 object-cover rounded-2xl shadow-elegant"
            />
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Interactive Upload Area */}
          {!imagePreview && (
            <div
              {...getRootProps()}
              className={`group relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-500 ${
                isDragActive 
                  ? 'border-secondary bg-gradient-to-br from-secondary/10 to-primary/10 scale-105 shadow-lg' 
                  : 'border-border bg-card hover:border-secondary hover:bg-gradient-to-br hover:from-secondary/5 hover:to-primary/5 hover:scale-105 hover:shadow-md'
              }`}
            >
              <input {...getInputProps()} />
              
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-primary to-secondary animate-pulse"></div>
              </div>
              
              <div className="relative space-y-6">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 transition-transform duration-300 ${isDragActive ? 'scale-110 rotate-6' : 'group-hover:scale-110'}`}>
                  <Camera className={`h-8 w-8 text-secondary transition-all duration-300 ${isDragActive ? 'animate-bounce' : ''}`} />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-foreground transition-all duration-300 group-hover:text-secondary">
                    {isDragActive ? '📸 Solte a imagem aqui!' : '🎯 Classificação Inteligente de Resíduos'}
                  </h3>
                  <p className="text-muted-foreground transition-all duration-300 group-hover:text-foreground/80">
                    {isDragActive 
                      ? 'Pronto para analisar seu resíduo!' 
                      : 'Arraste uma imagem ou clique para descobrir como reciclar corretamente'
                    }
                  </p>
                  
                  {!isDragActive && (
                    <div className="flex items-center justify-center gap-2 mt-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs bg-secondary/10 px-3 py-1 rounded-full">PNG</span>
                      <span className="text-xs bg-secondary/10 px-3 py-1 rounded-full">JPG</span>
                      <span className="text-xs bg-secondary/10 px-3 py-1 rounded-full">até 10MB</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Image Preview and Classification */}
          {imagePreview && (
            <div className="space-y-6 animate-fade-in">
              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl shadow-card">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Interactive overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Floating action button */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={resetClassifier}
                      className="bg-background/90 backdrop-blur-md hover:bg-background shadow-lg transition-all duration-300 hover:scale-110 p-2 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {/* Image info overlay */}
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-background/90 backdrop-blur-md rounded-lg px-3 py-2">
                      <p className="text-xs text-muted-foreground">Pronto para análise</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Interactive classification button */}
              <div className="relative">
                <button
                  onClick={classifyImage}
                  disabled={isClassifying}
                  className="w-full h-14 text-lg font-medium bg-gradient-to-r from-secondary via-primary to-secondary transition-all duration-500 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isClassifying ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-6 w-6 border-3 border-background border-t-transparent" />
                        <div className="absolute inset-0 animate-ping rounded-full h-6 w-6 border border-background/50" />
                      </div>
                      <span className="animate-pulse">🤖 Analisando com IA...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Recycle className="h-6 w-6 transition-transform duration-300 group-hover:rotate-180" />
                      <span>✨ Classificar com Inteligência Artificial</span>
                    </div>
                  )}
                </button>
                
                {/* Progress indicator for classification */}
                {isClassifying && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-secondary to-primary animate-[progress_2s_ease-in-out]" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Classification Result */}
          {result && (
                <div className="bg-card rounded-2xl p-8 shadow-card animate-fade-in border border-secondary/20">
                  <div className="text-center space-y-6">
                    {/* Animated success icon */}
                    <div className="relative">
                      <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 animate-scale-in">
                        <CheckCircle2 className="h-8 w-8 text-secondary animate-bounce" />
                      </div>
                      <div className="absolute inset-0 inline-flex p-4 rounded-xl animate-ping">
                        <div className="h-8 w-8 bg-secondary/30 rounded-full" />
                      </div>
                    </div>
                    
                    {/* Result display with icon */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-4xl animate-bounce">{result.icon}</span>
                        <h3 className="text-3xl font-bold text-foreground">
                          {result.category}
                        </h3>
                      </div>
                      
                      {/* Interactive confidence meter */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Confiança da IA:</span>
                          <span className="text-lg font-bold text-secondary">
                            {(result.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="relative w-full bg-muted rounded-full h-4 overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-secondary via-primary to-secondary transition-all duration-2000 ease-out rounded-full relative"
                            style={{ width: `${result.confidence * 100}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[slide_2s_ease-in-out_infinite]" />
                          </div>
                        </div>
                      </div>
                      
                      {/* All Predictions Section */}
                      <div className="mt-6 p-6 bg-card border border-secondary/20 rounded-xl">
                        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                          📊 Todas as Previsões:
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(result.allPredictions)
                            .sort(([,a], [,b]) => b - a)
                            .map(([category, confidence]) => {
                              const categoryData = wasteCategories[category as keyof typeof wasteCategories];
                              const percentage = (confidence * 100).toFixed(2);
                              return (
                                <div key={category} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{categoryData.icon}</span>
                                    <span className={`font-medium ${categoryData.color}`}>
                                      {categoryData.name}:
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 bg-muted rounded-full h-2">
                                      <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${
                                          category === Object.entries(result.allPredictions).sort(([,a], [,b]) => b - a)[0][0]
                                            ? 'bg-gradient-to-r from-secondary to-primary'
                                            : 'bg-muted-foreground/30'
                                        }`}
                                        style={{ width: `${confidence * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-mono min-w-[50px] text-right">
                                      {percentage}%
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* Interactive tip card */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">💡</span>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">Dica de Reciclagem:</h4>
                            <p className="text-sm text-muted-foreground">{result.tips}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
        </div>

        {/* Educational Sections */}
        <div className="space-y-12 mt-16">
          {/* Impact Statistics */}
          <ImpactStats />
          
          {/* Waste Classification Examples */}
          <WasteExamples />
          
          {/* Sustainability Tips */}
          <SustainabilityTips />
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 space-y-4">
          <div className="flex items-center justify-center gap-2 text-secondary">
            <Leaf className="h-5 w-5" />
            <span className="font-medium">Tecnologia de IA para gestão ambiental responsável</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Desenvolvido com 💚 para um futuro mais sustentável
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WasteClassifier;