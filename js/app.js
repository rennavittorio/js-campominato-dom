//recupero elementi da DOM per input user + variabili per functions
let playBtnElement = document.querySelector('.play-btn');
let userLevelElement = document.getElementById('levelSelection');
let gameFieldElement;
let cellsNum = 0;
let bombList = [];
let pointsCount = 0;

playBtnElement.addEventListener('click', function(){
    //recupero input utente
    let userLevelInput = userLevelElement.value;
    console.log('level', userLevelInput);
    
    if (userLevelInput === 'default'){
        alert('please insert all data')
    
    } else {
        let sideLenght = setSideLength(userLevelInput);
        cellsNum = sideLenght * sideLenght;
        
        let bombPercent = setBombPercent(userLevelInput, cellsNum);

        generateGameField(userLevelInput, cellsNum);

        bombList = randomUniqueIndexesList(cellsNum, bombPercent);
        console.log('bomblist', bombList);
        bombList.sort((a,b)=>a-b);
        console.log('bomblist sorted', bombList);
        
        gameFieldElement = document.querySelector('.game-grid');
        console.log(gameFieldElement);

        gameFieldElement.addEventListener('click', onClick)

    }

})





//FUNZIONI
//genero un numero random di indici rispetto a range num caselle e livello scelto
//serve per prendere randomicamente le caselle a cui assegnare la BOMBA
function randomUniqueIndexesList(cellsRange, levelOutputRange) {

    let arr = [] //creo un array con tutti i num da 1 a range
    for (let i = 1; i <= cellsRange; i++) { //parto da zero perché l'output è una lista di indici
        arr.push(i)
    }
    console.log('initial arr', arr)

    let result = [];
    
    for (let i = 1; i <= levelOutputRange; i++) {
        const random = Math.floor(Math.random() * (cellsRange - i));
        //riducendo il range ad ogni iterazione
        //alla fine andrà a prendere sempre tra i primi numeri fino al primo
        //che saranno sempre diversi
        result.push(arr[random]);
        arr[random] = arr[cellsRange - i];
    }
    
    return result;
}


function generateGameField (userInput, cellsNum){     

    let sideLenght = setSideLength(userInput);

    let gridElement = document.querySelector('.game-grid') //recupero elemento griglia dal dom
    let pointerFieldElement = document.querySelector('.pointer');
    let winConElement = document.querySelector('.win-condition');
    //resetta campo ad ogni click
    gridElement.innerHTML = ``; 
    pointerFieldElement.innerHTML = ``;
    winConElement.innerHTML = ``;
    
    //creo la griglia dinamica
    for (let i = 0; i < cellsNum; i++){
        let num = i + 1;
    
        //creo l'elemento
        const cell = `
                        <div class="cell cell-${num}" style="width: calc(100% / ${sideLenght})">
                            ${num}
                        </div>
                    ` 
    
        gridElement.innerHTML += cell; //lo inserisco nel DOM
    }


}

//set sideLength
function setSideLength (userInput){
    let sideLenght = 0;
    if (userInput === 'easy'){
        sideLenght = 7;
    } else if (userInput === 'medium'){
        sideLenght = 9;
    } else if (userInput === 'hard') {
        sideLenght = 10;
    }
    
    return sideLenght;
}

//set bomb percent
function setBombPercent (userInput, cellsNum){
    let levelOutput = 0;
    if (userInput === 'easy'){
        levelOutput = Math.round((cellsNum / 100) * 25); //3
    } else if (userInput === 'medium'){
        levelOutput = Math.round((cellsNum / 100) * 50); //5
    } else if (userInput === 'hard') {
        levelOutput = Math.round((cellsNum / 100) * 75); //8
    }
    
    return levelOutput;
}


//funzione click casella
function onClick(){
    let cell = event.target;
    let cellName = parseInt(cell.innerHTML);
    let pointerFieldElement = document.querySelector('.pointer');

    let winCondition = cellsNum - bombList.length;
    console.log('my win con is', winCondition);
    
    let winConElement = document.querySelector('.win-condition');

    if (bombList.includes(cellName)){ //GAME OVER
        cell.classList.add('bomb')
        console.log('boom', cellName);
        gameFieldElement.removeEventListener('click', onClick);

        pointerFieldElement.classList.add('t-red');
        winConElement.classList.remove('d-none');
        winConElement.classList.add('d-block', 't-red');
        winConElement.innerHTML = 'YOU LOSE';

    } else if (pointsCount < winCondition) {
        pointsCount++;
        console.log('points', pointsCount);

        cell.classList.add('active');

        pointerFieldElement.classList.remove('d-none');
        pointerFieldElement.classList.add('d-block');
        pointerFieldElement.innerHTML = `your current point is: ${pointsCount}`; 


    } else if (pointsCount === winCondition) {
        pointerFieldElement.classList.add('t-green');
        winConElement.classList.remove('d-none');
        winConElement.classList.add('d-block', 't-green');
        winConElement.innerHTML = 'YOU WIN';

        gameFieldElement.removeEventListener('click', onClick);
        
    }


}