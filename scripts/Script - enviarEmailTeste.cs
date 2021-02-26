usuario = doc.Campo("IDUSUARIOPESCADOR");
doc.UsuarioId = int.Parse(usuario);

documentoAtual = doc.DocVersao.DocumentoId;
tipoRegistro = doc.Campo(int.Parse(95));
email  = doc.Campo(int.Parse(21));

rgp = doc.Campo(int.Parse(83));
data = DateTime.Now.ToString("yyyyMMddHHmmss");
ano = int.Parse(data.Substring(0, 4));
mesAtual = int.Parse(data.Substring(4, 2));

anexos = new List<|int|>();
doc.EnviarEmail("TESTE RGP 2.0", "m4t3u5.m0t4@gmail.com", "Funcionando! UserID: " + usuario + "Documento Aual: " + documentoAtual + "Tipo Registro: " + tipoRegistro + "E-mail: " + email + "RGP: " + rgp + "Data: " + data + "Mês Atual: " + mesAtual + "Ano: " + ano + ".", false, anexos, false);