#!/usr/bin/env python3
"""Build native research plots. Source-backed results and assumed demos stay separate.

Run from any directory. --source-svg verifies/extracts the pinned Figure 4 SVG;
otherwise the checked-in vector-derived data are used. No statistical model is refit.
"""
from pathlib import Path
import argparse
import csv
import hashlib
import html
import json
import math
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
REF = 'f129ec2f515f5e908eb448ef37c41788e2e45a4c'
REPO = 'LystadJS/counterterrorism_ethnosectarian_islamic_state'
BLOB = '50234d6834e6c9c4db4508182968d2ab35f8b7ff'
SOURCE = f'https://github.com/{REPO}/blob/{REF}/figures/fig4.svg'
PHASES = ['Pre-Caliphate Expansion', 'Caliphate Period', 'Post-Caliphate Insurgency']
GROUPS = ['Shia-majority', 'Kurdish-majority', 'Sunni-majority']
NS = {'s': 'http://www.w3.org/2000/svg'}
DATA = ROOT / 'assets/data/ethnosectarian-figure4.json'
DEMO = {}

def esc(value):
    return html.escape(str(value), quote=True)

def text(x, y, value, cls='st-label', anchor='start'):
    return f'<text x="{x:.2f}" y="{y:.2f}" class="{cls}" text-anchor="{anchor}">{esc(value)}</text>'

def line(x1, y1, x2, y2, cls='st-grid'):
    return f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" class="{cls}"/>'

def dot(x, y, cls='st-point', r=4):
    return f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r}" class="{cls}"/>'

def path(points, cls='st-series', close=False):
    return '<path d="' + ' '.join(('M' if i == 0 else 'L') + f'{x:.2f},{y:.2f}' for i,(x,y) in enumerate(points)) + ('Z' if close else '') + f'" class="{cls}"/>'

def table(headers, rows, caption):
    head = ''.join(f'<th scope="col">{esc(h)}</th>' for h in headers)
    body = ''
    for row in rows:
        cells = ''
        for i, value in enumerate(row):
            tag = 'th' if i == 0 else 'td'
            scope = ' scope="row"' if i == 0 else ''
            cells += f'<{tag}{scope}>{esc(value)}</{tag}>'
        body += '<tr>' + cells + '</tr>'
    return f'<div class="rp-data-table" tabindex="0" role="region" aria-label="{esc(caption)}"><table><caption>{esc(caption)}</caption><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table></div>'

def figure(key, title, evidence, graphic, caption, detail, controls='', height=350):
    desc = caption + ' ' + ('Illustrative assumed inputs; these are not project results.' if evidence == 'Synthetic method demo' else '')
    return (f'<figure class="research-figure rp-stat-figure" data-evidence="{esc(evidence)}" aria-labelledby="{key}-caption">'
            f'<div class="rp-figure-bar"><span>{esc(title)}</span><span class="rp-figure-type">{esc(evidence)}</span></div>' + controls +
            f'<div class="rp-plot st-scroll" tabindex="0" role="region" aria-label="{esc(title)}; horizontally scrollable on narrow screens">'
            f'<svg xmlns="http://www.w3.org/2000/svg" class="rp-stat" viewBox="0 0 560 {height}" role="img" aria-labelledby="{key}-title {key}-desc">'
            f'<title id="{key}-title">{esc(title)}</title><desc id="{key}-desc">{esc(desc)}</desc>{graphic}</svg></div>'
            f'<figcaption id="{key}-caption">{esc(caption)}<span class="st-scroll-hint">Scroll within the plot on small screens.</span></figcaption>'
            f'<details class="rp-figure-data"><summary>{"Data & source" if evidence != "Synthetic method demo" else "Assumptions & values"}</summary><div class="rp-data-content">{detail}</div></details></figure>')

def axes(xmin, xmax, ymin, ymax, xticks, yticks, xlabel, ylabel, bounds=(76,45,510,272), percent=False):
    l,t,r,b = bounds
    fx=lambda v:l+(v-xmin)/(xmax-xmin)*(r-l)
    fy=lambda v:b-(v-ymin)/(ymax-ymin)*(b-t)
    out=text(l,23,ylabel,'st-subtitle')
    for v in yticks:
        out+=line(l,fy(v),r,fy(v))+text(l-10,fy(v)+5,f'{v:g}', 'st-tick','end')
    for v in xticks:
        out+=line(fx(v),t,fx(v),b)+text(fx(v),b+24,f'{v:g}'+('%' if percent else ''),'st-tick','middle')
    out+=line(l,b,r,b,'st-axis')+line(l,t,l,b,'st-axis')+text((l+r)/2,b+55,xlabel,'st-label','middle')
    return out,fx,fy

