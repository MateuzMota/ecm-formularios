documentoAtual = doc.DocVersao.DocumentoId;
tipoRegistro = doc.Campo(int.Parse(95));
email  = doc.Campo(int.Parse(21));

anexos = new List<|int|>();

rgp = doc.Campo(int.Parse(83));
data = DateTime.Now.ToString("yyyyMMddHHmmss");
ano = int.Parse(data.Substring(0, 4));
mesAtual = int.Parse(data.Substring(4, 2));

usuario = doc.Campo("IDUSUARIOPESCADOR"); //idUsuarioPescador
doc.UsuarioId = int.Parse(usuario);

doc.EnviarEmail("TESTE FOR", "m4t3u5.m0t4@gmail.com", "Entrou no for:", false, anexos, false);

nomeDoc = "nRGP/" + ano + "-" + mesAtual + "";
doc.EnviarEmail("TESTE FOR", "m4t3u5.m0t4@gmail.com", "Criar Nome do Documento.", false, anexos, false);

documentoCriado = doc.CriarDocumento(nomeDoc, int.Parse(21), int.Parse(207632));
doc.EnviarEmail("TESTE FOR", "m4t3u5.m0t4@gmail.com", "Criar Documento.", false, anexos, false);

doc.UsarDocumento(documentoCriado);
doc.EnviarEmail("TESTE FOR", "m4t3u5.m0t4@gmail.com", "Usar Documento.", false, anexos, false);

doc.Campo("IDUSUARIOPESCADOR-REAP", usuario);
doc.EnviarEmail("TESTE FOR", "m4t3u5.m0t4@gmail.com", "Usuário ID.", false, anexos, false);

doc.Campo(int.Parse(33), tipoRegistro);
doc.EnviarEmail("TESTE FOR", "m4t3u5.m0t4@gmail.com", "Tipo de Registro.", false, anexos, false);

doc.Campo(int.Parse(36), mesAtual);
doc.EnviarEmail("TESTE FOR", "m4t3u5.m0t4@gmail.com", "Mês.", false, anexos, false);

doc.Campo(int.Parse(35), "NAO");
doc.EnviarEmail("TESTE FOR", "m4t3u5.m0t4@gmail.com", "Não.", false, anexos, false);

doc.Campo(int.Parse(37), email);
doc.EnviarEmail("TESTE FOR", "m4t3u5.m0t4@gmail.com", "E-Mail.", false, anexos, false);

doc.UsarDocumento(documentoAtual);
doc.EnviarEmail("TESTE FOR", "m4t3u5.m0t4@gmail.com", "Usar Documento Atual.", false, anexos, false);

doc.IniciarProcesso(int.Parse(documentoCriado), int.Parse(85));
doc.EnviarEmail("TESTE FOR", "m4t3u5.m0t4@gmail.com", "Iniciar Processo.", false, anexos, false);


doc.EnviarEmail("TESTE FOR", "m4t3u5.m0t4@gmail.com", "finalizou a execução do for.", false, anexos, false);

doc.EnviarEmail("TESTE RGP 2.0 - 2", "m4t3u5.m0t4@gmail.com", "Fim da execução.", false, anexos, false);