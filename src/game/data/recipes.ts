export interface Recipe {
  name: string;
  ingredients: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export const recipes: Recipe[] = [
  {
    name: 'Mojito',
    ingredients: ['rum', 'mint', 'lime', 'sugar', 'soda'],
    difficulty: 'easy',
    points: 100
  },
  {
    name: 'Margarita',
    ingredients: ['tequila', 'lime', 'triple sec'],
    difficulty: 'easy',
    points: 100
  },
  {
    name: 'Old Fashioned',
    ingredients: ['whiskey', 'bitters', 'sugar'],
    difficulty: 'medium',
    points: 150
  },
  {
    name: 'Martini',
    ingredients: ['gin', 'vermouth'],
    difficulty: 'medium',
    points: 150
  },
  {
    name: 'Long Island Iced Tea',
    ingredients: ['vodka', 'gin', 'rum', 'tequila', 'triple sec', 'cola'],
    difficulty: 'hard',
    points: 200
  }
];