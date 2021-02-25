// Default é uma palavra reservado para o JS
var Login = function () {

    var btnBack = '.btn-back-login';
    var lnkForgetPassword = '#HyperLink1';
    var lnkCadastrarse = '#hlCadastrarse';
    var btnQrCode = '#btnQrCode';

    var $contentLogin = null;
    var $gridLogin = null;
    var $gridForgetPassword = null;
    var $gridTrocarSenha = null;
    var $gridCadastrarse = null;
    var $gridQrcode = null;
    var $imgQrcode = null;
    var $form = null;
    var qrLoad = false;

    var store = ({
        isFirstLoading: true,
        configuracaoPadrao: {
            habilitarEndereco: 0,
            habilitarEnvioAnexo: 0,
            habilitarGeracaoSenhaAutomatica: 0,
            tipoLogin: 1
        }
    });

    var TIPO_LOGIN = ({
        LIVRE: 1,
        CPF_CNPJ: 2,
        EMAIL: 3,
    });

    var controles = ({
        gridCadastrarse: '#Grid-Cadastrarse',
        containerEndereco: '.js-container-endereco',
        containerAnexo: '.js-container-anexo',
        containerSenha: '.js-container-senha',
        containerTipoPessoa: '.js-container-tipo-pessoa',
        labelCpfCnpj: '#labelCpfCnpj',

        cadastroUsuario: {
            txtNome: '#txtNome',
            txtLogin: '#txtLogin',
            txtPassword: '#txtPassword',
            txtRepetirPassword: '#txtRepetirPassword',
            txtCpf: '#txtCpf',
            txtCnpj: '#txtCnpj',
            txtEmail: '#txtEmail',
            txtContato: '#txtContato',
        },

        $el: {
            gridCadastrarse: null,
            containerEndereco: null,
            containerAnexo: null,
            containerSenha: null,
            containerTipoPessoa: null,

            labelCpfCnpj: null,

            inputs: {
                cadastroUsuario: {
                    txtNome: null,
                    txtLogin: null,
                    txtPassword: null,
                    txtRepetirPassword: null,
                    txtCpf: null,
                    txtCnpj: null,
                    txtEmail: null,
                    txtContato: null,
                }
            },
        }
    });

    function registerEvents() {

        $form.validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                txtUsuario: {
                    required: true
                },
                txtSenha: {
                    required: true
                }
            },

            messages: {
                txtUsuario: {
                    required: "Usuário é obrigatório."
                },
                txtSenha: {
                    required: "Senha é obrigatório."
                }
            },

            invalidHandler: function (event, validator) { //display error alert on form submit
                $('.alert-danger', $('.login-form')).show();
            },

            highlight: function (element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function (label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function (error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function (form) {
                form.submit(); // form validation success, call ajax form submit
            }
        });

        $('.login-form input').keypress(function (e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {

                }
                return false;
            }
        });

        $(lnkForgetPassword).click(function () {
            ExibirGrid($gridForgetPassword);
            $contentLogin.css('width', '450px');
        });

        $(lnkCadastrarse).click(function () {
            ExibirGrid($gridCadastrarse);
            $contentLogin.css('width', '100%');
        });

        $(btnQrCode).click(function () {
            ExibirGrid($gridQrcode);
            if (qrLoad) return;
            gerarQrCode();
        });

        $(btnBack).click(function () {
            ExibirGrid($gridLogin);
            $contentLogin.css('width', '450px');
        });

        $("#idBairro").hide();
        $("#txtContato").inputmask("(99) 99999-9999");
        $("#txtCep").inputmask("99999-999");
        // $('#rbtTipoPessoaJ').bind('click', checkRadio);
        // $('#rbtTipoPessoaF').bind('click', checkFisica);
        $("#txtCpf").inputmask("999.999.999-99");
        $("#txtCnpj").inputmask("99.999.999/9999-99");

        Ecm.registraEvento("click", ".autentica-token", function (e, botao) {
            e.preventDefault();
            $("#txtUsuario").val("");
            $("#txtSenha").val("");

            AutenticaToken();

        });

        $("#txtCep").blur(function () {
            var $this = $(this);
            if (!$this.val()) {
                resetCamposEndereco();
                return;
            }
            var parametros = JSON.stringify({
                cep: $this.val()
            });
            Ecm.ajax('WS/Ecm.asmx/RetornaEnderecoPorCep', parametros,
                function (data) {
                    data = JSON.parse(data);
                    if (!data.endereco)
                        toastr.warning('', 'Cep não encontrado');
                    else {
                        data.endereco = JSON.parse(data.endereco);
                        var endereco = data.endereco[0];

                        if (!endereco) {
                            resetCamposEndereco();
                            return;
                        }
                        $('#idBairro').val(endereco.idBairro).trigger('focusout');
                        $('#txtBairro').val(endereco.bairro).trigger('focusout');
                        $('#txtCidade').val(endereco.cidade).trigger('focusout');
                        $('#txtEndereco').val(endereco.rua).trigger('focusout');
                        $('#txtEstado').val(endereco.estado).trigger('focusout');

                    }

                }, function () { });
        });

        controles.$el.containerTipoPessoa.find('input[name="tipoPessoa"]').on('change', onChangeTipoPessoa);
        controles.$el.inputs.cadastroUsuario.txtEmail.on('keyup change', onChangeEmail);
        controles.$el.inputs.cadastroUsuario.txtCpf.on('keyup change', onChangeCpfCnpj);
        controles.$el.inputs.cadastroUsuario.txtCnpj.on('keyup change', onChangeCpfCnpj);
    }

    function resetCamposEndereco () {
        $('#idBairro').val(null).trigger('focusout');
        $('#txtBairro').val(null).trigger('focusout');
        $('#txtCidade').val(null).trigger('focusout');
        $('#txtEndereco').val(null).trigger('focusout');
        $('#txtEstado').val(null).trigger('focusout');
    }

    function iniciarVariaveis() {
        $contentLogin = $('.login-page .login-content');

        $gridLogin = $('#Grid-Login');
        $gridForgetPassword = $('#Grid-ForgetPassword');
        $gridTrocarSenha = $('#Grid-TrocarSenha');
        $gridCadastrarse = $('#Grid-Cadastrarse');
        $gridQrcode = $('#Grid-QrCode');
        $imgQrcode = $('#imgQrCode');

        $form = $('#form1');

        controles.$el.gridCadastrarse = $(document.body).find(controles.gridCadastrarse);
        controles.$el.containerEndereco = controles.$el.gridCadastrarse.find(controles.containerEndereco);
        controles.$el.containerAnexo = controles.$el.gridCadastrarse.find(controles.containerAnexo);
        controles.$el.containerSenha = controles.$el.gridCadastrarse.find(controles.containerSenha);
        controles.$el.containerTipoPessoa = controles.$el.gridCadastrarse.find(controles.containerTipoPessoa);

        controles.$el.labelCpfCnpj = controles.$el.gridCadastrarse.find(controles.labelCpfCnpj);
        controles.$el.inputs.cadastroUsuario.txtNome = controles.$el.gridCadastrarse.find(controles.cadastroUsuario.txtNome);
        controles.$el.inputs.cadastroUsuario.txtLogin = controles.$el.gridCadastrarse.find(controles.cadastroUsuario.txtLogin);
        controles.$el.inputs.cadastroUsuario.txtPassword = controles.$el.gridCadastrarse.find(controles.cadastroUsuario.txtPassword);
        controles.$el.inputs.cadastroUsuario.txtRepetirPassword = controles.$el.gridCadastrarse.find(controles.cadastroUsuario.txtRepetirPassword);
        controles.$el.inputs.cadastroUsuario.txtCpf = controles.$el.gridCadastrarse.find(controles.cadastroUsuario.txtCpf);
        controles.$el.inputs.cadastroUsuario.txtCnpj = controles.$el.gridCadastrarse.find(controles.cadastroUsuario.txtCnpj);
        controles.$el.inputs.cadastroUsuario.txtEmail = controles.$el.gridCadastrarse.find(controles.cadastroUsuario.txtEmail);
        controles.$el.inputs.cadastroUsuario.txtContato = controles.$el.gridCadastrarse.find(controles.cadastroUsuario.txtContato);

        window.controles = controles;
    }

    function onChangeTipoPessoa (event) {
        var value = event.target.value;

        controles.$el.inputs.cadastroUsuario.txtLogin.val(null).trigger('focusout');
        controles.$el.inputs.cadastroUsuario.txtCnpj.removeClass('edited');
        controles.$el.inputs.cadastroUsuario.txtCpf.removeClass('edited');

        if (value === 'rbtTipoPessoaJ') {
            controles.$el.labelCpfCnpj.html('CNPJ');
            controles.$el.inputs.cadastroUsuario.txtCnpj.show().trigger('focusout');
            controles.$el.inputs.cadastroUsuario.txtCpf.val(null).hide();
        }
        else {
            controles.$el.labelCpfCnpj.html('CPF');
            controles.$el.inputs.cadastroUsuario.txtCpf.show().trigger('focusout');
            controles.$el.inputs.cadastroUsuario.txtCnpj.val(null).hide();
        }
    }

    function onChangeEmail (event) {
        var value = event.target.value;

        if (store.configuracaoPadrao.tipoLogin === TIPO_LOGIN.EMAIL) {
            controles.$el.inputs.cadastroUsuario.txtLogin.val(value).trigger('focusout');
        }
    }

    function onChangeCpfCnpj (event) {
        var value = event.target.value;
        value = value.replace(/\D/g, '');

        if (store.configuracaoPadrao.tipoLogin == TIPO_LOGIN.CPF_CNPJ) {
            controles.$el.inputs.cadastroUsuario.txtLogin.val(value).trigger('focusout');
        }
    }

    var AutenticaToken = function () {
        var token = $("#hdfAuthTokenAutorizacao").val();
        var simpleEdit = $("#hdfAuthTokenParametrosSimpleEdit").val();
        console.log("token:" + token);
        console.log("simpleEdit:" + simpleEdit);

        location.href = simpleEdit;
        verificaTokenAutorizacao(token);

    }

    var verificaTokenAutorizacao = function (token) {
        var param = JSON.stringify({
            autorizacao: token
        });
        Ecm.ajax('WS/Ecm.asmx/RetornaUsuarioAutorizacaoToken',
            param,
            function (retorno) {
                var resultado = jQuery.parseJSON(retorno);
                console.log("retorno:" + retorno);
                console.log("resultado.usuario.Id:" + resultado.usuario.Id);
                if (resultado.usuario.Id > 0) {
                    $("#btnLogin").click();

                } else {
                    setTimeout(function () { verificaTokenAutorizacao(token); }, 3000);
                }
            }, function () { });

    }

    // Método invocado antes do document read
    function TrocarSenha() {
        iniciarVariaveis();

        $gridLogin.hide();
        $gridForgetPassword.hide();
        $gridCadastrarse.hide();
        $gridTrocarSenha.show();
    }

    function ExibirGrid($grid) {
        $gridLogin.hide();
        $gridTrocarSenha.hide();
        $gridForgetPassword.hide();
        $gridCadastrarse.hide();
        $gridQrcode.hide();

        $grid.fadeIn();
    }

    function gerarQrCode() {
        function showImg(e) {
            qrLoad = true;
            //var img = $imgQrcode[0];
            //img.onload = function (e) {
            //    window.URL.revokeObjectURL(img.src);//Clear
            //};
            //img.src = window.URL.createObjectURL(this.response);
            var uInt8Array = new Uint8Array(this.response);
            var i = uInt8Array.length;
            var biStr = new Array(i);
            while (i--) {
            biStr[i] = String.fromCharCode(uInt8Array[i]);
            }
            var data = biStr.join('');
            var base64 = window.btoa(data);
            $imgQrcode[0].src = "data:image/png;base64," + base64;
            $imgQrcode.show();
        }

        window.URL = window.URL || window.webkitURL;

        var xhr = new XMLHttpRequest;
        xhr.open('POST', 'WS/Ecm.asmx/GerarQrCodeAplicacao', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = 'arraybuffer';//Blob
        xhr.onload = showImg;
        xhr.send();

        //$.ajax(settings).success(function (data) {
        //    debugger;

        //}).done(function (data) {
        //    qrLoad = true;
        //    var arr = new Uint8Array(data);
        //    var raw = String.fromCharCode.apply(null, arr);
        //    var b64 = btoa(raw);
        //    var dataURL = "data:image/jpeg;base64," + b64;

        //    $imgQrcode[0].src = dataURL;
        //});
    }

    function setConfiguracaoPadrao (props) {
        if (!store.isFirstLoading)
            return;

        try {
            store.configuracaoPadrao = Object.assign({}, store.configuracaoPadrao, JSON.parse(props));

        } catch (error) {
            store.configuracaoPadrao = ({
                habilitarEndereco: 0,
                habilitarEnvioAnexo: 0,
                habilitarGeracaoSenhaAutomatica: 0,
                tipoLogin: 1
            });

            console.warn('[error]: ', 'não foi possivel carregar as configurações!');
        } finally {
            store.isFirstLoading = false;
        }
    }

    function configurarTelaCadastroExterno () {
        controles.$el.inputs.cadastroUsuario.txtLogin.prop('disabled', store.configuracaoPadrao.tipoLogin !== TIPO_LOGIN.LIVRE);

        if (store.configuracaoPadrao.habilitarEndereco)
            controles.$el.containerEndereco.show();
        else
            controles.$el.containerEndereco.hide();

        if (store.configuracaoPadrao.habilitarEnvioAnexo)
            controles.$el.containerAnexo.show();
        else
            controles.$el.containerAnexo.hide();
    }
	
        function VerificarLoginUnico(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');

            if (hash[0] == "IntegracaoGovbr") {
                var node = document.createElement("div");
                var h1 = document.createElement("h1");
                h1.innerText = "Autenticando no SisRGP 4.0...";
                $(h1).css("margin-top","15%");
                $(node).prepend(h1);
                node.id = "divBloquear";
                node.setAttribute("style","width: 100%;min-height: 100%;z-index: 999999;background-color: white;position: fixed;text-align:center;");
                $("body").prepend(node);

                var hash = hash[1];
				var tokenObj = DecodeJwt(hash);

                if (Date.now() >= tokenObj.exp * 1000) {
                alert("Sessão expirada, faça o login novamente.")
                return;
                }
                else
                {
                    $("#txtUsuario").val(tokenObj.CPF);
                    $("#txtSenha").val(tokenObj.Hash);
                    setTimeout(function() {
                        $("#btnLogin").trigger("click");
                    }, 50);
                }
            }		
        }
    };

        function DecodeJwt(token)
    {
        try {
            return JSON.parse(atob(token.split('.')[1]));
          } catch (e) {
            return null;
          }
    };	

    function init() {
		VerificarLoginUnico();
        Ecm.init();
        iniciarVariaveis();
        registerEvents();

        configurarTelaCadastroExterno();
    }

    return {
        init: init,
        TrocarSenha: TrocarSenha,
        setConfiguracaoPadrao: setConfiguracaoPadrao,
        store: store
    };
}();
