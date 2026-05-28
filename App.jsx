import { useState, useMemo, useEffect } from "react";

// ════════════════════════════════════════════════════════════════════
// BIBLE DATA — OLD TESTAMENT BOOKS
// ════════════════════════════════════════════════════════════════════
const OT_BOOKS = [
  { name: "Genesis", chapters: 50 },
  { name: "Exodus", chapters: 40 },
  { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 },
  { name: "Deuteronomy", chapters: 34 },
  { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 },
  { name: "Ruth", chapters: 4 },
  { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 },
  { name: "1 Kings", chapters: 22 },
  { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 },
  { name: "2 Chronicles", chapters: 36 },
  { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 },
  { name: "Esther", chapters: 10 },
  { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 },
  { name: "Proverbs", chapters: 31 },
  { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Solomon", chapters: 8 },
  { name: "Isaiah", chapters: 66 },
  { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 },
  { name: "Ezekiel", chapters: 48 },
  { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 },
  { name: "Joel", chapters: 3 },
  { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 },
  { name: "Jonah", chapters: 4 },
  { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 },
  { name: "Habakkuk", chapters: 3 },
  { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 },
  { name: "Zechariah", chapters: 14 },
  { name: "Malachi", chapters: 4 },
];

// Total OT chapters: 929 → 309+ days of 3 chapters/day; we build a plan capped at 310 days
function buildChapterList() {
  const list = [];
  for (const b of OT_BOOKS) for (let c = 1; c <= b.chapters; c++) list.push({ book: b.name, chapter: c });
  return list;
}
function buildPlan() {
  const all = buildChapterList();
  const days = [];
  for (let i = 0; i < all.length; i += 3) {
    const slice = all.slice(i, i + 3);
    if (slice.length > 0) days.push(slice);
  }
  return days;
}
const PLAN = buildPlan(); // ~310 days
const TOTAL_DAYS = PLAN.length;

function formatReading(chs) {
  if (!chs || chs.length === 0) return "";
  const groups = [];
  let cur = { book: chs[0].book, start: chs[0].chapter, end: chs[0].chapter };
  for (let i = 1; i < chs.length; i++) {
    if (chs[i].book === cur.book) cur.end = chs[i].chapter;
    else { groups.push(cur); cur = { book: chs[i].book, start: chs[i].chapter, end: chs[i].chapter }; }
  }
  groups.push(cur);
  return groups.map(g => g.start === g.end ? `${g.book} ${g.start}` : `${g.book} ${g.start}–${g.end}`).join(", ");
}

// OT Sections
const SECTIONS = [
  { label: "The Pentateuch", range: [1, 60], color: "#8B4513", bg: "#FFF5E6", text: "#5C2D0A", desc: "The Law — Creation, Covenant, and the foundation of faith" },
  { label: "Historical Books", range: [61, 130], color: "#2E5090", bg: "#E8EFF8", text: "#1A3060", desc: "Israel's story — conquest, kings, exile, and return" },
  { label: "Wisdom Literature", range: [131, 190], color: "#6B4E9F", bg: "#F0EBF8", text: "#3D2060", desc: "Psalms, Proverbs, Job — the heart's cry to God" },
  { label: "Major Prophets", range: [191, 260], color: "#1A6B3C", bg: "#E6F5ED", text: "#0D3D22", desc: "Isaiah–Daniel — judgment, hope, and Messianic promise" },
  { label: "Minor Prophets", range: [261, TOTAL_DAYS], color: "#9B2335", bg: "#FAECEE", text: "#5C0D18", desc: "The Twelve — calls to repentance and God's faithful love" },
];

function getSec(d) { return SECTIONS.find(s => d >= s.range[0] && d <= s.range[1]) || SECTIONS[0]; }

// ════════════════════════════════════════════════════════════════════
// BUILT-IN COMMENTARIES (no AI — fully static)
// ════════════════════════════════════════════════════════════════════
const COMMENTARY_DB = {
  "Genesis": {
    context: "Genesis is the book of beginnings — the origin of the cosmos, humanity, sin, and God's redemptive plan. Written by Moses under divine inspiration, it establishes the foundational theological truths that all subsequent Scripture builds upon. The name 'Genesis' comes from the Greek word meaning 'origin' or 'birth.'",
    themes: "The key themes include: (1) God as sovereign Creator who speaks things into existence; (2) Humanity as image-bearers (Imago Dei) with inherent dignity and responsibility; (3) The fall and its consequences — separation from God, death, and the curse; (4) God's grace immediately at work through the proto-evangelium in Genesis 3:15; (5) Covenant — with Noah, Abraham, Isaac, and Jacob — as God's unfolding plan of redemption.",
    application: "Genesis teaches us that God is not distant or uninvolved. He walked with Adam in the garden. He called Abram from paganism into covenant. He wrestled with Jacob and renamed him. The God of Genesis is the God who draws near. As you read, ask yourself: Where is God at work in the ordinary moments of these lives? And where is He at work in yours?",
    memoryVerse: "\"In the beginning God created the heavens and the earth.\" — Genesis 1:1",
    keyFigures: "Adam, Eve, Noah, Abraham, Isaac, Jacob, Joseph",
    historicalContext: "Covers from Creation through the death of Joseph in Egypt (~1800 BC). Written by Moses around 1400 BC as the first book of the Torah (Law)."
  },
  "Exodus": {
    context: "Exodus records the birth of Israel as a nation — their deliverance from 400 years of Egyptian slavery through Moses, the giving of the Law at Sinai, and the construction of the Tabernacle. The Hebrew title 'Shemot' means 'names,' referring to the names of Jacob's sons listed at the opening.",
    themes: "Central themes: (1) Redemption through blood — the Passover lamb foreshadows Christ; (2) God's power over all earthly powers (the ten plagues); (3) The Law as God's covenant standard; (4) God dwelling with His people through the Tabernacle; (5) Moses as a type of Christ — deliverer, mediator, and intercessor.",
    application: "The Passover is the great Old Testament picture of salvation. The lamb dies; the blood is applied; death passes over. This is the heart of the Gospel centuries before Calvary. As you read Exodus, marvel at how meticulously God planned your redemption from the very beginning of history.",
    memoryVerse: "\"I am the LORD your God, who brought you out of Egypt, out of the land of slavery.\" — Exodus 20:2",
    keyFigures: "Moses, Aaron, Pharaoh, Miriam, Joshua, Bezalel",
    historicalContext: "The Exodus occurred around 1446 BC (early date) or 1290 BC (late date). Moses wrote the book around 1400 BC."
  },
  "Leviticus": {
    context: "Leviticus is the handbook of the priests (Levites) and the people on how to approach a holy God. Though it feels distant to modern readers, every sacrifice, every ritual points forward to Christ, who fulfills and completes them all. The book's central command — 'Be holy because I, the LORD your God, am holy' (19:2) — reveals God's character and His high calling for His people.",
    themes: "Key themes: (1) Holiness — God's absolute purity and its demands; (2) Sacrifice — the costliness of sin and the necessity of substitution; (3) The priesthood as mediators between God and humanity; (4) Clean and unclean distinctions that taught Israel to discern between sacred and common; (5) The Day of Atonement (Yom Kippur) as the climactic annual covering of sin.",
    application: "Every time a worshipper brought a lamb or a bull to the altar in Leviticus, they were acting out what we now know: sin requires a substitute. Blood must be shed. But all those animal sacrifices were shadows — 'it is impossible for the blood of bulls and goats to take away sins' (Hebrews 10:4). They all pointed to the one sufficient sacrifice of Jesus Christ. Read Leviticus with Hebrews in hand.",
    memoryVerse: "\"Be holy because I, the LORD your God, am holy.\" — Leviticus 19:2",
    keyFigures: "Moses, Aaron, Nadab and Abihu, the priests",
    historicalContext: "Written by Moses around 1445 BC. The events occur at Mount Sinai during Israel's first year after the Exodus."
  },
  "Psalms": {
    context: "The Psalms are the songbook and prayer book of the Bible — 150 poems/songs spanning centuries, written by David (73 attributed), Asaph, the Sons of Korah, Solomon, Moses, Ethan, and others. They cover the full range of human experience: worship, lament, thanksgiving, repentance, trust, and prophetic declaration.",
    themes: "Key themes: (1) God as King, Shepherd, Fortress, and Father; (2) Honest prayer — the Psalms give language to every human emotion before God; (3) Messianic prophecy — Psalms 2, 22, 110 directly prophesy of Christ; (4) The blessing of God's Word (Psalm 119); (5) The tension between present suffering and future hope; (6) Corporate and individual worship.",
    application: "The Psalms teach us that all of our emotions belong to God. David cried out in anger, fear, grief, and exultant joy — and none of it disqualified him from God's presence. When you don't know how to pray, open the Psalms. When grief overwhelms, read Psalm 22. When you need assurance, read Psalm 23. When you want to praise, read Psalm 150. These are prayers that have connected God's people to Him for 3,000 years.",
    memoryVerse: "\"The LORD is my shepherd, I lack nothing.\" — Psalm 23:1",
    keyFigures: "David, Asaph, Moses, Solomon, the Sons of Korah",
    historicalContext: "Written over a span of ~900 years (1400–500 BC). Compiled into five books that mirror the five books of Moses."
  },
  "Isaiah": {
    context: "Isaiah is often called 'the fifth Gospel' because of its extensive Messianic prophecy. Written by Isaiah son of Amoz during the reigns of Uzziah, Jotham, Ahaz, and Hezekiah (740–681 BC), it addresses Judah's sin and impending judgment while offering breathtaking visions of future redemption and the coming Servant of the LORD.",
    themes: "Key themes: (1) The holiness of God — 'Holy, holy, holy is the LORD Almighty' (6:3); (2) Judgment on Judah and the nations; (3) The Servant Songs (42, 49, 50, 52–53) pointing directly to Christ; (4) Future restoration of Israel and a New Creation; (5) God's sovereignty over history — 'I am the first and I am the last' (44:6).",
    application: "Isaiah 53 is perhaps the single most important passage in the Old Testament for understanding the Gospel. Written 700 years before the cross, it describes Jesus' sufferings with surgical precision: despised, rejected, bearing our griefs, wounded for our transgressions, the LORD laying on Him the iniquity of us all. When you read it, you are reading the heart of the Gospel before Christ was born.",
    memoryVerse: "\"But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.\" — Isaiah 53:5",
    keyFigures: "Isaiah, Hezekiah, Ahaz, the Servant of the LORD",
    historicalContext: "Written 740–681 BC. Prophesied before and during the Assyrian crisis that destroyed northern Israel (722 BC) and threatened Jerusalem."
  },
  "Daniel": {
    context: "Daniel was a young Jewish nobleman taken to Babylon in 605 BC who rose to prominence in one of history's most pagan courts while maintaining unwavering faith in God. The book divides into court narratives (chs 1–6) and apocalyptic visions (chs 7–12), both demonstrating God's absolute sovereignty over human empires.",
    themes: "Key themes: (1) Faithfulness under pressure — Daniel and his friends refuse compromise; (2) God's sovereignty over kingdoms — He raises and removes rulers; (3) The 'Son of Man' vision (ch 7) — Jesus directly claims this title in Mark 14; (4) End-times prophecy including the 70 weeks (ch 9); (5) Resurrection and final judgment (12:2–3).",
    application: "Daniel and his three friends model what it looks like to be 'in the world but not of it.' They learned the Babylonian language, served in the government, and excelled in their work — but they drew clear lines at worship and spiritual compromise. Their courage came from their intimacy with God (Daniel prayed three times daily, chapter 6). The key to standing firm in a pagan culture is not isolation but deep, daily communion with God.",
    memoryVerse: "\"But the people who know their God will firmly resist him.\" — Daniel 11:32b",
    keyFigures: "Daniel, Shadrach, Meshach, Abednego, Nebuchadnezzar, Belshazzar, Darius",
    historicalContext: "Set during the Babylonian exile (605–535 BC). Daniel lived through the reigns of Nebuchadnezzar, Belshazzar, Darius the Mede, and Cyrus of Persia."
  },
  "Proverbs": {
    context: "Proverbs is a collection of inspired wisdom literature compiled mainly by Solomon (970–930 BC) along with contributions from Agur and King Lemuel. It addresses practical, everyday life — how to handle money, words, relationships, work, and character — all rooted in one foundational principle: 'The fear of the LORD is the beginning of wisdom' (1:7).",
    themes: "Key themes: (1) Wisdom as a divine gift to be pursued; (2) The fear of the LORD as wisdom's foundation; (3) The contrast between the wise and the foolish in daily choices; (4) The power of the tongue; (5) Righteousness in commerce, family, and friendship; (6) Lady Wisdom vs. the adulterous woman — a call to embrace God's ways.",
    application: "Proverbs does not promise a perfect formula ('if you do X, Y will always happen'), but it reveals general principles of how God has ordered His world. The consistent message is: character matters. Integrity, diligence, honest speech, humility, and the fear of God — these are the building blocks of a life well-lived. Read one chapter daily alongside your regular OT reading.",
    memoryVerse: "\"Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.\" — Proverbs 3:5-6",
    keyFigures: "Solomon, Agur, King Lemuel, Lady Wisdom",
    historicalContext: "Compiled during Solomon's reign (around 950 BC) and edited during Hezekiah's time (around 700 BC, see 25:1)."
  },
  "Job": {
    context: "Job is one of the oldest books of the Bible and one of the most profound explorations of human suffering and God's sovereignty ever written. A righteous man loses everything — children, wealth, health — and wrestles with God and his friends over the question: Why do the righteous suffer? God's answer in chapters 38–41 is not an explanation but a revelation of His incomprehensible greatness.",
    themes: "Key themes: (1) Suffering is not always punishment — Job was righteous; (2) The inadequacy of simple answers to complex suffering; (3) God's sovereignty and wisdom beyond human understanding; (4) Honest lament as legitimate prayer; (5) Restoration — God doubles what Job had lost; (6) The cosmic conflict behind human suffering (ch 1–2).",
    application: "Job teaches us to resist the temptation to explain other people's suffering. Job's friends were wrong. Their tidy theology — 'you're suffering because you sinned' — was rebuked by God Himself. When a brother or sister suffers, they need your presence more than your explanations. And when you suffer, remember Job's ultimate cry: 'I know that my redeemer lives' (19:25) — even in the darkest valley, God is not absent.",
    memoryVerse: "\"I know that my redeemer lives, and that in the end he will stand on the earth.\" — Job 19:25",
    keyFigures: "Job, Eliphaz, Bildad, Zophar, Elihu, God, Satan",
    historicalContext: "The setting is the patriarchal period (around 2000 BC). The book's composition date is debated — possibly one of the earliest books in Scripture."
  }
};

function getCommentary(books) {
  const bookName = books[0]?.book;
  if (!bookName) return null;
  // Match by book name prefix
  for (const key of Object.keys(COMMENTARY_DB)) {
    if (bookName.includes(key) || key.includes(bookName)) return COMMENTARY_DB[key];
  }
  // Fallback generic
  return {
    context: `${bookName} is part of the rich tapestry of God's Word in the Old Testament. As you read these chapters, note the people, promises, and patterns that point forward to Christ and His redemptive work.`,
    themes: "Watch for the key themes of covenant faithfulness, human failure, divine grace, and God's unrelenting pursuit of His people. The Old Testament is not merely history — it is a story of redemption in progress.",
    application: "Ask three questions of every passage: (1) What does this reveal about God's character? (2) What does it reveal about human nature? (3) Where do I see a pointer toward Christ or the Gospel? These questions will transform your Bible reading.",
    memoryVerse: "\"Your word is a lamp for my feet, a light on my path.\" — Psalm 119:105",
    keyFigures: "See the main characters in today's reading",
    historicalContext: "Part of the Old Testament historical narrative. Consider how God is working in and through His people's story."
  };
}

// ════════════════════════════════════════════════════════════════════
// BUILT-IN MCQ DATABASE (10+ per day group, keyed by book)
// ════════════════════════════════════════════════════════════════════
const MCQ_DB = {
  "Genesis": [
    { q: "On which day of creation did God create light?", opts: ["Day 1", "Day 2", "Day 3", "Day 4"], answer: 0 },
    { q: "What was the name of the garden where God placed Adam and Eve?", opts: ["Gethsemane", "Eden", "Paradise", "Sharon"], answer: 1 },
    { q: "What did God use to form Eve?", opts: ["Dust of the ground", "A rib from Adam", "Clay from the river", "Breath alone"], answer: 1 },
    { q: "Who was the first person born in the Bible?", opts: ["Abel", "Seth", "Enoch", "Cain"], answer: 3 },
    { q: "How many days did it rain during Noah's flood?", opts: ["20 days", "40 days", "60 days", "100 days"], answer: 1 },
    { q: "What was the sign of God's covenant with Noah?", opts: ["A burning torch", "A rainbow", "A dove", "An altar"], answer: 1 },
    { q: "From which city did God call Abram to leave?", opts: ["Nineveh", "Babylon", "Ur of the Chaldeans", "Haran"], answer: 2 },
    { q: "Who was Abraham's wife?", opts: ["Hagar", "Rebekah", "Sarah", "Leah"], answer: 2 },
    { q: "On which mountain did Abraham prepare to sacrifice Isaac?", opts: ["Sinai", "Moriah", "Zion", "Carmel"], answer: 1 },
    { q: "How many sons did Jacob have?", opts: ["10", "11", "12", "14"], answer: 2 },
    { q: "Who sold Joseph into slavery?", opts: ["His father Jacob", "His brothers", "Potiphar", "The Ishmaelites"], answer: 1 },
    { q: "In Pharaoh's dream, how many fat cows were eaten by the thin cows?", opts: ["5", "6", "7", "10"], answer: 2 },
  ],
  "Exodus": [
    { q: "What was Moses' mother's name?", opts: ["Miriam", "Jochebed", "Zipporah", "Rahab"], answer: 1 },
    { q: "In what did Pharaoh's daughter find baby Moses?", opts: ["A cave by the Nile", "A basket in the Nile", "A field of reeds", "A shepherd's tent"], answer: 1 },
    { q: "What was the burning bush miracle about?", opts: ["God calling Moses to deliver Israel", "Judgment on Egypt", "The giving of the Law", "Israel's defeat of Pharaoh"], answer: 0 },
    { q: "How many plagues came upon Egypt?", opts: ["7", "8", "10", "12"], answer: 2 },
    { q: "What did Israel eat in the wilderness?", opts: ["Manna and quail", "Bread and wine", "Dates and figs", "Meat from offerings"], answer: 0 },
    { q: "What were the Ten Commandments written on?", opts: ["Papyrus scrolls", "Tablets of stone", "Clay tablets", "Gold plates"], answer: 1 },
    { q: "What is the name of the mountain where God gave Moses the Law?", opts: ["Mount Zion", "Mount Carmel", "Mount Sinai", "Mount Moriah"], answer: 2 },
    { q: "What did the Israelites construct at Sinai while Moses was on the mountain?", opts: ["A temple", "A golden calf", "An altar to Baal", "An idol of Moses"], answer: 1 },
    { q: "What was the purpose of the Ark of the Covenant?", opts: ["To store supplies", "To house God's presence and the Law tablets", "To transport the priests", "To carry burnt offerings"], answer: 1 },
    { q: "What was the first plague God sent upon Egypt?", opts: ["Darkness", "Frogs", "Blood — the Nile turned to blood", "Locusts"], answer: 2 },
    { q: "What saved the Israelite firstborns during the Passover?", opts: ["The prayers of Moses", "The blood of the lamb on their doorposts", "Hiding in their homes", "An angel's covering"], answer: 1 },
  ],
  "Leviticus": [
    { q: "What was the purpose of the burnt offering?", opts: ["To feed the priests", "Atonement and total consecration to God", "Thanksgiving only", "To mark the Sabbath"], answer: 1 },
    { q: "What is the central command of Leviticus 19:2?", opts: ["Love your neighbor", "Obey the Law", "Be holy because I the LORD your God am holy", "Keep the Sabbath"], answer: 2 },
    { q: "What is the Day of Atonement called in Hebrew?", opts: ["Passover", "Shabbat", "Yom Kippur", "Pentecost"], answer: 2 },
    { q: "Aaron's sons who offered unauthorized fire before the LORD were:", opts: ["Eleazar and Ithamar", "Nadab and Abihu", "Phinehas and Gershom", "Korah and Dathan"], answer: 1 },
    { q: "In the Year of Jubilee, what happened?", opts: ["Double taxes were paid", "All debts were forgiven and land returned to original families", "The temple was rebuilt", "The king was crowned"], answer: 1 },
    { q: "What animal was used as a 'scapegoat' on the Day of Atonement?", opts: ["A bull", "A dove", "A goat that was sent into the wilderness", "A lamb"], answer: 2 },
    { q: "The 'clean' and 'unclean' food distinctions in Leviticus primarily taught Israel:", opts: ["Nutrition science", "To be distinct from surrounding nations and holy to God", "How to trade with neighbors", "Temple building techniques"], answer: 1 },
    { q: "What offering expressed thanksgiving and fellowship with God?", opts: ["Sin offering", "Guilt offering", "Peace offering", "Wave offering"], answer: 2 },
    { q: "How often was the Year of Jubilee observed?", opts: ["Every 7 years", "Every 25 years", "Every 40 years", "Every 50 years"], answer: 3 },
    { q: "Leviticus 17:11 teaches that 'the life of a creature is in the ___':", opts: ["breath", "blood", "soul", "heart"], answer: 1 },
  ],
  "Numbers": [
    { q: "What did the 12 spies find in Canaan?", opts: ["A barren desert", "A land flowing with milk and honey, with large inhabitants", "Only water", "Empty plains"], answer: 1 },
    { q: "Which two spies gave a positive report about entering Canaan?", opts: ["Moses and Aaron", "Joshua and Caleb", "Eleazar and Phinehas", "Reuben and Gad"], answer: 1 },
    { q: "How long did Israel wander in the wilderness because of unbelief?", opts: ["20 years", "30 years", "40 years", "50 years"], answer: 2 },
    { q: "What happened when the Israelites complained and God sent poisonous snakes?", opts: ["Moses drove them away", "Those who looked at the bronze snake Moses lifted up were healed", "Aaron prayed and the snakes left", "The snakes turned to sand"], answer: 1 },
    { q: "Balaam was hired by Balak to do what to Israel?", opts: ["Attack them militarily", "Curse them", "Spy on them", "Make a treaty with them"], answer: 1 },
    { q: "What miracle occurred at Meribah?", opts: ["Fire came from heaven", "Water flowed from a rock", "Manna appeared on the ground", "An angel appeared"], answer: 1 },
    { q: "Why was Moses not allowed to enter the Promised Land?", opts: ["He was too old", "He struck the rock in anger instead of speaking to it", "He married a Midianite woman", "He didn't believe God"], answer: 1 },
    { q: "What is the significance of the Nazirite vow in Numbers 6?", opts: ["It was for priests only", "It was a voluntary consecration to God requiring abstaining from wine and cutting hair", "It required living in the temple", "It was the mark of a king"], answer: 1 },
    { q: "The Aaronic blessing in Numbers 6 ends with: 'The LORD turn his face toward you and give you ___':", opts: ["wisdom", "strength", "peace", "land"], answer: 2 },
    { q: "What tribe was set apart for the service of the Tabernacle?", opts: ["Judah", "Dan", "Levi", "Benjamin"], answer: 2 },
  ],
  "Deuteronomy": [
    { q: "Deuteronomy means 'second ___':", opts: ["covenant", "law", "blessing", "journey"], answer: 1 },
    { q: "The Shema in Deuteronomy 6:4 begins: 'Hear, O Israel: The LORD our God, the LORD is ___':", opts: ["great", "mighty", "one", "holy"], answer: 2 },
    { q: "Who delivered the sermons that make up Deuteronomy?", opts: ["Aaron", "Joshua", "Moses", "Caleb"], answer: 2 },
    { q: "What was Israel commanded to do with God's commands according to Deuteronomy 6?", opts: ["Write them only in the temple", "Teach them diligently to their children", "Keep them secret", "Memorize them in silence"], answer: 1 },
    { q: "Where did Moses die?", opts: ["In the Promised Land", "At Mount Sinai", "In the wilderness of Moab on Mount Nebo", "In Egypt"], answer: 2 },
    { q: "Deuteronomy 18 prophesied that God would raise up a prophet like Moses. Christians understand this to refer to:", opts: ["Elijah", "Isaiah", "John the Baptist", "Jesus Christ"], answer: 3 },
    { q: "The blessings and curses of Deuteronomy 28 were conditional on Israel's:", opts: ["military strength", "obedience to God's covenant", "population growth", "temple sacrifices"], answer: 1 },
    { q: "Who succeeded Moses as Israel's leader?", opts: ["Caleb", "Aaron's son Eleazar", "Joshua", "Phinehas"], answer: 2 },
    { q: "What did Moses command Israel to place on doorposts and gates?", opts: ["Sacrificial blood", "God's commandments", "Symbols of the twelve tribes", "The name of the LORD"], answer: 1 },
    { q: "Deuteronomy 30:19 says: 'I have set before you life and death, blessings and curses. Now choose ___':", opts: ["wisely", "life", "righteousness", "God"], answer: 1 },
  ],
  "Psalms": [
    { q: "Psalm 23 begins: 'The LORD is my ___':", opts: ["rock", "light", "shepherd", "fortress"], answer: 2 },
    { q: "Which Psalm begins with the words Jesus quoted from the cross: 'My God, my God, why have you forsaken me?'", opts: ["Psalm 2", "Psalm 22", "Psalm 51", "Psalm 110"], answer: 1 },
    { q: "What is the central teaching of Psalm 1 about the blessed person?", opts: ["They are wealthy and successful", "They delight in and meditate on the Law of God", "They offer many sacrifices", "They have many children"], answer: 1 },
    { q: "Psalm 119 is devoted entirely to the praise of:", opts: ["God's creation", "God's Word", "God's mercy", "God's power"], answer: 1 },
    { q: "Which Psalm is called 'the Shepherd Psalm'?", opts: ["Psalm 100", "Psalm 23", "Psalm 91", "Psalm 46"], answer: 1 },
    { q: "In Psalm 51, David cries out after his sin with Bathsheba. He asks God to: 'Create in me a ___ heart':", opts: ["strong", "pure", "clean", "humble"], answer: 2 },
    { q: "Psalm 110:1 — 'The LORD says to my lord: Sit at my right hand until I make your enemies a footstool' — is quoted by Jesus in reference to:", opts: ["David", "Himself as the Messiah", "Moses", "The High Priest"], answer: 1 },
    { q: "How many psalms are in the book of Psalms?", opts: ["100", "120", "150", "175"], answer: 2 },
    { q: "Who wrote the majority of the Psalms?", opts: ["Solomon", "Moses", "David", "Asaph"], answer: 2 },
    { q: "Psalm 46:10 says: 'Be still, and know that I am ___':", opts: ["Lord", "God", "holy", "near"], answer: 1 },
    { q: "The book of Psalms is divided into how many sections?", opts: ["3", "4", "5", "7"], answer: 2 },
  ],
  "Proverbs": [
    { q: "The theme verse of Proverbs states that wisdom begins with:", opts: ["Study of the Law", "Fear of the LORD", "Humility before men", "Wealth and prosperity"], answer: 1 },
    { q: "Proverbs 3:5-6 instructs us to trust in the LORD with all our heart and:", opts: ["do not fear", "lean not on our own understanding", "seek counsel from others", "work hard always"], answer: 1 },
    { q: "Who is primarily credited with writing the book of Proverbs?", opts: ["David", "Moses", "Solomon", "Agur"], answer: 2 },
    { q: "What is the primary contrast made throughout Proverbs?", opts: ["Rich vs. poor", "Old vs. young", "Wise vs. foolish", "Strong vs. weak"], answer: 2 },
    { q: "Proverbs 31 describes the 'wife of noble character' whose worth is described as 'far above ___':", opts: ["gold", "silver", "rubies", "pearls"], answer: 2 },
    { q: "A soft answer turns away ___ (Proverbs 15:1):", opts: ["enemies", "wrath", "evil", "fools"], answer: 1 },
    { q: "Proverbs 22:6 says: 'Start children off on the way they should go, and even when they are old ___':", opts: ["they will succeed", "they will honor you", "they will not turn from it", "they will teach others"], answer: 2 },
    { q: "What does Proverbs say about a person who spares the rod?", opts: ["They are generous", "They hate their child", "They are patient", "They are merciful"], answer: 1 },
    { q: "According to Proverbs, what kind of person listens to correction?", opts: ["A weak person", "A proud person", "A wise person", "A religious person"], answer: 2 },
    { q: "Proverbs 16:18 warns: 'Pride goes before ___ and a haughty spirit before a fall':", opts: ["sin", "judgment", "destruction", "shame"], answer: 2 },
  ],
  "Isaiah": [
    { q: "Isaiah's vision in chapter 6 is of God seated on:", opts: ["A cloud", "A throne, high and exalted", "The ark of the covenant", "A mountain of fire"], answer: 1 },
    { q: "The seraphim in Isaiah 6 cried out: 'Holy, holy, holy is the LORD ___':", opts: ["Most High", "Our God", "Almighty", "of hosts"], answer: 3 },
    { q: "Isaiah 7:14 prophesies: 'The virgin will conceive and give birth to a son, and will call him ___':", opts: ["Jesus", "Emmanuel", "Wonderful", "Prince of Peace"], answer: 1 },
    { q: "Isaiah 53:5 says 'by his wounds we are ___':", opts: ["forgiven", "saved", "healed", "cleansed"], answer: 2 },
    { q: "What title does Isaiah 9:6 NOT give to the coming Messiah?", opts: ["Wonderful Counselor", "Mighty God", "Eternal Father", "King of Peace"], answer: 3 },
    { q: "Isaiah 40:31 promises: 'Those who hope in the LORD will renew their strength. They will soar on wings like ___':", opts: ["doves", "eagles", "sparrows", "angels"], answer: 1 },
    { q: "Who did God say He would send as a messenger before Him, according to Isaiah 40:3 (fulfilled by John the Baptist)?", opts: ["A prophet", "A voice crying in the wilderness", "A son of Aaron", "A servant of the king"], answer: 1 },
    { q: "Isaiah is often called the 'Fifth Gospel' because:", opts: ["It has five main sections", "It is written like the New Testament", "Of its extensive and detailed prophecies about Jesus Christ", "Isaiah lived during the time of Christ"], answer: 2 },
    { q: "Isaiah 55:8-9 teaches that God's thoughts and ways compared to ours are:", opts: ["Somewhat different", "Much the same", "As high as the heavens above the earth", "Unknown and hidden"], answer: 2 },
    { q: "The 'Suffering Servant' passages in Isaiah are found primarily in chapters:", opts: ["1–12", "24–27", "40–55 (especially 42, 49, 50, 52–53)", "60–66"], answer: 2 },
  ],
  "Daniel": [
    { q: "What was the test Daniel and his friends requested instead of the king's food?", opts: ["Fasting for 7 days", "Vegetables and water for 10 days", "Bread and water only", "Fruit for 30 days"], answer: 1 },
    { q: "What was the statue in Nebuchadnezzar's dream made of (from head to feet)?", opts: ["Gold, bronze, iron, clay", "Gold, silver, bronze, iron, iron/clay", "Silver, gold, bronze, iron", "Gold, silver, iron, stone"], answer: 1 },
    { q: "Who were the three friends thrown into the fiery furnace?", opts: ["Daniel, Azariah, Mishael", "Shadrach, Meshach, Abednego", "Both A and B (same people, different names)", "Elijah, Elisha, Isaiah"], answer: 2 },
    { q: "What did Nebuchadnezzar see in the fire besides the three men?", opts: ["An angel", "A fourth figure like the Son of God", "A mighty wind that quenched the fire", "Moses and Elijah"], answer: 1 },
    { q: "Daniel was thrown into the lions' den under King:", opts: ["Nebuchadnezzar", "Belshazzar", "Darius the Mede", "Cyrus"], answer: 2 },
    { q: "In Daniel 7, the 'Ancient of Days' gives dominion to a figure described as 'Son of Man.' Jesus used this title to refer to:", opts: ["A future prophet", "Himself", "The Messiah who would come after Him", "The archangel Michael"], answer: 1 },
    { q: "The handwriting on the wall (Mene, Mene, Tekel, Parsin) in Daniel 5 was a judgment on:", opts: ["Nebuchadnezzar", "Darius", "Belshazzar", "Cyrus"], answer: 2 },
    { q: "Daniel 9 contains the prophecy of the '70 weeks' which many scholars understand as pointing to:", opts: ["The Babylonian exile", "The exact timing of the Messiah's arrival and death", "The Maccabean revolt", "The return from exile under Ezra"], answer: 1 },
    { q: "Daniel 12:2 is one of the clearest OT statements about:", opts: ["the Messiah's birth", "bodily resurrection and judgment", "the rebuilding of the temple", "Israel's return from exile"], answer: 1 },
    { q: "What habit did Daniel maintain three times daily that led to his arrest?", opts: ["Reading the Law", "Fasting", "Prayer facing Jerusalem", "Offering incense"], answer: 2 },
  ],
  "Job": [
    { q: "How does God describe Job at the beginning of the book?", opts: ["A prophet and priest", "Blameless and upright, fearing God and shunning evil", "A warrior of great strength", "A king in the east"], answer: 1 },
    { q: "Who was given permission to test Job?", opts: ["An angel", "The Adversary (Satan)", "Job's friends", "God Himself directly"], answer: 1 },
    { q: "What did Job's wife tell him to do in his suffering?", opts: ["Pray harder", "Curse God and die", "Offer more sacrifices", "Seek wisdom from others"], answer: 1 },
    { q: "How many friends came to comfort Job initially?", opts: ["2", "3", "4", "7"], answer: 1 },
    { q: "The main argument of Job's three friends was that:", opts: ["God is unjust", "Job must have sinned to deserve his suffering", "Satan has power over God", "Job should give up hope"], answer: 1 },
    { q: "When God speaks from the whirlwind in Job 38, He responds to Job by:", opts: ["Explaining why Job suffered", "Apologizing for the pain", "Revealing His incomprehensible power and wisdom in creation", "Promising to restore Job immediately"], answer: 2 },
    { q: "Job's famous declaration of faith includes: 'I know that my Redeemer ___':", opts: ["is just", "lives", "is near", "will judge"], answer: 1 },
    { q: "At the end of the book, who did God rebuke for not speaking what was right about Him?", opts: ["Job", "Job's wife", "Elihu", "Eliphaz, Bildad, and Zophar"], answer: 3 },
    { q: "What did God command Job's three friends to do at the end of the book?", opts: ["Leave Job's presence", "Offer burnt offerings and have Job pray for them", "Fast for 40 days", "Make a public confession"], answer: 1 },
    { q: "How did God restore Job at the end?", opts: ["He received his health only", "God doubled all that Job had lost", "His children were restored to life", "God made him king of his region"], answer: 1 },
  ],
  "default": [
    { q: "What is the central message of the Old Testament?", opts: ["Israel is God's chosen nation", "God is working through history to redeem humanity through His covenant", "The Law must be perfectly obeyed", "Sacrifices secure God's favor"], answer: 1 },
    { q: "How many books are in the Old Testament?", opts: ["27", "33", "39", "46"], answer: 2 },
    { q: "The word 'covenant' (Hebrew: berith) refers to:", opts: ["A legal contract only", "A binding agreement between God and His people with promises and responsibilities", "Temple worship", "The sacrificial system"], answer: 1 },
    { q: "The theme of the 'remnant' in the Old Testament refers to:", opts: ["The poor of Israel", "A faithful minority who remained true to God when others fell away", "The priests and Levites", "Israel's enemies who survived battles"], answer: 1 },
    { q: "Typology in the Old Testament means:", opts: ["Symbolic writing styles", "OT people, events, and institutions that foreshadow Christ and New Testament realities", "Prophecy about foreign nations", "Laws about worship"], answer: 1 },
    { q: "God's covenant with Abraham in Genesis 12 included three promises:", opts: ["Land, Law, and Priests", "Land, descendants, and blessing to all nations", "Wealth, victory, and wisdom", "Temple, kingdom, and peace"], answer: 1 },
    { q: "The Hebrew word 'Shema' (Deuteronomy 6:4) means:", opts: ["Pray", "Obey", "Hear/Listen", "Remember"], answer: 2 },
    { q: "What is the significance of the number '40' in the Bible?", opts: ["It is a random historical number", "It often signifies a period of testing or preparation", "It always means judgment", "It marks the end of an era"], answer: 1 },
    { q: "The Messianic prophecies of the Old Testament were fulfilled in:", opts: ["Multiple individuals over time", "Jesus Christ alone", "The kings of Israel", "The return from Babylon"], answer: 1 },
    { q: "Which OT book contains the most chapters?", opts: ["Genesis", "Isaiah", "Jeremiah", "Psalms"], answer: 3 },
    { q: "What does 'Immanuel' mean?", opts: ["God saves", "God is mighty", "God with us", "God is holy"], answer: 2 },
    { q: "The first five books of the Bible are called the:", opts: ["Psalms", "Pentateuch", "Prophets", "Writings"], answer: 1 },
  ]
};

function getQuiz(chapters) {
  const bookName = chapters[0]?.book;
  let pool = null;
  if (bookName) {
    for (const key of Object.keys(MCQ_DB)) {
      if (key !== "default" && (bookName.includes(key) || key.includes(bookName))) {
        pool = MCQ_DB[key];
        break;
      }
    }
  }
  if (!pool) pool = MCQ_DB["default"];
  // Shuffle and return 10
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(10, shuffled.length));
}

