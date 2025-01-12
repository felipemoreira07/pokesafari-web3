import { IMove, INewPokemon, IPokemon } from "@/store";
import { getRandomElements } from "./getRandomElements";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";
import { AbilityPokemon, MovePokemon } from "@/services";

export type ContractPokemon = {
  name: string;
  nickname: string;
  url: string;
  captured_at: bigint;
  types: readonly string[];
  ability: string;
  weight: bigint;
  height: bigint;
  moves: readonly string[];
};

export class FormatPokemon {
  public static formatSafariPokemon(data: INewPokemon): IPokemon {
    const formattedPokemon: IPokemon = {
      name: capitalizeFirstLetter(data.name),
      url: data.sprites.front_default,
      moves: getRandomElements(data.moves, 4).map((m) => m.move.name),
      ability: getRandomElements(data.abilities, 1)[0].ability.name,
      types: data.types.map((type: { type: { name: string } }) =>
        capitalizeFirstLetter(type.type.name)
      ),
      weight: data.weight,
      height: data.height,
      captured_at: Date.now(),
      nickname: capitalizeFirstLetter(data.name),
    };

    return formattedPokemon;
  }

  public static formatContractPokemons(
    data: readonly ContractPokemon[]
  ): IPokemon[] {
    const formattedPokemons: IPokemon[] = [];

    for (const pokemon of data) {
      formattedPokemons.push({
        name: pokemon.name,
        nickname: pokemon.nickname,
        url: pokemon.url,
        moves: [...pokemon.moves],
        ability: pokemon.ability,
        types: [...pokemon.types],
        weight: Number(pokemon.weight),
        height: Number(pokemon.height),
        captured_at: Number(pokemon.captured_at),
      });
    }

    return formattedPokemons;
  }

  public static formatContractPokemon(pokemon: ContractPokemon): IPokemon {
    const formattedPokemon: IPokemon = {
      name: pokemon.name,
      nickname: pokemon.nickname,
      url: pokemon.url,
      moves: [...pokemon.moves],
      ability: pokemon.ability,
      types: [...pokemon.types],
      weight: Number(pokemon.weight),
      height: Number(pokemon.height),
      captured_at: Number(pokemon.captured_at),
    };

    return formattedPokemon;
  }

  public static formatMoveString(input: string): string {
    return input
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  public static formatMove(move: MovePokemon): IMove {
    const formattedMove: IMove = {
      name: this.formatMoveString(move.name),
      accuracy: move.accuracy,
      power: move.power,
      pp: move.pp,
      type: capitalizeFirstLetter(move.type.name),
    };

    return formattedMove;
  }

  public static formatAbility(ability: AbilityPokemon): string[] {
    const abilities: string[] = [];

    ability.effect_entries.forEach((effect) => {
      if (effect.language.name === "en") abilities.push(effect.effect);
    });
    ability.effect_changes.forEach((effect) => {
      effect.effect_entries.forEach((entry) => {
        if (entry.language.name === "en") abilities.push(entry.effect);
      });
    });

    return abilities;
  }
}
