function buscarNoMercado() {
    const produto = document.getElementById('nome-produto').value;
    const btn = document.getElementById('btn-buscar');

    if (!produto) {
        alert("Digite o nome do produto primeiro!");
        return;
    }

    // Efeito visual de carregamento
    btn.textContent = "A analisar a Web...";
    btn.disabled = true;

    // SIMULAÇÃO: Num sistema real, aqui você faria uma requisição para uma API em Python/Node.js
    // que faria o web scraping do Mercado Livre, Amazon, etc.
    setTimeout(() => {
        // Gerar preços simulados baseados no tamanho do nome do produto (só para dar resultados diferentes)
        const base = produto.length * 8 + Math.floor(Math.random() * 50); 
        const precoMedio = base;
        const precoMin = base * 0.75; // 25% mais barato
        const precoMax = base * 1.35; // 35% mais caro

        // Exibir resultados na tela
        document.getElementById('preco-min').textContent = `R$ ${precoMin.toFixed(2)}`;
        document.getElementById('preco-med').textContent = `R$ ${precoMedio.toFixed(2)}`;
        document.getElementById('preco-max').textContent = `R$ ${precoMax.toFixed(2)}`;

        // Preencher o preço de venda automaticamente com o preço médio
        document.getElementById('preco-venda').value = precoMedio.toFixed(2);

        // Mostrar os painéis seguintes
        document.getElementById('resultado-busca').classList.remove('escondido');
        document.getElementById('calculadora-custos').classList.remove('escondido');
        document.getElementById('painel-veredito').classList.remove('escondido');

        // Restaurar botão
        btn.textContent = "Varrer Mercado 🔍";
        btn.disabled = false;

        // Já calcula a viabilidade com o preço médio injetado
        calcularViabilidade();
    }, 1500); // Demora 1.5s para simular a varredura
}

function calcularViabilidade() {
    // 1. Capturar os valores inseridos
    const custoProduto = parseFloat(document.getElementById('custo-produto').value) || 0;
    const custoFrete = parseFloat(document.getElementById('custo-frete').value) || 0;
    const taxaMkp = parseFloat(document.getElementById('taxa-mkp').value) || 0;
    const taxaImposto = parseFloat(document.getElementById('taxa-imposto').value) || 0;
    const precoVenda = parseFloat(document.getElementById('preco-venda').value) || 0;

    // Se não houver preço de venda ou custo ainda, não calcula
    if (precoVenda === 0 || custoProduto === 0) return;

    // 2. A Matemática Bruta
    const custoTotalAquisicao = custoProduto + custoFrete;
    const descontoMkp = precoVenda * (taxaMkp / 100);
    const descontoImposto = precoVenda * (taxaImposto / 100);
    
    const deducoesTotais = custoTotalAquisicao + descontoMkp + descontoImposto;
    const lucroLiquido = precoVenda - deducoesTotais;
    
    // Margem líquida: Quanto % do dinheiro que entra é efetivamente meu?
    const margemLiquida = (lucroLiquido / precoVenda) * 100;

    // 3. Atualizar a tela com os valores formatados
    document.getElementById('out-receita').textContent = `R$ ${precoVenda.toFixed(2)}`;
    document.getElementById('out-custos').textContent = `R$ ${custoTotalAquisicao.toFixed(2)}`;
    document.getElementById('out-mkp').textContent = `R$ ${descontoMkp.toFixed(2)} (${taxaMkp}%)`;
    document.getElementById('out-impostos').textContent = `R$ ${descontoImposto.toFixed(2)} (${taxaImposto}%)`;
    
    const outLucro = document.getElementById('out-lucro');
    outLucro.textContent = `R$ ${lucroLiquido.toFixed(2)}`;
    document.getElementById('out-margem').textContent = `${margemLiquida.toFixed(1)}%`;

    // 4. Inteligência Artificial do Veredito (A Lógica do Negócio)
    const alerta = document.getElementById('alerta-veredito');
    
    if (lucroLiquido <= 0) {
        alerta.className = "alerta erro";
        alerta.innerHTML = "❌ <strong>INVIÁVEL:</strong> Você terá PREJUÍZO vendendo a este preço. Aumente o preço de venda ou negocie melhor com o fornecedor.";
        outLucro.style.color = "#ef4444";
    } else if (margemLiquida > 0 && margemLiquida < 10) {
        alerta.className = "alerta alerta-amarelo";
        alerta.innerHTML = "⚠️ <strong>ALERTA DE RISCO:</strong> Lucro muito baixo. Qualquer imprevisto (como uma devolução) causará prejuízo. Avalie com cuidado.";
        outLucro.style.color = "#d97706";
    } else if (margemLiquida >= 10 && margemLiquida <= 20) {
        alerta.className = "alerta sucesso";
        alerta.innerHTML = "✅ <strong>VIÁVEL:</strong> Produto saudável. Margem de lucro padrão do mercado. Pode investir.";
        outLucro.style.color = "#16a34a";
    } else {
        alerta.className = "alerta sucesso";
        alerta.innerHTML = "🚀 <strong>EXCELENTE OPÇÃO:</strong> Margem de lucro altíssima! Excelente oportunidade de negócio (Oceano Azul).";
        outLucro.style.color = "#16a34a";
    }
}
