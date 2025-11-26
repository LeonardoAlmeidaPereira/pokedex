const API_URL = 'https://pokeapi.co/api/v2/pokemon';
let offset = 0;
const limit = 20;

$(document).ready(function() {
    loadPokemonList();

    $('#btn-load-more').click(function() {
        offset += limit;
        loadPokemonList();
    });

    $('#btn-search').click(function() {
        const query = $('#search-input').val().toLowerCase().trim();
        if (query) {
            searchPokemon(query);
        } else {
            resetList();
        }
    });

    $('#search-input').on('keypress', function(e) {
        if (e.which === 13) {
            $('#btn-search').click();
        }
    });

    $(document).on('click', '.pokemon-card', function() {
        const pokemonId = $(this).data('id');
        openPokemonDetails(pokemonId);
    });

    $('#close-modal, #pokemonModal').click(function(e) {
        if (e.target === this || e.target.closest('#close-modal')) {
            $('#pokemonModal').addClass('hidden').removeClass('flex');
            $('body').removeClass('overflow-hidden');
        }
    });

    $(document).on('keydown', function(e) {
        if (e.key === "Escape") {
            $('#pokemonModal').addClass('hidden').removeClass('flex');
            $('body').removeClass('overflow-hidden');
        }
    });
});

async function loadPokemonList() {
    $('#loading').removeClass('hidden');
    $('#btn-load-more').hide();

    try {
        const response = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        
        const promises = data.results.map(item => fetch(item.url).then(res => res.json()));
        const pokemonDetails = await Promise.all(promises);

        pokemonDetails.forEach(data => {
            const pokemon = new Pokemon(data);
            $('#pokemon-list').append(pokemon.toHTML());
        });

    } catch (error) {
        console.error(error);
        alert('Erro ao carregar lista.');
    } finally {
        $('#loading').addClass('hidden');
        $('#btn-load-more').show();
    }
}

async function searchPokemon(query) {
    $('#pokemon-list').empty();
    $('#loading').removeClass('hidden');
    $('#btn-load-more').hide();

    try {
        const response = await fetch(`${API_URL}/${query}`);
        
        if (!response.ok) throw new Error('Pokémon não encontrado');

        const data = await response.json();
        const pokemon = new Pokemon(data);
        
        $('#pokemon-list').html(pokemon.toHTML());

    } catch (error) {
        $('#pokemon-list').html(`<div class="col-span-full w-full text-center"><p class="text-red-500 font-bold text-lg">Pokémon "${query}" não encontrado.</p></div>`);
    } finally {
        $('#loading').addClass('hidden');
    }
}

function resetList() {
    $('#pokemon-list').empty();
    offset = 0;
    loadPokemonList();
}

async function openPokemonDetails(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        
        const pokemon = new Pokemon(data);
        
        $('#modal-content').html(pokemon.toDetailHTML());
        
        $('#pokemonModal').removeClass('hidden').addClass('flex');
        $('body').addClass('overflow-hidden');
        
    } catch (error) {
        console.error(error);
    }
}