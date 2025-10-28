const express = require('express');
const router = express.Router();
const provablyFairService = require('../services/provablyFair');
const authenticateToken = require('../middleware/auth');

// Store de sessões ativas (em produção, usar banco de dados)
const activeSessions = new Map();
const gameHistory = new Map();

/**
 * POST /api/provably-fair/create-session
 * Cria uma nova sessão de jogo com seeds
 */
router.post('/create-session', authenticateToken, (req, res) => {
    try {
        const { clientSeed } = req.body;
        const userId = req.user.id;

        // Cria nova sessão
        const session = provablyFairService.createGameSession(userId, clientSeed);
        
        // Armazena sessão ativa
        activeSessions.set(userId, session);

        // Retorna apenas dados públicos
        res.json({
            success: true,
            session: {
                serverSeedHash: session.serverSeedHash,
                clientSeed: session.clientSeed,
                nonce: session.nonce,
                userId: session.userId,
                createdAt: session.createdAt
            }
        });
    } catch (error) {
        console.error('❌ Erro ao criar sessão Provably Fair:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

/**
 * GET /api/provably-fair/session
 * Retorna a sessão atual do usuário
 */
router.get('/session', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;
        const session = activeSessions.get(userId);

        if (!session) {
            return res.status(404).json({
                success: false,
                error: 'Nenhuma sessão ativa encontrada'
            });
        }

        res.json({
            success: true,
            session: {
                serverSeedHash: session.serverSeedHash,
                clientSeed: session.clientSeed,
                nonce: session.nonce,
                userId: session.userId,
                createdAt: session.createdAt
            }
        });
    } catch (error) {
        console.error('❌ Erro ao buscar sessão:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

/**
 * PUT /api/provably-fair/update-client-seed
 * Atualiza o client seed do usuário
 */
router.put('/update-client-seed', authenticateToken, (req, res) => {
    try {
        const { clientSeed } = req.body;
        const userId = req.user.id;

        if (!clientSeed || clientSeed.length < 1 || clientSeed.length > 64) {
            return res.status(400).json({
                success: false,
                error: 'Client seed deve ter entre 1 e 64 caracteres'
            });
        }

        let session = activeSessions.get(userId);
        
        if (!session) {
            // Cria nova sessão se não existir
            session = provablyFairService.createGameSession(userId, clientSeed);
        } else {
            // Atualiza client seed na sessão existente
            session.clientSeed = clientSeed;
        }

        activeSessions.set(userId, session);

        res.json({
            success: true,
            session: {
                serverSeedHash: session.serverSeedHash,
                clientSeed: session.clientSeed,
                nonce: session.nonce,
                userId: session.userId,
                createdAt: session.createdAt
            }
        });
    } catch (error) {
        console.error('❌ Erro ao atualizar client seed:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

/**
 * POST /api/provably-fair/open-case
 * Abre uma caixa usando Provably Fair
 */
router.post('/open-case', authenticateToken, (req, res) => {
    try {
        const { caseItems } = req.body;
        const userId = req.user.id;

        if (!caseItems || !Array.isArray(caseItems)) {
            return res.status(400).json({
                success: false,
                error: 'Items da caixa são obrigatórios'
            });
        }

        let session = activeSessions.get(userId);
        
        if (!session) {
            // Cria sessão automaticamente se não existir
            session = provablyFairService.createGameSession(userId);
            activeSessions.set(userId, session);
        }

        // Incrementa nonce
        session = provablyFairService.incrementNonce(session);
        
        // Gera resultado
        const resultData = provablyFairService.generateResult(
            session.serverSeed,
            session.clientSeed,
            session.nonce
        );

        // Calcula distribuição de items
        const itemsWithDistribution = provablyFairService.distributeResultToItems(caseItems);
        
        // Seleciona item vencedor
        const wonItem = provablyFairService.selectItemFromResult(resultData.result, itemsWithDistribution);

        // Gera dados de verificação
        const verificationData = provablyFairService.generateVerificationData(
            session.serverSeed,
            session.clientSeed,
            session.nonce,
            resultData.result,
            wonItem
        );

        // Salva no histórico
        const historyKey = `${userId}:${session.nonce}`;
        gameHistory.set(historyKey, {
            ...verificationData,
            caseItems: itemsWithDistribution,
            openedAt: new Date().toISOString()
        });

        // Atualiza sessão
        activeSessions.set(userId, session);

        res.json({
            success: true,
            result: {
                wonItem,
                nonce: session.nonce,
                serverSeedHash: session.serverSeedHash,
                result: resultData.result,
                verificationData: {
                    serverSeedHash: verificationData.serverSeedHash,
                    clientSeed: verificationData.clientSeed,
                    nonce: verificationData.nonce,
                    result: verificationData.result
                }
            }
        });
    } catch (error) {
        console.error('❌ Erro ao abrir caixa:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

/**
 * POST /api/provably-fair/verify
 * Verifica um resultado específico
 */
router.post('/verify', (req, res) => {
    try {
        const { serverSeed, clientSeed, nonce, expectedResult } = req.body;

        if (!serverSeed || !clientSeed || nonce === undefined || expectedResult === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Todos os parâmetros são obrigatórios'
            });
        }

        // Gera resultado baseado nos parâmetros
        const resultData = provablyFairService.generateResult(serverSeed, clientSeed, nonce);
        
        // Verifica se confere
        const isValid = resultData.result === expectedResult;

        // Gera hash do server seed para verificação
        const serverSeedHash = provablyFairService.generateServerSeedHash(serverSeed);

        res.json({
            success: true,
            verification: {
                isValid,
                inputs: {
                    serverSeed,
                    serverSeedHash,
                    clientSeed,
                    nonce
                },
                process: {
                    combinedString: resultData.combined,
                    resultHash: resultData.hash,
                    generatedResult: resultData.result,
                    expectedResult
                },
                match: isValid
            }
        });
    } catch (error) {
        console.error('❌ Erro ao verificar resultado:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

/**
 * GET /api/provably-fair/history
 * Retorna histórico de jogos do usuário
 */
router.get('/history', authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;
        const userHistory = [];

        // Busca histórico do usuário
        for (const [key, data] of gameHistory.entries()) {
            if (key.startsWith(`${userId}:`)) {
                userHistory.push(data);
            }
        }

        // Ordena por data (mais recente primeiro)
        userHistory.sort((a, b) => new Date(b.openedAt) - new Date(a.openedAt));

        res.json({
            success: true,
            history: userHistory.slice(0, 50) // Últimos 50 jogos
        });
    } catch (error) {
        console.error('❌ Erro ao buscar histórico:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

/**
 * GET /api/provably-fair/reveal/:nonce
 * Revela o server seed de uma jogada específica
 */
router.get('/reveal/:nonce', authenticateToken, (req, res) => {
    try {
        const { nonce } = req.params;
        const userId = req.user.id;
        const historyKey = `${userId}:${nonce}`;
        
        const gameData = gameHistory.get(historyKey);

        if (!gameData) {
            return res.status(404).json({
                success: false,
                error: 'Jogo não encontrado'
            });
        }

        res.json({
            success: true,
            reveal: {
                serverSeed: gameData.serverSeed,
                serverSeedHash: gameData.serverSeedHash,
                clientSeed: gameData.clientSeed,
                nonce: parseInt(nonce),
                result: gameData.result,
                wonItem: gameData.wonItem,
                isValid: gameData.isValid,
                openedAt: gameData.openedAt
            }
        });
    } catch (error) {
        console.error('❌ Erro ao revelar server seed:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erro interno do servidor' 
        });
    }
});

/**
 * GET /api/provably-fair/info
 * Retorna informações sobre como funciona o sistema
 */
router.get('/info', (req, res) => {
    res.json({
        success: true,
        info: {
            title: "Como funciona o Provably Fair",
            description: "Sistema que garante transparência e justiça em todos os jogos",
            steps: [
                {
                    step: 1,
                    title: "Server Seed",
                    description: "Geramos um seed aleatório no servidor e mostramos seu hash SHA256 para você"
                },
                {
                    step: 2,
                    title: "Client Seed",
                    description: "Você pode definir seu próprio seed ou usar um gerado automaticamente"
                },
                {
                    step: 3,
                    title: "Nonce",
                    description: "Contador que incrementa a cada jogo para garantir resultados únicos"
                },
                {
                    step: 4,
                    title: "Resultado",
                    description: "Combinamos ServerSeed + ClientSeed + Nonce e geramos um hash SHA256"
                },
                {
                    step: 5,
                    title: "Verificação",
                    description: "Após o jogo, revelamos o Server Seed para você verificar o resultado"
                }
            ],
            formula: "Hash SHA256(ServerSeed:ClientSeed:Nonce)",
            verification_url: "/provably-fair"
        }
    });
});

module.exports = router;