data = DateTime.Now.ToString("yyyyMMddHHmmss");
mesAtual = int.Parse(data.Substring(4, 2));
diaAtual = int.Parse(data.Substring(7, 2));

if( (mesAtual == 2 && diaAtual == 25) ||
	(mesAtual == 4 && diaAtual == 1) ||
  	(mesAtual == 7 && diaAtual == 1) ||
    (mesAtual == 10 && diaAtual == 1)
  )
{ return true; } else { return false; }


data = DateTime.Now.ToString("yyyyMMddHHmmss");
mesAtual = data.Substring(4, 2);
diaAtual = data.Substring(7, 2);

if( (mesAtual == 1 && diaAtual == 1) ||
	(mesAtual == 4 && diaAtual == 1) ||
  	(mesAtual == 7 && diaAtual == 1) ||
    (mesAtual == 10 && diaAtual == 1)
  )
{ return false; } else { return true; }