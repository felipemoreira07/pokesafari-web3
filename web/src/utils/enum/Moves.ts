export class Moves {
  public static enum = {
    Normal: "Normal",
    Fire: "Fire",
    Water: "Water",
    Grass: "Grass",
    Electric: "Electric",
    Ice: "Ice",
    Fighting: "Fighting",
    Poison: "Poison",
    Ground: "Ground",
    Flying: "Flying",
    Psychic: "Psychic",
    Bug: "Bug",
    Rock: "Rock",
    Ghost: "Ghost",
    Dragon: "Dragon",
    Dark: "Dark",
    Steel: "Steel",
    Fairy: "Fairy",
  } as const;

  public static label = {
    [this.enum.Normal]: "Normal",
    [this.enum.Fire]: "Fire",
    [this.enum.Water]: "Water",
    [this.enum.Grass]: "Grass",
    [this.enum.Electric]: "Electric",
    [this.enum.Ice]: "Ice",
    [this.enum.Fighting]: "Fighting",
    [this.enum.Poison]: "Poison",
    [this.enum.Ground]: "Ground",
    [this.enum.Flying]: "Flying",
    [this.enum.Psychic]: "Psychic",
    [this.enum.Bug]: "Bug",
    [this.enum.Rock]: "Rock",
    [this.enum.Ghost]: "Ghost",
    [this.enum.Dragon]: "Dragon",
    [this.enum.Dark]: "Dark",
    [this.enum.Steel]: "Steel",
    [this.enum.Fairy]: "Fairy",
  } as any;

  public static colors = {
    [this.enum.Normal]: "#A8A77A",
    [this.enum.Fire]: "#EE8130",
    [this.enum.Water]: "#6390F0",
    [this.enum.Grass]: "#7AC74C",
    [this.enum.Electric]: "#F7D02C",
    [this.enum.Ice]: "#96D9D6",
    [this.enum.Fighting]: "#C22E28",
    [this.enum.Poison]: "#A33EA1",
    [this.enum.Ground]: "#E2BF65",
    [this.enum.Flying]: "#A98FF3",
    [this.enum.Psychic]: "#F95587",
    [this.enum.Bug]: "#A6B91A",
    [this.enum.Rock]: "#B6A136",
    [this.enum.Ghost]: "#735797",
    [this.enum.Dragon]: "#6F35FC",
    [this.enum.Dark]: "#705746",
    [this.enum.Steel]: "#B7B7CE",
    [this.enum.Fairy]: "#D685AD",
  } as any;

  public static values = Object.values(this.enum);
  public static getLabel(value: string): string {
    return this.label[value];
  }
  public static getColor(value: string): string {
    return this.colors[value];
  }
}
