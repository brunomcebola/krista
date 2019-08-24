function masterKeyCipher(word) {
    let new_word = '';
    for(let i=0;i<word.length; i++){
        switch(word[i].toLowerCase()){
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
        if(!match){new_word+=word[i];}
    }
    return(new_word);
}

function numberJumperCipher(word) {
    let new_word = '';
    let table = ['a','d','g','j','m','p','s','v','y','z'];
    for(let i=0;i<word.length;i++){
        if(isNaN(word[i])){new_word+=word[i];}
        else{new_word+=table[word[i]];}       
    }
    return(new_word);
}

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
        for(let index1=0;index1<table.length;index1++){
            for(let index2=0;index2<table[index1].length;index2++){
                if(word[i]===table[index1][index2]){
                    new_word+=String.fromCharCode(97+index2)+index1.toString();
                    match = true;
                } 
            }
        }
        if(!match){new_word+=word[i];}
    }
    return(new_word);
}



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
        if(!word[i].match(/^[0-9a-z]+$/)){new_word+=word[i];}
        else{
            index = i++;
            new_word+=table[Number(word[i])][word.charCodeAt(index)-97]
        }
    }
    return(new_word);
}

function numberJumperDecipher(word) {
    let new_word = '';
    let table = ['a','d','g','j','m','p','s','v','y','z'];
    for(let i=0;i<word.length;i++){
        if(!word[i].match(/^[a-z]+$/)){new_word+=word[i];}
        else{new_word+=table.indexOf(word[i]).toString();}       
    }
    return(new_word);
}

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
        if(isNaN(word[i])){new_word+=word[i];}
        else{new_word+=table[word[i]][word[++i]];}
    }
    return(new_word);
}



export function cipher(word) {
    return navyCipher(numberJumperCipher(dataCipher(masterKeyCipher(word))))
}

export function decipher(word) {
    return masterKeyCipher(dataDecipher(numberJumperDecipher(navyDecipher(word))))
}

export function compareCipher(word1, word2) {
    return(word1===cipher(word2))
}