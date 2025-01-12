export class Pokeball {
  public static enum = {
    Pokeball: 1,
    GreatBall: 2,
    UltraBall: 3,
  } as const;
  public static label = {
    [this.enum.Pokeball]: "Pokeball",
    [this.enum.GreatBall]: "GreatBall",
    [this.enum.UltraBall]: "UltraBall",
  } as any;
  public static etherPrice = {
    [this.enum.Pokeball]: 0.001,
    [this.enum.GreatBall]: 0.002,
    [this.enum.UltraBall]: 0.005,
  } as any;
  public static values = Object.values(this.enum);
  public static getLabel(value: number): string {
    return this.label[value];
  }
  public static getEtherPrice(value: number): number {
    return this.etherPrice[value];
  }
}
