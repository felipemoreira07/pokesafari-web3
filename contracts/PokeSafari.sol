// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract PokeSafari {
    struct Pokemon {
        string name;
        string nickname;
        string url;
        uint256 captured_at;
        string[] types;
        string ability;
        uint256 weight;
        uint256 height;
        string[] moves;
    }

    Pokemon[] private pokemons;
    Pokemon[] private oak_pokemons;
    uint256 private pokeball_inventory;
    uint256 private greatball_inventory;
    uint256 private ultraball_inventory;

    uint256 private constant POKEBALL_PRICE = 0.001 ether;
    uint256 private constant GREATBALL_PRICE = 0.002 ether;
    uint256 private constant ULTRABALL_PRICE = 0.005 ether;

    uint256 private constant POKEBALL_FAILURE_ACCURACY = 70;
    uint256 private constant GREATBALL_FAILURE_ACCURACY = 50;
    uint256 private constant ULTRABALL_FAILURE_ACCURACY = 30;

    uint256 private constant POKEBALL_TYPE = 1;
    uint256 private constant GREATBALL_TYPE = 2;
    uint256 private constant ULTRABALL_TYPE = 3;

    event PokemonCaptured(string pokemonName, uint256 captured_at);
    event PokemonEscaped(string pokemonName, uint256 escaped_at);
    event PokemonSentToOak(string pokemonName, uint256 sent_at);

    function catchPokemon(
        string memory _name,
        string memory _nickname,
        string memory _url,
        uint256 _captured_at,
        string[] memory _types,
        string memory _ability,
        uint256 _weight,
        uint256 _height,
        string[] memory _moves,
        uint256 _pokeball_type,
        uint256 _catch_accuracy
    ) public {
        bool hasBalls = true;

        if (
            (_pokeball_type == POKEBALL_TYPE && pokeball_inventory <= 0) ||
            (_pokeball_type == GREATBALL_TYPE && greatball_inventory <= 0) ||
            (_pokeball_type == ULTRABALL_TYPE && ultraball_inventory <= 0)
        ) {
            hasBalls = false;
        }

        require(hasBalls, "No Pokeball of this type available");

        if (_pokeball_type == POKEBALL_TYPE) {
            pokeball_inventory--;
        } else if (_pokeball_type == GREATBALL_TYPE) {
            greatball_inventory--;
        } else {
            ultraball_inventory--;
        }

        if (
            (_pokeball_type == POKEBALL_TYPE &&
                _catch_accuracy < POKEBALL_FAILURE_ACCURACY) ||
            (_pokeball_type == GREATBALL_TYPE &&
                _catch_accuracy < GREATBALL_FAILURE_ACCURACY) ||
            (_pokeball_type == ULTRABALL_TYPE &&
                _catch_accuracy < ULTRABALL_FAILURE_ACCURACY)
        ) {
            emit PokemonEscaped(_name, _captured_at);
            return;
        }

        Pokemon storage newPokemon = pokemons.push();

        newPokemon.name = _name;
        newPokemon.nickname = _nickname;
        newPokemon.url = _url;
        newPokemon.captured_at = _captured_at;
        newPokemon.ability = _ability;
        newPokemon.weight = _weight;
        newPokemon.height = _height;

        newPokemon.types = new string[](_types.length);
        for (uint i = 0; i < _types.length; i++) {
            newPokemon.types[i] = _types[i];
        }

        newPokemon.moves = new string[](_moves.length);
        for (uint i = 0; i < _moves.length; i++) {
            newPokemon.moves[i] = _moves[i];
        }

        emit PokemonCaptured(_name, _captured_at);
    }

    function sendPokemonToOak(
        uint256 _pokemon_captured_at,
        uint256 _timestamp
    ) public {
        uint256 pokemonlength = pokemons.length;

        for (uint256 i = 0; i < pokemonlength; i++) {
            Pokemon storage pokemon = pokemons[i];
            if (pokemon.captured_at == _pokemon_captured_at) {
                Pokemon storage newPokemon = oak_pokemons.push();
                newPokemon.name = pokemon.name;
                newPokemon.nickname = pokemon.nickname;
                newPokemon.captured_at = pokemon.captured_at;
                newPokemon.types = pokemon.types;
                newPokemon.ability = pokemon.ability;
                newPokemon.weight = pokemon.weight;
                newPokemon.height = pokemon.height;
                newPokemon.moves = pokemon.moves;

                if (i < pokemonlength - 1) {
                    Pokemon storage lastPokemon = pokemons[pokemonlength - 1];
                    pokemon.name = lastPokemon.name;
                    pokemon.nickname = lastPokemon.nickname;
                    pokemon.captured_at = lastPokemon.captured_at;
                    pokemon.types = lastPokemon.types;
                    pokemon.ability = lastPokemon.ability;
                    pokemon.weight = lastPokemon.weight;
                    pokemon.height = lastPokemon.height;
                    pokemon.moves = lastPokemon.moves;
                }

                pokemons.pop();
                emit PokemonSentToOak(pokemon.name, _timestamp);
                return;
            }
        }

        revert("Pokemon not found");
    }

    function givePokemonNickname(
        uint256 captured_at,
        string memory nickname
    ) public {
        uint256 pokemonlength = pokemons.length;

        for (uint256 i = 0; i < pokemonlength; i++) {
            Pokemon storage pokemon = pokemons[i];
            if (pokemon.captured_at == captured_at) {
                pokemon.nickname = nickname;
                return;
            }
        }

        revert("Pokemon not found");
    }

    function addPokeballs(
        uint256 _pokeball_type,
        uint256 quantity
    ) public payable {
        require(quantity > 0, "Quantity must be greater than zero");

        uint256 pokeball_price = _pokeball_type == POKEBALL_TYPE
            ? POKEBALL_PRICE
            : (
                _pokeball_type == GREATBALL_TYPE
                    ? GREATBALL_PRICE
                    : ULTRABALL_PRICE
            );
        uint256 totalPrice = pokeball_price * quantity;

        require(msg.value >= totalPrice, "Incorrect Ether amount sent");

        if (_pokeball_type == POKEBALL_TYPE) {
            pokeball_inventory = pokeball_inventory + quantity;
        } else if (_pokeball_type == GREATBALL_TYPE) {
            greatball_inventory = greatball_inventory + quantity;
        } else {
            ultraball_inventory = ultraball_inventory + quantity;
        }
    }

    function getAllPokemons() public view returns (Pokemon[] memory) {
        return pokemons;
    }

    function getAllOakPokemons() public view returns (Pokemon[] memory) {
        return oak_pokemons;
    }

    function getPokeballs() public view returns (uint256) {
        return pokeball_inventory;
    }

    function getGreatballs() public view returns (uint256) {
        return greatball_inventory;
    }

    function getUltraballs() public view returns (uint256) {
        return ultraball_inventory;
    }
}
