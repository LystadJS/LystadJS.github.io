"""Source-based Vanguards panels: reported shares and linkage, never fitted effects.

Input percentages are transcribed strings. Convert only for geometry; do not
normalize compositions or manufacture sample sizes, intervals, or distances.
"""
import csv
import json
from decimal import Decimal
from pathlib import Path


def validate(data):
    rows = data['records']
    if len(rows) != 11 or rows[0]['kind'] != 'baseline':
        raise ValueError('Expected one ISIL baseline and ten wilayat.')
    if len({r['name'] for r in rows}) != len(rows):
        raise ValueError('Duplicate province.')
    for row in rows:
        if list(row['tactics']) != data['tactic_order']:
            raise ValueError('Tactic order/schema changed: ' + row['name'])
        values = [Decimal(v) for v in row['tactics'].values()]
        if any(not (0 <= v <= 100) for v in values):
            raise ValueError('Percentage outside 0–100.')
        if sum(values) != Decimal(row['reported_tactic_total_percent']):
            raise ValueError('Transcribed total mismatch.')
        if Decimal(row['suicide']) + Decimal(row['non_suicide']) != 100:
            raise ValueError('Suicide pair must sum to 100.')
        if row['kind'] == 'wilaya':
            criteria = [Decimal(v) for v in row['linkage_items'].values()]
            if len(criteria) != 9 or any(not (0 <= v <= 1) for v in criteria):
                raise ValueError('Unexpected linkage criteria.')
            if sum(criteria) != Decimal(row['linkage_total']):
                raise ValueError('Linkage total mismatch.')
    return rows


def export_csv(root, rows):
    """Tidy source transcription with per-value provenance; no target-choice data."""
    target = root / 'assets/data/vanguards-thesis.csv'
    with target.open('w', newline='', encoding='utf-8') as handle:
        out = csv.writer(handle)
        out.writerow(['unit','period','measure_type','measure','reported_value','unit_of_measure','table','printed_page','pdf_page'])
        for row in rows:
            src = row['source']
            common = [row['name'], row['period']]
            for key, value in row['tactics'].items():
                out.writerow(common + ['tactic',key,value,'percent',src['tactics_table'],src['printed_page'],src['pdf_page']])
            for key, value in [('Suicide', row['suicide']), ('Non-suicide', row['non_suicide'])]:
                out.writerow(common + ['suicide_indicator',key,value,'percent',src['tactics_table'],src['printed_page'],src['pdf_page']])
            if row['kind'] == 'wilaya':
                for key,value in list(row['linkage_items'].items()) + [('Total',row['linkage_total'])]:
                    out.writerow(common + ['linkage',key,value,'score',src['linkage_table'],src['linkage_printed_page'],src['linkage_pdf_page']])


