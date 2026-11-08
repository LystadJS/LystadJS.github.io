#!/usr/bin/env python3
"""Render the website CV from the transcribed physical CV; --check never writes."""
import argparse,html,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SECTIONS=[
 ('education','Education','education'),('research-portfolio','Scholarly Work & Publications','scholarly'),
 ('selected-projects','Applied Research & White Papers','applied'),('technical-work','Technical Development & Software','technical'),
 ('presentations','Presentations','presentations'),('academic-experience','Academic Appointments','academic'),
 ('professional-work','Professional Experience','professional'),('military-service','Military Service','military'),
 ('skills','Technical & Computational Skills','skills')]
def esc(s):return html.escape(s,quote=True)
def p(s,cls='document-muted'):return '<p class="'+cls+'">'+esc(s)+'</p>'
def bullets(values):return '<ul class="cv-bullets document-list">'+''.join('<li>'+esc(v)+'</li>' for v in values)+'</ul>' if values else ''

def project_heading(title, level):
    """Keep source punctuation as real text while hanging quotes outside the title."""
    quoted = re.fullmatch(r'([“"]\s*)(.*?)(\s*[”"])', title)
    if not quoted:
        return '<'+level+' class="document-title">'+esc(title)+'</'+level+'>'
    opening, text, closing = quoted.groups()
    # Keep the closing quote attached to the last word when the title wraps.
    prefix, separator, last_word = text.rpartition(' ')
    return ('<'+level+' class="document-title cv-quoted-title">'
            '<span class="cv-title-quote cv-title-quote-open">'+esc(opening)+'</span>'
            +esc(prefix+separator)+'<span class="cv-title-ending">'+esc(last_word)
            +'<span class="cv-title-quote cv-title-quote-close">'+esc(closing)+'</span>'
            '</span></'+level+'>')
def rail(r,education=False,project_key=None):
    cls='cv-role-meta cv-education-date cv-timeline-date' if education else 'cv-entry-rail cv-timeline-date'
    parts=r.get('milestones')
    if parts is None:
        parts=re.split(r'\s+[–—]\s+',r['date'],maxsplit=1)
        if len(parts)==2:parts[0]+=' —'
    label=r.get('date',' '.join(parts))
    rank_assets={'Sergeant':'sgt','Specialist':'spc','Private':'pv2'}
    spans=''
    for v in parts:
        span_cls='cv-timeline-year' if 'milestones' in r and re.fullmatch(r'20[0-9]{2}',v) else 'cv-date-line' if 'milestones' not in r else 'cv-milestone-line'
        image='<img class="cv-rank-mark" src="assets/images/about/military/rank-'+rank_assets[v]+'.svg" alt="" width="20" height="28" decoding="async">' if 'milestones' in r and v in rank_assets else ''
        spans+='<span class="'+span_cls+'">'+image+esc(v)+'</span>'
    action=''
    if project_key is not None:
        attrs=' class="cv-side-button cv-project-button" data-project-key="'+esc(project_key)+'"'
        if r.get('project_url'):
            action='<a'+attrs+' href="'+esc(r['project_url'])+'" aria-label="View project: '+esc(r['title'])+'">Project ↗</a>'
        else:
            action='<button'+attrs+' type="button" disabled aria-label="Project link not yet available: '+esc(r['title'])+'" title="Project link coming soon">Project ↗</button>'
    return '<div class="'+cls+'"'+(' aria-label="'+esc(label)+'"' if label else ' aria-hidden="true"')+'>'+spans+action+'</div>'
