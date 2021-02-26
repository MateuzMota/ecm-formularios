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
documentoCriado = doc.CriarDocumento(nomeDoc, int.Parse(21), int.Parse(207632));


doc.UsarDocumento(documentoCriado);
doc.Campo("IDUSUARIOPESCADOR-REAP", usuario);
doc.Campo("MES-REFERENCIA", mesAtual);
doc.Campo("ANO-REFERENCIA", ano);
doc.Campo("RGP-PESCADOR", rgp);
doc.UsarDocumento(documentoAtual);
doc.IniciarProcesso(int.Parse(documentoCriado), int.Parse(85));
