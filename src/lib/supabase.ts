import { createClient } from '@supabase/supabase-js';
import { CoffeeRecipe, BrewEvaluation, BeanInfo, GrindRecord } from '../types';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const cleanUrl = rawUrl.replace(/\/+(rest\/v1.*)?$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  cleanUrl && supabaseAnonKey && cleanUrl.startsWith('http')
);

export const supabase = isSupabaseConfigured
  ? createClient(cleanUrl, supabaseAnonKey)
  : null;

// Row mapping helpers supporting both camelCase and snake_case column schemas
export function mapRowToRecipe(row: any): CoffeeRecipe {
  let steps = row.steps;
  if (typeof steps === 'string') {
    try {
      steps = JSON.parse(steps);
    } catch (e) {
      steps = [];
    }
  }
  return {
    id: Number(row.id),
    title: row.title || '',
    brewMethod: row.brew_method || row.brewMethod || '에어로프레스',
    filterType: row.filter_type || row.filterType || '',
    capType: row.cap_type || row.capType || '',
    orientation: row.orientation || '',
    beanAmountGrams: Number(row.bean_amount_grams ?? row.beanAmountGrams ?? 0),
    waterAmountMl: Number(row.water_amount_ml ?? row.waterAmountMl ?? 0),
    ratioText: row.ratio_text || row.ratioText || '',
    waterTempCelsius: Number(row.water_temp_celsius ?? row.waterTempCelsius ?? 0),
    grindSizeMicrons: Number(row.grind_size_microns ?? row.grindSizeMicrons ?? 0),
    totalTimeSeconds: Number(row.total_time_seconds ?? row.totalTimeSeconds ?? 0),
    agtronNumber: Number(row.agtron_number ?? row.agtronNumber ?? 55),
    roastLevelName: row.roast_level_name || row.roastLevelName || '',
    desc: row.desc || '',
    steps: Array.isArray(steps) ? steps : [],
    isFavorite: Boolean(row.is_favorite ?? row.isFavorite ?? false),
    createdAt: row.created_at || row.createdAt || new Date().toISOString().split('T')[0],
  };
}

export function mapRowToEvaluation(row: any): BrewEvaluation {
  let notes = row.tasting_notes || row.tastingNotes;
  if (typeof notes === 'string') {
    try {
      notes = JSON.parse(notes);
    } catch (e) {
      notes = [];
    }
  }
  return {
    id: Number(row.id),
    recipeId: Number(row.recipe_id ?? row.recipeId ?? 0),
    recipeTitle: row.recipe_title || row.recipeTitle || '',
    brewMethod: row.brew_method || row.brewMethod || '',
    beanName: row.bean_name || row.beanName || '',
    roastLevel: row.roast_level || row.roastLevel || '중배전',
    rating: Number(row.rating ?? 5),
    acidity: Number(row.acidity ?? 3),
    sweetness: Number(row.sweetness ?? 3),
    body: Number(row.body ?? 3),
    bitterness: Number(row.bitterness ?? 3),
    aftertaste: Number(row.aftertaste ?? 3),
    tastingNotes: Array.isArray(notes) ? notes : [],
    evalDate: row.eval_date || row.evalDate || new Date().toISOString().split('T')[0],
    memo: row.memo || '',
  };
}

export async function fetchRecipesFromSupabase(): Promise<CoffeeRecipe[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('recipes').select('*').order('id', { ascending: false });
    if (error) {
      console.warn('Supabase fetch recipes error:', error.message);
      return null;
    }
    if (data && Array.isArray(data)) {
      return data.map(mapRowToRecipe);
    }
    return null;
  } catch (err) {
    console.warn('Supabase fetch recipes exception:', err);
    return null;
  }
}

