import { IMove } from "@/store";
import { FormatPokemon } from "@/utils/formatPokemon";

export type MovePokemon = {
  name: string;
  accuracy: number;
  pp: number;
  power: number;
  type: { name: string };
};

export type AbilityPokemon = {
  effect_changes: {
    effect_entries: { effect: string; language: { name: string } }[];
  }[];
  effect_entries: {
    effect: string;
    language: { name: string };
  }[];
};

export const getMoves = async (move: string): Promise<IMove> => {
  const response = await fetch(`https://pokeapi.co/api/v2/move/${move}`);
  const data: MovePokemon = await response.json();
  return FormatPokemon.formatMove(data);
};

export const getAbility = async (ability: string): Promise<string[]> => {
  const response = await fetch(`https://pokeapi.co/api/v2/ability/${ability}`);
  const data: AbilityPokemon = await response.json();
  return FormatPokemon.formatAbility(data);
};
