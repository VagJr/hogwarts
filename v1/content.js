'use strict';

module.exports = {
  rhythms: [
    { id: 'learn', icon: '🎓', title: 'Aprender', text: 'Aulas, biblioteca, provas, manuscritos e domínio de feitiços.' },
    { id: 'prepare', icon: '🧪', title: 'Preparar', text: 'Poções, Herbologia, equipamentos, Grimório, descanso e recursos.' },
    { id: 'explore', icon: '🗺️', title: 'Explorar', text: 'Castelo, segredos, Floresta Proibida, missões e eventos vivos.' },
    { id: 'social', icon: '🤝', title: 'Pertencer', text: 'Casa, grupos, guildas, dormitórios, mercado e atividades sociais.' },
    { id: 'compete', icon: '⚔️', title: 'Competir', text: 'Duelos, Quadribol, rankings e eventos de servidor.' }
  ],
  locations: [
    { id: 'salao', name: 'Salão Principal', role: 'social', activities: ['chat', 'Casa', 'eventos', 'alimentação'] },
    { id: 'escadaria', name: 'Grande Escadaria', role: 'explore', activities: ['segredos', 'quadros', 'atalhos'] },
    { id: 'masmorras', name: 'Masmorras', role: 'learn', activities: ['Poções', 'combate', 'mistérios'] },
    { id: 'astronomia', name: 'Torre de Astronomia', role: 'learn', activities: ['aulas', 'eventos noturnos'] },
    { id: 'biblioteca', name: 'Biblioteca', role: 'learn', activities: ['livros', 'provas', 'teses', 'magias'] },
    { id: 'floresta', name: 'Floresta Proibida', role: 'explore', activities: ['PvE', 'loot', 'coop', 'chefes'] },
    { id: 'hogsmeade', name: 'Hogsmeade', role: 'social', activities: ['comércio', 'encontros', 'eventos'] },
    { id: 'estufas', name: 'Estufas', role: 'prepare', activities: ['Herbologia', 'ingredientes'] }
  ]
};