export async function insertRecipeToSupabase(recipe: CoffeeRecipe): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: false, error: 'Supabase client is not configured' };

  // 1st attempt: Standard snake_case column names (most common in Supabase DBs)
  const snakePayload: Record<string, any> = {
    id: recipe.id,
    title: recipe.title,
    brew_method: recipe.brewMethod,
    filter_type: recipe.filterType,
    cap_type: recipe.capType,
    orientation: recipe.orientation,
    bean_amount_grams: recipe.beanAmountGrams,
    water_amount_ml: recipe.waterAmountMl,
    ratio_text: recipe.ratioText,
    water_temp_celsius: recipe.waterTempCelsius,
    grind_size_microns: recipe.grindSizeMicrons,
    total_time_seconds: recipe.totalTimeSeconds,
    agtron_number: recipe.agtronNumber ?? 55,
    roast_level_name: recipe.roastLevelName || '',
    desc: recipe.desc,
    steps: recipe.steps || [],
    is_favorite: recipe.isFavorite || false,
    created_at: recipe.createdAt,
  };

  const { error: snakeErr } = await supabase.from('recipes').insert([snakePayload]);
  if (!snakeErr) {
    return { success: true };
  }

  // 2nd attempt: camelCase column names matching JS model keys
  const camelPayload: Record<string, any> = {
    id: recipe.id,
    title: recipe.title,
    brewMethod: recipe.brewMethod,
    filterType: recipe.filterType,
    capType: recipe.capType,
    orientation: recipe.orientation,
    beanAmountGrams: recipe.beanAmountGrams,
    waterAmountMl: recipe.waterAmountMl,
    ratioText: recipe.ratioText,
    waterTempCelsius: recipe.waterTempCelsius,
    grindSizeMicrons: recipe.grindSizeMicrons,
    totalTimeSeconds: recipe.totalTimeSeconds,
    agtronNumber: recipe.agtronNumber ?? 55,
    roastLevelName: recipe.roastLevelName || '',
    desc: recipe.desc,
    steps: recipe.steps || [],
    isFavorite: recipe.isFavorite || false,
    createdAt: recipe.createdAt,
  };

  const { error: camelErr } = await supabase.from('recipes').insert([camelPayload]);
  if (!camelErr) {
    return { success: true };
  }

  // 3rd attempt: Strip extra new columns if schema table lacks them
  const fallbackPayload: Record<string, any> = {
    id: recipe.id,
    title: recipe.title,
    brew_method: recipe.brewMethod,
    filter_type: recipe.filterType,
    cap_type: recipe.capType,
    bean_amount_grams: recipe.beanAmountGrams,
    water_amount_ml: recipe.waterAmountMl,
    ratio_text: recipe.ratioText,
    water_temp_celsius: recipe.waterTempCelsius,
    grind_size_microns: recipe.grindSizeMicrons,
    total_time_seconds: recipe.totalTimeSeconds,
    desc: recipe.desc,
    steps: recipe.steps || [],
    is_favorite: recipe.isFavorite || false,
    created_at: recipe.createdAt,
  };

  const { error: fallbackErr } = await supabase.from('recipes').insert([fallbackPayload]);
  if (!fallbackErr) {
    return { success: true };
  }

  const finalError = snakeErr || camelErr || fallbackErr;
  console.error('Supabase Insert Error:', finalError);
  return { success: false, error: finalError };
}

export async function updateRecipeInSupabase(recipe: CoffeeRecipe): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: false, error: 'Supabase client is not configured' };
  try {
    const snakePayload: Record<string, any> = {
      title: recipe.title,
      brew_method: recipe.brewMethod,
      filter_type: recipe.filterType,
      cap_type: recipe.capType,
      orientation: recipe.orientation,
      bean_amount_grams: recipe.beanAmountGrams,
      water_amount_ml: recipe.waterAmountMl,
      ratio_text: recipe.ratioText,
      water_temp_celsius: recipe.waterTempCelsius,
      grind_size_microns: recipe.grindSizeMicrons,
      agtron_number: recipe.agtronNumber ?? 55,
      roast_level_name: recipe.roastLevelName || '',
      total_time_seconds: recipe.totalTimeSeconds,
      desc: recipe.desc,
      steps: recipe.steps || [],
      is_favorite: recipe.isFavorite || false,
    };

    const { error: snakeErr } = await supabase
      .from('recipes')
      .update(snakePayload)
      .eq('id', recipe.id);

    if (!snakeErr) {
      return { success: true };
    }

    // Fallback: try camelCase payload
    const camelPayload: Record<string, any> = {
      title: recipe.title,
      brewMethod: recipe.brewMethod,
      filterType: recipe.filterType,
      capType: recipe.capType,
      orientation: recipe.orientation,
      beanAmountGrams: recipe.beanAmountGrams,
      waterAmountMl: recipe.waterAmountMl,
      ratioText: recipe.ratioText,
      waterTempCelsius: recipe.waterTempCelsius,
      grindSizeMicrons: recipe.grindSizeMicrons,
      agtronNumber: recipe.agtronNumber ?? 55,
      roastLevelName: recipe.roastLevelName || '',
      totalTimeSeconds: recipe.totalTimeSeconds,
      desc: recipe.desc,
      steps: recipe.steps || [],
      isFavorite: recipe.isFavorite || false,
    };

    const { error: camelErr } = await supabase
      .from('recipes')
      .update(camelPayload)
      .eq('id', recipe.id);

    if (!camelErr) {
      return { success: true };
    }

    console.error('Supabase Update Recipe Error:', snakeErr || camelErr);
    return { success: false, error: snakeErr || camelErr };
  } catch (err) {
    console.error('Supabase Update Recipe Exception:', err);
    return { success: false, error: err };
  }
}

