"""Refresh documentation examples directly from the unchanged original HTML."""
from html import escape
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
source = (ROOT / 'dist/index.html').read_text(encoding='utf-8')


class Source(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.text, self.nodes, self.stack = text, [], []
        self.lines = [0]
        for match in re.finditer('\n', text):
            self.lines.append(match.end())
        self.feed(text)

    def position(self):
        line, column = self.getpos()
        return self.lines[line - 1] + column

    def handle_starttag(self, tag, attrs):
        node = {'tag': tag, 'attrs': dict(attrs), 'start': self.position()}
        self.nodes.append(node)
        if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            self.stack.append(node)
        else:
            node['end'] = node['start'] + len(self.get_starttag_text())

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index]['tag'] == tag:
                self.stack[index]['end'] = self.text.index('>', self.position()) + 1
                del self.stack[index:]
                break

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)

    def get(self, *, tag=None, id=None, class_name=None):
        for node in self.nodes:
            attrs = node['attrs']
            if tag and node['tag'] != tag:
                continue
            if id and attrs.get('id') != id:
                continue
            if class_name and class_name not in attrs.get('class', '').split():
                continue
            return self.text[node['start']:node['end']]
        raise ValueError(f'Missing source element: {tag}, {id}, {class_name}')


parsed = Source(source)
svg = parsed.get(tag='svg', class_name='svg-library')
fonts = next(tag for tag in re.findall(r'<link\b[^>]+>', source) if 'fonts.googleapis.com/css2?' in tag)
head = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><base href="dist/index.html"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>{fonts}<link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="testimonials.css"><style>body{{padding:24px}}body[data-component-example="navigation"]{{padding:0}}</style>'''
bootstrap = '<script type="module" src="../documentation/design-system-examples.mjs"></script>'
examples = []


def example(section, key, title, markup, height, note, scripts=''):
    document = head + '</head><body data-component-example="' + key + '">' + svg + markup + scripts + bootstrap + '</body></html>'
    frame = f'<figure class="ds-example" data-example="{key}"><figcaption><strong>{escape(title)}</strong><span>{escape(note)}</span></figcaption><iframe title="{escape(title, quote=True)}" data-component-example="{key}" data-min-height="{height}" srcdoc="{escape(document, quote=True)}" loading="lazy" style="height:{height}px"></iframe></figure>'
    examples.append((section, key, frame))


example('tipografia', 'typography', 'Tipografia em uso', '<section class="hero container">' + parsed.get(tag='div', class_name='hero-copy') + '</section>', 680, 'Título, itálico, subtítulo e corpo extraídos do hero original.')
buttons = [parsed.get(tag='a', class_name='header-contact'), parsed.get(tag='a', class_name='button-dark'), parsed.get(tag='a', class_name='button-outline'), parsed.get(tag='a', class_name='text-link')]
example('botoes', 'buttons', 'Botões e links reais', '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:24px">' + ''.join(buttons) + '</div>', 180, 'Passe o mouse ou use Tab. Os CTAs levam à referência completa.')
example('badge', 'badge', 'Badge original', parsed.get(tag='p', class_name='hero-badge'), 100, 'Mesmo texto, tamanho, borda, fundo e espaçamento.')
example('barra', 'sharing', 'Faixa e ícones de compartilhamento', parsed.get(tag='div', class_name='channel-strip'), 130, 'Instagram, WhatsApp, Seu site e Google Maps com os vetores originais.')
example('cards', 'applications', 'Cards de aplicações', parsed.get(tag='section', id='possibilidades'), 800, 'Os três cards reais, com sua composição e copy preservadas.')
example('cards', 'solutions', 'Cards de soluções', parsed.get(tag='section', id='solucoes'), 900, 'Essencial, Completo e Personalizado; layout responsivo original.')
example('depoimentos', 'carousel', 'Carrossel interativo — cinco relatos', parsed.get(tag='section', id='depoimentos') + parsed.get(tag='dialog', id='testimonial-dialog'), 850, 'Use setas, indicadores, toque ou teclado; abra “Ler relato”. Personagens fictícios.', '<script src="config.js" defer></script><script src="testimonials.js" defer></script>')
example('modais', 'dialog', 'Dialog — créditos e privacidade', parsed.get(tag='button', id='credits-open') + parsed.get(tag='dialog', id='credits-dialog'), 520, 'Clique para abrir. Experimente Escape, foco e fechamento pelo backdrop.')
example('formulario', 'fields', 'Input, Select e Label — formulário real', parsed.get(tag='form', id='contact-form'), 1000, 'Selecione a UF e pesquise a cidade. O exemplo valida os campos sem enviar dados.', '<script src="locations.js" defer></script>')
example('faq', 'accordion', 'Accordion — perguntas reais', parsed.get(tag='div', class_name='faq-list'), 850, 'Abra as respostas por clique, Enter ou Espaço. Conteúdo original completo.')
example('composicoes', 'navigation', 'Navigation — header e menu móvel', parsed.get(tag='header', class_name='site-header'), 380, 'Prévia com 390 px: abra o menu e feche com Escape; CTA de orçamento preservado.')

path = ROOT / 'design-system.html'
document = path.read_text(encoding='utf-8')
for section, key, frame in examples:
    document = re.sub(r'<figure class="ds-example" data-example="' + re.escape(key) + r'">.*?</figure>', '', document, flags=re.S)
    marker = '<section class="ds-section" id="' + section + '"'
    start = document.index(marker)
    insert = document.index('</h2>', start) + len('</h2>')
    # Keep examples in their declared order within the section.
    while document.startswith('<figure class="ds-example"', insert):
        insert = document.index('</figure>', insert) + len('</figure>')
    document = document[:insert] + frame + document[insert:]

css = '''/* ds-examples:start */
.ds-example { margin:24px 0 32px; border:1px solid var(--line); border-radius:12px; overflow:hidden; background:var(--paper); }
.ds-example figcaption { display:grid; gap:8px; padding:20px 24px; border-bottom:1px solid var(--line); }
.ds-example figcaption strong { font:600 22px/1.25 var(--display); letter-spacing:-.025em; }
.ds-example figcaption span { color:var(--muted); font-size:14px; line-height:1.5; }
.ds-example iframe { display:block; width:100%; border:0; background:var(--paper); }
.ds-example[data-example="navigation"] iframe { width:min(100%,390px); margin:auto; border-inline:1px solid var(--line); }
/* ds-examples:end */'''
document = re.sub(r'/\* ds-examples:start \*/.*?/\* ds-examples:end \*/\n?', '', document, flags=re.S)
document = document.replace('</style>', css + '\n</style>', 1)
script = '<script id="ds-examples" type="module" src="documentation/design-system-examples.mjs"></script>'
document = re.sub(r'<script id="ds-examples"[^>]*></script>\n?', '', document)
document = document.replace('</body>', script + '\n</body>')
document = document.replace('Os botões reais aparecem na prévia, com os textos, destinos e ícones originais.', 'Os exemplos abaixo usam os botões reais, com os textos, destinos e ícones originais.')
document = document.replace('Consulte os cards originais de aplicações e as três soluções na prévia.', 'Os exemplos abaixo exibem os cards originais de aplicações e as três soluções.')
document = document.replace('Os diálogos reais de créditos, relatos e Vila Terroir são acessíveis na própria prévia.', 'O diálogo de créditos está disponível abaixo; os relatos abrem pelo exemplo de carrossel. Vila Terroir continua acessível na prévia completa.')
document = document.replace('O formulário exibido na prévia é o original, com a base completa de municípios, validações e recuperação.', 'O exemplo abaixo mantém os campos originais e a base completa de municípios; usa validação nativa e bloqueia o envio. A integração completa e sua recuperação permanecem na prévia da landing.')
document = document.replace('As perguntas, respostas e interações da prévia são as da landing.', 'As perguntas, respostas e interações abaixo são as da landing.')
document = document.replace('Não existem mais hero reduzido, formulário substituto, modal placeholder ou carrossel documental paralelo.', 'Os exemplos usam trechos extraídos da implementação original em contextos isolados, com o mesmo CSS e fontes. O carrossel executa os próprios scripts originais; o formulário documental bloqueia o envio.')
path.write_text(document, encoding='utf-8', newline='\n')
print(f'Updated {len(examples)} isolated examples from the original source.')
