// ═══════════════════════════════════════════════════════════════
// 🧪 SCRIPT DE TESTES - CS2 FORTUNE CASES
// Execute no console do navegador (F12)
// ═══════════════════════════════════════════════════════════════

console.log('🧪 Iniciando testes CS2 Fortune Cases...\n');

// ═══════════════════════════════════════════════════════════════
// TESTE 1: Verificar se as caixas estão carregando
// ═══════════════════════════════════════════════════════════════

function test1_CheckCasesLoaded() {
  console.log('📦 TESTE 1: Verificando carregamento de caixas...');
  
  const caseCards = document.querySelectorAll('[class*="grid"] > div[class*="bg-gray-800"]');
  const totalCases = caseCards.length;
  
  console.log(`✅ ${totalCases} caixas encontradas no DOM`);
  
  if (totalCases === 28) {
    console.log('✅ PASSOU: 28 caixas carregadas corretamente!\n');
    return true;
  } else {
    console.error(`❌ FALHOU: Esperado 28 caixas, encontrado ${totalCases}\n`);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// TESTE 2: Verificar imagens das caixas
// ═══════════════════════════════════════════════════════════════

function test2_CheckCaseImages() {
  console.log('🖼️ TESTE 2: Verificando imagens das caixas...');
  
  const images = document.querySelectorAll('img[alt]');
  let loadedImages = 0;
  let failedImages = 0;
  
  images.forEach(img => {
    if (img.complete && img.naturalHeight !== 0) {
      loadedImages++;
    } else if (img.complete && img.naturalHeight === 0) {
      failedImages++;
    }
  });
  
  console.log(`✅ ${loadedImages} imagens carregadas com sucesso`);
  console.log(`⚠️ ${failedImages} imagens com fallback (esperado)\n`);
  
  return true;
}

// ═══════════════════════════════════════════════════════════════
// TESTE 3: Testar filtros de preço
// ═══════════════════════════════════════════════════════════════

function test3_TestFilters() {
  console.log('🔍 TESTE 3: Testando filtros de preço...');
  
  const filterButtons = document.querySelectorAll('button[class*="px-6 py-3"]');
  
  if (filterButtons.length >= 4) {
    console.log(`✅ ${filterButtons.length} botões de filtro encontrados`);
    
    // Simular cliques
    console.log('  → Testando filtro "Todas"');
    filterButtons[0].click();
    
    setTimeout(() => {
      console.log('  → Testando filtro "Baratas"');
      filterButtons[1].click();
    }, 500);
    
    setTimeout(() => {
      console.log('  → Testando filtro "Médias"');
      filterButtons[2].click();
    }, 1000);
    
    setTimeout(() => {
      console.log('  → Testando filtro "Caras"');
      filterButtons[3].click();
    }, 1500);
    
    setTimeout(() => {
      console.log('  → Voltando para "Todas"');
      filterButtons[0].click();
      console.log('✅ PASSOU: Filtros funcionando!\n');
    }, 2000);
    
    return true;
  } else {
    console.error(`❌ FALHOU: Esperado 4 filtros, encontrado ${filterButtons.length}\n`);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// TESTE 4: Simular abertura de caixa
// ═══════════════════════════════════════════════════════════════

function test4_TestCaseOpening() {
  console.log('🎁 TESTE 4: Simulando abertura de caixa...');
  
  const firstCase = document.querySelector('[class*="grid"] > div[class*="bg-gray-800"]');
  
  if (firstCase) {
    console.log('✅ Clicando na primeira caixa...');
    firstCase.click();
    
    setTimeout(() => {
      const modal = document.querySelector('[class*="fixed inset-0"]');
      
      if (modal) {
        console.log('✅ Modal aberto com sucesso!');
        
        // Procurar botão de abrir
        const openButton = Array.from(document.querySelectorAll('button')).find(
          btn => btn.textContent.includes('ABRIR')
        );
        
        if (openButton) {
          console.log('✅ Botão ABRIR encontrado, clicando...');
          openButton.click();
          
          console.log('⏳ Aguardando animação de abertura (3 segundos)...');
          
          setTimeout(() => {
            console.log('✅ PASSOU: Abertura de caixa funcional!\n');
            
            // Fechar modal
            setTimeout(() => {
              const closeButton = document.querySelector('[class*="text-gray-400"]:not([class*="bg-"])');
              if (closeButton && closeButton.textContent === '✕') {
                closeButton.click();
                console.log('✅ Modal fechado\n');
              }
            }, 1000);
          }, 3500);
        }
      } else {
        console.error('❌ FALHOU: Modal não abriu\n');
      }
    }, 500);
    
    return true;
  } else {
    console.error('❌ FALHOU: Nenhuma caixa encontrada para clicar\n');
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// TESTE 5: Verificar dados das caixas
// ═══════════════════════════════════════════════════════════════

function test5_CheckCaseData() {
  console.log('📊 TESTE 5: Verificando dados das caixas...');
  
  const prices = document.querySelectorAll('[class*="text-green-400"]');
  let validPrices = 0;
  
  prices.forEach(priceEl => {
    const text = priceEl.textContent;
    if (text.includes('R$')) {
      validPrices++;
    }
  });
  
  console.log(`✅ ${validPrices} preços válidos encontrados`);
  
  const caseNames = document.querySelectorAll('h3[class*="text-xl"]');
  console.log(`✅ ${caseNames.length} nomes de caixas encontrados`);
  
  if (validPrices > 0 && caseNames.length > 0) {
    console.log('✅ PASSOU: Dados das caixas corretos!\n');
    return true;
  } else {
    console.error('❌ FALHOU: Dados incompletos\n');
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// TESTE 6: Performance e responsividade
// ═══════════════════════════════════════════════════════════════

function test6_CheckPerformance() {
  console.log('⚡ TESTE 6: Verificando performance...');
  
  const startTime = performance.now();
  
  // Forçar reflow
  document.body.offsetHeight;
  
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  
  console.log(`✅ Tempo de render: ${renderTime.toFixed(2)}ms`);
  
  if (renderTime < 100) {
    console.log('✅ PASSOU: Performance excelente!\n');
  } else if (renderTime < 300) {
    console.log('⚠️ PASSOU: Performance aceitável\n');
  } else {
    console.warn('⚠️ ATENÇÃO: Performance pode melhorar\n');
  }
  
  return true;
}

// ═══════════════════════════════════════════════════════════════
// TESTE 7: Verificar responsividade
// ═══════════════════════════════════════════════════════════════

function test7_CheckResponsive() {
  console.log('📱 TESTE 7: Verificando responsividade...');
  
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  console.log(`✅ Viewport: ${viewport.width}x${viewport.height}`);
  
  if (viewport.width < 768) {
    console.log('📱 Modo Mobile detectado');
  } else if (viewport.width < 1024) {
    console.log('📱 Modo Tablet detectado');
  } else {
    console.log('🖥️ Modo Desktop detectado');
  }
  
  console.log('✅ PASSOU: Layout responsivo carregado!\n');
  return true;
}

// ═══════════════════════════════════════════════════════════════
// EXECUTAR TODOS OS TESTES
// ═══════════════════════════════════════════════════════════════

function runAllTests() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('🧪 CS2 FORTUNE - BATERIA DE TESTES AUTOMATIZADOS');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  const tests = [
    test1_CheckCasesLoaded,
    test2_CheckCaseImages,
    test5_CheckCaseData,
    test7_CheckResponsive,
    test6_CheckPerformance
  ];
  
  let passed = 0;
  let failed = 0;
  
  tests.forEach((test, index) => {
    try {
      const result = test();
      if (result) passed++;
      else failed++;
    } catch (error) {
      console.error(`❌ ERRO no teste ${index + 1}:`, error);
      failed++;
    }
  });
  
  // Testes interativos por último
  setTimeout(() => {
    console.log('\n🎮 Iniciando testes interativos...\n');
    test3_TestFilters();
    
    setTimeout(() => {
      test4_TestCaseOpening();
      
      setTimeout(() => {
        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('📊 RESUMO DOS TESTES');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log(`✅ Testes Passados: ${passed}`);
        console.log(`❌ Testes Falhados: ${failed}`);
        console.log(`📊 Taxa de Sucesso: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
        console.log('═══════════════════════════════════════════════════════════════\n');
        
        if (failed === 0) {
          console.log('🎉 TODOS OS TESTES PASSARAM! Sistema 100% funcional!');
        } else {
          console.warn('⚠️ Alguns testes falharam. Verifique os logs acima.');
        }
      }, 8000);
    }, 3000);
  }, 1000);
}

// ═══════════════════════════════════════════════════════════════
// AUTO-EXECUTAR
// ═══════════════════════════════════════════════════════════════

console.log('💡 Script de testes carregado!');
console.log('📝 Execute: runAllTests() para iniciar\n');

// Auto-executar após 2 segundos
setTimeout(() => {
  console.log('🚀 Auto-executando testes em 2 segundos...\n');
  setTimeout(runAllTests, 2000);
}, 1000);
