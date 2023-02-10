//recupero elementi da DOM per input user
let playBtnElement = document.querySelector('.play-btn');
let userLevelElement = document.getElementById('levelSelection');



playBtnElement.addEventListener('click', function(){
    //recupero input utente
    let userLevelInput = userLevelElement.value;
    console.log('level', userLevelInput);
    
    if (userLevelInput === 'default'){
        alert('please insert all data')
    
    } else {

        //utilizzo gli input validi
        let sideLenght = 0;
        let cellsNum = 0; //calcolo griglia

        //creo celle
        if (userLevelInput === 'easy'){
            sideLenght = 7;
        } else if (userLevelInput === 'medium'){
            sideLenght = 9;
        } else if (userLevelInput === 'hard') {
            sideLenght = 10;
        }
        cellsNum = sideLenght * sideLenght;

        //controllo livello scelto
        let levelOutput = 0;
        if (userLevelInput === 'easy'){
            levelOutput = Math.round((cellsNum / 100) * 25); //3
        } else if (userLevelInput === 'medium'){
            levelOutput = Math.round((cellsNum / 100) * 50); //5
        } else if (userLevelInput === 'hard') {
            levelOutput = Math.round((cellsNum / 100) * 75); //8
        }
        

        let gridElement = document.querySelector('.game-grid') //recupero elemento griglia dal dom
        gridElement.innerHTML = ``; //resetta campo ad ogni click
        
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


        //genero lista indici random, DEVO RIORDINARLI
        let myRndIndexesList = randomUniqueIndexesList(cellsNum, levelOutput);
        console.log('not sorted', myRndIndexesList)
        myRndIndexesList.sort((a,b)=>a-b);
        console.log('sorted', myRndIndexesList);

        let bombList = []
        
        //genero l'evento click quando sono sulla casella
        for (let i = 0; i < cellsNum; i++){
            let cellElement = document.querySelector(`.cell-${i + 1}`);

            //assegno la classe bomb ad ogni indice rnd trovato se corrisponde all'indice delle celle
            for (let a = 0; a < myRndIndexesList.length; a++){
                if (myRndIndexesList[a] === i){
                    cellElement.classList.add('bomb');
                    bombList.push(cellElement);
                }

            }

            //aggiungo l'evento click a tutti gli elementi
            cellElement.addEventListener('click', function(){
                console.log(i + 1);
                cellElement.classList.toggle('active')

            })
            
            
        }
        
        console.log('this are my bombs', bombList);
        
        //se bomba, perdi
        for(let i = 0; i < bombList.length; i++){
            let bombElement = bombList[i];

            bombElement.addEventListener('click', function(){
                if (bombElement.classList.contains('bomb')){
                    alert('you lose');
                    gridElement.innerHTML = ``; //resetta campo ad ogni click
                }

            })

        }

    }
    
    
})





//FUNZIONI
//genero un numero random di indici rispetto a range num caselle e livello scelto
//serve per prendere randomicamente le caselle a cui assegnare la BOMBA
function randomUniqueIndexesList(cellsRange, levelOutputRange) {

    let arr = [] //creo un array con tutti i num da 1 a range
    for (let i = 0; i < cellsRange; i++) { //parto da zero perché l'output è una lista di indici
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