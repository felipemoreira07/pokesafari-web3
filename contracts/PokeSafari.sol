// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract PokeSafari {
    struct Move {
        string name;
        string moveType;
    }

    struct Pokemon {
        uint256 id;
        string name;
        string nickname;
        uint256 captured_at;
        string[] types;
        string ability;
        uint256 weight;
        uint256 height;
        mapping(uint256 => Move) moves;
        uint256 movesSize;
    }

    struct SimplifiedPokemon {
        uint256 id;
        string name;
        string nickname;
        uint256 captured_at;
        string[] types;
        string ability;
        uint256 weight;
        uint256 height;
        Move[] moves;
    }

    Pokemon[] public s_pokemons;
    Pokemon[] public s_oak_pokemons;
    uint256 public s_pokeball_inventory;
    uint256 public s_greatball_inventory;
    uint256 public s_ultraball_inventory;

    uint256 public constant POKEBALL_PRICE = 0.001 ether;
    uint256 public constant GREATBALL_PRICE = 0.002 ether;
    uint256 public constant ULTRABALL_PRICE = 0.005 ether;

    uint256 public constant POKEBALL_ACCURACY = 30;
    uint256 public constant GREATBALL_ACCURACY = 50;
    uint256 public constant ULTRABALL_ACCURACY = 70;

    uint256 public constant POKEBALL_TYPE = 1;
    uint256 public constant GREATBALL_TYPE = 2;
    uint256 public constant ULTRABALL_TYPE = 3;

    event PokemonCaptured(string pokemonName);
    event PokemonEscaped(string pokemonName);
    event PokemonSentToOak(string pokemonName);

    function catchPokemon(
        uint256 id,
        string memory name,
        string memory nickname,
        uint256 captured_at,
        string[] memory types,
        string memory ability,
        uint256 weight,
        uint256 height,
        Move[] memory moves,
        uint256 pokeball_type,
        uint256 catchAccuracy
    ) public {
        bool hasBalls = true;

        if (
            (pokeball_type == POKEBALL_TYPE && s_pokeball_inventory <= 0) ||
            (pokeball_type == GREATBALL_TYPE && s_greatball_inventory <= 0) ||
            (pokeball_type == ULTRABALL_TYPE && s_ultraball_inventory <= 0)
        ) {
            hasBalls = false;
        }

        require(!hasBalls, "No Pokeball of this type available");

        if (pokeball_type == POKEBALL_TYPE) {
            s_pokeball_inventory--;
        } else if (pokeball_type == GREATBALL_TYPE) {
            s_greatball_inventory--;
        } else {
            s_ultraball_inventory--;
        }

        if (
            (pokeball_type == POKEBALL_TYPE &&
                catchAccuracy < POKEBALL_ACCURACY) ||
            (pokeball_type == GREATBALL_TYPE &&
                catchAccuracy < GREATBALL_ACCURACY) ||
            (pokeball_type == ULTRABALL_TYPE &&
                catchAccuracy < ULTRABALL_ACCURACY)
        ) {
            emit PokemonEscaped(name);
            return;
        }

        Pokemon storage newPokemon = s_pokemons.push();

        newPokemon.id = id;
        newPokemon.name = name;
        newPokemon.nickname = nickname;
        newPokemon.captured_at = captured_at;

        newPokemon.types = new string[](types.length);
        for (uint i = 0; i < types.length; i++) {
            newPokemon.types[i] = types[i];
        }

        newPokemon.ability = ability;
        newPokemon.weight = weight;
        newPokemon.height = height;

        for (uint j = 0; j < moves.length; j++) {
            newPokemon.moves[j] = Move({
                name: moves[j].name,
                moveType: moves[j].moveType
            });
            newPokemon.movesSize++;
        }

        emit PokemonCaptured(name);
    }

    function sendPokemonToOak(uint256 id) public {
        uint256 pokemons_length = s_pokemons.length;

        for (uint256 i = 0; i < pokemons_length; i++) {
            Pokemon storage pokemon = s_pokemons[i];
            if (pokemon.id == id) {
                Pokemon storage newPokemon = s_oak_pokemons.push();
                newPokemon.id = pokemon.id;
                newPokemon.name = pokemon.name;
                newPokemon.nickname = pokemon.nickname;
                newPokemon.captured_at = pokemon.captured_at;
                newPokemon.types = pokemon.types;
                newPokemon.ability = pokemon.ability;
                newPokemon.weight = pokemon.weight;
                newPokemon.height = pokemon.height;

                for (uint256 j = 0; j < pokemon.movesSize; j++) {
                    newPokemon.moves[j] = pokemon.moves[j];
                }
                newPokemon.movesSize = pokemon.movesSize;

                if (i < pokemons_length - 1) {
                    Pokemon storage lastPokemon = s_pokemons[
                        pokemons_length - 1
                    ];
                    pokemon.id = lastPokemon.id;
                    pokemon.name = lastPokemon.name;
                    pokemon.nickname = lastPokemon.nickname;
                    pokemon.captured_at = lastPokemon.captured_at;
                    pokemon.types = lastPokemon.types;
                    pokemon.ability = lastPokemon.ability;
                    pokemon.weight = lastPokemon.weight;
                    pokemon.height = lastPokemon.height;

                    for (uint256 j = 0; j < lastPokemon.movesSize; j++) {
                        pokemon.moves[j] = lastPokemon.moves[j];
                    }
                    pokemon.movesSize = lastPokemon.movesSize;
                }

                s_pokemons.pop();
                emit PokemonSentToOak(pokemon.name);
                return;
            }
        }

        revert("Pokemon not found");
    }

    function addPokeballs(
        uint256 pokeball_type,
        uint256 quantity
    ) public payable {
        require(quantity > 0, "Quantity must be greater than zero");

        uint256 pokeball_price = pokeball_type == POKEBALL_TYPE
            ? POKEBALL_PRICE
            : (
                pokeball_type == GREATBALL_TYPE
                    ? GREATBALL_PRICE
                    : ULTRABALL_PRICE
            );
        uint256 totalPrice = pokeball_price * quantity;

        require(msg.value >= totalPrice, "Incorrect Ether amount sent");

        if (pokeball_type == POKEBALL_TYPE) {
            s_pokeball_inventory++;
        } else if (pokeball_type == GREATBALL_TYPE) {
            s_greatball_inventory++;
        } else {
            s_ultraball_inventory++;
        }
    }

    function getAllPokemons() public view returns (SimplifiedPokemon[] memory) {
        uint256 pokemonCount = s_pokemons.length;
        SimplifiedPokemon[] memory allPokemons = new SimplifiedPokemon[](
            pokemonCount
        );

        for (uint256 i = 0; i < pokemonCount; i++) {
            Pokemon storage originalPokemon = s_pokemons[i];
            Move[] memory moves = new Move[](originalPokemon.movesSize);

            for (uint256 j = 0; j < originalPokemon.movesSize; j++) {
                Move storage move = originalPokemon.moves[j];
                moves[j] = Move({name: move.name, moveType: move.moveType});
            }

            allPokemons[i] = SimplifiedPokemon({
                id: originalPokemon.id,
                name: originalPokemon.name,
                nickname: originalPokemon.nickname,
                captured_at: originalPokemon.captured_at,
                types: originalPokemon.types,
                ability: originalPokemon.ability,
                weight: originalPokemon.weight,
                height: originalPokemon.height,
                moves: moves
            });
        }

        return allPokemons;
    }

    function getAllOakPokemons()
        public
        view
        returns (SimplifiedPokemon[] memory)
    {
        uint256 pokemonCount = s_oak_pokemons.length;
        SimplifiedPokemon[] memory allPokemons = new SimplifiedPokemon[](
            pokemonCount
        );

        for (uint256 i = 0; i < pokemonCount; i++) {
            Pokemon storage originalPokemon = s_oak_pokemons[i];
            Move[] memory moves = new Move[](originalPokemon.movesSize);

            for (uint256 j = 0; j < originalPokemon.movesSize; j++) {
                Move storage move = originalPokemon.moves[j];
                moves[j] = Move({name: move.name, moveType: move.moveType});
            }

            allPokemons[i] = SimplifiedPokemon({
                id: originalPokemon.id,
                name: originalPokemon.name,
                nickname: originalPokemon.nickname,
                captured_at: originalPokemon.captured_at,
                types: originalPokemon.types,
                ability: originalPokemon.ability,
                weight: originalPokemon.weight,
                height: originalPokemon.height,
                moves: moves
            });
        }

        return allPokemons;
    }

    function getPokeballs() public view returns (uint256) {
        return s_pokeball_inventory;
    }

    function getGreatballs() public view returns (uint256) {
        return s_greatball_inventory;
    }

    function getUltraballs() public view returns (uint256) {
        return s_ultraball_inventory;
    }
}