def military_timeline(events, record):
    """Annual ticks with compact promotion/date pairs and undated unit badges."""
    # Display-only placement can align a unit with a rank without rewriting source dates.
    events=[dict(e, datetime=e.get("display_datetime",e["datetime"])) for e in events]
    years=[]
    for year in record['timeline_years']:
        groups=[]
        present=[]
        for kind in ['promotion','unit']:
            items=[]
            selected=[e for e in events if e['kind']==kind and int(e['datetime'][:4])==year]
            if selected: present.append(kind)
            previous_month=12
            ordered=sorted(selected,key=lambda e:e['datetime'],reverse=True)
            for index,event in enumerate(ordered):
                if kind=='unit':
                    gap=previous_month-int(event['datetime'][5:7])
                    items.append('<li class="cv-unit-gap'+(' cv-unit-gap-between' if index else '')+'" aria-hidden="true" style="flex-grow: '+str(gap)+'"></li>')
                    previous_month=int(event['datetime'][5:7])
                note='<span class="cv-milestone-note">(Anticipated)</span>' if event.get('anticipated') else ''
                date='<time datetime="'+esc(event['datetime'])+'">'+esc(event['date'])+'</time>' if kind=='promotion' else ''
                # December sits near the upper boundary; January near the lower.
                month=int(event['datetime'][5:7])
                position=' style="--promotion-position: '+str(round((12-month)/11*100,2))+'%"' if kind=='promotion' else ''
                alignment=' data-align-promotion="'+esc(event['align_promotion'])+'"' if event.get('align_promotion') else ''
                if event.get('align_role'):
                    alignment+=' data-align-role="'+esc(event['align_role'])+'"'
                # Measured alpha bounds remove internal padding without altering the asset.
                bounds=event['artwork_bounds']
                art_style='height: '+str(24*bounds['height']/bounds['width'])+'px; --art-width: '+str(100/bounds['width'])+'%; --art-left: '+str(-24*bounds['left']/bounds['width'])+'px; --art-top: '+str(-24*bounds['top']/bounds['width'])+'px'
                items.append('<li class="cv-service-event cv-service-'+kind+'"'+position+alignment+'>'
                    '<span class="cv-insignia-art" style="'+art_style+'"><img src="'+esc(event['image'])+'" alt="" decoding="async"></span>'
                    +date+'<span>'+esc(event['label'])+'</span>'+note+'</li>')
            if kind=='unit' and ordered:
                items.append('<li class="cv-unit-gap" aria-hidden="true" style="flex-grow: '+str(previous_month-1)+'"></li>')
            groups.append('<li class="cv-service-column"><ol'+(' class="cv-unit-events"' if kind=='unit' else '')+'>'+''.join(items)+'</ol></li>')
        layout=' cv-year-'+present[0]+'-only' if len(present)==1 else ''

        # A descending timeline places dated events above the January boundary
        # of their year (e.g. November 2021 above 2021, below 2022).
        years.append('<li class="cv-annual-group'+layout+'">'
            +('<ol class="cv-service-insignia" aria-label="Promotions and units">'+''.join(groups)+'</ol>' if present else '')
            +'<span class="cv-service-year">'+str(year)+'</span></li>')
    return '<ol class="cv-service-timeline cv-annual-timeline">'+''.join(years)+'</ol>'

def citation(s):
    s=esc(s)
    s=re.sub(r'https?://[^\s<]+',lambda m:'<a href="'+m[0].rstrip('.')+'">'+m[0].rstrip('.')+'</a>'+('.' if m[0].endswith('.') else ''),s)
    return '<p class="cv-source-citation document-muted">'+s+'</p>'
