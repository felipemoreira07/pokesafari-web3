import { prepareEvent } from "thirdweb";

export const preparedPokemonCapturedEvent = prepareEvent({
  signature: "event PokemonCaptured(string pokemonName, uint256 captured_at)",
});

export const preparedPokemonEscapedEvent = prepareEvent({
  signature: "event PokemonEscaped(string pokemonName, uint256 escaped_at)",
});

export const preparedPokemonSentToOakEvent = prepareEvent({
  signature: "event PokemonSentToOak(string pokemonName, uint256 sent_at)",
});
