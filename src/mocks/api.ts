import type { Category, Item } from '@/lib/db';

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Postes e Estruturas', slug: 'postes-e-estruturas', icon: 'ConstructionIcon' },
  { id: 2, name: 'Luminárias e Lâmpadas', slug: 'luminarias-e-lampadas', icon: 'BulbIcon' },
  { id: 3, name: 'Materiais Elétricos', slug: 'materiais-eletricos', icon: 'CircuitBoardIcon' },
];

const MOCK_ITEMS: Item[] = [
  // Postes e Estruturas
  {
    id: 101, categoryId: 1, name: 'Aço Galvanizado', firstLetter: 'A', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Aço Galvanizado\n\nMaterial metálico com revestimento de zinco para proteção contra corrosão, amplamente utilizado na fabricação de postes e estruturas de iluminação pública.\n\n## Características\n\n- Resistência à corrosão por até **50 anos**\n- Espessura de revestimento: 85 µm (média)\n- Norma aplicável: **ABNT NBR 7007**\n\n## Aplicações\n\n- Postes troncocônicos\n- Braços e suportes\n- Parafusos e porcas estruturais\n\n## Observações\n\nVerificar certificado de galvanização e laudo de espessura antes da aplicação.`,
  },
  {
    id: 102, categoryId: 1, name: 'Braço Curvo Simples', firstLetter: 'B', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Braço Curvo Simples\n\nExtensão metálica fixada ao topo do poste para projetar a luminária sobre a via, garantindo melhor distribuição luminosa.\n\n## Especificações Típicas\n\n- Comprimento: **1,0 m a 2,5 m**\n- Diâmetro da ponteira: 60 mm\n- Material: Aço carbono galvanizado\n\n## Montagem\n\nFixação ao poste por abraçadeira ou encaixe no topo. Inclinação ajustável entre 5° e 15°.\n\n## Atenção\n\nRespeitar o torque de aperto dos parafusos conforme manual do fabricante.`,
  },
  {
    id: 103, categoryId: 1, name: 'Braço Duplo', firstLetter: 'B', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Braço Duplo\n\nSuporta duas luminárias em sentidos opostos, indicado para iluminação de avenidas largas e cruzamentos.\n\n## Especificações Típicas\n\n- Comprimento por lado: **1,5 m a 3,0 m**\n- Abertura total: até 6,0 m\n- Diâmetro interno: 60 mm\n\n## Vantagens\n\n- Reduz o número de postes necessários\n- Melhor uniformidade em pistas duplas\n- Instalação centralizada na mediana`,
  },
  {
    id: 104, categoryId: 1, name: 'Caixa de Derivação', firstLetter: 'C', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Caixa de Derivação\n\nComponente instalado na base do poste ou no ponto de derivação para conexão e proteção dos circuitos elétricos.\n\n## Características\n\n- Grau de proteção: **IP 65**\n- Material: Polipropileno ou alumínio\n- Dimensões: 200×150×80 mm (padrão)\n\n## Conteúdo Típico\n\n- Bornes de conexão\n- Disjuntor de proteção\n- Relé fotoelétrico (quando aplicável)\n\n## Norma\n\nConforme **ABNT NBR 5410** e especificações da concessionária local.`,
  },
  {
    id: 105, categoryId: 1, name: 'Concreto Armado Circular', firstLetter: 'C', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Poste de Concreto Armado Circular\n\nPoste fabricado em concreto com armação de aço, muito utilizado em redes de distribuição e iluminação pública.\n\n## Especificações\n\n- Alturas disponíveis: **7, 9, 11, 13 m**\n- Carga nominal: 300 a 1200 daN\n- Norma: **ABNT NBR 8451**\n\n## Vantagens\n\n- Alta durabilidade (vida útil > 50 anos)\n- Resistência a vandalismo\n- Baixa manutenção\n\n## Instalação\n\nFundação por embutimento (1/6 da altura + 0,5 m) ou sapata de concreto.`,
  },
  {
    id: 106, categoryId: 1, name: 'Estrutura Octogonal', firstLetter: 'E', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Poste Metálico Octogonal\n\nPoste de seção transversal octogonal fabricado em aço de alta resistência, com excelente relação peso/resistência.\n\n## Especificações\n\n- Alturas: **6 a 14 m**\n- Espessura da chapa: 3 a 6 mm\n- Aço: ASTM A572 Gr50 ou similar\n\n## Diferenciais\n\n- Menor peso que postes circulares equivalentes\n- Estética mais moderna\n- Parafuso de acesso embutido\n\n## Tratamento Superficial\n\nGalvanização a fogo ou pintura epóxi + poliuretano.`,
  },
  {
    id: 107, categoryId: 1, name: 'Fundação por Embutimento', firstLetter: 'F', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Fundação por Embutimento\n\nMétodo de fixação em que a base do poste é enterrada diretamente no solo, sem uso de parafusos de ancoragem.\n\n## Profundidade Mínima\n\n| Altura do Poste | Embutimento |\n|---|---|\n| 7 m | 1,67 m |\n| 9 m | 2,00 m |\n| 11 m | 2,33 m |\n\n## Procedimento\n\n1. Escavar buraco 20% maior que a base\n2. Compactar fundo com brita\n3. Posicionar e alinhar o poste\n4. Preencher com concreto magro\n5. Aguardar cura mínima de 72h`,
  },
  {
    id: 108, categoryId: 1, name: 'Poste Troncocônico', firstLetter: 'P', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Poste Troncocônico Metálico\n\nPoste com seção circular que diminui progressivamente da base ao topo. É o modelo mais comum em projetos de iluminação pública.\n\n## Especificações\n\n- Alturas: **5 a 16 m**\n- Diâmetro da base: 133 a 250 mm\n- Diâmetro do topo: 60 a 76 mm\n- Espessura: 3 a 5 mm\n\n## Certificação\n\nDeve atender à **ABNT NBR 16884** (postes metálicos para iluminação).`,
  },
  {
    id: 109, categoryId: 1, name: 'Tampa de Inspeção', firstLetter: 'T', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Tampa de Inspeção\n\nAcessório fixado na lateral do poste que permite acesso aos condutores e componentes internos sem necessidade de escada.\n\n## Características\n\n- Posição: 0,30 m a 1,00 m do solo\n- Material: Aço galvanizado ou alumínio\n- Fixação: 4 parafusos M8\n\n## Uso\n\nUtilizada para inspeção periódica dos circuitos, troca de fusíveis e conexão de novos ramais.`,
  },
  {
    id: 110, categoryId: 1, name: 'Topo de Poste Universal', firstLetter: 'T', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Topo de Poste Universal\n\nAdaptador instalado na extremidade superior do poste para compatibilizar diferentes diâmetros de braços e luminárias.\n\n## Compatibilidade\n\n- Ponteiras de 48 mm, 60 mm e 76 mm\n- Encaixe direto ou com redução\n\n## Material\n\nFundição de alumínio com tratamento anticorrosivo.\n\n## Atenção\n\nVerificar compatibilidade com o diâmetro interno do braço antes da aquisição.`,
  },

  // Luminárias e Lâmpadas
  {
    id: 201, categoryId: 2, name: 'Armadura LED Viária', firstLetter: 'A', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Armadura LED Viária\n\nLuminária completa para iluminação pública, com módulo LED integrado, driver e óptica, pronta para instalação em braços de 60 mm.\n\n## Especificações Típicas\n\n- Potência: **60 W a 200 W**\n- Fluxo luminoso: 8.000 a 28.000 lm\n- IP: **IP66**\n- IK: IK08\n- Temperatura de cor: **4.000 K ou 5.000 K**\n\n## Normas\n\n**NBR 5101** (Iluminação Pública) e **IEC 60598**.`,
  },
  {
    id: 202, categoryId: 2, name: 'Difusor Acrílico', firstLetter: 'D', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Difusor Acrílico\n\nComponente transparente da luminária responsável pela proteção dos LEDs e distribuição uniforme da luz.\n\n## Características\n\n- Material: PMMA (polimetilmetacrilato)\n- Transmitância luminosa: > 92%\n- Resistência UV: sim (tratamento superficial)\n\n## Vida Útil\n\nAmarela progressivamente após 10–15 anos. Substituição recomendada durante revisão geral da luminária.`,
  },
  {
    id: 203, categoryId: 2, name: 'Driver LED Regulável', firstLetter: 'D', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Driver LED Regulável\n\nFonte de alimentação eletrônica que converte a tensão da rede em corrente constante para os módulos LED, com controle de dimming.\n\n## Especificações\n\n- Entrada: **100–277 V AC**\n- Saída: corrente constante programável\n- Fator de potência: > 0,95\n- Rendimento: > 90%\n- Dimming: 0–10 V, DALI ou NFC\n\n## Proteções\n\nSobrecarga, curto-circuito, sobretensão e subtensão.`,
  },
  {
    id: 204, categoryId: 2, name: 'Lâmpada HPS 250W', firstLetter: 'L', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Lâmpada de Sódio de Alta Pressão (HPS) 250 W\n\nLâmpada de descarga amplamente utilizada antes da migração para LED. Ainda presente em parques de reposição.\n\n## Características\n\n- Fluxo luminoso: ~28.000 lm\n- Eficiência: ~112 lm/W\n- IRC: 20–25\n- Temperatura de cor: 2.200 K (laranja)\n- Vida útil: 16.000 h\n\n## Observação\n\nConteúdo de mercúrio exige descarte especial conforme **ABNT NBR 10004** (resíduo perigoso).`,
  },
  {
    id: 205, categoryId: 2, name: 'Lâmpada LED Modular 100W', firstLetter: 'L', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Módulo LED Substituto 100 W\n\nKIT de retrofit para substituição de lâmpadas HPS em luminárias existentes, sem troca da armadura.\n\n## Vantagens\n\n- Redução de consumo de até **60%**\n- Instalação sem obra civil\n- Payback médio: 24–36 meses\n\n## Especificações\n\n- Potência: 100 W\n- Fluxo: 13.000 lm\n- IP: IP65\n- Vida útil: 50.000 h (L80B10)`,
  },
  {
    id: 206, categoryId: 2, name: 'Luminária Cobra Head', firstLetter: 'L', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Luminária Cobra Head\n\nModelo clássico de luminária viária com formato de "cabeça de cobra", encaixe direto em braços de 60 mm.\n\n## Características\n\n- Carcaça em alumínio fundido\n- Difusor em vidro temperado ou policarbonato\n- Compatível com lâmpadas HPS, MH e módulos LED\n\n## Manutenção\n\nAbertura da tampa por trinco lateral. Limpeza semestral recomendada com pano úmido e detergente neutro.`,
  },
  {
    id: 207, categoryId: 2, name: 'Óptica Assimétrica', firstLetter: 'O', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Óptica Assimétrica\n\nSistema de lentes e refletores que direciona o fluxo luminoso predominantemente para um lado, ideal para vias onde o poste é instalado na calçada.\n\n## Distribuições Disponíveis\n\n- **Tipo II** – vias de média largura\n- **Tipo III** – vias largas\n- **Tipo VS** – iluminação de faixada\n\n## Parâmetros\n\nDefinidos conforme **IESNA LM-79** e simulação em software fotométrico (DIALux, Relux).`,
  },
  {
    id: 208, categoryId: 2, name: 'Protetor Contra Surtos', firstLetter: 'P', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Protetor Contra Surtos (DPS)\n\nDispositivo instalado na luminária para proteger o driver e módulo LED contra surtos de tensão provocados por descargas atmosféricas.\n\n## Especificações\n\n- Tensão de operação: **100–277 V AC**\n- Nível de proteção: ≤ 1,5 kV\n- Corrente de surto: 10 kA (8/20 µs)\n- Norma: **IEC 61643-11**\n\n## Recomendação\n\nObrigatório em regiões com alta incidência de raios (níveis ceráunicos > 40 dias/ano).`,
  },
  {
    id: 209, categoryId: 2, name: 'Relé Fotoelétrico', firstLetter: 'R', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Relé Fotoelétrico (Fotocélula)\n\nDispositivo que comanda automaticamente o acionamento e desligamento da iluminação conforme o nível de luminosidade natural.\n\n## Características\n\n- Tensão: **127 V ou 220 V AC**\n- Corrente máxima: 1.000 W\n- Nível de acionamento: ~30 lux (liga) / ~50 lux (desliga)\n- Encaixe padrão: rosca ANSI C136.10 (twist-lock)\n\n## Vida Útil\n\n~100.000 ciclos de operação.`,
  },
  {
    id: 210, categoryId: 2, name: 'Vidro Temperado', firstLetter: 'V', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Vidro Temperado para Luminária\n\nDifusor de vidro utilizado em luminárias do tipo cobra head, com alta resistência mecânica e térmica.\n\n## Características\n\n- Espessura: 4 mm (padrão)\n- Transmitância: > 90%\n- Resistência ao impacto: 5× superior ao vidro comum\n- Temperatura: suporta até 200 °C\n\n## Substituição\n\nEm caso de trinca ou quebra, nunca operar a luminária sem o difusor — risco de choque elétrico e dano à lâmpada.`,
  },

  // Materiais Elétricos
  {
    id: 301, categoryId: 3, name: 'Aterramento', firstLetter: 'A', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Sistema de Aterramento\n\nConjunto de eletrodos e condutores que conecta as partes metálicas da instalação ao solo, garantindo segurança e estabilidade da tensão.\n\n## Componentes\n\n- Haste de cobre 5/8" × 2,4 m\n- Conector tipo grampo ou solda exotérmica\n- Cabo de cobre nu 16 mm²\n\n## Resistência Máxima\n\n≤ **10 Ω** (sistemas de iluminação pública)\n\n## Norma\n\n**ABNT NBR 5410** e **NBR 5419** (proteção contra raios).`,
  },
  {
    id: 302, categoryId: 3, name: 'Cabo PP 3×2,5mm²', firstLetter: 'C', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Cabo PP Flexível 3×2,5 mm²\n\nCabo de cobre flexível com isolação em PVC, utilizado na ligação interna do poste entre a caixa de derivação e a luminária.\n\n## Características\n\n- Seção: 3 condutores de 2,5 mm²\n- Tensão: 0,6/1 kV\n- Temperatura máxima: 70 °C\n- Norma: **ABNT NBR NM 247-3**\n\n## Comprimento Típico\n\nFornecido em rolos de 100 m. Consumo médio por ponto: 5 a 10 m (incluindo ramal interno).`,
  },
  {
    id: 303, categoryId: 3, name: 'Cabo XLPE 16mm²', firstLetter: 'C', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Cabo XLPE Unipolar 16 mm²\n\nCabo de média tensão com isolação em polietileno reticulado, utilizado em ramais subterrâneos de alimentação de circuitos de iluminação.\n\n## Características\n\n- Seção: 16 mm²\n- Tensão: até **1 kV**\n- Isolação: XLPE (polietileno reticulado)\n- Temperatura máxima: 90 °C (operação) / 250 °C (curto-circuito)\n\n## Vantagem sobre PVC\n\nMaior capacidade de corrente e melhor desempenho em temperaturas elevadas.`,
  },
  {
    id: 304, categoryId: 3, name: 'Conector Perfurante de Isolação', firstLetter: 'C', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Conector Perfurante de Isolação (CPI)\n\nConector que perfura a isolação do cabo principal para derivar a energia sem necessidade de descascar os condutores, reduzindo o risco de falhas.\n\n## Especificações\n\n- Ramal principal: 16–95 mm²\n- Ramal derivado: 1,5–16 mm²\n- Material: liga de alumínio com parafuso de torque pré-definido\n\n## Aplicação\n\nConexão de ramais em redes aéreas de baixa tensão. Vedação total, apto para serviço em linha viva.`,
  },
  {
    id: 305, categoryId: 3, name: 'Disjuntor Bipolar 25A', firstLetter: 'D', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Disjuntor Termomagnético Bipolar 25 A\n\nDispositivo de proteção instalado na caixa de derivação para proteger o circuito de iluminação contra sobrecarga e curto-circuito.\n\n## Especificações\n\n- Corrente nominal: **25 A**\n- Tensão: 220/380 V AC\n- Poder de corte: 3.000 A (mínimo)\n- Padrão: DIN / trilho simétrico\n\n## Dimensionamento\n\nSelecionar corrente nominal acima de 1,25× a corrente de plena carga do circuito.`,
  },
  {
    id: 306, categoryId: 3, name: 'Fusível NH', firstLetter: 'F', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Fusível NH (Faca)\n\nElemento de proteção por fusão instalado no QDL (Quadro de Distribuição de Iluminação) para proteção dos circuitos contra curto-circuito.\n\n## Tipos\n\n| Tamanho | Corrente Máx. | Tensão |\n|---|---|---|\n| NH 00 | 160 A | 500 V |\n| NH 1 | 250 A | 500 V |\n| NH 2 | 400 A | 500 V |\n\n## Norma\n\n**IEC 60269** / **ABNT NBR NM 61**.`,
  },
  {
    id: 307, categoryId: 3, name: 'Painel de Controle de Iluminação', firstLetter: 'P', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Painel de Controle de Iluminação Pública\n\nQuadro elétrico externo que concentra os dispositivos de proteção, medição e acionamento de múltiplos circuitos de iluminação.\n\n## Componentes Típicos\n\n- Medidor de energia bidirecional\n- Disjuntores por circuito\n- Relé fotoelétrico central\n- Contatores de potência\n- IHM ou telemetria (projetos modernos)\n\n## Grau de Proteção\n\nMínimo **IP 54** para instalação em poste ou muro exposto.`,
  },
  {
    id: 308, categoryId: 3, name: 'Relé de Controle de Demanda', firstLetter: 'R', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Relé de Controle de Demanda\n\nDispositivo programável que reduz a potência dos circuitos de iluminação em horários de menor fluxo de pedestres e veículos.\n\n## Funcionalidades\n\n- Programação horária por dia da semana\n- Dimming em 2 a 4 níveis (ex: 100% → 50% → 30%)\n- Monitoramento de consumo\n- Comunicação: RS-485, GSM ou LoRa\n\n## Economia\n\nRedução de 20–40% no consumo de energia elétrica em horários noturnos de menor movimento.`,
  },
  {
    id: 309, categoryId: 3, name: 'Terminal de Compressão', firstLetter: 'T', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Terminal de Compressão\n\nConector prensado a frio utilizado para terminação de cabos em barramentos, disjuntores e conectores de painel.\n\n## Tipos\n\n- **Terminal tubular** (para cabos flexíveis)\n- **Terminal de furo** (conexão em barra)\n\n## Seções Disponíveis\n\n1,5 mm² a 240 mm²\n\n## Ferramental\n\nAlicate de compressão hidráulico ou mecânico conforme a seção. Utilizar sempre o terminal adequado ao cabo — nunca dobrar o cabo nu.`,
  },
  {
    id: 310, categoryId: 3, name: 'Tubo Conduite Flexível', firstLetter: 'T', updatedAt: '2024-01-01T00:00:00.000Z',
    content: `# Tubo Conduite Flexível\n\nEletroduto corrugado utilizado para proteção mecânica dos condutores no trecho entre a caixa de derivação e a luminária dentro do braço do poste.\n\n## Características\n\n- Material: PVC ou polipropileno\n- Diâmetros: 3/4" a 2"\n- Resistência ao esmagamento: ≥ 320 N\n- Temperatura: −5 °C a +60 °C\n\n## Instalação\n\nFixar com abraçadeiras a cada 50 cm. Vedar as extremidades com buchas para evitar entrada de água e insetos.`,
  },
];

interface ItemsApiResponse {
  items: Item[];
  hasMore: boolean;
}

const originalFetch = window.fetch.bind(window);

window.fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = input instanceof Request ? input.url : String(input);

  if (url === '/api/categories') {
    return Promise.resolve(
      new Response(JSON.stringify(MOCK_CATEGORIES), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  }

  if (url.startsWith('/api/items')) {
    const urlObj = new URL(url, 'http://localhost');
    const updatedAfter = urlObj.searchParams.get('updated_after') ?? '1970-01-01T00:00:00.000Z';
    const page = Number(urlObj.searchParams.get('page') ?? '1');
    const limit = Number(urlObj.searchParams.get('limit') ?? '200');

    const filtered = MOCK_ITEMS.filter((item) => item.updatedAt > updatedAfter);
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    const hasMore = start + limit < filtered.length;

    const body: ItemsApiResponse = { items: paginated, hasMore };
    return Promise.resolve(
      new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  }

  return originalFetch(input, init);
};