export async function deleteRecipeFromSupabase(id: number): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete recipe error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete recipe exception:', err);
    return false;
  }
}

export async function toggleFavoriteInSupabase(id: number, isFavorite: boolean): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('recipes').update({ is_favorite: isFavorite, isFavorite: isFavorite }).eq('id', id);
    if (error) {
      console.warn('Supabase update favorite error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase update favorite exception:', err);
    return false;
  }
}

export async function fetchEvaluationsFromSupabase(): Promise<BrewEvaluation[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('evaluations').select('*').order('id', { ascending: false });
    if (error) {
      console.warn('Supabase fetch evaluations error:', error.message);
      return null;
    }
    if (data && Array.isArray(data)) {
      return data.map(mapRowToEvaluation);
    }
    return null;
  } catch (err) {
    console.warn('Supabase fetch evaluations exception:', err);
    return null;
  }
}

export async function insertEvaluationToSupabase(evaluation: BrewEvaluation): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: false, error: 'Supabase client is not configured' };
  try {
    const payload = {
      id: evaluation.id,
      recipe_id: evaluation.recipeId,
      recipe_title: evaluation.recipeTitle,
      brew_method: evaluation.brewMethod,
      bean_name: evaluation.beanName,
      roast_level: evaluation.roastLevel,
      rating: evaluation.rating,
      acidity: evaluation.acidity,
      sweetness: evaluation.sweetness,
      body: evaluation.body,
      bitterness: evaluation.bitterness,
      aftertaste: evaluation.aftertaste,
      tasting_notes: evaluation.tastingNotes || [],
      eval_date: evaluation.evalDate,
      memo: evaluation.memo,
    };
    const { error } = await supabase.from('evaluations').insert([payload]);
    if (error) {
      console.error('Supabase Evaluation Insert Error:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error('Supabase Evaluation Insert Exception:', err);
    return { success: false, error: err };
  }
}

export async function updateEvaluationInSupabase(evaluation: BrewEvaluation): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: false, error: 'Supabase client is not configured' };
  try {
    const payload = {
      recipe_id: evaluation.recipeId,
      recipe_title: evaluation.recipeTitle,
      brew_method: evaluation.brewMethod,
      bean_name: evaluation.beanName,
      roast_level: evaluation.roastLevel,
      rating: evaluation.rating,
      acidity: evaluation.acidity,
      sweetness: evaluation.sweetness,
      body: evaluation.body,
      bitterness: evaluation.bitterness,
      aftertaste: evaluation.aftertaste,
      tasting_notes: evaluation.tastingNotes || [],
      eval_date: evaluation.evalDate,
      memo: evaluation.memo,
    };
    const { error } = await supabase.from('evaluations').update(payload).eq('id', evaluation.id);
    if (error) {
      console.error('Supabase Evaluation Update Error:', error);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error('Supabase Evaluation Update Exception:', err);
    return { success: false, error: err };
  }
}

export async function deleteEvaluationFromSupabase(id: number): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('evaluations').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete evaluation error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete evaluation exception:', err);
    return false;
  }
}

// ------------------------------------
// Bean Management (원두 정보)
// ------------------------------------

export const INITIAL_BEANS: BeanInfo[] = [];

export function mapRowToBean(row: any): BeanInfo {
  let notes = row.flavor_notes || row.flavorNotes;
  if (typeof notes === 'string') {
    try {
      notes = JSON.parse(notes);
    } catch (e) {
      notes = [];
    }
  }
  return {
    id: Number(row.id),
    name: row.name || '',
    roastery: row.roastery || '',
    origin: row.origin || '',
    agtronNumber: Number(row.agtron_number ?? row.agtronNumber ?? 65),
    roastLevel: row.roast_level || row.roastLevel || 'MEDIUM Roast',
    price: Number(row.price ?? 0),
    weightGrams: Number(row.weight_grams ?? row.weightGrams ?? 200),
    purchaseUrl: row.purchase_url || row.purchaseUrl || '',
    flavorNotes: Array.isArray(notes) ? notes : [],
    description: row.description || '',
    createdAt: row.created_at || row.createdAt || new Date().toISOString().split('T')[0],
  };
}

export async function fetchBeansFromSupabase(): Promise<BeanInfo[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('beans').select('*').order('id', { ascending: false });
    if (error) {
      console.warn('Supabase fetch beans error:', error.message);
      return null;
    }
    if (data && Array.isArray(data)) {
      return data.map(mapRowToBean);
    }
    return null;
  } catch (err) {
    console.warn('Supabase fetch beans exception:', err);
    return null;
  }
}

