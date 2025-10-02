// Ejemplos de alimentos comunes con sus calorías aproximadas
export const COMMON_FOODS = [
  // Frutas
  { name: 'Manzana mediana', calories: 95, category: 'snacks' },
  { name: 'Plátano mediano', calories: 105, category: 'snacks' },
  { name: 'Naranja mediana', calories: 62, category: 'snacks' },
  { name: 'Pera mediana', calories: 102, category: 'snacks' },
  { name: 'Uvas (1 taza)', calories: 62, category: 'snacks' },
  
  // Verduras
  { name: 'Ensalada mixta', calories: 50, category: 'lunch' },
  { name: 'Brócoli (1 taza)', calories: 25, category: 'lunch' },
  { name: 'Zanahoria mediana', calories: 25, category: 'snacks' },
  { name: 'Tomate mediano', calories: 22, category: 'lunch' },
  
  // Proteínas
  { name: 'Pechuga de pollo (100g)', calories: 165, category: 'lunch' },
  { name: 'Salmón (100g)', calories: 208, category: 'dinner' },
  { name: 'Huevo hervido', calories: 78, category: 'breakfast' },
  { name: 'Atún en lata (100g)', calories: 154, category: 'lunch' },
  
  // Cereales y granos
  { name: 'Arroz blanco (1 taza)', calories: 205, category: 'lunch' },
  { name: 'Pan integral (1 rebanada)', calories: 69, category: 'breakfast' },
  { name: 'Avena (1 taza)', calories: 147, category: 'breakfast' },
  { name: 'Pasta (1 taza)', calories: 220, category: 'lunch' },
  
  // Lácteos
  { name: 'Leche descremada (1 vaso)', calories: 83, category: 'breakfast' },
  { name: 'Yogur natural (1 taza)', calories: 154, category: 'snacks' },
  { name: 'Queso fresco (30g)', calories: 80, category: 'snacks' },
  
  // Frutos secos
  { name: 'Almendras (30g)', calories: 173, category: 'snacks' },
  { name: 'Nueces (30g)', calories: 196, category: 'snacks' },
  { name: 'Cacahuetes (30g)', calories: 166, category: 'snacks' },
];

// Función para buscar alimentos por nombre
export const searchFoods = (query) => {
  if (!query || query.length < 2) return [];
  
  const searchTerm = query.toLowerCase();
  return COMMON_FOODS.filter(food => 
    food.name.toLowerCase().includes(searchTerm)
  ).slice(0, 10); // Limitar a 10 resultados
};

// Función para obtener sugerencias aleatorias
export const getRandomSuggestions = (count = 5) => {
  const shuffled = [...COMMON_FOODS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};