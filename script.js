/*
    SISTEMA DE DENÚNCIAS ANÔNIMAS

    Protótipo utilizando:
    HTML5 + CSS3 + JavaScript

    Os dados são armazenados no localStorage.
*/


// =====================================================
// BANCO DE DADOS SIMULADO
// =====================================================

function obterDenuncias() {

    const dados = localStorage.getItem("denuncias");

    if (!dados) {
        return [];
    }

    return JSON.parse(dados);
}


function salvarDenuncias(denuncias) {

    localStorage.setItem(
        "denuncias",
        JSON.stringify(denuncias)
    );
}


// =====================================================
// GERAR PROTOCOLO
// =====================================================

function gerarProtocolo() {

    const numero =
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    return `DEN-${numero}`;
}


// =====================================================
// REGISTRAR DENÚNCIA
// =====================================================

const denunciaForm =
    document.getElementById("denunciaForm");


if (denunciaForm) {

    denunciaForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const tipo =
                document.getElementById("tipo").value;

            const titulo =
                document.getElementById("titulo").value;

            const local =
                document.getElementById("local").value;

            const data =
                document.getElementById("data").value;

            const descricao =
                document.getElementById("descricao").value;

            const urgencia =
                document.getElementById("urgencia").value;


            const protocolo =
                gerarProtocolo();


            const novaDenuncia = {

                id: Date.now(),

                protocolo: protocolo,

                tipo: tipo,

                titulo: titulo,

                local: local,

                data: data,

                descricao: descricao,

                urgencia: urgencia,

                status: "Pendente",

                criadaEm:
                    new Date().toLocaleString("pt-BR")

            };


            const denuncias =
                obterDenuncias();


            denuncias.push(
                novaDenuncia
            );


            salvarDenuncias(
                denuncias
            );


            const resultado =
                document.getElementById(
                    "resultadoDenuncia"
                );


            resultado.classList.remove(
                "hidden"
            );


            resultado.innerHTML = `

                <h2>Denúncia registrada!</h2>

                <p>
                    Sua denúncia foi registrada
                    com sucesso.
                </p>

                <p>
                    Guarde o protocolo abaixo
                    para acompanhar o andamento:
                </p>

                <div
                    style="
                    font-size: 28px;
                    font-weight: bold;
                    margin: 15px 0;
                    "
                >
                    ${protocolo}
                </div>

                <p>
                    Não compartilhe este protocolo
                    com pessoas não autorizadas.
                </p>

                <a
                    href="acompanhar-denuncia.html"
                    class="btn btn-primary"
                    style="margin-top:15px"
                >
                    Acompanhar denúncia
                </a>

            `;


            denunciaForm.reset();

            window.scrollTo({
                top:
                    resultado.offsetTop - 100,

                behavior: "smooth"
            });

        }
    );

}


// =====================================================
// CONSULTAR DENÚNCIA
// =====================================================

const consultaForm =
    document.getElementById(
        "consultaForm"
    );


if (consultaForm) {

    consultaForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const protocolo =
                document
                    .getElementById(
                        "protocolo"
                    )
                    .value
                    .trim()
                    .toUpperCase();


            const denuncias =
                obterDenuncias();


            const denuncia =
                denuncias.find(
                    item =>
                        item.protocolo ===
                        protocolo
                );


            const resultado =
                document.getElementById(
                    "resultadoConsulta"
                );


            resultado.classList.remove(
                "hidden"
            );


            if (!denuncia) {

                resultado.innerHTML = `

                    <div class="alert"
                         style="
                         background:#fff0f1;
                         color:#9b1c2b;
                         ">

                        ❌ Denúncia não encontrada.

                        <br><br>

                        Verifique o número do
                        protocolo e tente novamente.

                    </div>

                `;

                return;
            }


            resultado.innerHTML = `

                <div class="success-box">

                    <h2>
                        Denúncia encontrada
                    </h2>

                    <br>

                    <p>
                        <strong>Protocolo:</strong>
                        ${denuncia.protocolo}
                    </p>

                    <p>
                        <strong>Tipo:</strong>
                        ${denuncia.tipo}
                    </p>

                    <p>
                        <strong>Título:</strong>
                        ${denuncia.titulo}
                    </p>

                    <p>
                        <strong>Local:</strong>
                        ${denuncia.local}
                    </p>

                    <p>
                        <strong>Data:</strong>
                        ${formatarData(denuncia.data)}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${denuncia.status}
                    </p>

                    <p>
                        <strong>Urgência:</strong>
                        ${denuncia.urgencia}
                    </p>

                    <br>

                    <p>
                        <strong>Descrição:</strong>
                    </p>

                    <p>
                        ${denuncia.descricao}
                    </p>

                </div>

            `;

        }
    );

}


