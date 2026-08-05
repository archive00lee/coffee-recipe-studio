import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { RecipeSection } from './components/RecipeSection';
import { EvaluationSection } from './components/EvaluationSection';
import { BeanSection } from './components/BeanSection';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { RecipeFormModal } from './components/RecipeFormModal';
import { EvaluationFormModal } from './components/EvaluationFormModal';
import { BeanFormModal } from './components/BeanFormModal';
import { CoffeeRecipe, BrewEvaluation, BeanInfo } from './types';
import {
  isSupabaseConfigured,
  fetchRecipesFromSupabase,
  insertRecipeToSupabase,
  updateRecipeInSupabase,
  deleteRecipeFromSupabase,
  toggleFavoriteInSupabase,
  fetchEvaluationsFromSupabase,
  insertEvaluationToSupabase,
  updateEvaluationInSupabase,
  deleteEvaluationFromSupabase,
  INITIAL_BEANS,
  fetchBeansFromSupabase,
  insertBeanToSupabase,
  updateBeanInSupabase,
  deleteBeanFromSupabase,
} from './lib/supabase';
import { Cloud, Database, AlertCircle } from 'lucide-react';

export default function App() {
  const [recipes, setRecipes] = useState<CoffeeRecipe[]>([]);
  const [evaluations, setEvaluations] = useState<BrewEvaluation[]>([]);
  const [beans, setBeans] = useState<BeanInfo[]>(INITIAL_BEANS);

  const [activeTab, setActiveTab] = useState<'home' | 'recipe' | 'evaluation' | 'bean'>('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddEvalModalOpen, setIsAddEvalModalOpen] = useState(false);
  const [isAddBeanModalOpen, setIsAddBeanModalOpen] = useState(false);

  const [editingRecipe, setEditingRecipe] = useState<CoffeeRecipe | null>(null);
  const [editingEvaluation, setEditingEvaluation] = useState<BrewEvaluation | null>(null);
  const [editingBean, setEditingBean] = useState<BeanInfo | null>(null);

  const [selectedRecipeForDetail, setSelectedRecipeForDetail] = useState<CoffeeRecipe | null>(null);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean | null>(null);

  // Initial load from Supabase DB as the single source of truth
  useEffect(() => {
    let isMounted = true;

    async function loadCloudData() {
      if (!isSupabaseConfigured) {
        setIsCloudConnected(false);
        return;
      }

      try {
        const [cloudRecipes, cloudEvals, cloudBeans] = await Promise.all([
          fetchRecipesFromSupabase(),
          fetchEvaluationsFromSupabase(),
          fetchBeansFromSupabase(),
        ]);

        if (!isMounted) return;

        if (cloudRecipes !== null) {
          setRecipes(cloudRecipes);
          setIsCloudConnected(true);
        } else {
          setIsCloudConnected(false);
        }

        if (cloudEvals !== null) {
          setEvaluations(cloudEvals);
        }

        if (cloudBeans !== null && cloudBeans.length > 0) {
          setBeans(cloudBeans);
        }
      } catch (err) {
        console.error('Failed to load data from Supabase:', err);
        if (isMounted) setIsCloudConnected(false);
      }
    }

    loadCloudData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch functions
  const fetchRecipes = async () => {
    if (!isSupabaseConfigured) return;
    const cloudRecipes = await fetchRecipesFromSupabase();
    if (cloudRecipes !== null) {
      setRecipes(cloudRecipes);
    }
  };

  const fetchEvaluations = async () => {
    if (!isSupabaseConfigured) return;
    const cloudEvals = await fetchEvaluationsFromSupabase();
    if (cloudEvals !== null) {
      setEvaluations(cloudEvals);
    }
  };

  const fetchBeans = async () => {
    if (!isSupabaseConfigured) return;
    const cloudBeans = await fetchBeansFromSupabase();
    if (cloudBeans !== null && cloudBeans.length > 0) {
      setBeans(cloudBeans);
    }
  };

  // Open modals
  const handleOpenAddRecipeModal = () => {
    setEditingRecipe(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditRecipeModal = (recipe: CoffeeRecipe) => {
    setEditingRecipe(recipe);
    setIsAddModalOpen(true);
  };

  const handleOpenAddEvalModal = () => {
    setEditingEvaluation(null);
    setIsAddEvalModalOpen(true);
  };

  const handleOpenEditEvalModal = (evaluation: BrewEvaluation) => {
    setEditingEvaluation(evaluation);
    setIsAddEvalModalOpen(true);
  };

  const handleOpenAddBeanModal = () => {
    setEditingBean(null);
    setIsAddBeanModalOpen(true);
  };

  const handleOpenEditBeanModal = (bean: BeanInfo) => {
    setEditingBean(bean);
    setIsAddBeanModalOpen(true);
  };

  // Handlers
  const handleSaveRecipe = async (recipeData: Omit<CoffeeRecipe, 'id' | 'createdAt'>) => {
    if (editingRecipe) {
      // Edit Mode
      const updatedRecipe: CoffeeRecipe = {
        ...editingRecipe,
        ...recipeData,
      };

      if (isSupabaseConfigured) {
        const result = await updateRecipeInSupabase(updatedRecipe);
        if (result.success) {
          await fetchRecipes();
        } else {
          console.error('Supabase Recipe Update Error:', result.error);
          alert(`레시피 수정 실패!\n${result.error?.message || result.error || '알 수 없는 오류'}`);
        }
      } else {
        setRecipes((prev) => prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)));
      }

      if (selectedRecipeForDetail?.id === updatedRecipe.id) {
        setSelectedRecipeForDetail(updatedRecipe);
      }
      setEditingRecipe(null);
    } else {
      // Create Mode
      const newRecipe: CoffeeRecipe = {
        ...recipeData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
      };

      if (isSupabaseConfigured) {
        const result = await insertRecipeToSupabase(newRecipe);
        if (result.success) {
          await fetchRecipes();
        } else {
          console.error('Supabase Insert Error:', result.error);
          alert(`Supabase 데이터베이스 저장 실패!\n${result.error?.message || result.error || '알 수 없는 오류'}`);
        }
      } else {
        setRecipes((prev) => [newRecipe, ...prev]);
      }
    }
  };

  const handleDeleteRecipe = async (id: number) => {
    setRecipes((prev) => prev.filter((item) => item.id !== id));
    if (selectedRecipeForDetail?.id === id) {
      setSelectedRecipeForDetail(null);
    }

    if (isSupabaseConfigured) {
      await deleteRecipeFromSupabase(id);
    }
  };

  const handleToggleFavorite = async (id: number) => {
    let nextFavState = false;
    setRecipes((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          nextFavState = !r.isFavorite;
          return { ...r, isFavorite: nextFavState };
        }
        return r;
      })
    );

    if (isSupabaseConfigured) {
      await toggleFavoriteInSupabase(id, nextFavState);
    }
  };

  const handleSaveEvaluation = async (evalData: Omit<BrewEvaluation, 'id'>) => {
    if (editingEvaluation) {
      // Edit Mode
      const updatedEval: BrewEvaluation = {
        ...editingEvaluation,
        ...evalData,
      };

      if (isSupabaseConfigured) {
        const result = await updateEvaluationInSupabase(updatedEval);
        if (result.success) {
          await fetchEvaluations();
        } else {
          console.error('Supabase Evaluation Update Error:', result.error);
          alert(`센서리 평가 수정 실패!\n${result.error?.message || result.error || '알 수 없는 오류'}`);
        }
      } else {
        setEvaluations((prev) => prev.map((e) => (e.id === updatedEval.id ? updatedEval : e)));
      }
      setEditingEvaluation(null);
    } else {
      // Create Mode
      const newEval: BrewEvaluation = {
        ...evalData,
        id: Date.now(),
      };

      if (isSupabaseConfigured) {
        const result = await insertEvaluationToSupabase(newEval);
        if (result.success) {
          await fetchEvaluations();
        } else {
          console.error('Supabase Evaluation Insert Error:', result.error);
          alert(`센서리 평가 저장 실패!\n${result.error?.message || result.error || '알 수 없는 오류'}`);
        }
      } else {
        setEvaluations((prev) => [newEval, ...prev]);
      }
    }
  };

  const handleDeleteEvaluation = async (id: number) => {
    setEvaluations((prev) => prev.filter((item) => item.id !== id));

    if (isSupabaseConfigured) {
      await deleteEvaluationFromSupabase(id);
    }
  };

  const handleSaveBean = async (beanData: Omit<BeanInfo, 'id' | 'createdAt'> & { id?: number }) => {
    if (editingBean) {
      // Edit Mode
      const updatedBean: BeanInfo = {
        ...editingBean,
        ...beanData,
      };

      if (isSupabaseConfigured) {
        const result = await updateBeanInSupabase(updatedBean);
        if (result.success) {
          await fetchBeans();
        } else {
          console.error('Supabase Bean Update Error:', result.error);
          alert("원두 저장 실패!\n" + (result.error?.message || result.error || '알 수 없는 오류'));
        }
      } else {
        setBeans((prev) => prev.map((b) => (b.id === updatedBean.id ? updatedBean : b)));
      }
      setEditingBean(null);
    } else {
      // Create Mode
      const newBean: BeanInfo = {
        ...beanData,
        id: Date.now(),
        createdAt: new Date().toISOString().split('T')[0],
      };

      if (isSupabaseConfigured) {
        const result = await insertBeanToSupabase(newBean);
        if (result.success) {
          await fetchBeans();
        } else {
          console.error('Supabase Bean Insert Error:', result.error);
          alert("원두 저장 실패!\n" + (result.error?.message || result.error || '알 수 없는 오류'));
        }
      } else {
        setBeans((prev) => [newBean, ...prev]);
      }
    }
  };

  const handleDeleteBean = async (id: number) => {
    setBeans((prev) => prev.filter((item) => item.id !== id));

    if (isSupabaseConfigured) {
      await deleteBeanFromSupabase(id);
    }
  };

  const favoriteCount = recipes.filter((r) => r.isFavorite).length;

  return (
    <div className="bg-black text-zinc-100 min-h-screen flex flex-col font-sans selection:bg-white selection:text-black relative overflow-x-hidden">
      {/* Background Ambient Monochrome Glass Gradients */}
      <div className="fixed top-0 left-1/4 -translate-x-1/2 w-[600px] h-[500px] bg-gradient-to-b from-white/10 via-white/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-t from-zinc-500/10 via-white/5 to-transparent rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_50%)] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          openAddModal={handleOpenAddRecipeModal}
          recipeCount={recipes.length}
          evaluationCount={evaluations.length}
          beanCount={beans.length}
          favoriteCount={favoriteCount}
        />

        {/* Cloud Sync Status Notification Banner */}
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-3">
          {isCloudConnected === true && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs backdrop-blur-md">
              <Cloud className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Supabase 클라우드 데이터베이스 연동 완료 (단일 데이터 출처 동기화 중)</span>
            </div>
          )}
          {isCloudConnected === false && (
            <div className="flex items-center justify-between gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900/80 border border-white/10 text-zinc-400 text-xs backdrop-blur-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Supabase 클라우드 DB 연동 준비 중 (VITE_SUPABASE_URL 및 VITE_SUPABASE_ANON_KEY 설정 필요)</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content View Container */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {activeTab === 'home' && (
            <HomeSection
              recipes={recipes}
              onNavigateToRecipes={() => setActiveTab('recipe')}
              onSelectRecipe={(recipe) => setSelectedRecipeForDetail(recipe)}
            />
          )}

          {activeTab === 'recipe' && (
            <RecipeSection
              recipes={recipes}
              openModal={handleOpenAddRecipeModal}
              deleteRecipe={handleDeleteRecipe}
              toggleFavorite={handleToggleFavorite}
              onSelectRecipe={(recipe) => setSelectedRecipeForDetail(recipe)}
              onEditRecipe={handleOpenEditRecipeModal}
            />
          )}

          {activeTab === 'bean' && (
            <BeanSection
              beans={beans}
              onOpenAddModal={handleOpenAddBeanModal}
              onOpenEditModal={handleOpenEditBeanModal}
              onDeleteBean={handleDeleteBean}
            />
          )}

          {activeTab === 'evaluation' && (
            <EvaluationSection
              evaluations={evaluations}
              recipes={recipes}
              openAddModal={handleOpenAddEvalModal}
              deleteEvaluation={handleDeleteEvaluation}
              onSelectRecipe={(recipe) => setSelectedRecipeForDetail(recipe)}
              onEditEvaluation={handleOpenEditEvalModal}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/60 backdrop-blur-lg py-6 text-center text-xs text-zinc-500">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div>
              <span className="text-white font-bold tracking-tight">L coffee studio</span> — 정밀한 커피 레시피를 기록하고 관리하는 아카이브
            </div>
            <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
              <span>{recipes.length}개의 레시피 · {beans.length}개의 원두 · {evaluations.length}개의 센서리 보관 중</span>
              {isCloudConnected && (
                <span className="inline-flex items-center gap-1 text-emerald-400 font-sans">
                  <Database className="w-3 h-3" /> Supabase
                </span>
              )}
            </div>
          </div>
        </footer>
      </div>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipeForDetail}
        onClose={() => setSelectedRecipeForDetail(null)}
        onEdit={handleOpenEditRecipeModal}
      />

      {/* Recipe Form Modal */}
      <RecipeFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRecipe(null);
        }}
        onSubmit={handleSaveRecipe}
        initialData={editingRecipe}
      />

      {/* Bean Form Modal */}
      <BeanFormModal
        isOpen={isAddBeanModalOpen}
        onClose={() => {
          setIsAddBeanModalOpen(false);
          setEditingBean(null);
        }}
        onSubmit={handleSaveBean}
        initialData={editingBean}
      />

      {/* Evaluation Form Modal */}
      <EvaluationFormModal
        isOpen={isAddEvalModalOpen}
        onClose={() => {
          setIsAddEvalModalOpen(false);
          setEditingEvaluation(null);
        }}
        recipes={recipes}
        beans={beans}
        onSubmit={handleSaveEvaluation}
        initialData={editingEvaluation}
      />
    </div>
  );
}

