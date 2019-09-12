//encripta/desencripta a palavra passada com base numa palavra-chave
function masterKeyCipher(word) {
    let new_word = '';
    for(let i=0;i<word.length; i++){
        switch(word[i].toLowerCase()){
            //troca as letras
            case 'a':new_word+='x';break;
            case 'b':new_word+='y';break;
            case 'c':new_word+='z';break;
            case 'd':new_word+='0';break;
            case 'e':new_word+='1';break;
            case 'f':new_word+='2';break;
            case 'g':new_word+='3';break;
            case 'h':new_word+='4';break;
            case 'i':new_word+='u';break;
            case 'j':new_word+='5';break;
            case 'k':new_word+='p';break;
            case 'l':new_word+='6';break;
            case 'm':new_word+='7';break;
            case 'n':new_word+='8';break;
            case 'o':new_word+='9';break;
            case 'p':new_word+='k';break;
            case 'q':new_word+='r';break;
            case 'r':new_word+='q';break;
            case 's':new_word+='v';break;
            case 't':new_word+='w';break;
            case 'u':new_word+='i';break;
            case 'v':new_word+='s';break;
            case 'w':new_word+='t';break;
            case 'x':new_word+='a';break;
            case 'y':new_word+='b';break;
            case 'z':new_word+='c';break;
            case '0':new_word+='d';break;
            case '1':new_word+='e';break;
            case '2':new_word+='f';break;
            case '3':new_word+='g';break;
            case '4':new_word+='h';break;
            case '5':new_word+='j';break;
            case '6':new_word+='l';break;
            case '7':new_word+='m';break;
            case '8':new_word+='n';break;
            case '9':new_word+='o';break;
            default:new_word+=word[i];
        }
    }    
    return(new_word);
}


//encripta a palavra passada com base numa data
function dataCipher(word) {
    let new_word = '';
    let match = false;
    let table = [
        ['k','l','m','n','o','p','q','r','s','t'],
        ['u','v','w','x','y','z','0','1','2','3'],
        ['a','b','c','d','e','f','g','h','i','j'],
        [],[],[],[],[],[],
        ['4','5','6','7','8','9']
    ]
    //passa cada letra/numero para um conjunto de 2 numeros
    for(let i=0;i<word.length;i++){
        match = false
        for(let index1=0;index1<table.length;index1++){
            for(let index2=0;index2<table[index1].length;index2++){
                if(word[i]===table[index1][index2]){
                    new_word+=index1.toString()+index2.toString();
                    match = true;
                } 
            }
        }
        //se nao for letra/numero mantem o caracter
        if(!match){new_word+=word[i];}
    }
    return(new_word);
}

//encripta a palavra passada trocando os numeros por letras
function numberJumperCipher(word) {
    let new_word = '';
    let table = ['a','d','g','j','m','p','s','v','y','z'];
    for(let i=0;i<word.length;i++){
        //se não for um numero, mantem o caracter
        if(isNaN(word[i])){new_word+=word[i];}
        //obtem a letra no index correspondente ao numero
        else{new_word+=table[word[i]];}       
    }
    return(new_word);
}

//encripta a palavra passada com coordenadas
function navyCipher(word) {
    let new_word = '';
    let match = false;
    let table = [
        ['m','n','o','p','q'],
        ['r','s','t','u','v'],
        ['w','x','y','z','a'],
        ['b','c','d','e','f'],
        ['g','h','i','j','k']
    ]
    for(let i=0;i<word.length;i++){
        match = false;
        //passa cada letra para um conjunto de coordenadas
        for(let index1=0;index1<table.length;index1++){
            for(let index2=0;index2<table[index1].length;index2++){
                if(word[i]===table[index1][index2]){
                    new_word+=String.fromCharCode(97+index2)+index1.toString();
                    match = true;
                } 
            }
        }
        //se não for uma letra, mantem o caracter
        if(!match){new_word+=word[i];}
    }
    return(new_word);
}


//desencripta a palavra passada com base nas coordenadas
function navyDecipher(word) {
    let new_word = '';
    let index;
    let table = [
        ['m','n','o','p','q'],
        ['r','s','t','u','v'],
        ['w','x','y','z','a'],
        ['b','c','d','e','f'],
        ['g','h','i','j','k']
    ]
    for(let i=0;i<word.length;i++){
        //se não for uma coordenada, mantem o caracter
        if(!word[i].match(/^[0-9a-z]+$/)){new_word+=word[i];}
        //obtem a letra correspondente à coordenada
        else{
            index = i++;
            new_word+=table[Number(word[i])][word.charCodeAt(index)-97]
        }
    }
    return(new_word);
}

//desencripta a palavra passada trocando as letras por numeros
function numberJumperDecipher(word) {
    let new_word = '';
    let table = ['a','d','g','j','m','p','s','v','y','z'];
    for(let i=0;i<word.length;i++){
        //se não for uma letra, mantem o caracter
        if(!word[i].match(/^[a-z]+$/)){new_word+=word[i];}
        //substitui a letra pelo index da sua posição
        else{new_word+=table.indexOf(word[i]).toString();}       
    }
    return(new_word);
}

//desencripta a palavra passada com base numa data
function dataDecipher(word) {
    let new_word = '';
    let table = [
        ['k','l','m','n','o','p','q','r','s','t'],
        ['u','v','w','x','y','z','0','1','2','3'],
        ['a','b','c','d','e','f','g','h','i','j'],
        [],[],[],[],[],[],
        ['4','5','6','7','8','9']
    ]
    for(let i=0;i<word.length;i++){
        //se não for um numero, mantem o caracter
        if(isNaN(word[i])){new_word+=word[i];}
        //obtem a letra na posição indica por 2 numeros conseguintes
        else{new_word+=table[word[i]][word[++i]];}
    }
    return(new_word);
}


//aplica as várias funções e encripta a palavra passada
export function cipher(word) {
    return navyCipher(numberJumperCipher(dataCipher(masterKeyCipher(word))))
}

//aplica as várias funções e desencripta a palavra passada
export function decipher(word) {
    return masterKeyCipher(dataDecipher(numberJumperDecipher(navyDecipher(word))))
}

//aplica a função de cifragem e confirma se word1 combina com word2
export function compareCipher(word1, word2) {
    return(word1===cipher(word2))
}