def legend(items,y=345):
    out=''; x=76
    for label,cls in items:
        out+=line(x,y-5,x+20,y-5,cls)+text(x+28,y,label,'st-tick')
        x+=154
    return out

def extract(svg_file):
    data=Path(svg_file).read_bytes()
    actual=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
    if actual != BLOB:
        raise ValueError(f'Figure 4 source mismatch: {actual}')
    root=ET.fromstring(data)
    records=[]
    for g in root.findall('.//s:g[@clip-path]',NS):
        rect=g.find('s:rect',NS)
        if rect is None or 'x' not in rect.attrib: continue
        x=float(rect.get('x')); y=float(rect.get('y'))
        if not any(abs(y-v)<.02 for v in (57.81,370.06,682.32)):continue
        phase=min(range(3),key=lambda i:abs(y-[57.81,370.06,682.32][i]))
        if abs(x-63.38)<.02:
            bars=sorted([e for e in g.findall('s:rect',NS) if 'fill: #1F1F1F;' in e.get('style','') and abs(float(e.get('x','0'))-63.38)<.02 and abs(float(e.get('height','0'))-56.46)<.02],key=lambda e:float(e.get('y')))
            if len(bars)!=3: raise ValueError('Unexpected observed panel structure')
            for group,bar in zip(GROUPS,bars):
                p=float(bar.get('width'))/297.58
                records.append(dict(phase=PHASES[phase],group=group,metric='observed',estimate=p,label=f'{p:.0%}'))
        elif abs(x-395.63)<.02 or abs(x-727.87)<.02:
            circles=sorted(g.findall('s:circle',NS),key=lambda e:float(e.get('cy')))
            if len(circles)!=3: raise ValueError('Unexpected model panel structure')
            for group,circle in zip(GROUPS,circles):
                cy=float(circle.get('cy'))
                ci=next(e for e in g.findall('s:line',NS) if abs(float(e.get('y1'))-cy)<.02 and abs(float(e.get('y2'))-cy)<.02)
                label=next(''.join(e.itertext()) for e in g.findall('s:text',NS) if abs(float(e.get('y'))-cy-3.87)<.03)
                values=[(float(v)-x)/297.58 for v in (ci.get('x1'),circle.get('cx'),ci.get('x2'))]
                low,p,high=values
                assert 0<=low<=p<=high<=1
                assert f'{p:.0%}'==label
                records.append(dict(phase=PHASES[phase],group=group,metric='civilian' if x<500 else 'religious',estimate=p,lower=low,upper=high,label=label))
    assert len(records)==27
    records.sort(key=lambda z:(PHASES.index(z['phase']),GROUPS.index(z['group']),z['metric']))
    result=dict(repository=REPO,commit=REF,figure='figures/fig4.svg',blob=BLOB,source=SOURCE,
        status='Preliminary repository output; not a frozen publication release',
        derivation='Values recovered from SVG vector geometry, not raw observations or refitted models. Labels retain the source whole percentages. Axis calibration: 297.58 SVG units = 1 probability unit. Geometry is rounded in the source SVG.',
        intervals='Original conf_low/conf_high intervals preserved. Confidence level is not stated in the dashboard export; no 95% label is added.',records=records)
    DATA.parent.mkdir(parents=True,exist_ok=True)
    DATA.write_text(json.dumps(result,indent=2)+'\n')
    return result

