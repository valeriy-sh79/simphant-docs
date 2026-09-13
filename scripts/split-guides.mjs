import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const safeLinkMap = new Map([
  [
    '<https://numpy.org/doc/stable/reference/routines.math.html>',
    '[https://numpy.org/doc/stable/reference/routines.math.html](https://numpy.org/doc/stable/reference/routines.math.html)',
  ],
  [
    '<https://en.wikipedia.org/wiki/Overconstrained_mechanism>',
    '[https://en.wikipedia.org/wiki/Overconstrained_mechanism](https://en.wikipedia.org/wiki/Overconstrained_mechanism)',
  ],
]);

const englishSections = [
  {
    fileName: 'introduction-to-simphant.md',
    title: 'Introduction to SimPhant',
    sidebarLabel: 'Introduction',
    heading: '# Introduction to SimPhant™',
  },
  {
    fileName: 'user-interface.md',
    title: 'User Interface',
    sidebarLabel: 'User Interface',
    heading: '# User Interface',
  },
  {fileName: 'bodies.md', title: 'Bodies', sidebarLabel: 'Bodies', heading: '# Bodies'},
  {fileName: 'joints.md', title: 'Joints', sidebarLabel: 'Joints', heading: '# Joints'},
  {fileName: 'forces.md', title: 'Forces', sidebarLabel: 'Forces', heading: '# Forces'},
  {
    fileName: 'springs-and-bushings.md',
    title: 'Springs and Bushings',
    sidebarLabel: 'Springs and Bushings',
    heading: '# Springs und Bushings',
  },
  {
    fileName: 'gears-and-gear-constraints.md',
    title: 'Gears and Gear Constraints',
    sidebarLabel: 'Gears',
    heading: '# Gears and Gear Constraints',
  },
  {fileName: 'motion.md', title: 'Motion', sidebarLabel: 'Motion', heading: '# Motion'},
  {
    fileName: 'simulation.md',
    title: 'Simulation',
    sidebarLabel: 'Simulation',
    heading: '# Simulation',
  },
  {
    fileName: 'mathematical-foundations.md',
    title: 'Mathematical Foundations',
    sidebarLabel: 'Mathematical Foundations',
    heading: '# Mathematical Foundations of the SimPhant Multi-Body-Simulation Solver',
  },
];

const russianSections = [
  {
    fileName: 'introduction-to-simphant.md',
    title: 'Введение в SimPhant',
    sidebarLabel: 'Введение',
    heading: '# Введение в SimPhant™',
  },
  {
    fileName: 'user-interface.md',
    title: 'Пользовательский интерфейс',
    sidebarLabel: 'Пользовательский интерфейс',
    heading: '# Пользовательский интерфейс',
  },
  {fileName: 'bodies.md', title: 'Детали', sidebarLabel: 'Детали', heading: '# Детали'},
  {
    fileName: 'joints.md',
    title: 'Соединения и связи',
    sidebarLabel: 'Соединения и связи',
    heading: '# Соединения и связи (Joints)',
  },
  {fileName: 'forces.md', title: 'Силы', sidebarLabel: 'Силы', heading: '# Силы (Forces)'},
  {
    fileName: 'springs-and-bushings.md',
    title: 'Пружины и втулки',
    sidebarLabel: 'Пружины и втулки',
    heading: '# Пружины (Springs) и Втулки (Bushings)',
  },
  {
    fileName: 'gears-and-gear-constraints.md',
    title: 'Шестерни и зубчатые передачи',
    sidebarLabel: 'Шестерни и зубчатые передачи',
    heading: '# Шестерни и Зубчатые передачи (Gears and Gear Constraints)',
  },
  {
    fileName: 'motion.md',
    title: 'Движение',
    sidebarLabel: 'Движение',
    heading: '# Движение (Motion)',
  },
  {
    fileName: 'simulation.md',
    title: 'Симуляция',
    sidebarLabel: 'Симуляция',
    heading: '# Симуляция (Simulation)',
  },
  {
    fileName: 'mathematical-foundations.md',
    title: 'Математические основы',
    sidebarLabel: 'Математические основы',
    heading: '# Математические основы решателя SimPhant для моделирования систем твердых тел',
  },
];

