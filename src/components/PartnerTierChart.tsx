import React, { useMemo } from 'react';
import {
  StackedAreaChart,
  LinearXAxis,
  LinearYAxis,
  LinearXAxisTickSeries,
  LinearXAxisTickLabel,
  LinearYAxisTickSeries,
  StackedAreaSeries,
  Line,
  Area,
  Gradient,
  GradientStop,
  GridlineSeries,
  Gridline,
  Count,
} from 'reaviz';

/**
 * Générateur pseudo-aléatoire DÉTERMINISTE.
 *
 * `Math.random()` ferait sauter le graphique à chaque rendu (et doublé en
 * React StrictMode). Ici la graine vient du nom du palier : la courbe est
 * stable d'un rendu à l'autre tout en variant d'une carte à l'autre.
 */
const seededRandom = (seed: number) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const hashString = (value: string): number => {
  let h = 0;
  for (let i = 0; i < value.length; i++) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

const MONTHS = 12;

/**
 * Construit trois séries mensuelles : prospects, contrats, commissions.
 * Elles croissent progressivement — le partner monte en statut dans le temps.
 */
const buildSeries = (tierName: string, rate: number) => {
  const rand = seededRandom(hashString(tierName) + rate * 7);
  const base = 6 + rate * 1.4;

  const points = Array.from({ length: MONTHS }, (_, i) => {
    const growth = 1 + i * 0.19;
    const wobble = 0.75 + rand() * 0.5;
    // 12 mois civilement répartis : des étiquettes d'axe distinctes
    const date = new Date(2026, i, 1);
    date.setHours(0, 0, 0, 0);

    return {
      key: date,
      leads: Math.round(base * 2.4 * growth * wobble),
      deals: Math.round(base * growth * wobble * 0.62),
      fees: Math.round(base * growth * wobble * 0.34 * Math.max(rate, 0.6)),
    };
  });

  return [
    { key: 'Prospects', data: points.map((p) => ({ key: p.key, data: p.leads })) },
    { key: 'Contrats', data: points.map((p) => ({ key: p.key, data: p.deals })) },
    { key: 'Commissions', data: points.map((p) => ({ key: p.key, data: p.fees })) },
  ];
};

/** Mois affichés en_xlabel : 4 repères suffisent, 12 rend l'axe illisible. */
const AXIS_LABELS = new Set([0, 3, 7, 11]);

const formatMonth = (v: Date): string => {
  const d = new Date(v);
  return AXIS_LABELS.has(d.getMonth())
    ? d.toLocaleDateString('fr-FR', { month: 'short' })
    : '';
};

export interface PartnerTier {
  name: string;
  condition: string;
  rate: number;
  bonus: string;
  /** Trois teintes du même ton, du plus clair au plus soutenu. */
  colors: [string, string, string];
  featured?: boolean;
}

interface PartnerTierChartProps {
  tier: PartnerTier;
}

/**
 * Carte de palier avec courbe d'évolution.
 *
 * Chaque carte a sa propre palette : la couleur porte le sens du palier
 * (neutre quand la commission est nulle, chaude quand elle est maximale).
 */
const PartnerTierChart: React.FC<PartnerTierChartProps> = ({ tier }) => {
  const data = useMemo(
    () => buildSeries(tier.name, tier.rate),
    [tier.name, tier.rate]
  );

  const chartId = `tier-chart-${hashString(tier.name)}`;
  const [light, mid, deep] = tier.colors;

  return (
    <article
      className={`tier-chart-card${tier.featured ? ' is-featured' : ''}`}
      // Le % reprend la teinte de sa propre courbe : la carte et son
      // graphique se lisent comme un seul objet.
      style={{ '--tier-ink': tier.featured ? '#ffffff' : deep } as React.CSSProperties}
    >
      <header className="tier-chart-head">
        <div>
          <h3 className="tier-chart-name">{tier.name}</h3>
          <p className="tier-chart-condition">{tier.condition}</p>
        </div>
        {tier.featured && <span className="tier-chart-flag">Statut maximal</span>}
      </header>

      <div className="tier-chart-rate">
        <Count
          className="tier-chart-count"
          from={0}
          to={tier.rate}
          duration={1.4}
          suffix=" %"
        />
        <span className="tier-chart-rate-label">de commission</span>
      </div>

      <div className="tier-chart-plot">
        <StackedAreaChart
          id={chartId}
          height={168}
          data={data}
          xAxis={
            <LinearXAxis
              type="time"
              tickSeries={
                <LinearXAxisTickSeries
                  tickSize={6}
                  label={
                    <LinearXAxisTickLabel
                      format={(v: Date) => formatMonth(v)}
                      fill="#9a9aa0"
                    />
                  }
                />
              }
            />
          }
          yAxis={
            <LinearYAxis
              axisLine={null}
              tickSeries={
                <LinearYAxisTickSeries
                  line={null}
                  label={null}
                  tickSize={6}
                />
              }
            />
          }
          series={
            <StackedAreaSeries
              line={<Line strokeWidth={2.5} glow={{ blur: 8 }} />}
              area={
                <Area
                  glow={{ blur: 18 }}
                  color="transparent"
                  gradient={
                    <Gradient
                      stops={[
                        <GradientStop key="stop-0" stopOpacity={0.05} />,
                        <GradientStop key="stop-1" offset="70%" stopOpacity={0.22} />,
                        <GradientStop key="stop-2" offset="100%" stopOpacity={0.4} />,
                      ]}
                    />
                  }
                />
              }
              colorScheme={[light, mid, deep]}
            />
          }
          gridlines={<GridlineSeries line={<Gridline strokeColor="#00000012" />} />}
        />
      </div>

      <ul className="tier-chart-legend">
        {data.map((s, i) => (
          <li key={s.key}>
            <span
              className="tier-chart-swatch"
              style={{ background: [light, mid, deep][i] }}
            />
            {s.key}
          </li>
        ))}
      </ul>

      <p className="tier-chart-bonus">{tier.bonus}</p>
    </article>
  );
};

export default PartnerTierChart;