//recupero elementi da DOM per input user + variabili per functions
let playBtnElement = document.querySelector('.play-btn');
let userLevelElement = document.getElementById('levelSelection');
let pointerFieldElement = document.querySelector('.pointer');
let winConElement = document.querySelector('.win-condition');
let mouseHammerElement = document.querySelector('.fa-hammer');

let gameFieldElement;
let cellsNum = 0;
let bombList = [];
let pointsCount = 0;

window.addEventListener('mouseover', mouseMovement);


//start game ad ogni click
playBtnElement.addEventListener('click', function(){
    //recupero input utente
    let userLevelInput = userLevelElement.value;
    console.log('level', userLevelInput);
    
    //controllo validità input
    if (userLevelInput === 'default'){
        alert('please insert all data')
    
    } else {
        //genero campo di gioco
        let sideLenght = setSideLength(userLevelInput);
        cellsNum = sideLenght * sideLenght;
        
        let bombPercent = setBombPercent(userLevelInput, cellsNum);

        generateGameField(userLevelInput, cellsNum);

        bombList = randomUniqueIndexesList(cellsNum, bombPercent);
        console.log('bomblist', bombList);
        bombList.sort((a,b)=>a-b);
        console.log('bomblist sorted', bombList);
        
        //recupero campo di gioco e aggiungo eventi al click
        gameFieldElement = document.querySelector('.game-grid');
        console.log(gameFieldElement);

        gameFieldElement.addEventListener('click', onClick);

    }

})





/********************************************************************************
********************************* FUNZIONI *************************************
********************************************************************************/
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


function generateGameField (userInput, cellsNum){     

    let sideLenght = setSideLength(userInput);

    let gridElement = document.querySelector('.game-grid') //recupero elemento griglia dal dom
    let pointerFieldElement = document.querySelector('.pointer');
    let winConElement = document.querySelector('.win-condition');

    resetGameField(gridElement, pointerFieldElement, winConElement);
    
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


//function reset game field
function resetGameField (grid, pointer, winCon){
    grid.innerHTML = ``; 
    pointer.innerHTML = ``;
    winCon.innerHTML = ``;
    pointsCount = 0;
    pointer.classList.remove('t-red', 't-green');
    winCon.classList.remove('d-block', 't-red');
}


//funzione click casella
function onClick(){
    let cell = event.target;
    let cellName = parseInt(cell.innerHTML);

    let winCondition = cellsNum - bombList.length;
    // console.log('my win con is', winCondition);

    if (bombList.includes(cellName)){ //GAME OVER
        cell.classList.add('bomb')
        console.log('boom', cellName);
        gameFieldElement.removeEventListener('click', onClick);

        pointerFieldElement.classList.add('t-red');

        winConElement.classList.remove('d-none');
        winConElement.classList.add('d-block', 't-red');
        winConElement.innerHTML = 'YOU LOSE';

    } else if (pointsCount === winCondition - 1) { //perchè deve leggermi il count prima dell'ultimo click
        pointsCount++;
        pointerFieldElement.innerHTML = `your current point is: ${pointsCount}`;
        cell.classList.add('active');

        pointerFieldElement.classList.add('t-green');

        winConElement.classList.remove('d-none');
        winConElement.classList.add('d-block', 't-green');
        winConElement.innerHTML = 'YOU WIN';

        gameFieldElement.removeEventListener('click', onClick);
        
    } else if (pointsCount < winCondition) {
        pointsCount++;
        // console.log('points', pointsCount);

        cell.classList.add('active');

        pointerFieldElement.classList.remove('d-none');
        pointerFieldElement.classList.add('d-block');
        pointerFieldElement.innerHTML = `your current point is: ${pointsCount}`; 
    }




}


//function mouseover for hammer icon
function mouseMovement (event){
    console.log(event);
    mouseHammerElement.style.top = `${event.clientY}`;
    mouseHammerElement.style.top = `${event.clientX}`;
    // hammerIcon.style.top = `${event.clientY}`;
    // hammerIcon.style.left = `${event.clientX}`;
    // console.log(event);
}