// ════════════════════════════════════════════════════════════════════
// CONCEPTUAL TEACHINGS (Christian topics)
// ════════════════════════════════════════════════════════════════════
const TEACHINGS = [
  {
    id: "faith",
    title: "Faith",
    icon: "🌟",
    verse: "\"Now faith is confidence in what we hope for and assurance about what we do not see.\" — Hebrews 11:1",
    color: "#C17D0A",
    bg: "#FFF8E6",
    sections: [
      { heading: "What Is Faith?", body: "Biblical faith is not wishful thinking or blind optimism. It is confident trust in God based on the evidence of His character and His Word. The Greek word 'pistis' carries the meaning of firm conviction, trust, and reliance. Faith is not the absence of questions — it is the choice to trust God's word over our circumstances." },
      { heading: "Faith and Works", body: "James 2:17 clarifies that 'faith by itself, if it is not accompanied by action, is dead.' Saving faith always produces transformation. You don't do works to earn salvation — you do works because you are saved. The root of genuine faith always bears fruit. Abraham 'believed God, and it was credited to him as righteousness' (Romans 4:3), and this belief led to obedience — he was willing to offer Isaac." },
      { heading: "How Faith Grows", body: "Romans 10:17 tells us 'faith comes from hearing the message, and the message is heard through the word about Christ.' Faith grows through: (1) Regular, meditative reading of God's Word; (2) Prayer — speaking to and trusting God; (3) Community with other believers; (4) Trials — James 1:3 says 'the testing of your faith produces perseverance.' Don't avoid difficulty; lean into it as a faith-builder." },
      { heading: "Faith in the OT", body: "Hebrews 11 — 'the Hall of Faith' — shows that saving faith has always worked the same way. Abel, Enoch, Noah, Abraham, Moses, Rahab — all 'commended for their faith' — all died without receiving the fullness of the promise (v.13). They trusted God's word about a future they could not see. Your faith stands in the same tradition." },
      { heading: "Application", body: "Where are you struggling to trust God right now? Name it specifically. Then find a promise in Scripture that speaks to that exact area. Write it out. Pray it back to God. Faith is not passive — it actively takes hold of God's word and stands on it." }
    ]
  },
  {
    id: "forgiveness",
    title: "Forgiveness",
    icon: "🕊️",
    verse: "\"For if you forgive other people when they sin against you, your heavenly Father will also forgive you.\" — Matthew 6:14",
    color: "#2E6B9E",
    bg: "#E8F2FB",
    sections: [
      { heading: "God's Forgiveness of Us", body: "The word 'forgiveness' in the New Testament (Greek: 'aphiemi') means to release, to send away, to dismiss a debt. When God forgives you, He does not merely overlook your sin — He takes the full penalty of it and absorbs it in Christ. Colossians 2:14 says God 'canceled the charge of our legal indebtedness...nailing it to the cross.' Your sins are not minimized; they are paid for." },
      { heading: "The Cost of Forgiveness", body: "Forgiveness is never free — someone always pays. When a parent forgives a child's debt, the parent absorbs the loss. When God forgives sin, Jesus absorbed the wrath. The cross is the demonstration that forgiveness is not cheap grace — it is costly, blood-bought grace. This should produce in us both humility (we owe everything) and boldness (we owe nothing — it is paid)." },
      { heading: "Our Call to Forgive Others", body: "Matthew 18:21-35 — the Parable of the Unmerciful Servant — shows that someone forgiven an enormous debt who refuses to forgive a small one has not truly grasped their own forgiveness. Forgiving others is not optional for a Christian — it is the expected overflow of having been forgiven. It does not mean pretending it didn't happen, or that consequences are removed. It means releasing your right to hold the debt against them." },
      { heading: "What Forgiveness Is NOT", body: "Forgiveness does not require: (1) Trust to be immediately restored — trust is rebuilt over time with evidence; (2) Reconciliation — reconciliation requires two people; forgiveness can happen unilaterally; (3) Feelings to change first — you choose to forgive before feelings follow; (4) Minimizing the wrong — you can name what was wrong AND forgive it." },
      { heading: "Walking in Forgiveness", body: "Colossians 3:13 says 'Forgive as the Lord forgave you.' The measure of your forgiveness toward others is meant to match the measure of God's forgiveness toward you. Begin every day by receiving God's forgiveness afresh. Let that overflow into every relationship. Where bitterness has taken root — name it, bring it to the cross, and by an act of will release it." }
    ]
  },
  {
    id: "repentance",
    title: "Repentance",
    icon: "🔄",
    verse: "\"Repent, then, and turn to God, so that your sins may be wiped out, that times of refreshing may come from the Lord.\" — Acts 3:19",
    color: "#8B1A1A",
    bg: "#FAF0F0",
    sections: [
      { heading: "What Is Repentance?", body: "The New Testament word for repentance is 'metanoia' — a change of mind that leads to a change of direction. It is not just feeling sorry for sin (that can be mere remorse — see Judas in Matthew 27:3). True repentance involves: (1) Conviction — recognizing sin as sin; (2) Contrition — genuine sorrow before God; (3) Confession — agreeing with God about the sin; (4) Conversion — turning away from sin and toward God." },
      { heading: "Repentance and Salvation", body: "Jesus' first public proclamation was 'Repent, for the kingdom of heaven has come near' (Matthew 4:17). Repentance is not a work that earns forgiveness — it is the door through which faith enters. You cannot truly trust Christ while clinging to your sin. Acts 2:38 Peter says 'Repent and be baptized...for the forgiveness of your sins.' Repentance is the necessary turning that enables you to walk toward God." },
      { heading: "Ongoing Repentance", body: "Repentance is not only the door into the Christian life — it is the hallway you walk in every day. Martin Luther's first of his Ninety-Five Theses stated: 'When our Lord and Master Jesus Christ said repent, he willed the entire life of believers to be one of repentance.' Daily repentance keeps your communion with God fresh and your conscience clean. 1 John 1:9 is written to believers: 'If we confess our sins, he is faithful and just and will forgive us.'" },
      { heading: "Godly Sorrow vs. Worldly Sorrow", body: "2 Corinthians 7:10 makes a crucial distinction: 'Godly sorrow brings repentance that leads to salvation and leaves no regret, but worldly sorrow brings death.' Worldly sorrow is sorry about consequences. Godly sorrow is sorry for what sin does to God and to others. One leads to life change; the other leads to despair. When you feel convicted of sin, examine: Are you grieved at what this cost God and what it does to those you love? That is the godly sorrow that fuels genuine repentance." },
      { heading: "Repentance as Gift", body: "Acts 5:31 and 11:18 speak of God granting repentance. We do not generate repentance on our own — we ask God to grant it to us. If you find yourself hardening against God or struggling to repent, pray Psalm 51:10: 'Create in me a pure heart, O God.' God is not reluctant to grant repentance to those who ask. He delights in it." }
    ]
  },
  {
    id: "grace",
    title: "Grace",
    icon: "✨",
    verse: "\"For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God.\" — Ephesians 2:8",
    color: "#2E8A5E",
    bg: "#E6F5EE",
    sections: [
      { heading: "The Meaning of Grace", body: "The Greek word 'charis' (grace) means unmerited favor — a gift given purely out of the giver's goodness, with no consideration of the recipient's worthiness. God's grace is His sovereign, free decision to bless those who deserve judgment. It is not merely God being nice — it is God acting for our salvation at infinite cost to Himself." },
      { heading: "Grace in the Old Testament", body: "Grace did not begin at the cross — it begins in Eden. When Adam and Eve sinned, God did not immediately destroy them; He covered their shame, promised a Redeemer (Genesis 3:15), and established covenant relationships that were entirely initiated by Him. Noah found 'grace in the eyes of the LORD' (Genesis 6:8). Abraham was chosen not because of his virtue but because God chose him. All of Israel's history is a story of grace." },
      { heading: "Saving Grace", body: "Ephesians 2:8-9 is the great summary: 'For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God — not by works, so that no one can boast.' Salvation is entirely God's initiative and provision. You did not find God — He found you. You did not choose to be born again — the Spirit drew you, regenerated you, and gave you the faith to believe. This destroys all spiritual pride." },
      { heading: "Grace and Sanctification", body: "Grace is not only the door of salvation — it is the power of Christian living. Titus 2:11-12 says 'the grace of God...teaches us to say No to ungodliness and worldly passions, and to live self-controlled, upright and godly lives.' Grace is the greatest motivator of holiness. When you truly understand that you are fully accepted in Christ apart from your performance, you are free to obey out of love rather than fear." },
      { heading: "Living Under Grace", body: "Romans 6:1-2 asks 'Shall we go on sinning so that grace may increase? By no means!' Grace is not a license for sin — it is the power over sin. A person who claims to live under grace while continuing to sin has misunderstood grace. True grace produces gratitude, and gratitude produces obedience. Each morning, receive afresh what Christ has done, and let it motivate your entire day." }
    ]
  },
  {
    id: "new-creature",
    title: "The New Creature",
    icon: "🦋",
    verse: "\"Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!\" — 2 Corinthians 5:17",
    color: "#5C4A9E",
    bg: "#F0ECF8",
    sections: [
      { heading: "Born Again", body: "Jesus told Nicodemus in John 3: 'You must be born again.' This is not a metaphor for self-improvement. It is a radical divine act of regeneration — the Spirit of God implanting new life where there was only spiritual death. Ephesians 2:1 says you were 'dead in transgressions and sins.' You cannot improve a corpse. New life must come from outside — it comes from God." },
      { heading: "What Changes?", body: "2 Corinthians 5:17 says 'the old has gone, the new is here!' In the new birth: (1) Your nature changes — you have received the 'divine nature' (2 Peter 1:4); (2) Your desires change — you begin to love what God loves and hate what He hates; (3) Your identity changes — you are now a child of God (John 1:12); (4) Your destiny changes — from death to eternal life (John 5:24). The new creature is not a reformed version of you — it is genuinely new." },
      { heading: "Old Habits and New Identity", body: "Many Christians are confused: if I'm new, why do I still struggle with old sins? Romans 6-8 addresses this directly. You have a new nature (the 'spirit') but still live in a body with old patterns (the 'flesh'). Sanctification is the process of learning to live from your new nature. Colossians 3:9-10 says to 'put off the old self...and put on the new self.' This is both a fact to believe AND a daily choice to make." },
      { heading: "Identity Before Behavior", body: "The NT consistently tells us who we are before telling us how to behave. Colossians 1-2 establishes identity; Colossians 3-4 gives commands. Ephesians 1-3 declares who we are in Christ; Ephesians 4-6 tells us how to walk it out. This order is crucial. You obey not to become something — you obey because of what you already are in Christ. Behavior flows from identity." },
      { heading: "Walking in Newness", body: "Romans 6:4 says 'we too may live a new life.' This is a present, daily choice. Begin each day by declaring who you are in Christ: 'I am dead to sin and alive to God in Christ Jesus' (Romans 6:11). Every temptation is a lie about your identity — 'you're still that old person.' Counter it with truth. You are a new creature; live like it." }
    ]
  },
  {
    id: "mercy",
    title: "Mercy",
    icon: "💝",
    verse: "\"The LORD is compassionate and gracious, slow to anger, abounding in love and faithfulness.\" — Psalm 86:15",
    color: "#9E2C6B",
    bg: "#FAF0F6",
    sections: [
      { heading: "Mercy vs. Grace", body: "Though related, mercy and grace are distinct: Grace gives what we don't deserve (blessing, salvation). Mercy withholds what we do deserve (judgment, punishment). Both flow from the same wellspring — God's character. Lamentations 3:22-23 says 'Because of the LORD's great love we are not consumed, for his compassions never fail. They are new every morning.' Every morning you are alive is an act of mercy." },
      { heading: "Mercy in the OT", body: "The Hebrew word 'hesed' (often translated as 'loving-kindness' or 'steadfast love') is one of the richest words in the OT. It describes God's covenant faithfulness — a love that holds on even when the loved one is faithless. It appears over 200 times in the OT. Hosea 6:6 — 'For I desire mercy, not sacrifice' — shows that external religion without mercy toward others misses God's heart entirely." },
      { heading: "Christ: The Embodiment of Mercy", body: "Jesus was repeatedly moved with compassion (Greek: 'splagchnizomai' — moved in the deepest part of His being). When He saw the crowds, when He saw the blind, when He raised Lazarus — He was moved by mercy. His miracles were not primarily demonstrations of power — they were acts of mercy. Hebrews 4:15-16 tells us He 'sympathizes with our weaknesses' and we can 'approach God's throne of grace with confidence' to receive mercy." },
      { heading: "Receiving and Giving Mercy", body: "The Beatitude 'Blessed are the merciful, for they will be shown mercy' (Matthew 5:7) creates a beautiful cycle. Those who have truly received God's mercy cannot help but extend it to others. Micah 6:8 says what God requires: 'To act justly and to love mercy and to walk humbly with your God.' Mercy is not just an occasional act — it is a disposition, a way of seeing people through the eyes of their need rather than their failures." },
      { heading: "Showing Mercy Today", body: "Who in your life has wronged you, failed you, or disappointed you? Mercy says: I will not give them what they deserve. I will instead see them as God sees me — in need of compassion. This is not weakness; it is the most Christlike strength there is. Begin today by asking God to give you eyes of mercy for one person who is difficult for you to love." }
    ]
  },
  {
    id: "sin",
    title: "Sin",
    icon: "⚠️",
    verse: "\"For all have sinned and fall short of the glory of God.\" — Romans 3:23",
    color: "#8B3A0A",
    bg: "#FBF0E8",
    sections: [
      { heading: "What Is Sin?", body: "The primary Greek word for sin is 'hamartia' — missing the mark. Sin is failing to conform to God's perfect standard. But it is more than rule-breaking: it is a relational rupture — turning away from the God who made us and deserves our complete love and obedience. Isaiah 53:6 says 'we all, like sheep, have gone astray, each of us has turned to our own way.' Sin is fundamentally self-direction in the place of God-direction." },
      { heading: "The Nature and Effects of Sin", body: "Sin is: (1) Universal — Romans 3:23 'all have sinned'; (2) Corrupting — it affects mind, will, emotions, and body (Romans 1:21-32); (3) Separating — Isaiah 59:2 'your iniquities have separated you from your God'; (4) Death-producing — Romans 6:23 'the wages of sin is death'; (5) Enslaving — John 8:34 'everyone who sins is a slave to sin.' We are not sinners because we sin — we sin because we are sinners. The problem is the heart." },
      { heading: "Original Sin and Inherited Nature", body: "Romans 5:12 teaches that 'sin entered the world through one man, and death through sin, and in this way death came to all people.' We are born with a sin nature — a bias toward self and away from God. This is not a modern pessimistic view of humanity — it is the realistic theological diagnosis that explains why goodness must be taught and cultivated while selfishness comes naturally. The doctrine of original sin is not meant to excuse behavior but to explain why we need a Savior." },
      { heading: "Sin and the Cross", body: "God's solution to sin is not education, moral reform, or law — it is substitution. Isaiah 53:6 continues: 'the LORD has laid on him the iniquity of us all.' 2 Corinthians 5:21 says 'God made him who had no sin to be sin for us, so that in him we might become the righteousness of God.' The cross is the only sufficient answer to the sin problem — not because it minimizes sin, but because it fully deals with it through the death of the Son of God." },
      { heading: "Dealing With Sin as a Believer", body: "1 John 1:8-9 is written to Christians: 'If we claim to be without sin, we deceive ourselves...If we confess our sins, he is faithful and just and will forgive us.' Regular self-examination and confession keeps the heart clean. But confession is not groveling — it is agreeing with God about sin and receiving the forgiveness already purchased at the cross. Never let conviction become condemnation (Romans 8:1 — 'no condemnation for those in Christ Jesus')." }
    ]
  },
  {
    id: "life-of-god",
    title: "The Life of God",
    icon: "⚡",
    verse: "\"I am the resurrection and the life. The one who believes in me will live, even though they die.\" — John 11:25",
    color: "#1A6B9E",
    bg: "#E6F2FB",
    sections: [
      { heading: "Zoe — The Life of God", body: "In Greek, there are three words for 'life': bios (biological life), psyche (soul/personality), and zoe (divine, eternal life). When Jesus says 'I came that they may have life (zoe) and have it to the full' (John 10:10), He is speaking of participation in God's own life — not just extended existence, but a quality of life that is the life of the eternal God Himself." },
      { heading: "Life Given in the New Birth", body: "At regeneration, the believer receives zoe — the very life of God — through the indwelling Holy Spirit. 2 Peter 1:4 speaks of 'participating in the divine nature.' This is not deification in a pagan sense — it is the believer sharing in God's life through the Spirit. Galatians 2:20 captures it perfectly: 'I no longer live, but Christ lives in me.' Your Christian life is literally Christ's life being expressed through you." },
      { heading: "The Life of God and Eternal Life", body: "Eternal life in the NT is not primarily about duration — it is about quality and source. John 17:3 defines it: 'Now this is eternal life: that they know you, the only true God, and Jesus Christ, whom you have sent.' Eternal life is knowing God — an ongoing, deepening relationship. This life begins now, at salvation, and continues forever. The resurrection body will be the full manifestation of what the Spirit is already doing inside you." },
      { heading: "Abiding in the Life", body: "John 15 gives the key to living from God's life: 'Abide in me, and I in you. As the branch cannot bear fruit by itself, unless it abides in the vine, neither can you, unless you abide in me' (v.4). Abiding means staying connected — through the Word, prayer, obedience, and fellowship. The moment you try to live the Christian life from your own resources, you are operating in bios. Stay connected to the Vine." },
      { heading: "Signs of God's Life in You", body: "How do you know God's life is at work in you? The fruit of the Spirit (Galatians 5:22-23): love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control. These are not things you produce — they are the natural fruit of the Vine expressed through you. When you see these growing, you are experiencing the life of God at work. When they are absent, return to abiding." }
    ]
  },
  {
    id: "salvation",
    title: "Salvation",
    icon: "🛟",
    verse: "\"Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved.\" — Acts 4:12",
    color: "#1A7A3C",
    bg: "#E6F7EC",
    sections: [
      { heading: "The Need for Salvation", body: "Romans 3:23 establishes the diagnosis: 'all have sinned and fall short of the glory of God.' Romans 6:23 states the prognosis without intervention: 'the wages of sin is death.' Humans are not basically good people who need a little help — we are spiritually dead, under the wrath of God, separated from the source of life. The Gospel is not self-improvement advice; it is rescue news for the perishing." },
      { heading: "What Salvation Is", body: "Salvation in the NT (Greek: 'soteria') means rescue, deliverance, and wholeness. It encompasses: (1) Justification — being declared righteous before God (past — Romans 5:1); (2) Sanctification — being made holy in our daily lives (present — 1 Corinthians 1:18); (3) Glorification — being made fully like Christ at His return (future — Romans 8:30). You have been saved, are being saved, and will be saved — all by God's grace." },
      { heading: "How Salvation Comes", body: "Ephesians 2:8-9 is definitive: 'By grace you have been saved, through faith — not from yourselves...not by works.' Romans 10:9-10 gives the practical path: 'If you declare with your mouth "Jesus is Lord," and believe in your heart that God raised him from the dead, you will be saved.' Salvation requires: (1) Repentance — turning from sin; (2) Faith — trusting Christ's finished work; (3) Confession — publicly identifying with Christ." },
      { heading: "The Security of Salvation", body: "John 10:28-29 records Jesus' words: 'I give them eternal life, and they shall never perish; no one will snatch them out of my hand.' Romans 8:38-39 declares that nothing 'will be able to separate us from the love of God that is in Christ Jesus our Lord.' The security of salvation rests not on your grip on God but on God's grip on you. This does not produce complacency but deep gratitude and confident living." },
      { heading: "Sharing Salvation", body: "Every person who has been saved has been entrusted with the message of salvation for others. 2 Corinthians 5:18-19 says God 'gave us the ministry of reconciliation.' You are an ambassador of the most important news in human history. Your friends, family, and neighbors need what you have. Start by living the life, then speaking the message. The Gospel is not just for church — it is for every relationship you have." }
    ]
  },
  {
    id: "evangelism",
    title: "Evangelism",
    icon: "📢",
    verse: "\"How, then, can they call on the one they have not believed in? And how can they believe in the one of whom they have not heard?\" — Romans 10:14",
    color: "#7A4A0A",
    bg: "#FBF5E8",
    sections: [
      { heading: "The Great Commission", body: "Matthew 28:18-20 — the last words of Jesus before His ascension — are a command to every disciple: 'Go and make disciples of all nations, baptizing them...and teaching them to obey everything I have commanded you.' This is not a suggestion or only for professional ministers. Every follower of Jesus is commissioned to share the Gospel and make disciples. The question is not IF you should evangelize — it is HOW." },
      { heading: "The Message of Evangelism", body: "The core Gospel message (1 Corinthians 15:3-4): (1) Christ died for our sins according to the Scriptures; (2) He was buried; (3) He was raised on the third day. This is the message. The call is for people to repent, believe, and receive new life in Christ. You don't need to know everything — you need to know the death, burial, and resurrection of Jesus and what it means for your sins and theirs." },
      { heading: "Lifestyle Evangelism", body: "1 Peter 3:15 says 'Always be prepared to give an answer to everyone who asks you to give the reason for the hope that you have.' Notice: they ask YOU. This implies your life is visibly different enough that people are curious. Before you can verbally share the Gospel effectively, you must live it authentically. Your conduct, generosity, joy, and integrity will open doors that arguments cannot." },
      { heading: "Overcoming Fear in Evangelism", body: "The most common barrier to evangelism is fear — of rejection, of not knowing enough, of ruining a relationship. 2 Timothy 1:7 says 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.' You are not arguing people into the kingdom — God is. Your role is to be faithful and available. When fear rises, pray for the person by name and ask God for an opportunity. He will provide it." },
      { heading: "Discipleship and Evangelism", body: "True evangelism doesn't end with a decision — it leads to discipleship. Matthew 28 says 'make disciples' not just 'make converts.' When someone comes to faith, invest in them. Walk with them. Teach them the Word. Bring them into community. The goal is not a moment of decision but a lifetime of discipleship. The 90-Day OT Journey you're on right now is discipleship — pass it on." }
    ]
  },
  {
    id: "prayer",
    title: "Prayer",
    icon: "🙏",
    verse: "\"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.\" — Philippians 4:6",
    color: "#2A5E8A",
    bg: "#E8F0F8",
    sections: [
      { heading: "What Is Prayer?", body: "Prayer is conversation with God — the Creator of the universe condescending to commune with His creatures. It is simultaneously the most natural (we were created for fellowship with God) and the most supernatural (it moves the hand of the Almighty) activity a human can engage in. Prayer is not a technique for getting things from God — it is the primary means of knowing God and aligning yourself with His purposes." },
      { heading: "The Lord's Prayer as a Model", body: "In Matthew 6:9-13, Jesus gives His disciples a prayer template: (1) Adoration — 'Our Father in heaven, hallowed be your name'; (2) Surrender — 'Your kingdom come, your will be done'; (3) Petition — 'Give us today our daily bread'; (4) Confession — 'Forgive us our debts'; (5) Protection — 'Lead us not into temptation'; (6) Praise — 'For yours is the kingdom and the power and the glory.' Structure your prayer life around these categories." },
      { heading: "Types of Prayer", body: "Scripture describes many forms of prayer: (1) Intercession — praying for others (Romans 8:27); (2) Supplication — personal petition (Philippians 4:6); (3) Thanksgiving — expressing gratitude (1 Thessalonians 5:18); (4) Praise/Adoration — worshipping God for who He is (Psalm 150); (5) Confession — agreeing with God about sin (1 John 1:9); (6) Warfare — spiritual battle (Ephesians 6:18); (7) Lament — honest grief before God (many Psalms). A healthy prayer life includes all of these." },
      { heading: "Hindrances to Prayer", body: "James 4:3 says 'When you ask, you do not receive, because you ask with wrong motives.' Other hindrances Scripture identifies: unconfessed sin (Psalm 66:18), broken relationships (1 Peter 3:7), unbelief (James 1:6-7), and neglect of God's Word (John 15:7 — 'if you remain in me and my words remain in you, ask whatever you wish'). Regular self-examination and honest confession before God clears the channel of prayer." },
      { heading: "Persistence in Prayer", body: "Luke 18:1 — 'Jesus told his disciples a parable to show them that they should always pray and not give up.' The Parable of the Persistent Widow teaches that God honors persistent prayer. Unanswered prayer is not rejected prayer — God may be working things out in His timing. Keep praying. Keep asking. And regularly ask: is my desire aligned with what God desires? As you grow in knowing God through His Word, your prayers will increasingly align with His will." }
    ]
  },
  {
    id: "holiness",
    title: "Holiness",
    icon: "🕯️",
    verse: "\"Make every effort to live in peace with everyone and to be holy; without holiness no one will see the Lord.\" — Hebrews 12:14",
    color: "#5A2E8A",
    bg: "#F2ECF8",
    sections: [
      { heading: "The Holiness of God", body: "Holiness is the defining attribute of God — the one attribute the angels repeat three times: 'Holy, holy, holy is the LORD Almighty' (Isaiah 6:3; Revelation 4:8). The Hebrew 'qodesh' means to be set apart, distinct, other. God is not just morally pure — He is in a category entirely different from all created things. His holiness is the standard, the source, and the goal of all created holiness." },
      { heading: "Called to Holiness", body: "1 Peter 1:15-16 quotes Leviticus 19:2 and applies it to NT believers: 'But just as he who called you is holy, so be holy in all you do; for it is written: "Be holy, because I am holy."' Holiness is not optional for the Christian — it is the calling. You are holy positionally (set apart in Christ) and are called to become holy practically (in how you live). The two dimensions of holiness: status (who you are) and character (how you live)." },
      { heading: "Holiness and Separation", body: "Romans 12:2 commands 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind.' Holiness always involves separation — from sin, from the world's values, from what dishonors God. But biblical holiness is not monasticism (fleeing the world) — it is incarnational (being in the world while not being of it). Jesus was holy and yet ate with sinners. The standard is not physical separation but spiritual distinction." },
      { heading: "Holiness as a Pursuit", body: "Hebrews 12:14 says 'Make every effort...to be holy.' This is active, disciplined pursuit — not passive waiting. Sanctification requires: (1) Regular exposure to God's Word; (2) Consistent prayer and communion with God; (3) The accountability of Christian community; (4) Active resistance of temptation; (5) The 'putting off and putting on' of Colossians 3. Holiness is not accidental — it is cultivated." },
      { heading: "The Joy of Holiness", body: "The world pictures holiness as joyless, restrictive, and grim. But Psalm 16:11 says 'in your presence there is fullness of joy; at your right hand are pleasures forevermore.' The closer you draw to God in holiness, the deeper your joy, peace, and freedom. Sin promises pleasure but delivers bondage. Holiness promises restriction but delivers freedom — freedom from the tyranny of sinful appetites. The holy life is the truly happy life." }
    ]
  },
  {
    id: "righteousness",
    title: "Righteousness",
    icon: "⚖️",
    verse: "\"God made him who had no sin to be sin for us, so that in him we might become the righteousness of God.\" — 2 Corinthians 5:21",
    color: "#0A5E3A",
    bg: "#E6F5EF",
    sections: [
      { heading: "Two Kinds of Righteousness", body: "The Bible distinguishes between two kinds of righteousness: (1) Self-righteousness — moral effort and religious performance to make oneself acceptable to God. The Pharisees had this in abundance. Jesus said unless your righteousness exceeds theirs, you cannot enter the kingdom (Matthew 5:20). (2) Imputed righteousness — God declaring you righteous on the basis of Christ's perfect record credited to your account. This is the righteousness that saves." },
      { heading: "Justification: Declared Righteous", body: "Romans 3:21-22 announces 'a righteousness from God, apart from the law...that comes through faith in Jesus Christ to all who believe.' Justification is the legal act of God declaring the sinner righteous. It is not God making you good — it is God declaring you righteous, on the basis of Christ's death and resurrection. It is instantaneous, permanent, and entirely God's act. At the moment of faith, you stand before God with the full righteousness of Christ." },
      { heading: "Righteousness and the Law", body: "Romans 8:4 says the righteous requirement of the Law is 'fully met in us, who do not live according to the flesh but according to the Spirit.' Jesus perfectly kept the Law for us (active obedience) and took our penalty for breaking it (passive obedience). His obedience is credited to us; our disobedience was credited to Him on the cross. This is the 'great exchange' at the heart of the Gospel." },
      { heading: "Practical Righteousness", body: "Justified righteousness must lead to practical righteousness. Romans 6:13 says 'offer every part of yourself to him as an instrument of righteousness.' Righteousness means right living — doing what is right in relationships, commerce, speech, sexuality, and stewardship. Amos 5:24 captures God's OT standard: 'But let justice roll on like a river, righteousness like a never-failing stream!' Justice for others is the outward expression of inward righteousness." },
      { heading: "Hungering for Righteousness", body: "Matthew 5:6 — 'Blessed are those who hunger and thirst for righteousness, for they will be filled.' Jesus promises that those with a genuine appetite for righteousness will be satisfied. This hunger is itself a sign of God's life in you. Ask God today to increase your hunger for right living, right thinking, and right relationships. The pursuit of righteousness is not burdensome — it is the path to the deepest fulfillment a human can experience." }
    ]
  }
];

