export class EncuestaData {
    private preguntas: string[] = ['Pregunta 1', 'Pregunta 2', 'Pregunta 3', 'Pregunta 4'];
    private valores: number[] = [1, 2, 1, 2];

    constructor() {}

    getDataEncuesta () {
        return [
            { data: this.valores, label: 'Preguntas' } 
        ]
    }

    incrementarValor ( pregunta: number, valor: number ) {
        this.valores[pregunta] += valor;
        return this.getDataEncuesta();
    }
}