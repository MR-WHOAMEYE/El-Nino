/**
 * ============================================================================
 * COUNTERFACTUAL INTERVENTIONS & GREEDY BUDGET ALLOCATOR
 * ============================================================================
 * Models policy decisions: allocating resilience funding to minimize loss
 * with vulnerability-weighted equity priority.
 */

import { evaluateAllDistricts, computeEquityMetrics } from './equity.js';

export const INTERVENTION_CATALOG = [
  {
    id: 'irrigation_drip',
    name: 'Micro-Irrigation & Farm Ponds',
    category: 'Water Security',
    targetHazard: 'drought',
    costPerPerson: 450, // INR / person
    effectiveness: 0.65, // 65% reduction in drought yield penalty
    vulnerabilityReduction: 0.35, // Lowers irrigation deficit
    description: 'Solar micro-drip networks and decentralized percolation ponds buffering dry spells.'
  },
  {
    id: 'drainage_floodways',
    name: 'Urban Drainage & Floodways',
    category: 'Civil Infrastructure',
    targetHazard: 'flood',
    costPerPerson: 650,
    effectiveness: 0.70,
    vulnerabilityReduction: 0.30,
    description: 'Desilt natural stormwater canals and informal settlement flood embankments.'
  },
  {
    id: 'drought_seeds',
    name: 'Climate-Resilient Seed Kits',
    category: 'Agronomy',
    targetHazard: 'drought',
    costPerPerson: 180,
    effectiveness: 0.50,
    vulnerabilityReduction: 0.25,
    description: 'Subsidized short-duration millet and drought-tolerant seed distributed before planting.'
  },
  {
    id: 'early_warning',
    name: 'Multi-Hazard Early Warning & SMS',
    category: 'Digital Resilience',
    targetHazard: 'all',
    costPerPerson: 40,
    effectiveness: 0.30,
    vulnerabilityReduction: 0.15,
    description: 'Hyperlocal forecast dissemination in regional languages paired with community drills.'
  },
  {
    id: 'crop_insurance',
    name: 'Parametric Index Insurance',
    category: 'Social Protection',
    targetHazard: 'all',
    costPerPerson: 220,
    effectiveness: 0.55,
    vulnerabilityReduction: 0.40,
    description: 'Direct cash transfers triggered by satellite soil moisture and rain gauge deficit thresholds.'
  }
];

/**
 * Greedily allocates an aggregate budget (in Millions INR) across districts
 * to maximize avoided risk weighted by vulnerable population.
 */
export function allocateBudgetOptimally(districts, nino34, month, budgetMillions = 500, selectedInterventionId = 'irrigation_drip') {
  const intervention = INTERVENTION_CATALOG.find(i => i.id === selectedInterventionId) || INTERVENTION_CATALOG[0];
  const budgetInRupees = budgetMillions * 1000000;

  // Unmitigated baseline
  const baselineDistricts = evaluateAllDistricts(districts, nino34, month);
  const baselineEquity = computeEquityMetrics(baselineDistricts);

  // Score candidate locations by benefit-cost ratio:
  // Benefit = BaseRisk * Vulnerability * InterventionEffectiveness * Population
  // Cost = Population * CostPerPerson
  const candidates = baselineDistricts.map(d => {
    const isTargetHazardMatch =
      (intervention.targetHazard === 'all') ||
      (intervention.targetHazard === 'drought' && d.rainfallAnomaly < 0) ||
      (intervention.targetHazard === 'flood' && d.rainfallAnomaly > 0);

    const matchMultiplier = isTargetHazardMatch ? 1.0 : 0.25;
    const totalProgramCost = d.population * intervention.costPerPerson;
    const rawAvoidedRiskPerPerson = d.baseRisk * intervention.effectiveness * matchMultiplier;
    const equityWeight = Math.pow(d.vulnerabilityScore, 1.5);
    const totalBenefit = rawAvoidedRiskPerPerson * d.population * equityWeight;
    const benefitCostRatio = totalProgramCost > 0 ? (totalBenefit / totalProgramCost) : 0;

    return {
      district: d,
      totalProgramCost,
      benefitCostRatio,
      isTargetHazardMatch
    };
  }).sort((a, b) => b.benefitCostRatio - a.benefitCostRatio);

  let remainingBudget = budgetInRupees;
  const fundedDistricts = [];
  const allocationBreakdown = {};

  for (const candidate of candidates) {
    if (remainingBudget <= 0) break;
    const cost = candidate.totalProgramCost;
    if (cost <= remainingBudget) {
      // Fully funded
      fundedDistricts.push({
        districtId: candidate.district.id,
        fundedShare: 1.0,
        allocatedAmount: cost
      });
      allocationBreakdown[candidate.district.id] = {
        fundedShare: 1.0,
        amountMillions: Number((cost / 1000000).toFixed(2))
      };
      remainingBudget -= cost;
    } else {
      // Partial funding
      const share = remainingBudget / cost;
      if (share > 0.15) { // Only fund if at least 15% coverage achievable
        fundedDistricts.push({
          districtId: candidate.district.id,
          fundedShare: share,
          allocatedAmount: remainingBudget
        });
        allocationBreakdown[candidate.district.id] = {
          fundedShare: Number(share.toFixed(2)),
          amountMillions: Number((remainingBudget / 1000000).toFixed(2))
        };
        remainingBudget = 0;
      }
    }
  }

  // Calculate post-intervention state
  const postDistricts = baselineDistricts.map(d => {
    const alloc = allocationBreakdown[d.id];
    if (!alloc) return d;

    const partialEffectiveness = intervention.effectiveness * alloc.fundedShare;
    const partialVulnReduction = (intervention.vulnerabilityReduction || 0.2) * alloc.fundedShare;

    const mitigatedHazard = Math.abs(d.rainfallAnomaly) * (1.0 - partialEffectiveness);
    const mitigatedVuln = d.vulnerabilityScore * (1.0 - partialVulnReduction);
    const newRisk = mitigatedHazard * mitigatedVuln;

    return {
      ...d,
      effectiveRisk: Number(newRisk.toFixed(2)),
      avoidedRisk: Number((d.baseRisk - newRisk).toFixed(2)),
      fundedShare: alloc.fundedShare,
      allocatedAmountMillions: alloc.amountMillions
    };
  });

  const postEquity = computeEquityMetrics(postDistricts);

  return {
    intervention,
    budgetMillions,
    totalSpentMillions: Number(((budgetInRupees - remainingBudget) / 1000000).toFixed(2)),
    unallocatedBudgetMillions: Number((remainingBudget / 1000000).toFixed(2)),
    fundedCount: fundedDistricts.length,
    baselineEquity,
    postEquity,
    equityGapImprovement: Number((baselineEquity.equityGapRatio - postEquity.equityGapRatio).toFixed(2)),
    giniImprovement: Number((baselineEquity.giniCoefficient - postEquity.giniCoefficient).toFixed(3)),
    postDistricts
  };
}