export async function insertBeanToSupabase(bean: BeanInfo): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: false, error: 'Supabase client is not configured' };

  const snakePayload: Record<string, any> = {
    id: bean.id,
    name: bean.name,
    roastery: bean.roastery,
    origin: bean.origin,
    agtron_number: bean.agtronNumber,
    roast_level: bean.roastLevel,
    price: bean.price,
    weight_grams: bean.weightGrams,
    purchase_url: bean.purchaseUrl,
    flavor_notes: JSON.stringify(bean.flavorNotes || []),
    description: bean.description,
    created_at: bean.createdAt,
  };

  try {
    const { error } = await supabase.from('beans').insert([snakePayload]);
    if (error) {
      console.warn('Supabase insert bean error:', error.message);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error('Supabase insert bean exception:', err);
    return { success: false, error: err };
  }
}

export async function updateBeanInSupabase(bean: BeanInfo): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: false, error: 'Supabase client is not configured' };

  const snakePayload: Record<string, any> = {
    name: bean.name,
    roastery: bean.roastery,
    origin: bean.origin,
    agtron_number: bean.agtronNumber,
    roast_level: bean.roastLevel,
    price: bean.price,
    weight_grams: bean.weightGrams,
    purchase_url: bean.purchaseUrl,
    flavor_notes: JSON.stringify(bean.flavorNotes || []),
    description: bean.description,
  };

  try {
    const { error } = await supabase.from('beans').update(snakePayload).eq('id', bean.id);
    if (error) {
      console.warn('Supabase update bean error:', error.message);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error('Supabase update bean exception:', err);
    return { success: false, error: err };
  }
}

export async function deleteBeanFromSupabase(id: number): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('beans').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete bean error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase delete bean exception:', err);
    return false;
  }
}

// ------------------------------------
// Grind Records Management (분쇄도 계산기 기록)
// ------------------------------------

export function mapRowToGrindRecord(row: any): GrindRecord {
  return {
    id: String(row.id),
    grinderId: row.grinder_id || row.grinderId || '',
    grinderName: row.grinder_name || row.grinderName || '',
    calcMode: (row.calc_mode || row.calcMode || 'micronToClick') as 'micronToClick' | 'clickToMicron',
    inputMicron: Number(row.input_micron ?? row.inputMicron ?? 0),
    calculatedClick: Number(row.calculated_click ?? row.calculatedClick ?? 0),
    calculatedMicron: Number(row.calculated_micron ?? row.calculatedMicron ?? 0),
    unitName: row.unit_name || row.unitName || '클릭',
    brewMethodRecommendation: row.brew_method_recommendation || row.brewMethodRecommendation || '',
    roastLevel: row.roast_level || row.roastLevel || '',
    notes: row.notes || '',
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

export async function fetchGrindRecordsFromSupabase(): Promise<GrindRecord[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('grind_records').select('*').order('id', { ascending: false });
    if (error) {
      console.warn('Supabase fetch grind_records error:', error.message);
      return null;
    }
    if (data && Array.isArray(data)) {
      return data.map(mapRowToGrindRecord);
    }
    return null;
  } catch (err) {
    console.warn('Supabase fetch grind_records exception:', err);
    return null;
  }
}

export async function insertGrindRecordToSupabase(record: GrindRecord): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: false, error: 'Supabase client is not configured' };

  const snakePayload: Record<string, any> = {
    id: record.id,
    grinder_id: record.grinderId,
    grinder_name: record.grinderName,
    calc_mode: record.calcMode,
    input_micron: record.inputMicron,
    calculated_click: record.calculatedClick,
    calculated_micron: record.calculatedMicron,
    unit_name: record.unitName,
    brew_method_recommendation: record.brewMethodRecommendation,
    roast_level: record.roastLevel || '',
    notes: record.notes || '',
    created_at: record.createdAt,
  };

  try {
    const { error } = await supabase.from('grind_records').insert([snakePayload]);
    if (error) {
      console.warn('Supabase insert grind_record error:', error.message);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.error('Supabase insert grind_record exception:', err);
    return { success: false, error: err };
  }
}

export async function deleteGrindRecordFromSupabase(id: string): Promise<{ success: boolean; error?: any }> {
  if (!supabase) return { success: false, error: 'Supabase client is not configured' };
  try {
    const { error } = await supabase.from('grind_records').delete().eq('id', id);
    if (error) {
      console.warn('Supabase delete grind_record error:', error.message);
      return { success: false, error };
    }
    return { success: true };
  } catch (err) {
    console.warn('Supabase delete grind_record exception:', err);
    return { success: false, error: err };
  }
}

