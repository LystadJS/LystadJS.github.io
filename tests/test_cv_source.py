"""Check physical-CV transcription against the rendered website CV."""
import importlib.util,json,re,unittest
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('sync_cv',ROOT/'scripts/sync_cv.py')
sync=importlib.util.module_from_spec(spec);spec.loader.exec_module(sync)
class Records(HTMLParser):
    def __init__(self,text):
        super().__init__(convert_charrefs=True)
        self.records={};self.current=None;self.bullet=None;self.description_list=False;self.feed(text)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='article' and 'data-cv-group' in a:
            self.current=(a['data-cv-group'],int(a['data-cv-index']))
            self.records[self.current]={'text':[],'bullets':[],'current':a.get('data-current')}
        if tag=='div' and self.current is not None and 'cv-timeline-date' in a.get('class','').split():
            self.records[self.current]['date_label']=a.get('aria-label','')
        if tag=='ul' and 'cv-bullets' in a.get('class','').split():self.description_list=True
        if tag=='li' and self.current is not None and self.description_list:self.bullet=[]
    def handle_data(self,data):
        if self.current is not None:self.records[self.current]['text'].append(data)
        if self.bullet is not None:self.bullet.append(data)
    def handle_endtag(self,tag):
        if tag=='li' and self.bullet is not None:
            self.records[self.current]['bullets'].append(''.join(self.bullet));self.bullet=None
        if tag=='ul':self.description_list=False
        if tag=='article':self.current=None
class PhysicalCV(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data=json.loads((ROOT/'assets/data/cv-source.json').read_text(encoding='utf-8'))
        cls.page=(ROOT/'cv.html').read_text(encoding='utf-8')
    def test_all_records_and_bullets_match_source(self):
        parsed=Records(self.page)
        groups=['education','scholarly','applied','technical','presentations','academic','professional','military']
        self.assertEqual(len(parsed.records),32)
        for group in groups:
            for i,record in enumerate(self.data[group]):
                rendered=parsed.records[(group,i)]
                self.assertEqual(rendered['bullets'],record.get('bullets',[]),(group,i))
                if group != 'military': self.assertEqual(rendered['date_label'],record.get('date',' '.join(record.get('milestones',[]))),(group,i,'date'))
                text=''.join(rendered['text'])
                for key in ['title','school','organization','subtitle','concentration','citation','label']:
                    if record.get(key):self.assertIn(record[key],text,(group,i,key))
    def test_ongoing_entries_are_distinct_from_completed_entries(self):
        parsed=Records(self.page)
        expected={('education',0),('scholarly',0),('scholarly',1),('scholarly',2),('applied',0),('applied',1),('technical',0),('technical',1),('academic',0),('professional',0),('military',0)}
        actual={key for key,value in parsed.records.items() if value['current']=='true'}
        self.assertEqual(actual,expected)
        self.assertTrue(all(value['current'] in ('true','false') for value in parsed.records.values()))
    def test_military_timeline_preserves_dated_events(self):
        events=self.data['military_timeline']
        self.assertEqual(len(events),7)
        self.assertEqual([e['datetime'] for e in events], sorted([e['datetime'] for e in events],reverse=True))
        for event in events:
            if event['kind']=='promotion': self.assertIn('datetime="'+event['datetime']+'">'+event['date']+'</time>',self.page)
            self.assertTrue((ROOT/event['image']).is_file())
        self.assertTrue(events[0]['anticipated'])
        self.assertEqual(events[2]['date'],'Dec. 2024')
        self.assertEqual(events[4]['date'],'Apr. 2022')

    def test_regeneration_is_idempotent(self):
        self.assertEqual(sync.render(self.page,self.data),self.page)
    def test_regeneration_preserves_stylesheet_versions(self):
        page=re.sub(r'(assets/css/(?:cv|document-format)\.css\?v=)[^"]+',r'\g<1>future-presentation',self.page)
        self.assertEqual(sync.render(page,self.data),page)
    def test_physical_titles_and_removed_website_only_content(self):
        self.assertIn('Military Attaché',self.page)
        self.assertIn('Adjunct Instructor',self.page)
        self.assertIn('APSTA-UE 1085: Basic Statistics I',self.page)
        self.assertIn('French (Intermediate)',self.page)
        for old in ['GPA:','Diplomatic-Military Advisor','Graduate Employee Adjunct','id="overview"','id="volunteering"']:
            self.assertNotIn(old,self.page)
    def test_revised_source_and_incomplete_presentation_notes(self):
        self.assertIn('al-Naba', self.data['scholarly'][0]['bullets'][0])
        self.assertTrue(all(not record['bullets'] for record in self.data['presentations']))
if __name__=='__main__':unittest.main()
