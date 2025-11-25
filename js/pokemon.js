class Pokemon {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.image = data.sprites.other['official-artwork'].front_default || data.sprites.front_default;
        this.types = data.types.map(t => t.type.name);
        
        this.height = data.height / 10;
        this.weight = data.weight / 10;
        
        this.stats = data.stats.map(s => ({
            name: s.stat.name,
            value: s.base_stat
        }));

        this.abilities = data.abilities.map(a => a.ability.name);
    }

    getFormattedId() {
        return `#${this.id.toString().padStart(3, '0')}`;
    }

    getTypeColor(type) {
        const colors = {
            fire: 'bg-red-500',
            grass: 'bg-green-500',
            water: 'bg-blue-500',
            bug: 'bg-lime-600',
            normal: 'bg-gray-400',
            poison: 'bg-purple-600',
            electric: 'bg-yellow-400',
            ground: 'bg-amber-600',
            fairy: 'bg-pink-400',
            fighting: 'bg-red-700',
            psychic: 'bg-pink-600',
            rock: 'bg-stone-600',
            ghost: 'bg-indigo-800',
            ice: 'bg-cyan-400',
            dragon: 'bg-indigo-600',
            steel: 'bg-slate-400',
            flying: 'bg-sky-300',
            dark: 'bg-gray-600'
        };
        
        const targetType = type || this.types[0];
        
        return colors[targetType] || 'bg-gray-400';
    }

    toHTML() {
        return `
            <div class="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 cursor-pointer pokemon-card group border border-gray-100" data-id="${this.id}">
                <div class="bg-gray-100 p-6 relative flex justify-center items-center h-48 group-hover:bg-gray-200 transition-colors">
                    <span class="absolute top-3 left-4 text-gray-400 font-bold font-mono text-sm">${this.getFormattedId()}</span>
                    <img src="${this.image}" alt="${this.name}" class="w-32 h-32 object-contain drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                </div>
                <div class="p-5 text-center">
                    <h3 class="text-xl font-bold text-gray-800 capitalize mb-3 tracking-wide">${this.name}</h3>
                    <div class="flex justify-center flex-wrap gap-2">
                         ${this.types.map(t => `<span class="${this.getTypeColor(t)} text-white text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider shadow-sm">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    toDetailHTML() {
        const statsHTML = this.stats.map(stat => {
            let colorClass = 'bg-blue-500';
            if (stat.value < 50) colorClass = 'bg-red-400';
            else if (stat.value >= 100) colorClass = 'bg-green-500';

            const statNames = { 
                hp: 'HP', attack: 'Ataque', defense: 'Defesa', 
                'special-attack': 'Sp. Atk', 'special-defense': 'Sp. Def', speed: 'Velocidade' 
            };
            const displayName = statNames[stat.name] || stat.name;

            return `
                <div class="mb-4">
                    <div class="flex justify-between text-sm mb-1">
                        <span class="capitalize text-gray-600 font-semibold">${displayName}</span>
                        <span class="font-bold text-gray-800">${stat.value}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div class="${colorClass} h-2.5 rounded-full" style="width: ${Math.min(stat.value, 100)}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="bg-gray-100 p-8 text-center rounded-t-2xl relative">
                <img src="${this.image}" class="w-48 h-48 mx-auto object-contain drop-shadow-xl z-10 relative">
                <h2 class="text-3xl font-bold capitalize text-gray-800 mt-4">${this.name}</h2>
                 <p class="text-gray-500 font-mono text-sm mt-1">${this.getFormattedId()}</p>
            </div>
            
            <div class="p-6">
                <div class="flex justify-center gap-2 mb-6">
                    ${this.types.map(t => `<span class="${this.getTypeColor(t)} text-white text-xs px-4 py-1.5 rounded-full uppercase font-bold shadow-sm">${t}</span>`).join('')}
                </div>

                <div class="grid grid-cols-2 gap-4 mb-8 text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div class="text-center border-r border-gray-200">
                        <p class="text-xs uppercase tracking-wide text-gray-400 mb-1">Altura</p>
                        <p class="font-bold text-lg text-gray-800">${this.height} m</p>
                    </div>
                    <div class="text-center">
                        <p class="text-xs uppercase tracking-wide text-gray-400 mb-1">Peso</p>
                        <p class="font-bold text-lg text-gray-800">${this.weight} kg</p>
                    </div>
                </div>
                
                <div class="space-y-6">
                    <div>
                        <h4 class="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                           Estatísticas
                        </h4>
                        ${statsHTML}
                    </div>
                </div>
            </div>
        `;
    }
}