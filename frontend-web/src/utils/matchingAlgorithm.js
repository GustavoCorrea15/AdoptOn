export const calculateCompatibilityScore = (animal, userProfile) => {
  if (!userProfile) return 50;

  let score = 0;

  // Tipo de moradia vs Porte (25 pontos)
  if (userProfile.tipo_moradia === 'apartamento') {
    if (animal.porte === 'pequeno') score += 25;
    else if (animal.porte === 'medio') score += 15;
    else score += 5;
  } else if (userProfile.tipo_moradia === 'casa') {
    if (animal.porte === 'pequeno') score += 20;
    else if (animal.porte === 'medio') score += 25;
    else score += 20;
  } else if (userProfile.tipo_moradia === 'chacara') {
    if (animal.porte === 'grande') score += 25;
    else score += 15;
  }

  // Experiência vs Espécie (20 pontos)
  if (userProfile.experiencia_pets === 'nenhuma') {
    if (animal.especie === 'gato') score += 15;
    else score += 10;
  } else if (userProfile.experiencia_pets === 'pouca') {
    if (animal.especie === 'gato') score += 18;
    else score += 15;
  } else {
    score += 20;
  }

  // Idade do animal (15 pontos)
  const animalAgeYears = Math.floor(animal.idade / 12);
  if (animalAgeYears <= 1) {
    if (userProfile.experiencia_pets === 'muita') score += 15;
    else score += 5;
  } else if (animalAgeYears <= 3) {
    score += 15;
  } else {
    score += 12;
  }

  // Cuidados veterinários (15 pontos)
  if (animal.castrado && animal.vacinado) score += 15;
  else score += 8;

  // Raça (10 pontos)
  if (animal.raca === 'SRD') score += 10;
  else if (userProfile.experiencia_pets === 'muita') score += 10;
  else score += 6;

  // Localização (10 pontos)
  if (animal.ong_cidade?.toLowerCase() === userProfile.cidade?.toLowerCase()) {
    score += 10;
  } else {
    score += 5;
  }

  // Preferência por espécie baseada no perfil (5 pontos)
  if (userProfile.tipo_moradia === 'apartamento' && animal.especie === 'gato') {
    score += 5;
  } else if (userProfile.tipo_moradia !== 'apartamento' && animal.especie === 'cao') {
    score += 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

export const sortAnimalsByCompatibility = (animals, userProfile) => {
  return animals.map(animal => ({
    ...animal,
    compatibility_score: calculateCompatibilityScore(animal, userProfile)
  })).sort((a, b) => b.compatibility_score - a.compatibility_score);
};