def target_plot(data):
    records=data['records']; out=''
    views=[('civilian','Predicted probability of civilian targeting',100),('religious','Religious targeting, conditional on a civilian attack',20),('observed','Observed civilian / state-security target mix',100)]
    for metric,title,maximum in views:
        g=text(24,23,title,'st-subtitle')
        if metric=='observed':
            g+=line(162,43,180,43,'st-series')+text(188,48,'Civilian','st-tick')+line(290,43,308,43,'st-series st-red')+text(316,48,'State / security','st-tick')
        else:
            g+=text(162,48,'Point estimate and source interval','st-tick')
        fx=lambda p:162+p*100/maximum*348
        for tick in range(0,maximum+1,maximum//4):
            g+=line(fx(tick/100),67,fx(tick/100),397)+text(fx(tick/100),417,f'{tick}%','st-tick','middle')
        for i,phase in enumerate(PHASES):
            g+=text(24,70+i*110,phase,'st-phase')
            for j,group in enumerate(GROUPS):
                y=94+i*110+j*28
                row=next(z for z in records if z['phase']==phase and z['group']==group and z['metric']==metric)
                g+=text(24,y+5,group,'st-label')
                if metric=='observed':
                    p=row['estimate']; a=348*p
                    g+=f'<rect x="162" y="{y-9}" width="{a:.2f}" height="18" class="st-bar"/><rect x="{162+a:.2f}" y="{y-9}" width="{348-a:.2f}" height="18" class="st-bar st-red"/>'
                    g+=text(162+a/2,y+5,row['label'],'st-bar-label','middle')+text(162+a+(348-a)/2,y+5,f'{1-p:.0%}','st-bar-label','middle')
                else:
                    a,b,c=[fx(row[k]) for k in ('lower','estimate','upper')]
                    color=' st-red' if metric=='religious' else ''
                    g+=f'<g class="st-result" data-value="{row["estimate"]:.8f}"><title>{esc(phase)} · {esc(group)}: {row["label"]}; interval {row["lower"]:.1%}–{row["upper"]:.1%}</title>'
                    g+=line(a,y,c,y,'st-series'+color)+line(a,y-4,a,y+4,'st-series'+color)+line(c,y-4,c,y+4,'st-series'+color)+dot(b,y,'st-point'+color)+text(c+8,y+5,row['label'],'st-value')+'</g>'
        g+=line(162,397,510,397,'st-axis')+text(336,448,'Observed share (%)' if metric=='observed' else 'Predicted probability (%)','st-label','middle')
        out+=f'<g data-target-panel="{metric}"'+(' hidden="hidden"' if metric!='civilian' else '')+'>'+g+'</g>'
    controls='<div class="st-controls" role="group" aria-label="Figure 4 view" hidden>' + ''.join(f'<button type="button" data-target-view="{key}" aria-pressed="{str(key=="civilian").lower()}">{label}</button>' for key,label in [('civilian','Civilian model'),('religious','Religious model'),('observed','Observed mix')])+'</div>'
    rows=[]
    for phase in PHASES:
        for group in GROUPS:
            vals={z['metric']:z for z in records if z['phase']==phase and z['group']==group}
            def value(k):
                z=vals[k];return f'{z["estimate"]:.1%} ({z["lower"]:.1%}–{z["upper"]:.1%})'
            rows.append([phase+' / '+group,vals['observed']['label'],value('civilian'),value('religious')])
    detail=(f'<p>Adapted from <a href="{SOURCE}">Figure 4 in the project repository</a>, commit <code>{REF[:7]}</code>. '
        'All three phases and demographic groups are retained. The religious outcome is conditional on civilian targeting, not a share of all attacks.</p>'
        '<p>Approximate values below are recovered from the rounded SVG geometry. Whiskers preserve the source confidence intervals; the export does not identify their confidence level. This is a display adaptation, not a rerun of the analysis.</p>' + table(['Phase / district','Observed civilian','Civilian model (interval)','Religious | civilian (interval)'],rows,'Figure 4 — vector-derived values') +
        '<p><a href="assets/data/ethnosectarian-figure4.csv" download>Download plotted values (CSV)</a> · <a href="assets/data/ethnosectarian-figure4.json">Provenance and precision notes</a></p>')
    return figure('st-target','Targeting by demography & phase','Figure 4 · preliminary',out,'Observed shares and model probabilities from the repository’s final numbered figure. Whiskers are the original intervals; no new model was fitted.',detail,controls,470)

def demo(key,title,graphic,caption,assumptions,headers,rows,height=375):
    DEMO[key]={'status':'Synthetic method demonstration; not empirical project results','assumptions':assumptions,'columns':headers,'values':rows}
    detail='<p>'+esc(assumptions)+'</p>'+table(headers,rows,'Assumed inputs / derived values')+'<p>Reproduce with <code>python3 scripts/build_research_figures.py</code>. <a href="assets/data/research-plot-demos.json">All demonstration inputs</a>.</p>'
    return figure('st-'+key,title,'Synthetic method demo',graphic,caption,detail,height=height)

def missing():
    s,x,y=axes(0,10,0,10,[0,2,4,6,8,10],[0,2,4,6,8,10],'Assumed mean deaths in unreported attacks','Mean deaths per attack')
    s+=line(x(4),45,x(4),272,'st-reference')
    rows=[]
    for frac,cls in [(.2,''),(.4,' st-red'),(.6,' st-pale')]:
        vals=[(v,4*(1-frac)+v*frac) for v in range(11)]
        s+=path([(x(a),y(b)) for a,b in vals],'st-series'+cls)
        s+=dot(x(0),y(vals[0][1]),'st-point'+cls)
        rows.append([f'{frac:.0%}',4,f'{vals[0][1]:.1f}',f'{vals[-1][1]:.1f}'])
    s+=legend([('20% missing','st-series'),('40% missing','st-series st-red'),('60% missing','st-series st-pale')])
    return demo('missing','Missingness changes the estimate',s,'Zero-filling unreported deaths pulls the estimated mean down. Alternative assumptions matter more as the share of missing records rises.','Assume recorded attacks average 4 deaths. Overall mean = (1 − missing fraction) × 4 + missing fraction × assumed unreported mean. No project data are used.',['Missing fraction','Recorded mean','Zero-fill mean','Mean if unreported = 10'],rows)

def distance():
    profiles=[[.55,.30,.10,.05],[.50,.35,.10,.05],[.58,.24,.12,.06],[.12,.18,.50,.20],[.08,.22,.48,.22],[.10,.15,.53,.22]]
    dist=[[math.sqrt(sum((a-b)**2 for a,b in zip(p,q)))/math.sqrt(2) for q in profiles] for p in profiles]
    s=text(30,28,'Between-unit distance in four-part tactical profiles','st-subtitle')
    l,t,c=146,77,36
    for i in range(6):
        s+=text(l+i*c+c/2,t-14,chr(65+i),'st-label','middle')+text(l-16,t+i*c+24,chr(65+i),'st-label','end')
        for j in range(6):
            v=dist[i][j];opacity=.08+.78*v/.5
            s+=f'<rect x="{l+j*c}" y="{t+i*c}" width="{c-2}" height="{c-2}" class="st-heat" fill-opacity="{opacity:.3f}"/>'
            s+=text(l+j*c+c/2-1,t+i*c+22,f'{v:.2f}','st-cell-value','middle')
    # Average-link distances explain the high-level two-block structure; the matrix itself is exact.
    s+=text(402,117,'Dissimilarity','st-label')
    for i,v in enumerate([0,.1,.2,.3,.4,.5]):
        s+=f'<rect x="404" y="{132+i*23}" width="24" height="21" class="st-heat" fill-opacity="{.08+.78*v/.5:.3f}"/>'+text(438,148+i*23,f'{v:.1f}','st-tick')
    s+=text(254,323,'Units A–F · same scale in both dimensions','st-label','middle')
    rows=[[chr(65+i)]+[f'{v:.2f}' for v in p] for i,p in enumerate(profiles)]
    return demo('distance','Cohesion within and between units',s,'A quantitative distance matrix reveals two distinct profile groups. Generic units stand in for the comparison—not real wilayat.','Six assumed unit profiles, each summing to 1 across four categories. Distance = Euclidean distance / sqrt(2), bounded by 0–1 for composition vectors. The displayed color range is 0–0.5.',['Unit','Category 1','Category 2','Category 3','Category 4'],rows,350)

def climate():
    s,x,y=axes(0,20,-.5,3.5,[0,5,10,15,20],[0,1,2,3],'Projection step','Change from baseline (standardized units)')
    rows=[]
    for name,slope,cls in [('A',.06,''),('B',.14,' st-red')]:
        points=[(i,slope*i,.015*i+.001*i*i) for i in range(21)]
        band=[(x(i),y(m+w)) for i,m,w in points]+[(x(i),y(m-w)) for i,m,w in reversed(points)]
        s+=path(band,'st-band'+cls,True)+path([(x(i),y(m)) for i,m,w in points],'st-series'+cls)
        rows += [[name,i,round(m,3),round(m-w,3),round(m+w,3)] for i,m,w in points if i%5==0]
    s+=legend([('Scenario A','st-series'),('Scenario B','st-series st-red')])
    return demo('climate','Scenario paths and widening uncertainty',s,'Compare trajectories against a common baseline, with uncertainty shown rather than hidden. These are not NASA climate projections.','Assumed trajectories: m(t) = 0.06t or 0.14t; envelope half-width = 0.015t + 0.001t². Envelopes are illustrative ranges, not fitted confidence intervals.',['Scenario','Step','Center','Lower','Upper'],rows)

def flood():
    times=[[1,1.5,2,2.5,3,3.5,4,4.5,5,6,7.5,9],[2,3.5,4.5,6.5,8,9.5,11,12,14,16,18,20]]
    s,x,y=axes(0,20,0,100,[0,5,10,15,20],[0,25,50,75,100],'Travel time from response hub (hours)','Communities reachable (%)')
    for data,cls in zip(times,['',' st-red']):
        points=[(0,0)]
        for i,v in enumerate(data):points.extend([(v,i/len(data)*100),(v,(i+1)/len(data)*100)])
        points.append((20,100))
        s+=path([(x(a),y(b)) for a,b in points],'st-series'+cls)
    s+=line(x(6),45,x(6),272,'st-reference')+text(x(6)+8,62,'6-hour window','st-tick')
    s+=legend([('Open route','st-series'),('Disrupted route','st-series st-red')])
    rows=[[i+1,a,b] for i,(a,b) in enumerate(zip(*times))]
    return demo('flood','Access as a travel-time distribution',s,'The cumulative curves compare response reach: 83% versus 25% of the assumed communities within six hours.','Twelve equally weighted, fictional communities. The empirical cumulative distribution is the share with travel time ≤ t. Both route scenarios are assumed, not measured Nepal–China travel times.',['Community','Open (hours)','Disrupted (hours)'],rows)

def food():
    s,x,y=axes(0,1,0,100,[0,.25,.5,.75,1],[0,25,50,75,100],'Conflict pressure (scaled 0–1)','Illustrative disruption probability (%)')
    rows=[]
    for a,cls in [(.2,''),(.8,' st-red')]:
        vals=[(i/40,100/(1+math.exp(-(-3+4*(i/40)+2*a+3*(i/40)*a)))) for i in range(41)]
        s+=path([(x(v),y(p)) for v,p in vals],'st-series'+cls)
        rows += [[a,v,round(p,1)] for v,p in vals if v in [0,.25,.5,.75,1]]
    s+=legend([('Lower restriction','st-series'),('Higher restriction','st-series st-red')])
    return demo('food','Conflict and access can interact',s,'Under the assumed model, disruption probability changes with both conflict pressure and access restrictions. The curves show their interaction.','Synthetic response function: p = logistic(−3 + 4c + 2a + 3ca). Conflict c runs 0–1; access restriction a is 0.2 or 0.8. Coefficients are assumed—not fitted food-insecurity effects.',['Restriction','Conflict','Probability (%)'],rows)

def aid():
    rows=[];s=text(26,27,'Incidents per 1,000 worker-months','st-subtitle');fx=lambda v:154+v/7*340
    for v in range(8):s+=line(fx(v),55,fx(v),247)+text(fx(v),275,str(v),'st-tick','middle')
    for i,(n,exposure) in enumerate([(12,6000),(18,18000),(6,2000),(24,24000)]):
        rate=n/exposure*1000;lo=rate*math.exp(-1.96/math.sqrt(n));hi=rate*math.exp(1.96/math.sqrt(n)); yy=82+i*46
        s+=text(26,yy+5,'Setting '+chr(65+i),'st-label')+line(fx(lo),yy,fx(hi),yy,'st-series')+dot(fx(rate),yy)+text(fx(hi)+10,yy+5,f'{rate:.1f}','st-value')
        rows.append([chr(65+i),n,exposure,round(rate,2),round(lo,2),round(hi,2)])
    s+=line(154,247,494,247,'st-axis')+text(324,310,'Exposure-adjusted incident rate','st-label','middle')
    return demo('aid','Rates, not just incident counts',s,'The largest incident count need not imply the highest rate. Points and approximate 95% intervals use synthetic counts and exposure.','Assume independent Poisson events. Rate = events / worker-months × 1,000; log-Wald interval = rate × exp(±1.96/√events). These are method examples, not estimates of aid-worker risk.',['Setting','Events','Worker-months','Rate','Lower','Upper'],rows,350)

def weights():
    cases=[('A',.90,.20,''),('B',.60,.65,' st-red'),('C',.30,.85,' st-pale')]
    s,x,y=axes(0,1,0,1,[0,.25,.5,.75,1],[0,.25,.5,.75,1],'Weight on accessibility','Composite screening score (not a probability)')
    rows=[]
    for name,access,gap,cls in cases:
        s+=path([(x(0),y(gap)),(x(1),y(access))],'st-series'+cls)+dot(x(.5),y((access+gap)/2),'st-point'+cls)
        rows.append([name,access,gap,(access+gap)/2])
    s+=legend([('Case A','st-series'),('Case B','st-series st-red'),('Case C','st-series st-pale')])
    return demo('weights','How weighting changes priorities',s,'Crossing lines show where an assumed screening ranking changes. The scores do not measure real proliferation risk.','Three fictional cases. Score(w) = w × accessibility + (1 − w) × oversight gap. Both inputs are assumed 0–1 indices; no weapons capabilities or transfers are modeled.',['Case','Accessibility','Oversight gap','Equal-weight score'],rows)

def decision():
    s,x,y=axes(-1,1.5,0,2.5,[-1,-.5,0,.5,1,1.5],[0,.5,1,1.5,2,2.5],'Change in outcome (standardized units)','Probability density')
    rows=[]
    for name,mu,sd,cls in [('A',-.1,.18,''),('B',.25,.23,' st-red'),('C',.6,.30,' st-pale')]:
        density=lambda v:math.exp(-.5*((v-mu)/sd)**2)/(sd*math.sqrt(2*math.pi))
        pts=[(-1+i*.025,density(-1+i*.025)) for i in range(101)]
        s+=path([(x(v),y(d)) for v,d in pts],'st-series'+cls)
        tail=100*.5*(1+math.erf(mu/(sd*math.sqrt(2))))
        rows.append([name,mu,sd,round(tail,1)])
    s+=line(x(0),45,x(0),272,'st-reference')+text(x(0)+7,62,'No change','st-tick')
    s+=legend([('Scenario A','st-series'),('Scenario B','st-series st-red'),('Scenario C','st-series st-pale')])
    return demo('decision','Compare the distribution, not only the mean',s,'Distributions expose uncertainty around a decision-relevant reference. These assumed distributions are not policy forecasts.','Three normal distributions with the listed means and standard deviations. The final column is the normal probability of a positive change. No posterior or fitted empirical model is claimed.',['Scenario','Mean','SD','P(change > 0), %'],rows)

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--source-svg',type=Path)
    args=ap.parse_args()
    data=extract(args.source_svg) if args.source_svg else json.loads(DATA.read_text())
    if data['blob']!=BLOB or len(data['records'])!=27:raise ValueError('Unrecognized source dataset')
    replacements={'paper-target-map':target_plot(data),'paper-estimating-lethality':missing(),'paper-vanguards':distance(),'paper-climate-terrorism':climate(),'project-himalayan-flood':flood(),'project-food-under-fire':food(),'project-protecting-aid-workers':aid(),'project-autonomous-weapons':weights(),'project-ambassador-advising':decision()}
    p=ROOT/'research.html'; document=p.read_text()
    for key,new in replacements.items():
        pattern=rf'(<article\b[^>]*\bid="{re.escape(key)}"[^>]*>)(.*?)(</article>)'
        match=re.search(pattern,document,re.S)
        if not match:raise ValueError('Missing project: '+key)
        inner,n=re.subn(r'<figure\b.*?</figure>',lambda _:new,match[2],flags=re.S)
        if n!=1:raise ValueError('Expected one figure: '+key)
        document=document[:match.start()]+match[1]+inner+match[3]+document[match.end():]
    # Keep the source-backed PCoA panel and its precise coordinates unchanged.
    if 'assets/css/research-statistics.css' not in document:
        document=document.replace('</head>','<link rel="stylesheet" href="assets/css/research-statistics.css?v=20261006-1">\n<script src="assets/js/research-statistics.js?v=20261006-1" defer></script>\n</head>')
    p.write_text(document)
    (ROOT/'assets/data/research-plot-demos.json').write_text(json.dumps(DEMO,indent=2)+'\n')
    with (ROOT/'assets/data/ethnosectarian-figure4.csv').open('w',newline='') as f:
        w=csv.DictWriter(f,fieldnames=['phase','group','metric','estimate','lower','upper','label'])
        w.writeheader();w.writerows(data['records'])
    print(f'Built {len(replacements)} native plots; retained the source-backed PCoA figure.')

if __name__=='__main__':
    main()