def render(document,data):
    # Content regeneration preserves the presentation versions selected by the page.
    logos={m[1]:m[0] for m in re.finditer(r'<div class="cv-org-logo"[^>]*data-logo="([^"]+)"[^>]*>[\s\S]*?</div>',document)}
    def attrs(g,i):
        record=data[g][i]
        current=record.get('current',False) or bool(re.search(r'\b(?:Present|In Progress|In Development)\b',record.get('date',''),re.I))
        return ' data-cv-group="'+g+'" data-cv-index="'+str(i)+'" data-current="'+str(current).lower()+'"'
    def standard(r,g,i):
        cls='cv-entry cv-timeline-entry'+(' cv-role-timeline-entry' if g=='military' else '')
        c=p(r['label'],'cv-entry-kicker document-muted') if r.get('label') else ''
        level='h4' if g=='military' else 'h3'
        c+=project_heading(r['title'], level)
        if g=='military':
            c=c.replace('<h4 class="document-title">', '<h4 class="document-title" id="military-role-'+str(i+1)+'">').replace('</h4>', ' <span class="cv-role-number" aria-label="Role '+str(i+1)+'">'+str(i+1)+'</span></h4>')
        if r.get('subtitle'):c+=p(r['subtitle'])
        c+=bullets(r.get('bullets',[]))
        if r.get('citation'):c+=citation(r['citation'])
        return '<article class="'+cls+'"'+attrs(g,i)+'>'+(rail(r,project_key=g+'-'+str(i) if g in ['scholarly','applied','technical','presentations'] else None) if g!='military' else '')+'<div class="cv-entry-content'+(' cv-military-entry-content' if g=='military' else '')+'">'+c+'</div></article>'

    def institution(r,g,i):
        ed=g=='education'
        c='<h3 class="document-title'+(' cv-degree-title' if ed else '')+'">'+esc(r.get('organization',r['title']))+'</h3>'
        if r.get('concentration'):c+=p(r['concentration'],'cv-degree-concentration document-muted')
        if r.get('school'):c+=p(r['school'],'cv-degree-university document-muted')
        if r.get('subtitle'):c+=p(r['subtitle'],'cv-org-context document-muted')
        header='<header class="cv-org-header"><div>'+c+'</div></header>'
        details=bullets(r['bullets'])
        if r.get('organization'):details='<div class="cv-role cv-timeline-role-body"><div class="cv-role-heading"><div><h4 class="document-title">'+esc(r['title'])+'</h4></div></div>'+details+'</div>'
        cls='cv-org-entry cv-timeline-entry'+(' cv-education-entry' if ed else '')
        # Non-degree study has its own typography without changing source wording.
        if ed and r['title']=='Non-Degree Coursework':cls+=' cv-coursework-entry'
        return '<article class="'+cls+'"'+attrs(g,i)+'>'+rail(r,ed)+'<div class="cv-org-main">'+header+('' if ed else logos.get(r.get('logo'),''))+details+'</div></article>'
    blocks=[]
    for sid,title,g in SECTIONS:
        if g=='skills':
            c='<div class="cv-skill-domains">'+''.join('<section class="cv-skill-domain"><h3 class="document-title">'+esc(k)+':</h3>'+bullets(v)+'</section>' for k,v in data['skills'].items())+'</div>'
        else:
            entries=''.join(institution(r,g,i) if g in ['education','academic','professional'] else standard(r,g,i) for i,r in enumerate(data[g]))
            if g=='education':
                groups=[]
                for i,r in enumerate(data[g]):
                    if not groups or groups[-1][0]!=r['logo']:groups.append((r['logo'],[]))
                    groups[-1][1].append(institution(r,g,i))
                entries=''.join('<div class="cv-school-group">'+''.join(items)+'<div class="cv-school-art" aria-hidden="true"><img src="assets/images/experience/'+esc(logo)+('.png' if logo=='florida-state-university' else '-color.svg')+'" alt="" decoding="async"></div></div>' for logo,items in groups)
            c='<div class="cv-timeline'+(' cv-education-timeline' if g=='education' else ' cv-military-timeline' if g=='military' else '')+'">'+entries+'</div>'
            if g=='applied':c='<div class="cv-disclosure">'+p(data['disclosure'],'document-copy')+'</div>'+c
            if g=='military':
                # One equal-year rail spans the complete, independently spaced list.
                service_rail=military_timeline(data['military_timeline'], {'timeline_years': list(range(2027,2020,-1))})
                points=''.join('<a class="cv-role-point" data-current="'+str(r.get('current',False)).lower()+'" href="#military-role-'+str(i+1)+'" data-start-date="'+esc(r['start_date'])+'" aria-label="Role '+str(i+1)+': '+esc(r['title'])+'">'+str(i+1)+'</a>' for i,r in enumerate(data['military']))
                c='<div class="cv-independent-service"><div class="cv-service-scale">'+service_rail+points+'<time class="cv-today-marker" hidden></time><span class="cv-future-arrow" role="img" aria-label="Future"></span></div><div class="cv-military-timeline cv-role-list">'+entries+'</div></div>'
                c='<div class="cv-military-identity"><img class="cv-army-mark" src="assets/images/experience/us-army.webp" alt="United States Army emblem" width="58" height="58" loading="lazy" decoding="async"><h3 class="document-title">United States Army</h3>'+p('U.S. Department of Defense')+'</div>'+c
                # Reuse the print CV's original artwork; CSS reveals each relevant area.
                artwork='<img src="assets/images/about/military/print-cv-badges-ribbons.png" alt="" width="423" height="445" decoding="async">'
                badge_art='<div class="cv-award-art" aria-hidden="true"><div class="cv-art-tabs">'+artwork+'</div><div class="cv-art-badges">'+artwork+'</div></div>'
                ribbon_art='<div class="cv-award-art" aria-hidden="true"><div class="cv-art-ribbons">'+artwork+'</div></div>'
                c+='<div class="cv-training-awards"><h3 class="document-title">Specialized Training and Awards</h3>'
                c+='<section class="cv-award-group">'+badge_art+'<div class="cv-award-copy"><h4 class="document-title">Special Skills Badges</h4>'+bullets(data['badges'])+'</div></section>'
                c+='<section class="cv-award-group">'+ribbon_art+'<div class="cv-award-copy"><h4 class="document-title">Awards</h4>'+bullets(data['awards'])+'</div></section></div>'
        blocks.append('<section class="cv-section" id="'+sid+'"><h2 class="cv-section-label document-section-title">'+esc(title)+'</h2><div class="cv-section-body">'+c+'</div></section>')
    start=re.search(r'<section class="cv-section" id="[^"]+">',document)
    if not start:raise ValueError('Missing CV sections')
    end=document.index('\n    </article>\n  </div>\n</main>',start.start())
    document=document[:start.start()]+'\n\n      '.join(blocks)+'\n'+document[end:]
    links='          <a href="#profile" class="active">Overview</a>\n'+'\n'.join('          <a href="#'+sid+'"'+'>'+esc(title)+'</a>' for i,(sid,title,_) in enumerate(SECTIONS))
    return re.sub(r'(<nav class="cv-toc" aria-label="CV sections">)[\s\S]*?(</nav>)',lambda m:m[1]+'\n'+links+'\n        '+m[2],document)
def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--check',action='store_true');args=parser.parse_args()
    data=json.loads((ROOT/'assets/data/cv-source.json').read_text(encoding='utf-8'))
    path=ROOT/'cv.html';current=path.read_text(encoding='utf-8');result=render(current,data)
    if args.check:
        if result!=current:raise SystemExit('CV is out of sync with cv-source.json')
        print('CV matches its transcribed source.')
    else:path.write_text(result,encoding='utf-8',newline='');print('CV synchronized.')
if __name__=='__main__':main()

