// Developed by CR Prince
// Core Data Processing Module

let rawData = null;
let processedData = null;

export async function loadData() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Data fetch failed');
    rawData = await response.json();
    processEngineData();
    return true;
  } catch (error) {
    console.error('IndoChart Data Engine Error:', error);
    return false;
  }
}

function processEngineData() {
  // Enrich data with Previous Year Engine calculations
  const enrichSeries = (series) => {
    return series.map((item, index) => {
      const prev = index > 0 ? series[index - 1].value : item.value;
      const absChange = item.value - prev;
      const pctChange = prev !== 0 ? (absChange / prev) * 100 : 0;
      return {
        ...item,
        prevValue: prev,
        absChange: Number(absChange.toFixed(2)),
        pctChange: Number(pctChange.toFixed(2)),
        trend: absChange >= 0 ? 'up' : 'down'
      };
    });
  };

  processedData = {
    metadata: rawData.metadata,
    indiaGDP: enrichSeries(rawData.indiaGDP),
    states: rawData.states.map(state => ({
      ...state,
      data: enrichSeries(state.data)
    })),
    sectors: rawData.sectors
  };
}

export function getIndiaData() {
  return processedData?.indiaGDP || [];
}

export function getStatesData() {
  return processedData?.states || [];
}

export function getSectorData() {
  return processedData?.sectors || [];
}

export function getLatestIndiaMetrics() {
  const data = getIndiaData();
  return data[data.length - 1];
}

export function getRankings() {
  const states = getStatesData();
  const latestData = states.map(s => {
    const latest = s.data[s.data.length - 1];
    return { name: s.name, code: s.code, value: latest.value, growth: latest.pctChange };
  });

  const byGdp = [...latestData].sort((a, b) => b.value - a.value);
  const byGrowth = [...latestData].sort((a, b) => b.growth - a.growth);

  return {
    topGdp: byGdp.slice(0, 3),
    bottomGdp: byGdp.slice(-3).reverse(),
    fastestGrowth: byGrowth[0]
  };
}
  
