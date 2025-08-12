import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Recycle, Calendar, Award, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ClassificationHistory {
  id: string;
  category: string;
  confidence: number;
  timestamp: Date;
  points: number;
}

const Dashboard: React.FC = () => {
  const [history, setHistory] = useState<ClassificationHistory[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(10);

  useEffect(() => {
    // Load data from localStorage
    const savedHistory = localStorage.getItem('classification-history');
    const savedPoints = localStorage.getItem('eco-points');
    
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    if (savedPoints) {
      setTotalPoints(parseInt(savedPoints));
    }
  }, []);

  const thisWeekClassifications = history.filter(item => {
    const itemDate = new Date(item.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return itemDate >= weekAgo;
  }).length;

  const categoryStats = history.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostClassifiedCategory = Object.entries(categoryStats).sort(([,a], [,b]) => b - a)[0];

  const weeklyProgress = (thisWeekClassifications / weeklyGoal) * 100;

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Plástico': '♻️',
      'Papel': '📄',
      'Metal': '🥫',
      'Vidro': '🍶',
      'Papelão': '📦',
      'Orgânico': '🍎'
    };
    return icons[category] || '🗑️';
  };

  const recentClassifications = history
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Eco</h1>
          <p className="text-muted-foreground">Acompanhe seu impacto ambiental</p>
        </div>
        <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-secondary" />
            <span className="font-medium text-foreground">Nível Eco Warrior</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total de Classificações</p>
              <p className="text-3xl font-bold text-blue-800">{history.length}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-xl">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Pontos Eco</p>
              <p className="text-3xl font-bold text-green-800">{totalPoints}</p>
            </div>
            <div className="bg-green-200 p-3 rounded-xl">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">Esta Semana</p>
              <p className="text-3xl font-bold text-amber-800">{thisWeekClassifications}</p>
            </div>
            <div className="bg-amber-200 p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Categoria Top</p>
              <p className="text-2xl font-bold text-purple-800">
                {mostClassifiedCategory ? mostClassifiedCategory[0] : 'Nenhuma'}
              </p>
            </div>
            <div className="bg-purple-200 p-3 rounded-xl">
              <Recycle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Goal Progress */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Meta Semanal</h3>
              <Target className="h-5 w-5 text-secondary" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium text-foreground">
                  {thisWeekClassifications}/{weeklyGoal} classificações
                </span>
              </div>
              
              <Progress value={Math.min(weeklyProgress, 100)} className="h-3" />
              
              <p className="text-sm text-muted-foreground">
                {weeklyProgress >= 100 
                  ? '🎉 Meta atingida! Parabéns pelo seu comprometimento!' 
                  : `Faltam ${weeklyGoal - thisWeekClassifications} classificações para atingir sua meta.`
                }
              </p>
            </div>
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Distribuição por Categoria</h3>
          
          {Object.entries(categoryStats).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(categoryStats)
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => {
                  const percentage = (count / history.length) * 100;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(category)}</span>
                          <span className="text-sm font-medium text-foreground">{category}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{count}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma classificação ainda. Comece classificando seus resíduos!
            </p>
          )}
        </Card>
      </div>

      {/* Recent Classifications */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Classificações Recentes</h3>
        
        {recentClassifications.length > 0 ? (
          <div className="space-y-3">
            {recentClassifications.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getCategoryIcon(item.category)}</span>
                  <div>
                    <p className="font-medium text-foreground">{item.category}</p>
                    <p className="text-sm text-muted-foreground">
                      Confiança: {(item.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-secondary">+{item.points} pts</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Suas classificações aparecerão aqui. Comece a classificar resíduos!
          </p>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;