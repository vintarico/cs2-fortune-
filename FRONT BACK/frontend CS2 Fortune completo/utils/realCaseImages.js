// URLs das imagens reais das caixas CS2
// Baseado nas imagens fornecidas pelo usuário

export const REAL_CASE_IMAGES = {
  // Original Collection
  'fracture': '/images/cases/fracture.png',
  'kilowatt': '/images/cases/kilowatt.png',
  'recoil': '/images/cases/revolution.png', // Recoil não está nas imagens, usando Revolution
  'revolution': '/images/cases/revolution.png',
  'danger-zone': '/images/cases/danger-zone.png',
  'dreams-nightmares': '/images/cases/dreams-nightmares.png',
  'phoenix': '/images/cases/phoenix.png',
  'broken-fang': '/images/cases/breakout.png', // Broken Fang similar ao Breakout
  'breakout': '/images/cases/breakout.png',
  'riptide': '/images/cases/riptide.png',
  'huntsman': '/images/cases/huntsman.png',
  'spectrum': '/images/cases/spectrum.png',
  'hydra': '/images/cases/bydvo.png', // Hydra similar ao BydVO
  'bravo': '/images/cases/bravo.png',
  'weapon': '/images/cases/weapon.png',

  // Weapon & Agent Collection - Part 1
  'ak47-empress': '/images/cases/ak47-empress.png',
  'kilowatt-case-2': '/images/cases/kilowatt-2.png',
  'desert-deagle': '/images/cases/desert-deagle.png',
  'm444-howl': '/images/cases/m444-howl.png',
  'phoenix-case-2': '/images/cases/phoenix.png',
  'karambit-fade': '/images/cases/karambit-fade.png',
  'glock-fade': '/images/cases/glock-fade.png',
  'knife-droper': '/images/cases/knife-droper.png',
  't-agent': '/images/cases/t-agent.png',
  'agent-master': '/images/cases/agent-master.png',

  // Weapon & Agent Collection - Part 2
  'p90-asiimov': '/images/cases/p90-asiimov.png',
  'sg-553': '/images/cases/sg-553-cyrex.png',
  'phoenix-weapon': '/images/cases/phoenix.png',
  'mp9-wildfire': '/images/cases/mp9-wildfire.png',
  'awp-gungnir': '/images/cases/awp-gungnir.png',
  'm441-printstream': '/images/cases/m441-printstream.png',
  'glock-neo-noir': '/images/cases/glock-neo-noir.png',
  'ak47-bloodsport': '/images/cases/ak47-bloodsport.png',
  'revolter-fade': '/images/cases/revolter-fade.png',

  // Part 2 Extended
  'usp-guardian': '/images/cases/usp-guardian.png',
  'five-seven-hyper': '/images/cases/five-seven-hyper.png',
  'cyrex': '/images/cases/sg-553-cyrex.png',
  
  // New Cases (Baseado nos nomes)
  'starter-bronze': '/images/cases/fracture.png', // Placeholder
  'starter-silver': '/images/cases/kilowatt.png', // Placeholder
  'ak47-empress': '/images/cases/ak47-empress.png',
  'm4a4-howl': '/images/cases/m444-howl.png',
  'awp-dragon-lore': '/images/cases/desert-deagle.png',
  'neon-rider': '/images/cases/phoenix.png',
  'gungnir': '/images/cases/awp-gungnir.png',
  'prince': '/images/cases/usp-guardian.png',
  'wild-lotus': '/images/cases/phoenix.png',
  'printstream': '/images/cases/m441-printstream.png',
  'fire-ice': '/images/cases/ak47-bloodsport.png',
  'blue-gem': '/images/cases/glock-neo-noir.png',
  'souvenir-dlore': '/images/cases/awp-gungnir.png'
};

// Função para obter URL da imagem real
export function getRealCaseImage(caseId) {
  return REAL_CASE_IMAGES[caseId] || '/images/cases/default.png';
}
