import { create } from "zustand";

export type IMove = {
  name: string;
  accuracy: number;
  pp: number;
  power: number;
  type: string;
};

export type IPokemon = {
  name: string;
  nickname: string;
  url: string;
  captured_at: number;
  types: string[];
  ability: string;
  weight: number;
  height: number;
  moves: string[];
};

export type INewPokemon = {
  name: string;
  sprites: { front_default: string };
  moves: { move: { name: string } }[];
  abilities: { ability: { name: string } }[];
  types: { type: { name: string } }[];
  weight: number;
  height: number;
};

type StoreVariables = {
  newPokemon: IPokemon | undefined;
  selectedPokemon: IPokemon | undefined;
  teamPokemons: IPokemon[];
  oakPokemons: IPokemon[];

  moves: IMove[];

  refetchPokeball: number | undefined;
  refetchPokemons: "team" | "oak" | undefined;

  isLoading: boolean;

  enablePokemonCapturedEvent: boolean;
  enablePokemonEscapedEvent: boolean;
  enablePokemonSentToOakEvent: boolean;
};

type StoreActions = {
  setNewPokemon: (pokemon: IPokemon) => void;
  resetNewPokemon: () => void;

  setSelectedPokemon: (pokemon: IPokemon) => void;
  resetSelectedPokemon: (pokemon: IPokemon) => void;

  setTeamPokemons: (pokemon: IPokemon[]) => void;
  setOakPokemons: (pokemon: IPokemon[]) => void;

  setRefetchPokeball: (val: number) => void;
  resetRefetchPokeball: () => void;

  setRefetchPokemons: (val: "team" | "oak") => void;
  resetRefetchPokemons: () => void;

  setLoading: (val: boolean) => void;

  setEnablePokemonCapturedEvent: (val: boolean) => void;
  setEnablePokemonEscapedEvent: (val: boolean) => void;
  setEnablePokemonSentToOakEvent: (val: boolean) => void;
};

export const useStore = create<StoreVariables & StoreActions>((set) => ({
  newPokemon: undefined,
  selectedPokemon: undefined,
  teamPokemons: [],
  oakPokemons: [],

  moves: [],

  refetchPokeball: undefined,
  refetchPokemons: undefined,

  isLoading: false,

  enablePokemonCapturedEvent: true,
  enablePokemonEscapedEvent: true,
  enablePokemonSentToOakEvent: true,

  setNewPokemon: (pokemon: IPokemon) => set(() => ({ newPokemon: pokemon })),
  resetNewPokemon: () => set(() => ({ newPokemon: undefined })),

  setSelectedPokemon: (pokemon: IPokemon) =>
    set(() => ({ selectedPokemon: pokemon })),
  resetSelectedPokemon: () => set(() => ({ selectedPokemon: undefined })),

  setTeamPokemons: (pokemons: IPokemon[]) =>
    set(() => ({
      teamPokemons: pokemons,
    })),
  setOakPokemons: (pokemons: IPokemon[]) =>
    set(() => ({
      oakPokemons: pokemons,
    })),

  setRefetchPokeball: (val: number) => set(() => ({ refetchPokeball: val })),
  resetRefetchPokeball: () => set(() => ({ refetchPokeball: undefined })),

  setRefetchPokemons: (val: "team" | "oak") =>
    set(() => ({ refetchPokemons: val })),
  resetRefetchPokemons: () => set(() => ({ refetchPokemons: undefined })),

  setLoading: (val: boolean) => set(() => ({ isLoading: val })),

  setEnablePokemonCapturedEvent: (val: boolean) =>
    set(() => ({ enablePokemonCapturedEvent: val })),
  setEnablePokemonEscapedEvent: (val: boolean) =>
    set(() => ({ enablePokemonEscapedEvent: val })),
  setEnablePokemonSentToOakEvent: (val: boolean) =>
    set(() => ({ enablePokemonSentToOakEvent: val })),
}));
