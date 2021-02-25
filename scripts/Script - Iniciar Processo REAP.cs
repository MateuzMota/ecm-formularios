documentoAtual = doc.DocVersao.DocumentoId;
tipoRegistro = doc.Campo(int.Parse(95));
email  = doc.Campo(int.Parse(21));

rgp = doc.Campo(int.Parse(83));
data = DateTime.Now.ToString("yyyyMMddHHmmss");
ano = data.Substring(0, 4);
mesAtual = data.Substring(4, 2);

nomeDoc = rgp + "/" + ano + "-" + mesAtual;

usuario = doc.Campo("IDUSUARIOPESCADOR"); //idUsuarioPescador
doc.UsuarioId = int.Parse(usuario);

if( (mesAtual >= 1 && mesAtual <= 3) ) {
    for(i = 3; i >= mesAtual; i--) {
        documentoCriado = doc.CriarDocumento(nomeDoc, int.Parse(21), int.Parse(207632));

        if(int.Parse(documentoCriado) > 0) {
            doc.UsarDocumento(documentoCriado);
            doc.Campo("IDUSUARIOPESCADOR-REAP", usuario);
            doc.Campo(int.Parse(33), tipoRegistro);
            doc.Campo(int.Parse(36), mesAtual);
            doc.Campo(int.Parse(35), "NAO");
            doc.Campo(int.Parse(11), rgp);
            doc.Campo(int.Parse(37), email);
            doc.UsarDocumento(documentoAtual);
            doc.IniciarProcesso(int.Parse(documentoCriado), int.Parse(68));
        }
    }
}

if( (mesAtual >= 4 && mesAtual <= 6) ) {
    for(i = 6; i >= mesAtual; i--) {
        documentoCriado = doc.CriarDocumento(nomeDoc, int.Parse(21), int.Parse(207632));

        if(int.Parse(documentoCriado) > 0) {
            doc.UsarDocumento(documentoCriado);
            doc.Campo("IDUSUARIOPESCADOR-REAP", usuario);
            doc.Campo(int.Parse(33), tipoRegistro);
            doc.Campo(int.Parse(36), mesAtual);
            doc.Campo(int.Parse(35), "NAO");
            doc.Campo(int.Parse(11), rgp);
            doc.Campo(int.Parse(37), email);
            doc.UsarDocumento(documentoAtual);
            doc.IniciarProcesso(int.Parse(documentoCriado), int.Parse(68));
        }
    }
}

if( (mesAtual >= 7 && mesAtual <= 9) ) {
    for(i = 9; i >= mesAtual; i--) {
        documentoCriado = doc.CriarDocumento(nomeDoc, int.Parse(21), int.Parse(207632));

        if(int.Parse(documentoCriado) > 0) {
            doc.UsarDocumento(documentoCriado);
            doc.Campo("IDUSUARIOPESCADOR-REAP", usuario);
            doc.Campo(int.Parse(33), tipoRegistro);
            doc.Campo(int.Parse(36), mesAtual);
            doc.Campo(int.Parse(35), "NAO");
            doc.Campo(int.Parse(11), rgp);
            doc.Campo(int.Parse(37), email);
            doc.UsarDocumento(documentoAtual);
            doc.IniciarProcesso(int.Parse(documentoCriado), int.Parse(68));
        }
    }
}

if( (mesAtual >= 10 && mesAtual <= 12) ) {
    for(i = 12; i >= mesAtual; i--) {
        documentoCriado = doc.CriarDocumento(nomeDoc, int.Parse(21), int.Parse(207632));

        if(int.Parse(documentoCriado) > 0) {
            doc.UsarDocumento(documentoCriado);
            doc.Campo("IDUSUARIOPESCADOR-REAP", usuario);
            doc.Campo(int.Parse(33), tipoRegistro);
            doc.Campo(int.Parse(36), mesAtual);
            doc.Campo(int.Parse(35), "NAO");
            doc.Campo(int.Parse(11), rgp);
            doc.Campo(int.Parse(37), email);
            doc.UsarDocumento(documentoAtual);
            doc.IniciarProcesso(int.Parse(documentoCriado), int.Parse(68));
        }
    }
}


