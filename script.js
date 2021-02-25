//Função para consultar campos
function consultar() {
    //Objeto com os parametros da pesquisa convertido em JSON
    var parametros = JSON.stringify({
        usuarioId: 1,
        campoIdOrder: 0,
        tipoDocumentalId: 0,//ID do tipo documental do formulario de busca
        camposPesquisar: [{
            "Id": 0,//ID do campo a ser pesquisado
            "TipoDocumentalId": 0,//ID do tipo documental do formulario de busca
            "Nome": "",//Nome opcional
            "ColunaTipo": "C",
            "Valor": "",//Valor a ser pesquisado no campo
            "Comparacao": 6
        }],
        totalDocumentosPorPagina: 1000,
        paginacaoIndiceAtual: 0,
    });
    //Função ECM de chamada AJAX (caminho, parametros em json, callback sucesso, callback erro)
    Ecm.ajax('../WS/Ecm.asmx/PesquisarOrder', parametros, function (data) {
        data = JSON.parse(data);
    },
        function (data) {
            data = JSON.parse(data);
            var $toast = toastr['error'](" ", "<i class='fa '></i>" + data.mensagem);
        });
};
{
    var parametros = JSON.stringify({
        usuarioId: 1,
        campoIdOrder: 0,
        tipoDocumentalId: 0,
        camposPesquisar: [{
            "Id": 0,
            "TipoDocumentalId": 0,
            "Nome": "",
            "ColunaTipo": "C",
            "Valor": "",
            "Comparacao": 6
        }],
        totalDocumentosPorPagina: 1000,
        paginacaoIndiceAtual: 0,
    });
    Ecm.ajax('../WS/Ecm.asmx/PesquisarOrder', parametros, function (data) {
        data = JSON.parse(data);
    },
        function (data) {
            data = JSON.parse(data);
            var $toast = toastr['error'](" ", "<i class='fa '></i>" + data.mensagem);
        });
}

//Função de upload de arquivo
DocumentoVisualizacaoForm.onUploadAnexo(function (anexoId) { },
    function (anexoId) {
        Ecm.alertWarning('Erro ao fazer upload do arquivo')
        $('.inputAnexo').val('')
    }
)

//Adicionar um botao voltar na tela
$('.cancelar').clone().off().removeClass('cancelar').addClass('buttonVoltar').show().html('Voltar').insertAfter('.cancelar')
Ecm.registraEvento('click', '.buttonVoltar', function (i, e) { $('.btn--close-right').trigger('click') })