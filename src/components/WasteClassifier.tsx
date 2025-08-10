import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Leaf, Recycle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from "sonner";
import wasteExamplesHero from '@/assets/waste-examples.jpg';
import ImpactStats from './ImpactStats';
import WasteExamples from './WasteExamples';
import SustainabilityTips from './SustainabilityTips';

interface ClassificationResult {
  category: string;
  confidence: number;
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
      
      // Para demonstração, vamos simular uma resposta
      const mockResult = {
        category: Object.keys(wasteCategories)[Math.floor(Math.random() * Object.keys(wasteCategories).length)],
        confidence: Math.random() * 0.3 + 0.7 // 70-100%
      };
      
      setResult(mockResult);
      toast.success("Classificação realizada com sucesso!");
      
    } catch (error) {
      console.error('Erro na classificação:', error);
      toast.error("Erro ao classificar a imagem. Tente novamente.");
    } finally {
      setIsClassifying(false);
    }
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
          {/* Upload Area */}
          {!imagePreview && (
            <div
              {...getRootProps()}
              className={`upload-area cursor-pointer ${isDragActive ? 'drag-over' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="space-y-6">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {isDragActive ? 'Solte a imagem aqui' : 'Carregar Imagem'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Arraste e solte uma imagem ou clique para selecionar
                  </p>
                  <button className="btn-upload">
                    Selecionar Imagem
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Formatos suportados: JPG, PNG, WebP • Máximo 10MB
                </p>
              </div>
            </div>
          )}

          {/* Image Preview and Classification */}
          {imagePreview && (
            <div className="space-y-8">
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <div className="text-center space-y-6">
                  <div className="image-preview max-w-md mx-auto">
                    <img
                      src={imagePreview}
                      alt="Imagem para classificação"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={classifyImage}
                      disabled={isClassifying}
                      className="btn-classify disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isClassifying ? (
                        <div className="flex items-center gap-3">
                          <div className="loading-spinner" />
                          Classificando...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Leaf className="h-5 w-5" />
                          Classificar Resíduo
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={resetClassifier}
                      className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Nova Imagem
                    </button>
                  </div>
                </div>
              </div>

              {/* Classification Result */}
              {result && (
                <div className="result-card animate-fade-in">
                  <div className="space-y-6">
                    <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8 text-secondary" />
                    </div>
                    
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        Classificação Concluída
                      </h3>
                      
                      <div className="bg-white/50 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-center gap-4 mb-4">
                          <span className="text-4xl">
                            {wasteCategories[result.category as keyof typeof wasteCategories]?.icon}
                          </span>
                          <div className="text-left">
                            <p className="text-3xl font-bold text-foreground">
                              {wasteCategories[result.category as keyof typeof wasteCategories]?.name || result.category}
                            </p>
                            <p className="text-muted-foreground">
                              Confiança: {(result.confidence * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-secondary h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${result.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                      <Leaf className="h-4 w-4 text-secondary" />
                      <span>Contribuindo para um futuro mais sustentável</span>
                    </div>
                  </div>
                </div>
              )}
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