# SCRIPT DE LIMPEZA - VERSÃO COMENTADA LINHA POR LINHA

# IMPORTS: trazem ferramentas prontas para usarmos no código
import ctypes   # permite conversar direto com o Windows (usamos p/ checar e pedir admin)
import os       # mexe com arquivos, pastas e variáveis do sistema
import shutil   # apaga pastas inteiras (com tudo dentro)
import sys      # dá informações sobre o Python que está rodando este script


# FUNÇÃO 1: descobre se o script está rodando como administrador
def adm() -> bool:  # "def" cria uma função chamada eh_admin; "-> bool" = devolve True ou False
    try:  # "tente fazer isto; se der erro, vá para o except"
        # Pergunta ao Windows se o usuário é admin. Ele devolve 0 se NÃO for.
        # "!= 0" significa "diferente de zero", então vira True se for admin.
        return ctypes.windll.shell32.IsUserAnAdmin() != 0
    except Exception:  # se qualquer erro acontecer na checagem
        return False   # assumimos que NÃO é admin


# FUNÇÃO 2: abre uma nova cópia do script com poderes de administrador
def reiniciar_como_admin():
    # sys.argv = lista com o nome do script (e argumentos, se houver).
    # O f' "{a}" ' coloca aspas em volta de cada item (protege caminhos com espaço).
    # " ".join(...) junta todos os itens em um único texto, separados por espaço.
    params = " ".join(f'"{a}"' for a in sys.argv)

    # ShellExecuteW pede ao Windows para abrir um programa.
    ctypes.windll.shell32.ShellExecuteW(
        None,            # 1º: sem janela "pai"
        "runas",         # 2º: palavra mágica = "executar como administrador" (mostra o aviso UAC)
        sys.executable,  # 3º: programa a abrir = o próprio Python que está rodando
        params,          # 4º: o que dar ao Python = este mesmo script
        None,            # 5º: pasta de trabalho padrão
        1                # 6º: 1 = mostrar a janela normalmente
    )


# ---------------------------------------------------------------------
# FUNÇÃO 3: apaga tudo que está DENTRO de uma pasta
# ---------------------------------------------------------------------
def limpar_pasta(caminho: str):  # recebe o caminho da pasta (texto) que será limpa
    # Cria 3 contadores, todos começando em 0:
    # removidos = quantos itens apagou | ignorados = quantos não conseguiu | bytes_liberados = espaço
    removidos = ignorados = bytes_liberados = 0

    # os.path.isdir verifica se a pasta existe. "not" inverte: "se NÃO existir..."
    if not os.path.isdir(caminho):
        print(f"[!] Pasta não encontrada: {caminho}")   # avisa na tela
        return removidos, ignorados, bytes_liberados     # sai da função devolvendo zeros

    # os.listdir devolve os nomes de tudo que há dentro da pasta.
    # O "for" repete o bloco abaixo uma vez para cada nome, e "nome" é o item da vez.
    for nome in os.listdir(caminho):
        # os.path.join cola pasta + nome formando o caminho completo (ex: C:\Windows\Temp\abc.tmp)
        item = os.path.join(caminho, nome)

        try:  # tenta apagar; se o Windows negar, cai no except lá embaixo
            # Se for arquivo comum (isfile) OU atalho/link (islink)...
            if os.path.isfile(item) or os.path.islink(item):
                # Pega o tamanho em bytes. Se for link, usa 0 (links não ocupam espaço real).
                tamanho = os.path.getsize(item) if os.path.isfile(item) else 0
                os.unlink(item)                # apaga o arquivo
                bytes_liberados += tamanho     # soma o tamanho ao total liberado

            # Senão, se for uma subpasta...
            elif os.path.isdir(item):
                # Calcula o tamanho total da subpasta ANTES de apagar.
                # os.walk percorre a pasta e todas as pastas dentro dela:
                #   r  = pasta atual | _ = nomes das subpastas (não usamos) | fs = arquivos dessa pasta
                # sum(...) soma o tamanho de cada arquivo encontrado.
                # O "if os.path.exists" evita erro caso o arquivo suma durante a contagem.
                tamanho = sum(
                    os.path.getsize(os.path.join(r, f))
                    for r, _, fs in os.walk(item)
                    for f in fs
                    if os.path.exists(os.path.join(r, f))
                )
                shutil.rmtree(item)            # apaga a subpasta inteira com tudo dentro
                bytes_liberados += tamanho     # soma ao total liberado

            removidos += 1  # "+= 1" soma 1: conta mais um item removido (só chega aqui se não deu erro)

        # Se deu PermissionError (sem permissão) ou OSError (arquivo em uso, etc.)...
        except (PermissionError, OSError):
            ignorados += 1  # ...só conta como ignorado e o "for" continua para o próximo item

    # Devolve os 3 números para quem chamou a função
    return removidos, ignorados, bytes_liberados


