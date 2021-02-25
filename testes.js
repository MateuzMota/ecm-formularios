$(document).ready(function () {
    //remove barra do final para garantir funcionamento da chamada da API;
    var urlBase = window.location.href;
    if (urlBase.substr(urlBase.length - 1) === '/') {
        urlBase = urlBase.substring(0, urlBase.length - 1);
    }

    var api = $('#api').val(),
        credenciais = {
            usuario: $('#texto').val(),
            senha: $('#usuario').val(),
        },
        token = '';

    $('#GrupoTrabalho').val('').trigger('change');

    retornarToken();
    DesativaCampos();
    Mascaras();

    var cpfValido = true;
    var emailValido = true;
    var cnpjValido = true;


    function retornarToken() {
        $.post(api + '/auth/token', credenciais, function (data) {
            token = data;
            $('#tokenApi').val(data.token);
        });
    }

    function retornaUsuarioDTO(form) {
        $.post(urlBase + '/Home/RetornaUsuarioDTO', form, function (data) {
            criaUsuario(data, form);
        })
            .done(function () { })
            .fail(function () { });
    }

    function retornaDoumentoDTO(form) {
        $.post(urlBase + '/Home/RetornaDocumentoDTO', form, function (data) {
            criaDocumento(data, form);
        })
            .done(function () { })
            .fail(function () { });
    }

    function RetornaCheckUsuarioDTO(form) {
        $.post(urlBase + '/Home/RetornaCheckUsuarioDTO', form, function (data) {
            var mensagem = data;

            if (data.length == 1) {
                erroValidacao(mensagem);
            } else {
                existeUsuario(data, form);
            }
        })
            .done(function () { })
            .fail(function () { });
    }

    function usuarioExiste(usuario) {
        $.post(urlBase + '/Home/AvisoUsuarioExistente', usuario, function (resp) {
            var content = $(resp).find('main');
            $('#divCarregando').fadeOut('slow');
            $('#divPrint').empty().append(content.get(0).outerHTML);
            //var html = document.open("text/html", "replace");
            //html.write(resp);
            //html.close();
        })
            .done(function () { })
            .fail(function () { });
    }

    function erro(request) {
        $.post(urlBase + '/Home/ErrorApi', { msgEx: request.statusText }, function (resp) {
            var content = $(resp).find('main');
            $('#divCarregando').fadeOut('slow');
            $('#divPrint').empty().append(content.get(0).outerHTML);
        })
            .done(function () { })
            .fail(function () { });
    }

    function erroValidacao(mensagem) {
        $.post(urlBase + '/Home/ValidacaoDados', { msgEx: mensagem }, function (resp) {
            var content = $(resp).find('main');
            $('#divCarregando').fadeOut('slow');
            $('#divPrint').empty().append(content.get(0).outerHTML);
        })
            .done(function () { })
            .fail(function () { });
    }

    function sucesso(form) {
        $.post(urlBase + '/Home/Sucesso', form, function (resp) {
            var content = $(resp).find('main');
            $('#divCarregando').fadeOut('slow');
            $('#divPrint').empty().append(content.get(0).outerHTML);
        })
            .done(function () { })
            .fail(function () { });
    }

    function existeUsuario(usuario, form) {
        $.ajax({
            url: api + '/v2/documentos/pesquisar/18/quantidade/1/retornarAnexos/false',
            headers: {
                Authorization: `Bearer ${token.token}`,
            },
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(usuario),
            success: function (retorno, request) {
                if (!retorno) {
                    retornaUsuarioDTO(form);
                } else {
                    //tela de usuario existente
                    usuarioExiste(retorno[0]);
                }
            },
            error: function (request) {
                if (request.status == 404) {
                    retornaUsuarioDTO(form);
                } else {
                    erro(request);
                }
            },
        });
    }

    function criaUsuario(usuario, form) {
        console.log(usuario);
        $.ajax({
            url: api + '/v2/usuarios',
            headers: {
                Authorization: `Bearer ${token.token}`,
            },
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: usuario,
            success: function (data) {
                retornaDoumentoDTO(form);
            },
            error: function (request) {
                erro(request);
            },
        });
    }

    function criaDocumento(documento, form) {
        $.ajax({
            url: api + '/v2/documentos?pastaId=159975&tipoDocumentoId=18',
            headers: {
                Authorization: `Bearer ${token.token}`,
            },
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(documento),
            success: function (data) {
                iniciaProcesso(data.documentoId, form);
            },
            error: function (request) {
                erro(request);
            },
        });
    }

    function iniciaProcesso(documentoId, form) {
        $.ajax({
            url: api + '/v2/processos/36/documentos/' + documentoId + '/iniciar',
            headers: {
                Authorization: `Bearer ${token.token}`,
            },
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: '',
            success: function (data) {
                sucesso(form);
            },
            error: function (request) {
                erro(request);
            },
        });
    }

    function notificaTIE(tie) {
        setTimeout(function () {
            if ($(tie).val().length != 10) {
                $('#TIE-error').remove();
                $('#TIE').removeClass('valid').addClass('input-validation-error');
                $('#TIE').attr('aria-describedby="TIE-error"');
                $('#TIE').attr('aria-invalid="true"');
                $('span[data-valmsg-for*="TIE"]').append('<span id="TIE-error" class="">TIE Inválido</span>');
                $('#salvar').hide();
                $('#notifiqueTIE').text('Por favor confira o campo TIE: TIE inválido.').show();
                tieValido = false;
                $('#TIE').val('');
            } else {
                $('#TIE-error').remove();
                $('#TIE').removeClass('input-validation-error');
                $('#notifiqueTIE').text('').hide();
                $('#salvar').show();
                tieValido = true;
            }
        }, 300);
    }

    function notificaCPF(cpf) {
        setTimeout(function () {
            if (cpf.length == 11) {
                if (!validaCPF(cpf)) {
                    $('#CPF-error').remove();
                    $('#CPF').removeClass('valid').addClass('input-validation-error');
                    $('#CPF').attr('aria-describedby="CPF-error"');
                    $('#CPF').attr('aria-invalid="true"');
                    $('span[data-valmsg-for*="CPF"]').append('<span id="CPF-error" class="">CPF Inválido</span>');
                    $('#salvar').hide();
                    $('#notifiqueCPF').text('Por favor confira o campo CPF: CPF inválido.').show();
                    cpfValido = false;
                } else {
                    $('#CPF').removeClass('input-validation-error');
                    $('#notifiqueCPF').text('').hide();
                    cpfValido = true;
                }

                if (cpfValido && cnpjValido && emailValido) {
                    $('#salvar').show();
                }
            }
        }, 300);
    }

    function notificaCNPJ(cnpj) {
        setTimeout(function () {
            if (cnpj.length == 14) {
                if (!validarCNPJ(cnpj)) {
                    $('#CNPJ-error').remove();
                    $('#CNPJ').removeClass('valid').addClass('input-validation-error');
                    $('#CNPJ').attr('aria-describedby="CPF-error"');
                    $('#CNPJ').attr('aria-invalid="true"');
                    $('span[data-valmsg-for*="CNPJ"]').append('<span id="CPF-error" class="">CNPJ Inválido</span>');
                    $('#salvar').hide();
                    $('#notifiqueCNPJ').text('Por favor confira o campo CNPJ: CNPJ inválido.').show();
                    cnpjValido = false;
                } else {
                    $('#CNPJ').removeClass('input-validation-error');
                    $('#notifiqueCNPJ').text('').hide();
                    cnpjValido = true;
                }

                if (cpfValido && cnpjValido && emailValido) {
                    $('#salvar').show();
                }
            }
        }, 500);
    }

    function notificaEmail(email) {
        setTimeout(function () {
            if (email != '' && email) {
                var valido = validaEmail(email);
                if (!valido) {
                    $('#Email-error').remove();
                    $('#Email').removeClass('valid').addClass('input-validation-error');
                    $('#Email').attr('aria-describedby="CPF-error"');
                    $('#Email').attr('aria-invalid="true"');
                    $('span[data-valmsg-for*="Email"]').append('<span id="Email-error" class="">E-mail Inválido</span>');
                    $('#salvar').hide();
                    $('#notifiqueEmail').text('Por favor confira o campo E-mail: E-mail inválido.').show();
                    emailValido = false;
                } else {
                    $('#Email').removeClass('input-validation-error');
                    $('#notifiqueEmail').text('').hide();
                    emailValido = true;
                }

                if (cpfValido && cnpjValido && emailValido) {
                    $('#salvar').show();
                }
            }
        }, 300);
    }

    function validaEmail(email) {
        var dominio = email.split('@');
        var grupoTrabalho = $('#GrupoTrabalho').val();
        if (dominio.length >= 2) {
            if (grupoTrabalho == '5') {
                var gov = dominio[1].split('.');
                if (gov[1] == 'gov' && gov[2] == 'br') {
                    return true;
                }
                return false;
            } else {
                var dom = dominio[1].split('.');
                if (dom.length >= 2) {
                    return true;
                }
                return false;
            }
        }
        return false;
    }

    function validaCPF(cpf) {
        var numeros, digitos, soma, i, resultado, digitos_iguais;
        digitos_iguais = 1;
        if (cpf.length < 11) return false;
        for (i = 0; i < cpf.length - 1; i++)
            if (cpf.charAt(i) != cpf.charAt(i + 1)) {
                digitos_iguais = 0;
                break;
            }
        if (!digitos_iguais) {
            numeros = cpf.substring(0, 9);
            digitos = cpf.substring(9);
            soma = 0;
            for (i = 10; i > 1; i--) soma += numeros.charAt(10 - i) * i;
            resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
            if (resultado != digitos.charAt(0)) return false;
            numeros = cpf.substring(0, 10);
            soma = 0;
            for (i = 11; i > 1; i--) soma += numeros.charAt(11 - i) * i;
            resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
            if (resultado != digitos.charAt(1)) return false;
            return true;
        } else return false;
    }

    function validarCNPJ(cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj == '') return false;

        if (cnpj.length != 14) return false;

        // Elimina CNPJs invalidos conhecidos
        if (
            cnpj == '00000000000000' ||
            cnpj == '11111111111111' ||
            cnpj == '22222222222222' ||
            cnpj == '33333333333333' ||
            cnpj == '44444444444444' ||
            cnpj == '55555555555555' ||
            cnpj == '66666666666666' ||
            cnpj == '77777777777777' ||
            cnpj == '88888888888888' ||
            cnpj == '99999999999999'
        )
            return false;

        // Valida DVs
        tamanho = cnpj.length - 2;
        numeros = cnpj.substring(0, tamanho);
        digitos = cnpj.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(0)) return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(1)) return false;

        return true;
    }

    function DesativaCampos() {
        $('#CNPJ').closest('div.col-md-4').css('display', 'none');
        $('#CNPJ').val('');
        $('#RazaoSocial').closest('div.col-md-4').css('display', 'none');
        $('#CPF').closest('div.col-md-4').css('display', 'none');
        $('#CPF').val('');
        $('#CPF').siblings('label').text('CPF');
        $('#NomeEmbarcacao').closest('div.col-md-4').css('display', 'none');
        $('#NumeroRGP').closest('div.col-md-4').css('display', 'none');
        $('#NumeroRGP').val('');
        if ($('#EmContrucao').val() === '2' || $('#EmContrucao').val() === '') {
            $('#TIE').closest('div.col-md-4').css('display', 'none');
        } else {
            $('#TIE').closest('div.col-md-4').css('display', 'block');
        }
        $('#TIE').val('');
        $('#EmContrucao').closest('div.col-md-4').css('display', 'none');
        $('#TipoPessoa').closest('div.col-md-4').css('display', 'none');
        $('#Lotacao').closest('div.col-md-4').css('display', 'none');
        $('#Matricula').closest('div.col-md-4').css('display', 'none');
        $('#Formulario').closest('div.col-md-4').css('display', 'none');
        $('#NumeroSif').closest('div.col-md-4').css('display', 'none');
        emailValido = true;
        cnpjValido = true;
        cpfValido = true;
        MoverDivEmail(false);
    }

    function AtivaCamposEntidadeColaborativa() {
        $('#CNPJ').closest('div.col-md-4').css('display', 'block');
        $('#RazaoSocial').closest('div.col-md-4').css('display', 'block');
        $('#TIE').closest('div.col-md-4').css('display', 'none');
    }

    function AtivaCamposPescador() {
        $('#CPF').closest('div.col-md-4').css('display', 'block');
        $('#TIE').closest('div.col-md-4').css('display', 'none');
    }

    function AtivaCamposServidor() {
        $('#CPF').closest('div.col-md-4').css('display', 'block');
        $('#Lotacao').closest('div.col-md-4').css('display', 'block');
        $('#Matricula').closest('div.col-md-4').css('display', 'block');
        $('#TIE').closest('div.col-md-4').css('display', 'none');
    }

    function AtivaCamposEmbarcacao() {
        $('#NomeEmbarcacao').closest('div.col-md-4').css('display', 'block');
        //$("#CPF").closest("div.col-md-4").css("display", "block");
        $('#NumeroRGP').closest('div.col-md-4').css('display', 'block');
        if ($('#EmContrucao').val() === '2' || $('#EmContrucao').val() === '') {
            $('#TIE').closest('div.col-md-4').css('display', 'none');
        } else {
            $('#TIE').closest('div.col-md-4').css('display', 'block');
        }
        $('#EmContrucao').closest('div.col-md-4').css('display', 'block');
        $('#TipoPessoa').closest('div.col-md-4').css('display', 'block');
    }

    function AtivaCamposEmpresaRastreadora() {
        $('#CPF').closest('div.col-md-4').css('display', 'block');
        $('#CNPJ').closest('div.col-md-4').css('display', 'block');
        $('#RazaoSocial').closest('div.col-md-4').css('display', 'block');
        $('#TIE').closest('div.col-md-4').css('display', 'none');
    }

    function AtivaCamposPescadorAmador() {
        $('#CPF').closest('div.col-md-4').css('display', 'block');
        $('#TIE').closest('div.col-md-4').css('display', 'none');
    }

    function AtivaCamposSisTainha() {
        $('#NomeEmbarcacao').closest('div.col-md-4').css('display', 'block');
        $('#NumeroRGP').closest('div.col-md-4').css('display', 'block');
        $('#TIE').closest('div.col-md-4').css('display', 'block');
        $('#TipoPessoa').closest('div.col-md-4').css('display', 'block');
        $('#Formulario').closest('div.col-md-4').css('display', 'block');
        $('#Formulario').trigger('change');
    }

    function AtivaCamposMapaBordo() {
        $('#NomeEmbarcacao').closest('div.col-md-4').css('display', 'block');
        //$("#CPF").closest("div.col-md-4").css("display", "block");
        $('#NumeroRGP').closest('div.col-md-4').css('display', 'block');
        $('#TIE').closest('div.col-md-4').css('display', 'block');
        $('#TipoPessoa').closest('div.col-md-4').css('display', 'block');
    }

    function MoverDivEmail(mover) {
        if (mover) {
            $('#Email').closest('div.col-md-4').appendTo($('#RazaoSocial').closest('div.col-md-4').closest('.row'));
        } else {
            $('#Email').closest('div.col-md-4').appendTo($('#GrupoTrabalho').closest('div.col-md-4').closest('.row'));
        }
    }

    function Mascaras() {
        $('#NumeroRGP').mask('AA00000000');
        $('#TIE').mask('0000000000');
        $('#CPF').mask('000.000.000-00', { reverse: true });
        $('#CEP').mask('00000-000', { reverse: true });
        $('#CNPJ').mask('00.000.000/0000-00', { reverse: true });
        $('#Contato').mask('(00) 0 0000-0000');
        $('#NumeroSif').mask('000000', { reverse: true });
    }
    function Unmask() {
        $('#CPF').unmask();
        $('#CEP').unmask();
        $('#CNPJ').unmask();
        $('#Contato').unmask();
    }

    function MarcaCampoVazio() {
        var retorno = true;
        $('input').each(function () {
            if ($(this).val()) {
                $(this).addClass('error');
                retorno = false;
            } else {
                $(this).removeClass('error');
            }
        });
        return retorno;
    }

    function BuscaCEP(cep) {
        $('#divCarregando').show();
        var api = $('#api').val();
        $.get(api + '/v2/endereco/cep/' + cep, function (result) {
            var data = JSON.parse(result);
            if (data.codigo == 1) {
                var endereco = JSON.parse(data.endereco);
                if (endereco[0]) {
                    $('#Endereco').val(endereco[0].rua);
                    $('#Bairro').val(endereco[0].bairro);
                    $('#Cidade').val(endereco[0].cidade);
                    $('#Estado').val(endereco[0].uf);
                }
            }
            $('#divCarregando').fadeOut('slow');
        }).fail(function () {
            $('#divCarregando').fadeOut('slow');
        });
    }

    $('#TIE').focusout(function () {
        notificaTIE($('#TIE'));
    });

    $('#CPF').focus(function () {
        var cpf = $(this).val().replace('.', '').replace('.', '').replace('-', '');
        notificaCPF(cpf);
    });
    $('#CPF').focusout(function () {
        var cpf = $(this).val().replace('.', '').replace('.', '').replace('-', '');
        notificaCPF(cpf);
    });

    $('#CNPJ').focus(function () {
        var cnpj = $(this).val().replace('.', '').replace('.', '').replace('-', '');
        notificaCPF(cnpj);
    });
    $('#CNPJ').focusout(function () {
        var cnpj = $(this).val().replace('.', '').replace('.', '').replace('/', '').replace('-', '');
        notificaCNPJ(cnpj);
    });

    $('#Email').focus(function () {
        var email = $(this).val();
        notificaEmail(email);
    });

    $('#Email').focusout(function () {
        var email = $(this).val();
        notificaEmail(email);
    });

    $('#Email').change(function () {
        var email = $(this).val();
        notificaEmail(email);
    });

    $('.letras').keyup(function () {
        this.value = this.value.replace(/[^a-zA-Z. ]*/g, '');
    });

    $('.maiusculo').focusout(function () {
        this.value = this.value.toUpperCase();
    });

    $('#salvar').click(function (e) {
        e.preventDefault();

        var form = $('form');
        var email = $('#Email').val();
        notificaEmail(email);
        form.validate();
        if (form.valid()) {
            $('#divCarregando').show();
            Unmask();
            RetornaCheckUsuarioDTO(form.serialize());
            return false;
        } else {
            setTimeout(function () {
                $('#TIE-error').text('Campo Obrigatório');
            }, 200);
        }
    });

    $('#TipoPessoa').change(function () {
        var selected = $(this).val();
        if (selected == 1) {
            $('#CPF').closest('div.col-md-4').css('display', 'none');
            $('#CPF').val('');
            $('#CNPJ').closest('div.col-md-4').css('display', 'block');
            $('#RazaoSocial').closest('div.col-md-4').css('display', 'block');
            $('#CNPJ').val('');
            $('#RazaoSocial').val('');
        }
        if (selected == 2) {
            $('#CPF').closest('div.col-md-4').css('display', 'block');
            $('#CPF').val('');
            $('#CNPJ').closest('div.col-md-4').css('display', 'none');
            $('#RazaoSocial').closest('div.col-md-4').css('display', 'none');
            $('#CNPJ').val('');
            $('#RazaoSocial').val('');
        }
    });

    $('#Formulario').change(function () {
        var selected = $(this).val();

        if (selected == 1) {
            $('#NomeEmbarcacao').closest('div.col-md-4').css('display', 'block');
            $('#NumeroRGP').closest('div.col-md-4').css('display', 'block');
            $('#TIE').closest('div.col-md-4').css('display', 'block');
            $('#Nome').siblings('label').text('Responsável pela Embarcação');
            $('#Nome').attr('placeholder', 'Responsável  pela Embarcação');
            $('#Email').attr('placeholder', 'E-mail do proprietário');
            $('#NumeroSif').closest('div.col-md-4').css('display', 'none');
            $('#CNPJ').closest('div.col-md-4').css('display', 'none');
            $('#RazaoSocial').closest('div.col-md-4').css('display', 'none');
        }
        if (selected == 2) {
            $('#NomeEmbarcacao').closest('div.col-md-4').css('display', 'block');
            $('#NumeroRGP').closest('div.col-md-4').css('display', 'block');
            $('#TIE').closest('div.col-md-4').css('display', 'block');
            $('#Nome').siblings('label').text('Responsável  pela Embarcação');
            $('#Nome').attr('placeholder', 'Responsável  pela Embarcação');
            $('#Email').attr('placeholder', 'E-mail do proprietário');
            $('#NumeroSif').closest('div.col-md-4').css('display', 'none');
            $('#CNPJ').closest('div.col-md-4').css('display', 'none');
            $('#RazaoSocial').closest('div.col-md-4').css('display', 'none');
        }
        if (selected == 3) {
            $('#Nome').siblings('label').text('Responsável pela Empresa');
            $('#Nome').attr('placeholder', 'Responsável pela Empresa');
            $('#Email').attr('placeholder', 'E-mail da Empresa');
            $('#CNPJ').closest('div.col-md-4').css('display', 'block');
            $('#RazaoSocial').closest('div.col-md-4').css('display', 'block');

            $('#NomeEmbarcacao').closest('div.col-md-4').css('display', 'none');
            $('#NumeroRGP').closest('div.col-md-4').css('display', 'none');
            $('#NumeroRGP').val('');
            $('#TIE').closest('div.col-md-4').css('display', 'none');
            $('#TIE').val('');
            $('#TipoPessoa').closest('div.col-md-4').css('display', 'none');
            $('#TipoPessoa').val('');
            $('#CPF').closest('div.col-md-4').css('display', 'block');
            $('#CPF').siblings('label').text('CPF do responsável');
            $('#CPF').attr('placeholder', 'CPF do Responsável');
            $('#NumeroSif').closest('div.col-md-4').css('display', 'block');
        }

        MoverDivEmail(true);
        $('#NumeroRGP').trigger('focusout');
    });

    $('#GrupoTrabalho').change(function () {
        var selected = $(this).val();
        DesativaCampos();
        if (selected == '1') {
            $('#identificacao').text('Representante Legal (Presidente)');
            $('#identificacao').attr('placeholder', 'Nome do Presidente da Entidade');
            $('#Email').attr('placeholder', 'E-mail da Entidade');
            $('#CNPJ').attr('placeholder', 'CNPJ da Entidade');
            $('#NomeEndereco').attr('placeholder', 'Endereço Completo da Entidade');
            $('#NomeEndereco').text('Endereço da entidade');
            AtivaCamposEntidadeColaborativa();
        }
        if (selected == '2') {
            $('#identificacao').text('Nome');
            $('#identificacao').attr('placeholder', 'Nome Completo do Pescador');
            $('#Email').attr('placeholder', 'E-mail do Pescador');
            $('#CPF').attr('placeholder', 'CPF do Pescador');
            $('#NomeEndereco').attr('placeholder', 'Endereço Completo do Pescador');
            $('#NmeEndereco').text('Endereço Completo');
            AtivaCamposPescador();
        }
        if (selected == '3') {
            $('#identificacao').text('Responsável pela Embarcação');
            $('#identificacao').attr('placeholder', 'Nome Completo do Responsável');
            $('#Email').attr('placeholder', 'E-mail do Responsável');
            $('#Contato').attr('placeholder', 'Telefone do Responsável');
            $('#NomeEndereco').attr('placeholder', 'Endereço Completo do Responsável');
            $('#NomeEndereco').text('Endereço do proprietário');
            AtivaCamposEmbarcacao();
        }
        if (selected == '4' || selected == '5') {
            $('#identificacao').text('Nome');
            $('#identificacao').attr('placeholder', 'Nome Completo do Servidor');
            $('#Email').attr('placeholder', 'E-mail do Servidor');
            $('#CPF').attr('placeholder', 'CPF do Servidor');
            $('#NomeEndereco').attr('placeholder', 'Endereço Completo do Servidor');
            $('#NmeEndereco').text('Endereço Completo');
            AtivaCamposServidor();
        }
        if (selected == '6') {
            $('#identificacao').text('Nome');
            $('#identificacao').attr('placeholder', 'Nome Completo do Pescador');
            $('#Email').attr('placeholder', 'E-mail do Pescador');
            $('#CPF').attr('placeholder', 'CPF do Pescador');
            $('#NomeEndereco').attr('placeholder', 'Endereço Completo do Pescador');
            $('#NmeEndereco').text('Endereço Completo');
            AtivaCamposPescador();
        }
        if (selected == '7') {
            $('#Nome').siblings('label').text('Nome do Responsável');
            $('#Nome').attr('placeholder', 'Nome do Responsável');
            $('#RazaoSocial').siblings('input').attr('placeholder', 'Nome/Razão Social');
            $('#RazaoSocial').text('Nome/Razão Social');
            $('#NomeEndereco').siblings('input').attr('placeholder', 'Endereço Completo da Empresa');
            $('#NomeEndereco').text('Endereço Completo da Empresa');
            $('#CEP').siblings('label').text('CEP da Empresa');
            $('#CEP').attr('placeholder', 'CEP da Empresa');
            $('#CPF').attr('placeholder', 'CPF do Responsável');
            AtivaCamposEmpresaRastreadora();
        }
        if (selected == '8') {
            $('#identificacao').text('Nome');
            $('#identificacao').attr('placeholder', 'Nome Completo do Pescador');
            $('#Email').attr('placeholder', 'E-mail do Pescador');
            $('#CPF').attr('placeholder', 'CPF do Pescador');
            $('#NomeEndereco').attr('placeholder', 'Endereço Completo do Pescador');
            $('#NmeEndereco').text('Endereço Completo');
            AtivaCamposPescadorAmador();
        }
        if (selected == '9') {
            $('#identificacao').text('Responsável pela Embarcação');
            $('#identificacao').attr('placeholder', 'Nome Completo do Responsável');
            $('#Email').attr('placeholder', 'E-mail do Responsável');
            $('#Contato').attr('placeholder', 'Telefone do Responsável');
            $('#NomeEndereco').attr('placeholder', 'Endereço Completo do Responsável');
            $('#NomeEndereco').text('Endereço do proprietário');
            AtivaCamposSisTainha();
        }
        if (selected == '10') {
            $('#identificacao').text('Responsável pela Embarcação');
            $('#identificacao').attr('placeholder', 'Nome Completo do Responsável');
            $('#Email').attr('placeholder', 'E-mail do Responsável');
            $('#Contato').attr('placeholder', 'Telefone do Responsável');
            $('#NomeEndereco').attr('placeholder', 'Endereço Completo do Responsável');
            $('#NomeEndereco').text('Endereço do proprietário');
            AtivaCamposMapaBordo();
        }
        if (selected == '8') {
        }
        if (selected == '9') {
        }
        if (selected == '5') {
            $('#Email').val('');
        }
    });

    $('#EmContrucao').change(function () {
        var selected = $(this).val();

        if (selected == '1') {
            $('#TIE').attr('data-val-required', 'Campo Obrigatório');
            $('#TIE').attr('required', 'required');
            $('#TIE').attr('data-val', 'true');
            $('#TIE').closest('div.col-md-4').css('display', 'block');
        }
        if (selected == '2') {
            $('#TIE-error').remove();
            $('#TIE').removeAttr('data-val-required');
            $('#TIE').removeAttr('data-val');
            $('#TIE').removeAttr('required', 'required');
            $('#TIE').closest('div.col-md-4').css('display', 'none');
        }
    });

    $('#CEP').keyup(function () {
        var cep = $(this).val();
        if (cep.length >= 9) {
            BuscaCEP(cep);
        }
    });

    $('#NumeroRGP').focusout(function () {
        if ($('#NumeroRGP').val().length == '10') {
            //Nao aceita rgp com qtde de caracteres diferente de 10
            if ($('#GrupoTrabalho').val() != '10') {
                var endpointLista = '';
                if ($('#Formulario').val() == '1') {
                    endpointLista = 'RetornarRgpCerco2020';
                }
                if ($('#Formulario').val() == '2') {
                    endpointLista = 'RetornarRgpEmalhe2020';
                }

                $('#RGP-error').remove();
                $.get(urlBase + '/Home/' + endpointLista, function (data) {
                    var listaRgp2020 = data;
                    if (listaRgp2020.indexOf($('#NumeroRGP').val()) == -1) {
                        $('#NumeroRGP').val('');
                        $('span[data-valmsg-for*="NumeroRGP"]').append(
                            '<span id="RGP-error" class="">RGP não é válido para a modalidade selecionada.</span>'
                        );
                    } else {
                        $('#NumeroRGP').removeClass('input-validation-error');
                    }
                })
                    .done(function () { })
                    .fail(function () { });
            }
        } else {
            $('#NumeroRGP').val('');
            setTimeout(function () {
                $('span[data-valmsg-for*="NumeroRGP"]').append(
                    '<span id="RGP-error" class="">RGP deve ser no formato AA00000000.</span>'
                );
            }, 10);
        }
    });
});