const ukrainianSections = [
  {
    fileName: 'introduction-to-simphant.md',
    title: 'Вступ до SimPhant',
    sidebarLabel: 'Вступ',
    heading: '# Вступ до SimPhant',
  },
  {
    fileName: 'user-interface.md',
    title: 'Інтерфейс користувача',
    sidebarLabel: 'Інтерфейс користувача',
    heading: '# Інтерфейс користувача',
  },
  {fileName: 'bodies.md', title: 'Деталі', sidebarLabel: 'Деталі', heading: '# Деталі'},
  {
    fileName: 'joints.md',
    title: "З'єднання та зв'язки",
    sidebarLabel: "З'єднання та зв'язки",
    heading: "# З'єднання та зв'язки (Joints)",
  },
  {fileName: 'forces.md', title: 'Сили', sidebarLabel: 'Сили', heading: '# Сили (Forces)'},
  {
    fileName: 'springs-and-bushings.md',
    title: 'Пружини та втулки',
    sidebarLabel: 'Пружини та втулки',
    heading: 'Пружини (Springs) і Втулки (Bushings)',
  },
  {
    fileName: 'gears-and-gear-constraints.md',
    title: 'Шестерні та зубчасті передачі',
    sidebarLabel: 'Шестерні',
    heading: 'Шестерні та Зубчасті передачі (Gears and Gear Constraints)',
  },
  {
    fileName: 'motion.md',
    title: 'Рух',
    sidebarLabel: 'Рух',
    heading: 'Рух (Motion)',
  },
  {
    fileName: 'simulation.md',
    title: 'Симуляція',
    sidebarLabel: 'Симуляція',
    heading: 'Симуляція (Simulation)',
  },
  {
    fileName: 'mathematical-foundations.md',
    title: 'Математичні основи',
    sidebarLabel: 'Математичні основи',
    heading: '# Математичні основи розв\'язувача SimPhant для моделювання систем твердих тіл',
  },
];