# ---------------------------------------------------------------------
# FUNÇÃO 4 (PRINCIPAL): organiza tudo e executa
# ---------------------------------------------------------------------
def main():
    # os.name vale "nt" quando o sistema é Windows. "!=" = "diferente de".
    if os.name != "nt":
        print("Este script é apenas para Windows.")
        return

    # Se NÃO for administrador...
    if not adm():
        print("Solicitando permissão de administrador...")
        reiniciar_como_admin()  # abre uma nova cópia com permissão de admin
        return                  # e encerra esta cópia (a nova cuida do resto)

    # Lê a variável do Windows "WINDIR" (pasta onde o Windows está instalado).
    # Se não existir, usa C:\Windows. O "r" antes das aspas = texto cru (a \ não vira código special).
    windir = os.environ.get("WINDIR", r"C:\Windows")

    # Lista com as 3 pastas que serão limpas:
    pastas = [
        os.path.join(windir, "Prefetch"),   # C:\Windows\Prefetch
        os.environ.get("TEMP", ""),         # %TEMP% = pasta temporária do SEU usuário
        os.path.join(windir, "Temp"),       # C:\Windows\Temp
    ]

    # Contadores gerais (somando o resultado das 3 pastas)
    total_removidos = total_ignorados = total_bytes = 0

    # Repete para cada pasta da lista
    for pasta in pastas:
        if not pasta:   # se o texto estiver vazio (variável não encontrada)...
            continue    # ...pula esta pasta e vai para a próxima

        print(f"\nLimpando: {pasta}")  # "\n" = pula uma linha. {pasta} é trocado pelo caminho.

        # Chama a função de limpeza. Ela devolve 3 valores, guardados em r, i e b:
        # r = removidos | i = ignorados | b = bytes liberados
        r, i, b = limpar_pasta(pasta)

        # Mostra o resultado. b / 1024 / 1024 converte bytes em MB.
        # ":.2f" mostra o número com 2 casas decimais.
        print(f"  Removidos: {r} | Ignorados (em uso): {i} | Liberado: {b / 1024 / 1024:.2f} MB")

        # Soma o resultado desta pasta nos totais gerais
        total_removidos += r
        total_ignorados += i
        total_bytes += b

    # Resumo final
    print("\n" + "=" * 50)  # "=" * 50 repete o sinal 50 vezes, formando uma linha
    print(f"Total removidos : {total_removidos}")
    print(f"Total ignorados : {total_ignorados}")
    print(f"Espaço liberado : {total_bytes / 1024 / 1024:.2f} MB")
    print("=" * 50)

    # input() espera você apertar Enter. Serve para a janela não fechar sozinha.
    input("\nPressione Enter para sair...")


# ---------------------------------------------------------------------
# PONTO DE ENTRADA
# __name__ vale "__main__" quando você executa ESTE arquivo diretamente.
# Se alguém importasse este arquivo em outro programa, main() NÃO rodaria sozinha.
# ---------------------------------------------------------------------
if __name__ == "__main__":
    main()  # chama a função principal e tudo começa aqui