// =====================================================
// ADMINISTRADOR
// =====================================================

function carregarDashboard() {

    const tabela =
        document.getElementById(
            "tabelaDenuncias"
        );


    if (!tabela) {
        return;
    }


    const denuncias =
        obterDenuncias();


    tabela.innerHTML = "";


    if (denuncias.length === 0) {

        tabela.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                    text-align:center;
                    padding:40px;
                    "
                >

                    Nenhuma denúncia registrada.

                </td>

            </tr>

        `;

    }


    denuncias.forEach(
        denuncia => {

            const linha =
                document.createElement(
                    "tr"
                );


            linha.innerHTML = `

                <td>
                    <strong>
                        ${denuncia.protocolo}
                    </strong>
                </td>

                <td>
                    ${denuncia.tipo}
                </td>

                <td>
                    ${denuncia.titulo}
                </td>

                <td>
                    ${denuncia.local}
                </td>

                <td>
                    ${formatarData(denuncia.data)}
                </td>

                <td>

                    <span
                        class="
                        status
                        ${classeStatus(
                            denuncia.status
                        )}
                        "
                    >

                        ${denuncia.status}

                    </span>

                </td>

                <td>

                    <button
                        class="
                        btn
                        btn-primary
                        btn-small
                        "
                        onclick="
                        alterarStatus(
                            '${denuncia.protocolo}'
                        )
                        "
                    >
                        Alterar
                    </button>

                </td>

            `;


            tabela.appendChild(
                linha
            );

        }
    );


    atualizarEstatisticas(
        denuncias
    );
}


// =====================================================
// STATUS
// =====================================================

function classeStatus(status) {

    if (status === "Pendente") {

        return "status-pendente";

    }

    if (status === "Em andamento") {

        return "status-andamento";

    }

    if (status === "Finalizada") {

        return "status-finalizada";

    }

    return "";
}


// =====================================================
// ALTERAR STATUS
// =====================================================

function alterarStatus(
    protocolo
) {

    const denuncias =
        obterDenuncias();


    const denuncia =
        denuncias.find(
            item =>
                item.protocolo ===
                protocolo
        );


    if (!denuncia) {
        return;
    }


    const novoStatus =
        prompt(
            `Alterar status da denúncia ${protocolo}:\n\n` +
            `1 - Pendente\n` +
            `2 - Em andamento\n` +
            `3 - Finalizada\n\n` +
            `Digite o número:`
        );


    const statusMap = {

        "1": "Pendente",

        "2": "Em andamento",

        "3": "Finalizada"

    };


    if (!statusMap[novoStatus]) {

        alert(
            "Opção inválida."
        );

        return;
    }


    denuncia.status =
        statusMap[novoStatus];


    salvarDenuncias(
        denuncias
    );


    carregarDashboard();


    alert(
        "Status atualizado com sucesso!"
    );
}


// =====================================================
// ESTATÍSTICAS
// =====================================================

function atualizarEstatisticas(
    denuncias
) {

    const total =
        denuncias.length;


    const pendentes =
        denuncias.filter(
            item =>
                item.status ===
                "Pendente"
        ).length;


    const andamento =
        denuncias.filter(
            item =>
                item.status ===
                "Em andamento"
        ).length;


    const finalizadas =
        denuncias.filter(
            item =>
                item.status ===
                "Finalizada"
        ).length;


    const totalElement =
        document.getElementById(
            "totalDenuncias"
        );

    const pendentesElement =
        document.getElementById(
            "pendentes"
        );

    const andamentoElement =
        document.getElementById(
            "andamento"
        );

    const finalizadasElement =
        document.getElementById(
            "finalizadas"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (pendentesElement) {

        pendentesElement.textContent =
            pendentes;

    }


    if (andamentoElement) {

        andamentoElement.textContent =
            andamento;

    }


    if (finalizadasElement) {

        finalizadasElement.textContent =
            finalizadas;

    }
}


// =====================================================
// LIMPAR DADOS
// =====================================================

function limparDenuncias() {

    const confirmar =
        confirm(
            "Tem certeza que deseja apagar todas as denúncias?"
        );


    if (!confirmar) {
        return;
    }


    localStorage.removeItem(
        "denuncias"
    );


    carregarDashboard();


    alert(
        "Todas as denúncias foram removidas."
    );
}


// =====================================================
// FORMATAR DATA
// =====================================================

function formatarData(data) {

    if (!data) {
        return "-";
    }


    const partes =
        data.split("-");


    if (partes.length !== 3) {
        return data;
    }


    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// =====================================================
// INICIAR DASHBOARD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        carregarDashboard();

    }
);
