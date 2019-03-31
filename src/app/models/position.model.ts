export class Position {

    public static readonly indices: number[] = [1,2,3,4,5,6,7,8,9,10];
    public static readonly letters: string[] = ["A","B","C","D","E","F","G","H","I","J"];

    private letter:string;
    private number:number;

    constructor(pLetter:string, num:number){
        if(Position.letters.indexOf(pLetter) > -1){
            this.letter = pLetter;
        } else {
            console.error("coordinate out of the grid : "+pLetter);
            return;
        }
        if(Position.indices.indexOf(num) > -1){
            this.number = num;
        } else {
            console.error("coordinate out of the grid : "+num);
            return;
        }
    }

    getLetter(){
        return this.letter;
    }
    getNumber(){
        return this.number;
    }

    equals(position:Position){
        return ((position.getLetter() == this.letter) 
                && (position.getNumber() == this.number));
    }

    getIndices(){
        return Position.indices;
    }
    getLetters(){
        return Position.letters;
    }
}