function toUnixNewlines(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

function makeFrontMatter(title, sidebarLabel) {
  return `---\ntitle: ${title}\nsidebar_label: ${sidebarLabel}\n---\n\n`;
}

function sanitizeMarkdown(text) {
  let result = toUnixNewlines(text);
  for (const [unsafeLink, safeLink] of safeLinkMap.entries()) {
    result = result.replaceAll(unsafeLink, safeLink);
  }
  return result;
}

function stripLeadingTitleBlock(text, titleBlocks) {
  const candidates = Array.isArray(titleBlocks) ? titleBlocks : [titleBlocks];
  for (const titleBlock of candidates) {
    if (text.startsWith(titleBlock)) {
      return text.slice(titleBlock.length);
    }
  }
  return text;
}

function normalizeSectionHeading(text) {
  return text.trim().replace(/^#+\s*/, '').replace(/™/g, '');
}

function sectionBounds(sourceText, sections) {
  let cursor = 0;
  const lines = sourceText.split('\n').map((line) => {
    const entry = {line, start: cursor};
    cursor += line.length + 1;
    return entry;
  });

  const bounds = [];
  for (const section of sections) {
    const normalizedHeading = normalizeSectionHeading(section.heading);
    const match = lines.find((line) => normalizeSectionHeading(line.line) === normalizedHeading);

    if (!match) {
      throw new Error(`Heading not found: ${section.heading}`);
    }

    bounds.push({heading: section.heading, matchedHeading: match.line, start: match.start});
  }

  return bounds
    .sort((left, right) => left.start - right.start)
    .map((entry, index, items) => ({
      ...entry,
      end: index + 1 < items.length ? items[index + 1].start : sourceText.length,
    }));
}

function buildDocChunks(sourceText, sections, titleBlock) {
  const bounds = sectionBounds(sourceText, sections);

  return sections.map((section, index) => {
    const bound = bounds.find((item) => item.heading === section.heading);
    const rawChunk = sourceText.slice(bound.start, bound.end);
    const headingLine = `${bound.matchedHeading}\n`;
    const withoutHeading = rawChunk.startsWith(headingLine)
      ? rawChunk.slice(headingLine.length)
      : rawChunk.replace(bound.matchedHeading, '').trimStart();

    const withPreamble =
      index === 0
        ? `${stripLeadingTitleBlock(sourceText.slice(0, bound.start), titleBlock)}${withoutHeading}`
        : withoutHeading;

    return {
      ...section,
      content: withPreamble.trim() + '\n',
    };
  });
}

async function writeDocs(destinationDir, sections) {
  await fs.mkdir(destinationDir, {recursive: true});
  await Promise.all(
    sections.map((section) => {
      const filePath = path.join(destinationDir, section.fileName);
      const fileContents = makeFrontMatter(section.title, section.sidebarLabel) + section.content;
      return fs.writeFile(filePath, fileContents, 'utf8');
    }),
  );
}

async function copyMedia(sourceDir, destinationDir) {
  await fs.rm(destinationDir, {recursive: true, force: true});
  await fs.cp(sourceDir, destinationDir, {recursive: true});
}

async function main() {
  const englishSourcePath = path.join(rootDir, 'Word_EN', 'Documentation_EN_md.md');
  const russianSourcePath = path.join(rootDir, 'Word_RU', 'Documentation_RU_md.md');
  const ukrainianSourcePath = path.join(rootDir, 'Word_UA', 'Documentation_UA_md.md');
  const englishText = sanitizeMarkdown(await fs.readFile(englishSourcePath, 'utf8'));
  const russianText = sanitizeMarkdown(await fs.readFile(russianSourcePath, 'utf8'));
  const ukrainianText = sanitizeMarkdown(await fs.readFile(ukrainianSourcePath, 'utf8'));

  const englishDocs = buildDocChunks(
    englishText,
    englishSections,
    ['**SimPhant™**\n\nThe user Guide\n\n', '**SimPhant**\n\nThe user Guide\n\n'],
  );
  const russianDocs = buildDocChunks(
    russianText,
    russianSections,
    ['**SimPhant™**\n\nРуководство пользователя\n\n', '**SimPhant**\n\nРуководство пользователя\n\n'],
  );
  const ukrainianDocs = buildDocChunks(
    ukrainianText,
    ukrainianSections,
    [
      'SimPhant™\n\nПосібник користувача\n\n',
      'SimPhant\n\nПосібник користувача\n\n',
      '**SimPhant™**\n\nПосібник користувача\n\n',
      '**SimPhant**\n\nПосібник користувача\n\n',
    ],
  );

  await writeDocs(path.join(rootDir, 'docs'), englishDocs);
  await writeDocs(path.join(rootDir, 'i18n', 'ru', 'docusaurus-plugin-content-docs', 'current'), russianDocs);
  await writeDocs(path.join(rootDir, 'i18n', 'uk', 'docusaurus-plugin-content-docs', 'current'), ukrainianDocs);

  await Promise.all([
    copyMedia(path.join(rootDir, 'Word_EN', 'media'), path.join(rootDir, 'docs', 'media')),
    copyMedia(
      path.join(rootDir, 'Word_RU', 'media'),
      path.join(rootDir, 'i18n', 'ru', 'docusaurus-plugin-content-docs', 'current', 'media'),
    ),
    copyMedia(
      path.join(rootDir, 'Word_UA', 'media'),
      path.join(rootDir, 'i18n', 'uk', 'docusaurus-plugin-content-docs', 'current', 'media'),
    ),
  ]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});