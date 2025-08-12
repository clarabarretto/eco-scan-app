import React, { useState, useEffect } from 'react';
import { Trophy, Star, Award, Zap, Target, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category: 'beginner' | 'intermediate' | 'advanced' | 'special';
}

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [history, setHistory] = useState<any[]>([]);

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

  useEffect(() => {
    // Calculate achievements based on user progress
    const calculateAchievements = () => {
      const totalClassifications = history.length;
      const categoryStats = history.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const weeklyClassifications = history.filter(item => {
        const itemDate = new Date(item.timestamp);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return itemDate >= weekAgo;
      }).length;

      const streakDays = calculateStreak();
      const allCategories = new Set(history.map(item => item.category)).size;

      const achievementsList: Achievement[] = [
        // Beginner achievements
        {
          id: 'first-classification',
          title: 'Primeiro Passo',
          description: 'Realize sua primeira classificação',
          icon: <Star className="h-6 w-6" />,
          points: 50,
          unlocked: totalClassifications >= 1,
          category: 'beginner'
        },
        {
          id: 'eco-newbie',
          title: 'Eco Novato',
          description: 'Complete 5 classificações',
          icon: <Zap className="h-6 w-6" />,
          points: 100,
          unlocked: totalClassifications >= 5,
          progress: Math.min(totalClassifications, 5),
          maxProgress: 5,
          category: 'beginner'
        },
        
        // Intermediate achievements
        {
          id: 'category-explorer',
          title: 'Explorador de Categorias',
          description: 'Classifique pelo menos 3 tipos diferentes de resíduos',
          icon: <Target className="h-6 w-6" />,
          points: 200,
          unlocked: allCategories >= 3,
          progress: Math.min(allCategories, 3),
          maxProgress: 3,
          category: 'intermediate'
        },
        {
          id: 'eco-warrior',
          title: 'Eco Guerreiro',
          description: 'Alcance 25 classificações',
          icon: <Award className="h-6 w-6" />,
          points: 300,
          unlocked: totalClassifications >= 25,
          progress: Math.min(totalClassifications, 25),
          maxProgress: 25,
          category: 'intermediate'
        },
        {
          id: 'weekly-champion',
          title: 'Campeão Semanal',
          description: 'Complete 10 classificações em uma semana',
          icon: <Trophy className="h-6 w-6" />,
          points: 250,
          unlocked: weeklyClassifications >= 10,
          progress: Math.min(weeklyClassifications, 10),
          maxProgress: 10,
          category: 'intermediate'
        },

        // Advanced achievements
        {
          id: 'master-classifier',
          title: 'Mestre Classificador',
          description: 'Realize 100 classificações',
          icon: <Trophy className="h-6 w-6" />,
          points: 500,
          unlocked: totalClassifications >= 100,
          progress: Math.min(totalClassifications, 100),
          maxProgress: 100,
          category: 'advanced'
        },
        {
          id: 'category-master',
          title: 'Mestre das Categorias',
          description: 'Classifique todos os 6 tipos de resíduos',
          icon: <Star className="h-6 w-6" />,
          points: 400,
          unlocked: allCategories >= 6,
          progress: Math.min(allCategories, 6),
          maxProgress: 6,
          category: 'advanced'
        },

        // Special achievements
        {
          id: 'eco-enthusiast',
          title: 'Entusiasta Eco',
          description: 'Mantenha uma sequência de 7 dias classificando',
          icon: <Heart className="h-6 w-6" />,
          points: 350,
          unlocked: streakDays >= 7,
          progress: Math.min(streakDays, 7),
          maxProgress: 7,
          category: 'special'
        }
      ];

      setAchievements(achievementsList);
    };

    calculateAchievements();
  }, [history, totalPoints]);

  const calculateStreak = () => {
    if (history.length === 0) return 0;
    
    const dates = [...new Set(history.map(item => 
      new Date(item.timestamp).toDateString()
    ))].sort();
    
    let currentStreak = 1;
    let maxStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currentDate = new Date(dates[i]);
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }
    
    return Math.max(maxStreak, currentStreak);
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  const totalAchievementPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);

  const getCategoryColor = (category: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800 border-green-200',
      intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
      advanced: 'bg-purple-100 text-purple-800 border-purple-200',
      special: 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return colors[category as keyof typeof colors] || colors.beginner;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      beginner: '🌱',
      intermediate: '🌿',
      advanced: '🌳',
      special: '⭐'
    };
    return icons[category as keyof typeof icons] || '🏆';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200">
          <Trophy className="h-12 w-12 text-amber-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Conquistas</h1>
          <p className="text-muted-foreground">Desbloqueie badges e ganhe pontos pela sua dedicação ambiental</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-800">{unlockedAchievements.length}</p>
          <p className="text-sm text-green-600">Conquistas Desbloqueadas</p>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-800">{totalAchievementPoints}</p>
          <p className="text-sm text-blue-600">Pontos de Conquistas</p>
        </Card>

        <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-purple-800">
            {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
          </p>
          <p className="text-sm text-purple-600">Progresso Completo</p>
        </Card>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            Conquistas Desbloqueadas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <Badge className={getCategoryColor(achievement.category)}>
                    {getCategoryIcon(achievement.category)} {achievement.category}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-amber-200 p-3 rounded-xl w-fit text-amber-700">
                    {achievement.icon}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                    <span className="text-sm font-medium text-amber-700">+{achievement.points} pts</span>
                    <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                      ✓ Desbloqueado
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Target className="h-6 w-6 text-muted-foreground" />
            Próximas Conquistas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="p-6 bg-muted/30 border-muted relative overflow-hidden opacity-75">
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs">
                    {getCategoryIcon(achievement.category)} {achievement.category}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded-xl w-fit text-muted-foreground">
                    {achievement.icon}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-muted-foreground">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground/80">{achievement.description}</p>
                  </div>
                  
                  {achievement.maxProgress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="text-muted-foreground">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                      </div>
                      <Progress 
                        value={(achievement.progress! / achievement.maxProgress) * 100} 
                        className="h-2" 
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-muted">
                    <span className="text-sm font-medium text-muted-foreground">+{achievement.points} pts</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      🔒 Bloqueado
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements;