import { INewPokemon, IPokemon, Move } from "@/store";
import { getRandomElements } from "./getRandomElements";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter";

export function getFilteredPokemon(data: INewPokemon, id: number) {
  const filteredPokemon: IPokemon = {
    name: data.name,
    url: data.sprites.front_default,
    moves: getRandomElements(data.moves, 4).map((m) => ({
      name: m.move.name,
      moveType: "normal",
    })),
    ability: getRandomElements(data.abilities, 1)[0].ability.name,
    types: data.types.map((type: { type: { name: string } }) => type.type.name),
    weight: data.weight,
    height: data.height,
    captured_at: Date.now(),
    id,
    nickname: capitalizeFirstLetter(data.name),
  };

  return filteredPokemon;
}
