
var ImpressaoCarteirinha = (function () {
    var $button = null;
    var $carteirinha = null;

    function init() {
        configurarModal(function () {
            registerHandlers();
            var documentoForm = DocumentoVisualizacaoForm.retornaDocumento();

            if (DocumentoVisualizacaoForm.estouEditando() && !documentoForm.rascunho) {
                renderButtonImpressao();
            }
        });
    }

    function configurarModal(callback) {
        $carteirinha = $(window.document).find('#js-modalCarteirinhaModel').clone();

        //$(window.document).find("#js-modalCarteirinhaModel").remove();
        $(window.document).find('#js-modalCarteirinha').remove();

        $carteirinha.attr('id', 'js-modalCarteirinha');
        $(window.document).find('body').append($carteirinha);

        setTimeout(callback, 500);
    }

    function registerHandlers() {
        $carteirinha.on('shown.bs.modal', onShownModal);
        $carteirinha.on('hidden.bs.modal', onHiddenModal);
    }

    function renderButtonImpressao() {
        var $anchor = $('<a/>');
        $anchor.addClass('btn btn-sm blue js-exibirModalCarteirinha');
        $anchor.css('margin-left', 30);
        $anchor.html('Imprimir Carteirinha');
        $anchor.attr('href', 'javascript:;');

        $(window.document).find('.botoes').find('.js-exibirModalCarteirinha').remove();
        $(window.document).find('.botoes').append($anchor);
        var grupoUsuario = Ecm.retornaUsuario();
        if (
            (grupoUsuario.gruposId.includes(62) ||
                grupoUsuario.gruposId.includes(66) ||
                grupoUsuario.gruposId.includes(67)) &&
            DocumentoVisualizacaoForm.estouEditando()
        ) {
            $('.processo-acao').hide();
            $('.salvar').show();
        }
        $anchor.on('click', imprimirCarteirinha);
    }

    function imprimirCarteirinha(event) {
        $button = $(this);

        var urlApiAuth = '';
        var origem = window.location.origin;
        var partesUrl = window.location.href.split('/');
        urlApiAuth = origem + '/' + partesUrl[3] + '/api/auth/';

        EcmApi.init(urlApiAuth);

        var anexoId,
            versaoId = DocumentoVisualizacaoForm.versaoId(),
            tipoAnexoId = 5,
            urlAnexoId = `anexos/ultimoAnexoInserido/idVersaoDocumento/${versaoId}/idTipoAnexo/${tipoAnexoId}`;

        Ecm.Api2.Get(urlAnexoId).done(function (retorno) {
            if (retorno) {
                anexoId = retorno.objeto;

                var anexos = $(document.body).find('.listagemAnexos .arquivo'),
                    $arquivo = _.head(_.filter(anexos, { id: `anexo-${anexoId}` }));

                if (!$arquivo) {
                    return;
                }

                if (anexoId) {
                    $button.attr('disabled', true);
                    carregarDadosCarteirinha();

                    retornarAnexo(anexoId, function (imagem, retorno) {
                        var params = {
                            'numero-rgp': $carteirinha.find('#ddlCategoria').text(),
                            nome: $carteirinha.find('#txtNome').val(),
                            'primeiro-numero-rgp': $carteirinha.find('.js-numeroPrimeiroRGP').text(),
                            'primeiro-registro': $carteirinha.find('.js-dataPrimeiroRegistro').text(),
                            cpf: $carteirinha.find('#txtCpf').val()
                        };

                        gerarQrCode($carteirinha, params, function () {
                            var reader = new FileReader();
                            reader.readAsDataURL(retorno.response);

                            reader.onloadend = function () {
                                base64data = reader.result;

                                $carteirinha.find('.js-imageFoto').attr('src', base64data);

                                setTimeout(function () {
                                    exibirModoPrint($button);
                                }, 1000);
                            };
                        });
                    });
                }
            }
        });
    }

    function gerarQrCode($container, dadosCarteirinha, callback) {
        EcmApi.postCriptografarTexto(
            dadosCarteirinha,
            function (dados) {
                var origem = window.location.origin;
                var partesUrl = window.location.href.split('/');

                var urlEcmAsmx = origem + '/' + partesUrl[3] + '/ws/ecm.asmx/GerarQrCode';

                var dadosJson = JSON.stringify({ parametros: dados.texto });

                Ecm.ajax(
                    urlEcmAsmx,
                    dadosJson,
                    function (response) {
                        if (!Array.isArray(response)) {
                            callback();
                            return;
                        }

                        var base64 = arrayBufferToBase64(response);
                        base64 = 'data:image/png;base64,' + base64;

                        $container.find('.js-imageQrCode').attr('src', base64);
                        callback();
                    },
                    function () {
                        $button.attr('disabled', false);
                        toastr.error('Não foi possível gerar a carteirinha!');
                    }
                );
            },
            function () {
                $button.attr('disabled', false);
                toastr.error('Não foi possível gerar a carteirinha!');
            }
        );
    }

    function exibirModoPrint($this) {
        var $style = $(window.document).find('style[css-print-carteirinha]').clone();

        $('<iframe>', { name: 'printcarteirinha', class: 'printcarteirinha' })
            .appendTo('body')
            .contents()
            .find('body')
            .append($carteirinha.find('#js-formularioPescaImpressao').clone())
            .closest('html')
            .find('head')
            .append($style);

        setTimeout(function () {
            window.frames['printcarteirinha'].focus();
            window.frames['printcarteirinha'].print();
            $this.attr('disabled', false);
            $('.printcarteirinha').remove();
        }, 1000);
    }

    function carregarDadosCarteirinha() {
        setValueHtml('.js-numeroRGP', [83]);
        setValueHtml('.js-categoria', [22]);
        setValueHtml('.js-nome', [2]);
        setValueHtml('.js-documentoIdentidade', [6]);
        setValueHtml('.js-orgaoEmissorUF', [7, 42]);
        setValueHtml('.js-dataNascimento', [9]);
        setValueHtml('.js-numeroPrimeiroRGP', [84]);
        setValueHtml('.js-orgaoEmissor', [85]);
        setValueHtml('.js-dataPrimeiroRegistro', [71]);
        setValueHtml('.js-filiacao', [12, 11]);
        setValueHtml('.js-entidadeRepresentativa', [36]);
        setValueHtml('.js-uf', [38]);
        setValueHtml('.js-cpf', [1]);
        setValueHtml('.js-pisPasep', [14]);
        setValueHtml('.js-dataExpedicao', []);
    }

    function setValueHtml(target, camposIds) {
        var value = '';
        if (camposIds.length > 1) {
            for (var index in camposIds) {
                var campoId = camposIds[index];
                var txtValue = $(window.document)
                    .find('[data-campo-id="@@' + campoId + '@@"]')
                    .val();
                if (value.length > 1) {
                    if (target == '.js-filiacao') {
                        value += ' <br /> ' + txtValue;
                    } else {
                        value += ' - ' + txtValue;
                    }
                } else {
                    value = txtValue;
                }
            }
            $carteirinha.find(target).html(value);
        } else if (camposIds.length == 1) {
            var txtValue = $(window.document)
                .find('[data-campo-id="@@' + camposIds[0] + '@@"]')
                .val();
            if (target == '.js-entidadeRepresentativa') {
                if (txtValue == '') {
                    txtValue = 'Pescador não filiado.';
                }
            }
            if (target == '.js-dataPrimeiroRegistro') {
                var idTipoRegistro = 95;
                var tipoRegistro = $(window.document)
                    .find('[data-campo-id="@@' + idTipoRegistro + '@@"]')
                    .val();
                if (tipoRegistro == 'REGISTRO-COM-PROTOCOLO') {
                    var idDataProtocolo = 96;
                    txtValue = $(window.document)
                        .find('[data-campo-id="@@' + idDataProtocolo + '@@"]')
                        .val();
                }
                if (tipoRegistro == 'REGISTRO-INICIAL') {
                    txtValue = moment().format('DD/MM/YYYY');
                }
            }
            value = txtValue;
            $carteirinha.find(target).html(value);
        } else {
            value = moment().format('DD/MM/YYYY');
            $carteirinha.find(target).html(value);
        }
    }

    function onShownModal(event) {
        var $this = $(this);
        var zIndex = parseInt($this.css('z-index')) || 0;

        if ($('.modal-backdrop').length > 1) {
            $('.modal-backdrop')
                .not(':first')
                .css('z-index', zIndex + 1);
        }

        $this.css('z-index', zIndex + 2);
    }

    function onHiddenModal(event) {
        var $this = $(this);
        var zIndex = parseInt($this.css('z-index'));
        $this.css('z-index', zIndex - 2);
    }

    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;

        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        return window.btoa(binary);
    }

    return {
        init: init
    };
})();

ImpressaoCarteirinha.init();

var grupoUsuario = Ecm.retornaUsuario();
if (
    (grupoUsuario.gruposId.includes(62) ||
        grupoUsuario.gruposId.includes(66) ||
        grupoUsuario.gruposId.includes(67)) &&
    DocumentoVisualizacaoForm.estouEditando()
) {
    $('.processo-acao').hide();
    $('.salvar').show();
}
window.ImpressaoCarteirinha = ImpressaoCarteirinha;