import React, { useState } from 'react';
import { ConsequenceGraphData, ConsequenceNode } from '../../types';
import {
  Network,
  ChevronRight,
  Info,
  Users,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  GitBranch,
  Layers,
  ChevronDown,
  Activity
} from 'lucide-react';

interface ClimateConsequenceGraphProps {
  data: ConsequenceGraphData;
  onSelectNode?: (nodeId: string) => void;
}

export const ClimateConsequenceGraph: React.FC<ClimateConsequenceGraphProps> = ({
  data,
  onSelectNode,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('EXTREME_HEAT');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    EXTREME_HEAT: true,
    COOLING_DEMAND: true,
    ELECTRICITY_GRID_STRESS: true,
    WATER_PUMPING_DISRUPTION: true,
    SOIL_MOISTURE_DEFICIT: true,
    WATER_AVAILABILITY_REDUCTION: true,
  });

  const selectedNode = data.nodes.find((n) => n.id === selectedNodeId) || data.nodes[0];

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNodeClick = (id: string) => {
    setSelectedNodeId(id);
    if (onSelectNode) onSelectNode(id);
  };

  const getCategoryBadge = (category: ConsequenceNode['category']) => {
    switch (category) {
      case 'signal':
        return { label: 'Climate Signal', color: 'bg-[#D15A42]/10 text-[#D15A42] border-[#D15A42]/30' };
      case 'infrastructural':
        return { label: 'Infrastructure', color: 'bg-[#3368A0]/10 text-[#3368A0] border-[#3368A0]/30' };
      case 'environmental':
        return { label: 'Environmental', color: 'bg-[#4A8C80]/10 text-[#4A8C80] border-[#4A8C80]/30' };
      case 'economic':
        return { label: 'Economic Pressure', color: 'bg-[#E3963E]/10 text-[#E3963E] border-[#E3963E]/30' };
      case 'community':
        return { label: 'Community Vulnerability', color: 'bg-[#A855F7]/10 text-[#A855F7] border-[#A855F7]/30' };
      case 'health':
        return { label: 'Public Health', color: 'bg-[#E11D48]/10 text-[#E11D48] border-[#E11D48]/30' };
      default:
        return { label: 'Consequence', color: 'bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--border)]' };
    }
  };

  // Upstream causes & downstream consequence node lookups
  const upstreamNodes = data.nodes.filter((n) => selectedNode.upstream_node_ids.includes(n.id));
  const downstreamNodes = data.nodes.filter((n) => selectedNode.downstream_node_ids.includes(n.id));

  return (
    <div className="space-y-4">
      {/* Header telemetry summary */}
      <div className="p-4 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D15A42] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-wider text-[var(--text-muted)] uppercase">
              Causal Pathway Simulation • {data.region_name}
            </span>
          </div>
          <h2 className="text-base font-semibold text-[var(--text)] mt-1 flex items-center gap-2">
            <Network size={18} className="text-[var(--brand)]" />
            {data.root_signal}
          </h2>
          <p className="text-xs text-[var(--text-muted)] max-w-2xl mt-0.5">
            {data.summary}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-1.5 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] text-center">
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Causal Nodes</div>
            <div className="text-sm font-semibold font-mono-numbers text-[var(--text)]">{data.nodes.length}</div>
          </div>
          <div className="px-3 py-1.5 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] text-center">
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Primary Confidence</div>
            <div className="text-sm font-semibold font-mono-numbers text-[var(--brand)]">{selectedNode.confidence}%</div>
          </div>
          <div className="px-3 py-1.5 rounded-[4px] bg-[var(--brand-subtle)] border border-[var(--brand)]/30 text-center">
            <div className="text-[10px] text-[var(--brand)] uppercase tracking-wider">Est. Affected</div>
            <div className="text-sm font-semibold font-mono-numbers text-[var(--brand)]">
              {selectedNode.affected_population.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Main split view: Graph Tree on Left, Scientific Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Graph Cascade Tree Column */}
        <div className="lg:col-span-7 rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3">
            <div className="flex items-center gap-2">
              <GitBranch size={16} className="text-[var(--brand)]" />
              <span className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
                Multi-Tier Consequence Hierarchy
              </span>
            </div>
            <span className="text-[11px] text-[var(--text-muted)]">Click node to inspect causes & consequences</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[640px] pr-1">
            {data.nodes.map((node, idx) => {
              const isSelected = node.id === selectedNodeId;
              const isRoot = node.upstream_node_ids.length === 0;
              const badge = getCategoryBadge(node.category);
              const isExpanded = expandedNodes[node.id];

              return (
                <div
                  key={node.id}
                  onClick={() => handleNodeClick(node.id)}
                  className={`group relative p-3 rounded-[5px] border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[var(--brand)] bg-[var(--brand-subtle)]/40 shadow-xs'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] hover:border-[var(--text-muted)]/40'
                  }`}
                  style={{
                    marginLeft: `${Math.min(node.upstream_node_ids.length * 16, 48)}px`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="pt-0.5">
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full ${
                            node.severity === 'critical'
                              ? 'bg-[#D15A42]'
                              : node.severity === 'high'
                              ? 'bg-[#E3963E]'
                              : 'bg-[#3368A0]'
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                            {node.label}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded border uppercase font-mono-numbers font-medium ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                        </div>

                        <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2">
                          {node.explanation}
                        </p>
                      </div>
                    </div>

                    {/* Numeric Indicators */}
                    <div className="flex flex-col items-end shrink-0 pl-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono-numbers font-bold text-[var(--text)]">
                          {node.impact_percent > 0 ? `+${node.impact_percent}%` : `${node.impact_percent}%`}
                        </span>
                        <span className="text-[9px] text-[var(--text-muted)] uppercase">Impact</span>
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono-numbers mt-0.5">
                        {node.confidence}% conf.
                      </div>
                    </div>
                  </div>

                  {/* Flow connect indicator */}
                  {node.downstream_node_ids.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                      <span className="flex items-center gap-1">
                        <ArrowRight size={11} className="text-[var(--brand)]" />
                        Triggers {node.downstream_node_ids.length} downstream effect{node.downstream_node_ids.length > 1 ? 's' : ''}
                      </span>
                      <span className="font-mono-numbers">
                        {(node.affected_population / 1000).toFixed(0)}k pop. exposed
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node Inspector & Decision Evidence */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-[6px] border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-[var(--brand)]" />
                <span className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
                  Causal Evidence Dossier
                </span>
              </div>
              <span className="text-[10px] font-mono-numbers px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--text-muted)]">
                Node ID: {selectedNode.id}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-[var(--text)] mb-1">
              {selectedNode.label}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
              {selectedNode.explanation}
            </p>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] mb-4">
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Estimated Impact</div>
                <div className="text-sm font-semibold font-mono-numbers text-[var(--text)] mt-0.5">
                  {selectedNode.impact_percent > 0 ? `+${selectedNode.impact_percent}%` : `${selectedNode.impact_percent}%`}
                </div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Confidence</div>
                <div className="text-sm font-semibold font-mono-numbers text-[var(--brand)] mt-0.5">
                  {selectedNode.confidence}%
                </div>
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Affected Pop.</div>
                <div className="text-sm font-semibold font-mono-numbers text-[var(--text)] mt-0.5">
                  {selectedNode.affected_population.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Primary Evidence Feeds */}
            <div className="mb-4">
              <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-[var(--brand)]" />
                Primary Empirical Evidence
              </div>
              <ul className="space-y-1.5">
                {selectedNode.primary_evidence.map((ev, i) => (
                  <li key={i} className="text-xs text-[var(--text)] flex items-start gap-2 bg-[var(--surface)] p-2 rounded border border-[var(--border)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] mt-1.5 shrink-0" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Upstream Causes */}
            <div className="mb-4">
              <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Upstream Triggers ({upstreamNodes.length})
              </div>
              {upstreamNodes.length === 0 ? (
                <div className="text-xs text-[var(--text-muted)] italic p-2 rounded bg-[var(--surface-2)]">
                  Root climate forcing signal. No preceding municipal dependencies.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {upstreamNodes.map((un) => (
                    <button
                      key={un.id}
                      onClick={() => handleNodeClick(un.id)}
                      className="w-full text-left p-2 rounded bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between text-xs transition-colors"
                    >
                      <span className="font-medium text-[var(--text)] truncate">{un.label}</span>
                      <span className="text-[10px] font-mono-numbers text-[var(--text-muted)] shrink-0 ml-2">
                        {un.confidence}% conf.
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Downstream Consequences */}
            <div>
              <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Downstream Consequences ({downstreamNodes.length})
              </div>
              {downstreamNodes.length === 0 ? (
                <div className="text-xs text-[var(--text-muted)] italic p-2 rounded bg-[var(--surface-2)]">
                  Terminal impact node in current model resolution.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {downstreamNodes.map((dn) => (
                    <button
                      key={dn.id}
                      onClick={() => handleNodeClick(dn.id)}
                      className="w-full text-left p-2 rounded bg-[var(--surface)] hover:bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between text-xs transition-colors"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <ArrowRight size={12} className="text-[var(--brand)] shrink-0" />
                        <span className="font-medium text-[var(--text)] truncate">{dn.label}</span>
                      </div>
                      <span className="text-[10px] font-mono-numbers text-[#D15A42] shrink-0 ml-2">
                        +{dn.impact_percent}% impact
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