// ════════════════════════════════════════════════════════════════════
// MILESTONES & STORAGE
// ════════════════════════════════════════════════════════════════════
const MILESTONES = {
  7: "One week complete! 🌱",
  30: "One month strong! 💪",
  50: "Halfway there! 🌟",
  100: "100 days! Incredible! 🔥",
  150: "150 days — unstoppable! ⚡",
  200: "200 days — faithful warrior! 🏆",
  [TOTAL_DAYS]: "OT COMPLETE! You've read the entire Old Testament! 🎉👑"
};

const DISCIPLER_CODE = "PASTOR2024";

async function lsGet(key) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; } catch { return null; }
}
async function lsSet(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
}
async function lsList(prefix) {
  try { const r = await window.storage.list(prefix); return r ? r.keys : []; } catch { return []; }
}

// ════════════════════════════════════════════════════════════════════
// LOADER COMPONENT
// ════════════════════════════════════════════════════════════════════
function Loader({ text, color = "#8B4513" }) {
  return (
    <div style={{ textAlign: "center", padding: "2.5rem 1rem" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #e8d8c0", borderTop: `3px solid ${color}`, borderRadius: "50%", margin: "0 auto 1rem", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ fontSize: 13, color: "#8a7a6a", margin: 0, fontStyle: "italic" }}>{text}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ════════════════════════════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("disciple");

  const handleLogin = () => {
    const n = name.trim(), c = code.trim().toUpperCase();
    if (!n) { setError("Please enter your name."); return; }
    if (!c) { setError("Please enter your access code."); return; }
    if (mode === "discipler") {
      if (c !== DISCIPLER_CODE) { setError("Invalid discipler code."); return; }
      onLogin({ name: n, code: c, role: "discipler" });
    } else {
      onLogin({ name: n, code: c, role: "disciple" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #1C0A00 0%, #2D1206 40%, #0F1A2E 100%)", fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: 52, marginBottom: "0.75rem", filter: "drop-shadow(0 0 12px rgba(200,160,80,0.4))" }}>✝</div>
          <h1 style={{ color: "#F5E6C8", fontSize: 26, fontWeight: 400, margin: "0 0 6px", letterSpacing: 2 }}>OT Journey</h1>
          <p style={{ color: "#A08060", fontSize: 13, margin: "0 0 4px", letterSpacing: 1 }}>Old Testament · 3 Chapters Daily</p>
          <p style={{ color: "#6A5040", fontSize: 12, margin: 0, fontStyle: "italic" }}>{TOTAL_DAYS} days through the entire Old Testament</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(200,160,80,0.2)", borderRadius: 16, padding: "2rem" }}>
          <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: 3, marginBottom: "1.5rem" }}>
            {["disciple", "discipler"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit", background: mode === m ? "rgba(139,69,19,0.8)" : "transparent", color: mode === m ? "#F5E6C8" : "#A08060" }}>
                {m === "disciple" ? "I'm a Disciple" : "I'm the Discipler"}
              </button>
            ))}
          </div>

          {[["Your Name", name, setName, "Enter your full name", "text"], ["Access Code", code, setCode, mode === "disciple" ? "Code from your discipler" : "Discipler password", "password"]].map(([label, val, setter, ph, type]) => (
            <div key={label} style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", color: "#C8A878", fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{label}</label>
              <input value={val} onChange={e => { setter(e.target.value); setError(""); }} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder={ph} type={type}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(200,160,80,0.25)", background: "rgba(255,255,255,0.06)", color: "#F5E6C8", fontSize: 15, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }} />
            </div>
          ))}

          {error && <p style={{ color: "#FF9080", fontSize: 13, margin: "-0.5rem 0 1rem", textAlign: "center" }}>{error}</p>}

          <button onClick={handleLogin} style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #8B4513, #5C8A2A)", color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5 }}>
            Begin the Journey →
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// DISCIPLER DASHBOARD
// ════════════════════════════════════════════════════════════════════
function DisciplerDashboard({ user, onLogout }) {
  const [disciples, setDisciples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      const keys = await lsList("disciple_");
      const data = (await Promise.all(keys.map(k => lsGet(k)))).filter(Boolean);
      setDisciples(data);
      setLoading(false);
    })();
  }, []);

  const avgDays = disciples.length ? Math.round(disciples.reduce((s, d) => s + (d.daysCompleted || 0), 0) / disciples.length) : 0;
  const avgScore = (() => {
    const active = disciples.filter(d => Object.keys(d.quizScores || {}).length > 0);
    if (!active.length) return 0;
    return Math.round(active.reduce((s, d) => {
      const sc = Object.values(d.quizScores || {});
      return s + (sc.reduce((a, b) => a + b, 0) / sc.length);
    }, 0) / active.length);
  })();

  return (
    <div style={{ fontFamily: "'Palatino Linotype', Palatino, serif", maxWidth: 860, margin: "0 auto", minHeight: "100vh", background: "#F5F0E8" }}>
      <div style={{ background: "linear-gradient(135deg, #1C0A00, #2D1A0A)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: "#A08060", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 4px" }}>Discipler Dashboard</p>
          <h1 style={{ color: "#F5E6C8", fontSize: 20, fontWeight: 400, margin: 0 }}>Welcome, {user.name}</h1>
        </div>
        <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#C8A878", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>Sign out</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: "1px solid #E0D0B8" }}>
        {[["Total Disciples", disciples.length, "👥"], [`Avg Progress`, `${avgDays}/${TOTAL_DAYS}`, "📅"], ["Avg Quiz Score", avgScore + "%", "📝"]].map(([l, v, i]) => (
          <div key={l} style={{ padding: "1.25rem", textAlign: "center", background: "#fff", borderRight: "1px solid #E0D0B8" }}>
            <p style={{ fontSize: 22, margin: "0 0 4px" }}>{i}</p>
            <p style={{ fontSize: 22, fontWeight: 600, color: "#2D1A0A", margin: "0 0 2px" }}>{v}</p>
            <p style={{ fontSize: 11, color: "#8a7a6a", margin: 0, letterSpacing: 0.5, textTransform: "uppercase" }}>{l}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "1.5rem" }}>
        {loading ? <Loader text="Loading disciples…" /> : disciples.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", background: "#fff", borderRadius: 12, border: "1px solid #E0D0B8" }}>
            <p style={{ fontSize: 36, margin: "0 0 1rem" }}>🌱</p>
            <h3 style={{ color: "#2D1A0A", margin: "0 0 8px" }}>No disciples yet</h3>
            <p style={{ color: "#8a7a6a", fontSize: 14, margin: "0 0 1.5rem" }}>Share the app with your disciples. Their progress appears here automatically.</p>
            <div style={{ background: "#F5E6C8", borderRadius: 8, padding: "1rem", display: "inline-block", textAlign: "left" }}>
              <p style={{ fontSize: 12, color: "#8B4513", margin: "0 0 4px", fontWeight: 600, letterSpacing: 1 }}>HOW IT WORKS</p>
              <p style={{ fontSize: 13, color: "#4A2A0A", margin: 0, lineHeight: 1.8 }}>1. Share the app link with each disciple<br />2. Give each a unique access code (e.g. JOHN01)<br />3. Their progress saves as they read and quiz<br />4. Check their progress here anytime</p>
            </div>
          </div>
        ) : selected ? (
          <div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8B4513", fontSize: 13, padding: 0, marginBottom: "1rem", fontFamily: "inherit" }}>← All disciples</button>
            <div style={{ background: "#fff", border: "1px solid #E0D0B8", borderRadius: 12, padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.5rem" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#8B4513,#5C8A2A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: 22 }}>{selected.name?.charAt(0).toUpperCase()}</div>
                <div>
                  <h2 style={{ margin: 0, color: "#1C0A00", fontSize: 20 }}>{selected.name}</h2>
                  <p style={{ margin: 0, color: "#8a7a6a", fontSize: 13 }}>Code: {selected.code}</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.5rem" }}>
                {[["Days Completed", `${selected.daysCompleted || 0}/${TOTAL_DAYS}`], ["Progress", `${Math.round(((selected.daysCompleted || 0) / TOTAL_DAYS) * 100)}%`], ["Quizzes Taken", Object.keys(selected.quizScores || {}).length], ["Avg Quiz Score", (() => { const s = Object.values(selected.quizScores || {}); return s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) + "%" : "—"; })()]].map(([l, v]) => (
                  <div key={l} style={{ background: "#F5F0E8", borderRadius: 8, padding: "1rem" }}>
                    <p style={{ fontSize: 11, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>{l}</p>
                    <p style={{ fontSize: 22, fontWeight: 600, color: "#2D1A0A", margin: 0 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {disciples.sort((a, b) => (b.daysCompleted || 0) - (a.daysCompleted || 0)).map(d => {
              const pct = Math.round(((d.daysCompleted || 0) / TOTAL_DAYS) * 100);
              return (
                <div key={d.code} onClick={() => setSelected(d)} style={{ background: "#fff", border: "1px solid #E0D0B8", borderRadius: 10, padding: "1rem 1.25rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#8B4513,#5C8A2A)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 600, fontSize: 16, flexShrink: 0 }}>{d.name?.charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#1C0A00" }}>{d.name}</span>
                      <span style={{ fontSize: 12, color: "#8a7a6a" }}>Day {d.daysCompleted || 0}/{TOTAL_DAYS}</span>
                    </div>
                    <div style={{ height: 6, background: "#E8D8B8", borderRadius: 99 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#8B4513,#5C8A2A)", borderRadius: 99 }} />
                    </div>
                  </div>
                  <span style={{ color: "#C0A880" }}>›</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAIN DISCIPLE APP
// ════════════════════════════════════════════════════════════════════
function DiscipleApp({ user, onLogout }) {
  const storageKey = `disciple_${user.code}`;
  const [view, setView] = useState("dashboard");
  const [completed, setCompleted] = useState({});
  const [quizScores, setQuizScores] = useState({});
  const [notes, setNotes] = useState({});
  const [activeDay, setActiveDay] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await lsGet(storageKey);
      if (saved) {
        setCompleted(saved.completed || {});
        setNotes(saved.notes || {});
        setQuizScores(saved.quizScores || {});
      }
      setLoaded(true);
    })();
  }, []);

  const persist = async (nc, nn, nq) => {
    const dc = Object.values(nc).filter(Boolean).length;
    const existing = await lsGet(storageKey);
    await lsSet(storageKey, { name: user.name, code: user.code, role: "disciple", completed: nc, notes: nn, quizScores: nq, daysCompleted: dc, lastActive: new Date().toISOString(), joinDate: existing?.joinDate || new Date().toISOString() });
  };

  const toggleDone = async (d) => { const n = { ...completed, [d]: !completed[d] }; setCompleted(n); await persist(n, notes, quizScores); };
  const saveNote = async (d, t) => { const n = { ...notes, [d]: t }; setNotes(n); await persist(completed, n, quizScores); };
  const saveQuizScore = async (d, score, total) => { const pct = Math.round((score / total) * 100); const n = { ...quizScores, [d]: pct }; setQuizScores(n); await persist(completed, notes, n); };

  const doneCount = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((doneCount / TOTAL_DAYS) * 100);
  const nextDay = (PLAN.findIndex((_, i) => !completed[i + 1]) + 1) || TOTAL_DAYS;

  if (!loaded) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F0E8" }}><Loader text="Loading your journey…" /></div>;

  if (view === "day" && activeDay) return (
    <DayView day={activeDay} completed={completed} notes={notes} quizScores={quizScores}
      onToggleDone={toggleDone} onSaveNote={saveNote} onSaveQuizScore={saveQuizScore}
      onBack={() => setView("plan")} user={user} onLogout={onLogout} />
  );

  return (
    <div style={{ fontFamily: "'Palatino Linotype', Palatino, serif", maxWidth: 780, margin: "0 auto", minHeight: "100vh", background: "#F5F0E8" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(160deg, #1C0A00 0%, #2D1A0A 60%, #1A2D0A 100%)", padding: "2rem 1.5rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#A08060", textTransform: "uppercase", margin: "0 0 6px" }}>Old Testament Discipleship Journey</p>
            <h1 style={{ fontSize: 22, fontWeight: 400, margin: "0 0 4px", color: "#F5E6C8", letterSpacing: 1 }}>Through the Old Testament</h1>
            <p style={{ color: "#6A5040", fontSize: 13, margin: 0 }}>Welcome, {user.name} · 3 chapters daily · {TOTAL_DAYS} days</p>
          </div>
          <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(200,160,80,0.2)", color: "#A08060", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>Sign out</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#8B4513,#C8A020,#5C8A2A)", borderRadius: 99, transition: "width 0.5s" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#F5E6C8", minWidth: 42 }}>{pct}%</span>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {[["Days done", doneCount], ["Days left", TOTAL_DAYS - doneCount], ["Chapters read", doneCount * 3]].map(([l, v]) => (
            <div key={l}><p style={{ fontSize: 18, fontWeight: 600, margin: 0, color: "#F5E6C8" }}>{v}</p><p style={{ fontSize: 11, color: "#6A5040", margin: 0 }}>{l}</p></div>
          ))}
        </div>
        {MILESTONES[doneCount] && (
          <div style={{ marginTop: "1rem", background: "rgba(92,138,42,0.2)", border: "1px solid rgba(92,138,42,0.4)", borderRadius: 8, padding: "8px 14px", display: "inline-block" }}>
            <span style={{ fontSize: 13, color: "#9AE06A", fontWeight: 500 }}>{MILESTONES[doneCount]}</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ display: "flex", borderBottom: "1px solid #E0D0B8", background: "#fff", overflowX: "auto" }}>
        {[["dashboard", "Overview"], ["plan", "Reading Plan"], ["teachings", "Teachings"]].map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: "0.75rem", background: "none", border: "none", borderBottom: view === v ? "2px solid #8B4513" : "2px solid transparent", color: view === v ? "#8B4513" : "#8a7a6a", fontWeight: view === v ? 600 : 400, cursor: "pointer", fontSize: 14, fontFamily: "inherit", whiteSpace: "nowrap" }}>{l}</button>
        ))}
      </div>

      {view === "dashboard" && <Dashboard completed={completed} doneCount={doneCount} nextDay={nextDay} onGoToDay={d => { setActiveDay(d); setView("day"); }} quizScores={quizScores} />}
      {view === "plan" && <PlanView plan={PLAN} completed={completed} notes={notes} onOpenDay={d => { setActiveDay(d); setView("day"); }} onToggleDone={toggleDone} />}
      {view === "teachings" && <TeachingsView />}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════════════════
function Dashboard({ completed, doneCount, nextDay, onGoToDay, quizScores }) {
  const sectionProgress = SECTIONS.map(s => {
    const total = Math.min(s.range[1], TOTAL_DAYS) - s.range[0] + 1;
    const done = Array.from({ length: total }, (_, i) => i + s.range[0]).filter(d => completed[d]).length;
    return { ...s, total, done, pct: Math.round((done / total) * 100) };
  });

  const quizAvg = (() => {
    const sc = Object.values(quizScores);
    return sc.length ? Math.round(sc.reduce((a, b) => a + b, 0) / sc.length) : null;
  })();

  return (
    <div style={{ padding: "1.5rem" }}>
      {nextDay <= TOTAL_DAYS && (
        <div onClick={() => onGoToDay(nextDay)} style={{ background: "#fff", border: "1px solid #E0D0B8", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, borderLeft: "4px solid #8B4513" }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#8B4513,#5C8A2A)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontSize: 18 }}>▶</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, margin: 0, fontSize: 15, color: "#1C0A00" }}>Continue — Day {nextDay}</p>
            <p style={{ fontSize: 13, color: "#8a7a6a", margin: "2px 0 0" }}>{formatReading(PLAN[nextDay - 1])}</p>
          </div>
          <span style={{ color: "#C0A880" }}>›</span>
        </div>
      )}

      {quizAvg !== null && (
        <div style={{ background: "#fff", border: "1px solid #E0D0B8", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", gap: 20 }}>
          {[["Quiz Average", quizAvg + "%"], ["Quizzes Done", Object.keys(quizScores).length], ["Total Questions", Object.keys(quizScores).length * 10 + "+"]].map(([l, v]) => (
            <div key={l} style={{ textAlign: "center", flex: 1 }}>
              <p style={{ fontSize: 20, fontWeight: 600, color: "#8B4513", margin: 0 }}>{v}</p>
              <p style={{ fontSize: 11, color: "#8a7a6a", margin: 0, letterSpacing: 0.5 }}>{l}</p>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ fontSize: 11, fontWeight: 600, margin: "0 0 1rem", color: "#8a7a6a", letterSpacing: 2, textTransform: "uppercase" }}>Progress by section</h3>
      <div style={{ display: "grid", gap: 10, marginBottom: "1.5rem" }}>
        {sectionProgress.map(s => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #E0D0B8", borderRadius: 10, padding: "1rem 1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1C0A00" }}>{s.label}</span>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8a7a6a", fontStyle: "italic" }}>{s.desc}</p>
              </div>
              <span style={{ fontSize: 13, color: "#8a7a6a" }}>{s.done}/{s.total} days</span>
            </div>
            <div style={{ height: 7, background: "#E8D8B8", borderRadius: 99 }}>
              <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: 99, transition: "width 0.4s" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// PLAN VIEW
// ════════════════════════════════════════════════════════════════════
function PlanView({ plan, completed, notes, onOpenDay, onToggleDone }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => plan.map((chs, i) => ({ chs, day: i + 1 })).filter(({ chs, day }) => {
    const sec = getSec(day);
    const lbl = formatReading(chs);
    return (filter === "All" || sec?.label === filter) && (search === "" || lbl.toLowerCase().includes(search.toLowerCase()) || String(day).includes(search));
  }), [plan, filter, search]);

  return (
    <div style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1rem" }}>
        {["All", ...SECTIONS.map(s => s.label)].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "5px 10px", borderRadius: 99, border: "1px solid", borderColor: filter === f ? "#8B4513" : "#E0D0B8", background: filter === f ? "#8B4513" : "transparent", color: filter === f ? "#fff" : "#8a7a6a", cursor: "pointer", fontSize: 11, fontWeight: filter === f ? 600 : 400, fontFamily: "inherit" }}>{f}</button>
        ))}
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by book or day…"
        style={{ width: "100%", padding: "9px 14px", borderRadius: 8, border: "1px solid #E0D0B8", background: "#fff", fontSize: 13, marginBottom: "1rem", boxSizing: "border-box", fontFamily: "inherit", outline: "none" }} />
      <div style={{ display: "grid", gap: 6 }}>
        {filtered.map(({ chs, day }) => {
          const sec = getSec(day);
          const done = !!completed[day];
          return (
            <div key={day} style={{ background: "#fff", border: `1px solid ${done ? sec.color : "#E0D0B8"}`, borderRadius: 10, overflow: "hidden", display: "flex" }}>
              <div style={{ width: 4, background: sec.color, flexShrink: 0 }} />
              <div style={{ flex: 1, padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: 12 }}>
                <div onClick={() => onToggleDone(day)} style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${done ? sec.color : "#C0B0A0"}`, background: done ? sec.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  {done && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
                </div>
                <div style={{ flex: 1, cursor: "pointer" }} onClick={() => onOpenDay(day)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: sec.text }}>Day {day}</span>
                    <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 99, background: sec.bg, color: sec.text }}>{sec.label}</span>
                    {notes[day] && <span style={{ fontSize: 10, color: "#8a7a6a" }}>📝</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: done ? "#A09080" : "#1C0A00", textDecoration: done ? "line-through" : "none" }}>{formatReading(chs)}</p>
                </div>
                <span onClick={() => onOpenDay(day)} style={{ color: "#C0A880", cursor: "pointer" }}>›</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <p style={{ textAlign: "center", color: "#8a7a6a", padding: "2rem" }}>No results found.</p>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// TEACHINGS VIEW
// ════════════════════════════════════════════════════════════════════
function TeachingsView() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    const t = TEACHINGS.find(x => x.id === selected);
    return (
      <div style={{ padding: "1.5rem" }}>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8B4513", fontSize: 13, padding: "0 0 1rem", fontFamily: "inherit" }}>← All Topics</button>
        <div style={{ background: t.bg, border: `1px solid ${t.color}30`, borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "0.75rem" }}>
            <span style={{ fontSize: 32 }}>{t.icon}</span>
            <h2 style={{ margin: 0, color: t.color, fontSize: 22, fontWeight: 400 }}>{t.title}</h2>
          </div>
          <p style={{ fontSize: 14, color: t.text, fontStyle: "italic", margin: 0, lineHeight: 1.7, borderLeft: `3px solid ${t.color}`, paddingLeft: "1rem" }}>{t.verse}</p>
        </div>
        {t.sections.map((s, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #E0D0B8", borderRadius: 10, padding: "1.25rem", marginBottom: 10 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: t.color, margin: "0 0 8px" }}>{s.heading}</h3>
            <p style={{ fontSize: 14, color: "#2A1A0A", lineHeight: 1.85, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      <p style={{ fontSize: 13, color: "#8a7a6a", fontStyle: "italic", marginBottom: "1.25rem" }}>Deep-dive teachings on the core truths of the Christian faith</p>
      <div style={{ display: "grid", gap: 10 }}>
        {TEACHINGS.map(t => (
          <div key={t.id} onClick={() => setSelected(t.id)} style={{ background: "#fff", border: `1px solid ${t.color}30`, borderRadius: 12, padding: "1rem 1.25rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, borderLeft: `4px solid ${t.color}` }}>
            <span style={{ fontSize: 24 }}>{t.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 15, color: "#1C0A00", margin: "0 0 2px" }}>{t.title}</p>
              <p style={{ fontSize: 12, color: "#8a7a6a", margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>{t.verse.slice(0, 80)}…</p>
            </div>
            <span style={{ color: "#C0A880" }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// DAY VIEW
// ════════════════════════════════════════════════════════════════════
function DayView({ day, completed, notes, quizScores, onToggleDone, onSaveNote, onSaveQuizScore, onBack, user, onLogout }) {
  const chs = PLAN[day - 1];
  const sec = getSec(day);
  const done = !!completed[day];
  const [tab, setTab] = useState("read");
  const [note, setNote] = useState(notes[day] || "");
  const [saved, setSaved] = useState(false);
  const [quizData] = useState(() => getQuiz(chs));
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const label = formatReading(chs);
  const commentary = getCommentary(chs);

  const score = submitted ? Object.entries(answers).filter(([i, a]) => quizData[+i]?.answer === a).length : 0;
  const alreadyScored = quizScores[day] !== undefined;

  const handleSubmitQuiz = async () => {
    setSubmitted(true);
    await onSaveQuizScore(day, score, quizData.length);
  };

  return (
    <div style={{ fontFamily: "'Palatino Linotype', Palatino, serif", maxWidth: 780, margin: "0 auto", minHeight: "100vh", background: "#F5F0E8" }}>
      {/* Header */}
      <div style={{ background: sec.bg, borderBottom: `2px solid ${sec.color}30`, padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: sec.text, padding: 0, fontSize: 13, fontFamily: "inherit" }}>← Reading Plan</button>
          <button onClick={onLogout} style={{ background: "rgba(0,0,0,0.06)", border: `1px solid ${sec.color}30`, color: sec.text, padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>Sign out</button>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: sec.color, color: "#fff" }}>Day {day}</span>
              <span style={{ fontSize: 11, color: sec.text }}>{sec.label}</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 400, margin: 0, color: "#1C0A00" }}>{label}</h2>
          </div>
          <button onClick={() => onToggleDone(day)} style={{ padding: "6px 14px", borderRadius: 8, border: `2px solid ${done ? sec.color : "#C0B0A0"}`, background: done ? sec.bg : "transparent", color: done ? sec.text : "#8a7a6a", cursor: "pointer", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", fontFamily: "inherit" }}>
            {done ? "✓ Done" : "Mark done"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #E0D0B8", background: "#fff", overflowX: "auto" }}>
        {[["read", "📖 Read"], ["commentary", "✍️ Commentary"], ["quiz", `📝 Quiz (${quizData.length})`], ["teachings", "🎓 Teachings"], ["notes", "📒 Notes"]].map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)} style={{ padding: "0.75rem 0.9rem", background: "none", border: "none", borderBottom: tab === v ? `2px solid ${sec.color}` : "2px solid transparent", color: tab === v ? sec.color : "#8a7a6a", fontWeight: tab === v ? 600 : 400, cursor: "pointer", fontSize: 12, whiteSpace: "nowrap", fontFamily: "inherit" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: "1.5rem" }}>
        {/* READ */}
        {tab === "read" && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: "1.5rem" }}>
              {chs.map((c, i) => (
                <a key={i} href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(c.book)}+${c.chapter}&version=KJV`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "1rem 1.25rem", background: "#fff", border: "1px solid #E0D0B8", borderRadius: 10, textDecoration: "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: sec.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>📖</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: "#1C0A00" }}>{c.book} {c.chapter}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#8a7a6a" }}>Read on BibleGateway · KJV</p>
                  </div>
                  <span style={{ color: sec.color, fontSize: 16 }}>↗</span>
                </a>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: 10, padding: "1rem 1.25rem", border: `1px solid ${sec.color}30` }}>
              <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "#8a7a6a", margin: "0 0 6px" }}>Also read on</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[["Blue Letter Bible", `https://www.blueletterbible.org/kjv/${chs[0].book.toLowerCase().replace(/ /g, "-").replace(/^(\d)/, "$1$2")}/${chs[0].chapter}/1/`],
                ["Bible Hub", `https://biblehub.com/${chs[0].book.toLowerCase().replace(/ /g, "_")}/${chs[0].chapter}-1.htm`]].map(([name, url]) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                    style={{ padding: "6px 12px", borderRadius: 6, background: sec.bg, color: sec.text, textDecoration: "none", fontSize: 12, border: `1px solid ${sec.color}30` }}>{name} ↗</a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COMMENTARY */}
        {tab === "commentary" && commentary && (
          <div>
            <div style={{ background: sec.bg, borderLeft: `4px solid ${sec.color}`, borderRadius: "0 10px 10px 0", padding: "1rem 1.25rem", marginBottom: "1.25rem" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: sec.text, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: 1 }}>Memory Verse</p>
              <p style={{ fontSize: 14, color: "#1C0A00", margin: 0, fontStyle: "italic", lineHeight: 1.7 }}>{commentary.memoryVerse}</p>
            </div>

            {[["Historical Context", commentary.historicalContext], ["Key Figures", commentary.keyFigures], ["Passage Context", commentary.context], ["Key Themes", commentary.themes], ["Application for Disciples", commentary.application]].map(([heading, body]) => (
              <div key={heading} style={{ background: "#fff", border: "1px solid #E0D0B8", borderRadius: 10, padding: "1.25rem", marginBottom: 10 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: sec.color, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 0.5 }}>{heading}</h3>
                <p style={{ fontSize: 14, color: "#2A1A0A", lineHeight: 1.85, margin: 0 }}>{body}</p>
              </div>
            ))}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: "1rem" }}>
              <a href={`https://www.blueletterbible.org/commentaries/mhc/`} target="_blank" rel="noopener noreferrer"
                style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #E0D0B8", textDecoration: "none", fontSize: 13, color: sec.text, background: "#fff" }}>Matthew Henry Commentary ↗</a>
              <a href={`https://enduringword.com/bible-commentary/${chs[0].book.toLowerCase().replace(/ /g, "-").replace(/^(\d)/, "$1-").replace("1-", "1")}/`} target="_blank" rel="noopener noreferrer"
                style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #E0D0B8", textDecoration: "none", fontSize: 13, color: sec.text, background: "#fff" }}>Enduring Word ↗</a>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {tab === "quiz" && (
          <div>
            {alreadyScored && !submitted && (
              <div style={{ background: "#E6F5EE", borderRadius: 8, padding: "10px 14px", marginBottom: "1rem", fontSize: 13, color: "#1A5C3A" }}>
                ✓ You previously scored <strong>{quizScores[day]}%</strong>. You can retake it below.
              </div>
            )}
            <p style={{ fontSize: 13, color: "#8a7a6a", marginBottom: "1.25rem" }}>{quizData.length} questions · {label}</p>

            {quizData.map((q, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E0D0B8", borderRadius: 10, padding: "1rem 1.25rem", marginBottom: 10 }}>
                <p style={{ fontWeight: 600, fontSize: 14, margin: "0 0 10px", color: "#1C0A00" }}>{i + 1}. {q.q}</p>
                <div style={{ display: "grid", gap: 6 }}>
                  {q.opts.map((opt, j) => {
                    const chosen = answers[i] === j;
                    const correct = submitted && j === q.answer;
                    const wrong = submitted && chosen && j !== q.answer;
                    return (
                      <div key={j} onClick={() => !submitted && setAnswers(p => ({ ...p, [i]: j }))}
                        style={{ padding: "9px 12px", borderRadius: 8, border: `1px solid ${correct ? "#3D9970" : wrong ? "#C03030" : chosen ? sec.color : "#E0D0B8"}`, background: correct ? "#E6F5EE" : wrong ? "#FCEBEB" : chosen ? sec.bg : "#F8F5F0", cursor: submitted ? "default" : "pointer", fontSize: 14, color: correct ? "#1A5C3A" : wrong ? "#8B1A1A" : chosen ? sec.text : "#1C0A00" }}>
                        {opt}
                        {correct && <span style={{ float: "right" }}>✓</span>}
                        {wrong && <span style={{ float: "right" }}>✗</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {!submitted ? (
              <button onClick={handleSubmitQuiz} disabled={Object.keys(answers).length < quizData.length}
                style={{ width: "100%", padding: "0.75rem", background: Object.keys(answers).length >= quizData.length ? sec.color : "#C0B0A0", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                Submit Quiz ({Object.keys(answers).length}/{quizData.length} answered)
              </button>
            ) : (
              <div style={{ background: sec.bg, borderRadius: 10, padding: "1.5rem", textAlign: "center", border: `1px solid ${sec.color}50` }}>
                <p style={{ fontSize: 32, fontWeight: 600, color: sec.color, margin: "0 0 4px" }}>{score}/{quizData.length}</p>
                <p style={{ fontSize: 16, color: sec.text, margin: "0 0 4px" }}>{Math.round((score / quizData.length) * 100)}% — {score === quizData.length ? "Perfect! Outstanding." : score >= Math.ceil(quizData.length * 0.7) ? "Great work! Keep studying." : "Review the chapters and try again."}</p>
                <p style={{ fontSize: 12, color: "#8a7a6a", margin: 0 }}>Score saved ✓</p>
              </div>
            )}
          </div>
        )}

        {/* TEACHINGS - inline quick access */}
        {tab === "teachings" && (
          <div>
            <p style={{ fontSize: 13, color: "#8a7a6a", marginBottom: "1.25rem", fontStyle: "italic" }}>Select a topic to study in depth</p>
            <div style={{ display: "grid", gap: 8 }}>
              {TEACHINGS.map(t => (
                <TeachingCard key={t.id} t={t} />
              ))}
            </div>
          </div>
        )}

        {/* NOTES */}
        {tab === "notes" && (
          <div>
            <p style={{ fontSize: 13, color: "#8a7a6a", marginBottom: "0.75rem" }}>Personal notes for Day {day} — {label}</p>
            <textarea value={note} onChange={e => { setNote(e.target.value); setSaved(false); }} rows={8} placeholder="Write your notes, key verses, insights, or prayer points here…"
              style={{ width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #E0D0B8", background: "#fff", color: "#1C0A00", fontSize: 14, boxSizing: "border-box", resize: "vertical", lineHeight: 1.7, fontFamily: "inherit" }} />
            <button onClick={async () => { await onSaveNote(day, note); setSaved(true); }}
              style={{ marginTop: 10, padding: "8px 18px", borderRadius: 8, background: saved ? "#5C8A2A" : sec.color, color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>
              {saved ? "✓ Saved" : "Save notes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// TEACHING CARD (expandable)
// ════════════════════════════════════════════════════════════════════
function TeachingCard({ t }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "#fff", border: `1px solid ${t.color}30`, borderRadius: 12, overflow: "hidden", borderLeft: `4px solid ${t.color}` }}>
      <div onClick={() => setOpen(!open)} style={{ padding: "1rem 1.25rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 22 }}>{t.icon}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: 15, color: "#1C0A00", margin: "0 0 2px" }}>{t.title}</p>
          <p style={{ fontSize: 12, color: "#8a7a6a", margin: 0, fontStyle: "italic" }}>{t.verse.slice(0, 70)}…</p>
        </div>
        <span style={{ color: "#C0A880", fontSize: 16, transform: open ? "rotate(90deg)" : "none", transition: "0.2s" }}>›</span>
      </div>
      {open && (
        <div style={{ padding: "0 1.25rem 1.25rem" }}>
          <div style={{ background: t.bg, padding: "0.75rem 1rem", borderRadius: 8, marginBottom: "1rem" }}>
            <p style={{ fontSize: 13, color: t.text, fontStyle: "italic", margin: 0, lineHeight: 1.7 }}>{t.verse}</p>
          </div>
          {t.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: t.color, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.heading}</p>
              <p style={{ fontSize: 13, color: "#2A1A0A", lineHeight: 1.85, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    lsGet("nt90_user_v2").then(u => { setUser(u); setAuthLoading(false); });
  }, []);

  const handleLogin = async (u) => { await lsSet("nt90_user_v2", u); setUser(u); };
  const handleLogout = async () => { await lsSet("nt90_user_v2", null); setUser(null); };

  if (authLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #1C0A00, #2D1A0A)" }}>
      <Loader text="Loading…" color="#C8A878" />
    </div>
  );

  if (!user) return <LoginScreen onLogin={handleLogin} />;
  if (user.role === "discipler") return <DisciplerDashboard user={user} onLogout={handleLogout} />;
  return <DiscipleApp user={user} onLogout={handleLogout} />;
}
