mesAtual = 3;

if( (mesAtual >= 1 && mesAtual <= 3) ) {
    executa(mesAtual, 3);
}

if( (mesAtual >= 4 && mesAtual <= 6) ) {
    executa(mesAtual, 6);
}

if( (mesAtual >= 7 && mesAtual <= 9) ) {
    executa(mesAtual, 9);
}

if( (mesAtual >= 10 && mesAtual <= 12) ) {
    executa(mesAtual, 12);
}

function executa(mesAtual, b) {
    for(let i = b; i >= mesAtual; i--) {
        console.log(i);
    }
}