def build_panel(root, text, line, dot, table, esc):
    data = json.loads((root / 'assets/data/vanguards-thesis.json').read_text())
    rows = validate(data)
    export_csv(root, rows)
    panels = []
    # Shared fixed order follows Chapter 5; it is not an inferred cluster order.
    x0, step, cellw = 146, 63, 59
    g = text(24,25,'Selected operation frequencies (%)','st-subtitle')
    headers = [('Bombing',''),('Raid',''),('Hostage-','taking'),('Armed','Assault'),('Seizure',''),('Suicide*','')]
    for j,(a,b) in enumerate(headers):
        x = x0 + j*step + cellw/2
        g += text(x,62,a,'vg-col','middle')
        if b: g += text(x,78,b,'vg-col','middle')
    for i,row in enumerate(rows):
        y = 100 + i*28 + (12 if i else 0)
        g += text(24,y+17,row['label'],'vg-name' + (' vg-baseline-text' if i == 0 else ''))
        if i == 0:
            g += f'<rect x="18" y="{y-4}" width="521" height="30" class="vg-baseline-box"/>'
        for j,key in enumerate(data['displayed_metrics']):
            raw = row['suicide'] if key == 'Suicide' else row['tactics'][key]
            value = float(raw)
            x = x0 + j*step
            label = f'0{raw}' if raw.startswith('.') else raw
            g += (f'<g class="vg-cell" data-unit="{esc(row["name"])}" data-metric="{esc(key)}" data-value="{raw}">'
                  f'<title>{esc(row["name"])} · {esc(key)}: {label}% (Table {row["source"]["tactics_table"]})</title>'
                  f'<rect x="{x}" y="{y}" width="{cellw}" height="23" class="vg-heat" fill-opacity="{.06+.79*value/65:.4f}"/>' +
                  text(x+cellw/2,y+16,label,'vg-cell-value','middle') + '</g>')
    g += line(456,47,456,418,'vg-divider')
    g += text(24,442,'Share of operations','st-tick')
    for j,v in enumerate([0,20,40,60]):
        x = 190+j*72
        g += f'<rect x="{x}" y="430" width="28" height="16" class="vg-heat" fill-opacity="{.06+.79*v/65:.4f}"/>'
        g += text(x+35,443,str(v),'st-tick')
    g += text(24,474,'*Suicide is a separate indicator, not an exclusive tactic.','vg-note')
    g += text(24,496,'ISIL: 2013–2019 · Wilayat: 2014–2019 · Thesis table order','vg-note')
    panels.append(('profiles',g))

    # Two aligned dot plots use the same percent scale, not a regression line.
    g = text(24,25,'Bombing and raid shares against the ISIL baseline','st-subtitle')
    for j,(key,cls) in enumerate([('Bombing',''),('Raid',' vg-raid')]):
        left = 164+j*198
        width = 155
        fx = lambda v: left + v/70*width
        base = float(rows[0]['tactics'][key])
        g += text(left,59,key,'st-subtitle')
        g += text(left,80,f'ISIL baseline: {base:.1f}%','st-tick')
        for tick in [0,20,40,60]:
            g += line(fx(tick),98,fx(tick),405,'st-grid')
            g += text(fx(tick),430,str(tick),'st-tick','middle')
        g += line(fx(base),97,fx(base),405,'st-reference')
        for i,row in enumerate(rows[1:]):
            y = 114+i*31
            raw = row['tactics'][key]
            value = float(raw)
            if j == 0: g += text(24,y+5,row['label'],'vg-name')
            g += (f'<g class="vg-share" data-unit="{esc(row["name"])}" data-metric="{key}" data-value="{raw}">'
                  f'<title>{esc(row["name"])} · {key}: {raw}%; ISIL baseline: {base:.1f}%.</title>' +
                  dot(fx(value),y,'st-point'+cls,r=4.5) +
                  text(fx(value)+8,y+5,raw,'vg-dot-value') + '</g>')
        g += line(left,405,left+width,405,'st-axis')
    g += text(346,461,'Reported operations (%) · same scale in both plots','vg-note','middle')
    g += line(24,486,48,486,'st-reference')+text(57,491,'Dashed lines: ISIL reference shares, not fitted trends.','vg-note')
    panels.append(('comparison',g))

    # Linkage is a reported nine-item score; no relationship with tactics is fitted.
    g = text(24,25,'Reported linkage to IS central leadership','st-subtitle')
    g += text(24,49,'Nine criteria, each scored 0–1; summed without reweighting','vg-note')
    fx = lambda v: 166+v/9*340
    for tick in range(10):
        g += line(fx(tick),88,fx(tick),401,'st-grid')+text(fx(tick),425,tick,'st-tick','middle')
    for i,row in enumerate(rows[1:]):
        y = 107+i*31
        value=float(row['linkage_total'])
        g += text(24,y+5,row['label'],'vg-name')
        g += (f'<g class="vg-linkage" data-unit="{esc(row["name"])}" data-value="{value}">'
              f'<title>{esc(row["name"])}: {row["linkage_total"]} of 9 (Table {row["source"]["linkage_table"]}).</title>' +
              line(fx(0),y,fx(value),y,'vg-stem')+dot(fx(value),y,'st-point',r=5)+
              text(fx(value)+11,y+5,row['linkage_total'],'st-value')+'</g>')
    g += line(166,401,506,401,'st-axis')+text(336,456,'Linkage score (0–9)','st-label','middle')
    g += text(24,488,'A linkage–cohesion association was not established in the thesis.','vg-note')
    panels.append(('linkage',g))
    graphic=''.join(f'<g data-vanguards-panel="{key}"'+(' hidden="hidden" aria-hidden="true"' if key != 'profiles' else ' aria-hidden="false"')+'>'+g+'</g>' for key,g in panels)
    controls='<div class="st-controls vg-controls" role="group" aria-label="Vanguards thesis figure view" hidden>'+''.join(
        f'<button type="button" data-vanguards-view="{key}" aria-pressed="{str(key=="profiles").lower()}">{label}</button>'
        for key,label in [('profiles','Tactic profiles'),('comparison','Bombings & raids'),('linkage','Linkage scores')])+'</div>'
    # One accessible table contains all displayed values; full 265-value export
    # additionally includes every tactic, suicide complement, and linkage criterion.
    values=[]
    for row in rows:
        src=row['source']
        vals=[row['tactics'][k] if k!='Suicide' else row['suicide'] for k in data['displayed_metrics']]
        values.append([row['label'],*vals,row.get('linkage_total','Not scored'),f'{src["tactics_table"]}; p. {src["printed_page"]}'])
    detail=('<p><cite>John Lystad, Vanguards of Terror: Analyzing the Tactical Orientation and Cohesion of the Islamic State Insurgency 1999–2019</cite> '
            '(Florida State University, 2022), Table 4.1 and Chapter 5 tables. The source is the author-supplied thesis; these are transcribed findings, not simulated observations.</p>'
            '<p>The baseline covers 8 April 2013–31 December 2019; the affiliate study window covers 29 June 2014–31 December 2019. '
            'Congo and Mozambique are the separately analyzed wings of Central Africa Province. Rows follow the thesis, not a clustering result.</p>'
            '<p>The heatmap shows five selected tactics and a separate suicide indicator; it is not a complete composition. All thirteen tactics are available in the CSV. '
            'Percentages retain their printed precision and are not normalized. No province-specific sample sizes or confidence intervals have been inferred.</p>'
            '<p>Linkage totals sum the original nine criteria. The thesis explicitly leaves the linkage–behavior association for further quantitative analysis (pp. 86–87); '
            'the figure therefore includes no regression, significance test, or causal interpretation.</p>' +
            table(['Unit','Bombing %','Raid %','Hostage-taking %','Armed Assault %','Seizure %','Suicide %','Linkage / 9','Tactic source'],values,'Vanguards — transcribed values displayed in the figure') +
            '<p><a href="assets/data/vanguards-thesis.csv" download>Download full table transcription (CSV)</a> · '
            '<a href="assets/data/vanguards-thesis.json">Data, provenance &amp; source audit</a> · '
            '<a href="https://github.com/LystadJS/LystadJS.github.io/blob/main/docs/vanguards-figure.md">Source and display methodology</a></p>'
            '<p>Source audit: tactic totals range from 99.8% to 100.2%; printed rounding is retained. The source also contains a 97.0% Libya target-table total '
            'and conflicting Caucasus targeting prose/table entries. Target-choice data are not used in this visualization; neither discrepancy has been silently corrected.</p>')
    return graphic, detail, controls
