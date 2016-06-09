export class Hero {
  constructor(
    public id:number, 
    public name:string) { }
}

export const HEROES  = [
    new Hero(1, 'Windstorm'),
    new Hero(13, 'Bombasto'),
    new Hero(15, 'Magneta'),
    new Hero(20, 'Tornado')
  ]
