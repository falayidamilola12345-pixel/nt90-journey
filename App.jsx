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
  },
  "Numbers": {
    context: "Numbers (Hebrew: 'Bemidbar' — 'In the Wilderness') covers Israel's 40 years of wandering between Sinai and the plains of Moab. It takes its English name from the two censuses recorded in the book. It is a book of journeys, failures, rebellions, and God's patient faithfulness to a stubborn people.",
    themes: "Key themes: (1) The consequences of unbelief — an entire generation forfeited the Promised Land; (2) God's faithfulness despite human failure; (3) Intercession — Moses repeatedly stands between God's judgment and the people; (4) Holiness in the camp — God's presence demands purity; (5) The bronze serpent (21:8–9) — Jesus cites this directly as a type of His own crucifixion (John 3:14).",
    application: "Numbers is a sobering warning against the sin of unbelief. Eleven days' journey from Sinai to Canaan became 40 years because the people refused to trust God's promise. Paul writes in 1 Corinthians 10:11 that 'these things happened to them as examples and were written down as warnings for us.' Ask yourself: where am I wandering in circles because I refuse to trust God and step forward in faith?",
    memoryVerse: "\"The LORD bless you and keep you; the LORD make his face shine on you and be gracious to you; the LORD turn his face toward you and give you peace.\" — Numbers 6:24–26",
    keyFigures: "Moses, Aaron, Miriam, Joshua, Caleb, Balaam, Balak, Phinehas",
    historicalContext: "Covers approximately 1446–1406 BC — Israel's wilderness period. Written by Moses around 1400 BC."
  },
  "Deuteronomy": {
    context: "Deuteronomy (Greek: 'second law') is Moses' farewell address to Israel on the plains of Moab, just before they enter Canaan without him. It is a passionate renewal of the covenant — recalling God's faithfulness, restating the Law, and calling the new generation to wholehearted love and obedience. Jesus quoted Deuteronomy more than any other book when resisting Satan's temptations.",
    themes: "Key themes: (1) Love as the foundation of obedience — 'Love the LORD your God with all your heart' (6:5); (2) Memory — Israel must not forget what God has done; (3) Covenant renewal for a new generation; (4) Blessings and curses — obedience brings life, disobedience brings death; (5) The prophesied coming of a greater prophet like Moses (18:15–18), fulfilled in Christ.",
    application: "Deuteronomy is the most pastoral book of Moses. He is not giving laws coldly — he is pleading with the people he loves. The great Shema (6:4–5) is Israel's central confession and Jesus called it the greatest commandment. Read Deuteronomy as a love letter — God calling His people back to covenant loyalty. Then ask: What does wholehearted love for God look like in my daily life this week?",
    memoryVerse: "\"Love the LORD your God with all your heart and with all your soul and with all your strength.\" — Deuteronomy 6:5",
    keyFigures: "Moses, Joshua, the Levitical priests",
    historicalContext: "Set in 1406 BC on the plains of Moab. Moses delivers three sermons before his death on Mount Nebo. Written by Moses with a brief account of his death added (likely by Joshua)."
  },
  "Joshua": {
    context: "Joshua is the triumphant sequel to the Torah — Israel finally enters and conquers the Promised Land under Joshua's leadership. The name 'Joshua' (Hebrew: Yeshua) is the same name as 'Jesus,' and Joshua is one of the clearest types of Christ in the Old Testament: he leads his people into their inheritance through faith and by the power of God.",
    themes: "Key themes: (1) God's faithfulness — every promise He made to Abraham is kept; (2) Conquest by faith — Jericho falls not by military tactics but by obedience; (3) Covenant fidelity — sin in the camp (Achan) brings defeat; (4) Rahab — a pagan prostitute's faith saves her family and places her in the lineage of Christ (Matthew 1); (5) The land as inheritance — a foretaste of the eternal inheritance believers receive in Christ.",
    application: "Joshua 1:8 is a life-changing verse: 'Keep this Book of the Law always on your lips; meditate on it day and night, so that you may be careful to do everything written in it. Then you will be prosperous and successful.' God's definition of success is rooted in Scripture saturation and obedience — not talent, strategy, or wealth. This is still the formula today.",
    memoryVerse: "\"Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.\" — Joshua 1:9",
    keyFigures: "Joshua, Caleb, Rahab, Achan, the priests",
    historicalContext: "The conquest of Canaan began around 1406 BC and took approximately 7 years. Written shortly after the events by Joshua himself (with possible later additions)."
  },
  "Judges": {
    context: "Judges is one of the most raw and honest books in Scripture. After Joshua's generation died, Israel fell into a devastating cycle: sin → oppression → cry to God → deliverance through a judge → peace → sin again. The book's closing epitaph captures its tragedy: 'In those days Israel had no king; everyone did as they saw fit' (21:25).",
    themes: "Key themes: (1) The sin cycle — spiritual amnesia leads to repeated catastrophe; (2) God's grace in raising deliverers despite Israel's unfaithfulness; (3) The judges as imperfect types of the ultimate deliverer, Christ; (4) The corruption of leadership — Gideon, Jephthah, Samson all have serious moral failures; (5) The need for a king — Judges prepares the reader for 1 Samuel.",
    application: "Judges is a mirror. The same patterns play out in individual lives: we experience God's blessing, drift into complacency and sin, face consequences, cry out, receive grace — and then repeat. The solution is not more willpower but a transformed heart. The New Covenant that Jeremiah promised and Jesus inaugurated breaks this cycle through the indwelling Spirit. We don't have to live in the Judges cycle.",
    memoryVerse: "\"In those days Israel had no king; everyone did as they saw fit.\" — Judges 21:25",
    keyFigures: "Deborah, Gideon, Jephthah, Samson, Delilah",
    historicalContext: "Covers approximately 1380–1050 BC — the period between Joshua's death and the rise of the monarchy. Written likely by Samuel around 1050–1000 BC."
  },
  "Ruth": {
    context: "Ruth is a beautiful short story of loyalty, redemption, and God's providence set during the dark days of the Judges. A Moabite widow clings to her mother-in-law Naomi and the God of Israel, and is redeemed by Boaz — a kinsman-redeemer who becomes a profound picture of Jesus Christ. Ruth is one of only two women with a book of the Bible named after her.",
    themes: "Key themes: (1) Hesed — the Hebrew word for loyal, covenant love, used three times in the book; (2) The kinsman-redeemer (go'el) as a picture of Christ who redeems us at great cost; (3) God's providence operating through ordinary human choices; (4) The inclusion of Gentiles in God's redemptive plan — Ruth the Moabitess enters the lineage of David and of Christ (Matthew 1:5); (5) Faithfulness rewarded.",
    application: "Ruth's declaration to Naomi — 'Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God' (1:16) — is one of the most moving statements of covenant loyalty in Scripture. It models what the Christian life looks like: a wholehearted commitment to God and His people regardless of cost. Is there a 'Naomi' in your life who needs this kind of loyal love?",
    memoryVerse: "\"Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.\" — Ruth 1:16",
    keyFigures: "Ruth, Naomi, Boaz",
    historicalContext: "Set during the period of the judges (~1100 BC). Ruth becomes the great-grandmother of King David. Written likely by Samuel around 1000 BC."
  },
  "1 Samuel": {
    context: "1 Samuel covers one of the most dramatic transitions in Israel's history — from a loose tribal confederation led by judges and priests to a monarchy. Three towering figures dominate: Samuel (the last judge and first prophet), Saul (Israel's first king, a tragic failure), and David (the man after God's own heart, anointed but not yet crowned).",
    themes: "Key themes: (1) The heart matters to God — 'Man looks at the outward appearance, but the LORD looks at the heart' (16:7); (2) Obedience over sacrifice (15:22); (3) The danger of demanding what God hasn't given — Israel's rejection of God as king (ch 8); (4) God's anointed — the word 'Messiah' (anointed one) echoes throughout; (5) David as a type of Christ — shepherd, warrior, king, suffering servant.",
    application: "Saul and David both sinned, but the difference between them is instructive. Saul made excuses and blamed others. David confessed and repented (Psalm 51). The issue was never sinlessness — it was the posture of the heart toward God after failure. When you sin, don't be a Saul. Be a David. Run to God, not away from Him.",
    memoryVerse: "\"To obey is better than sacrifice, and to heed is better than the fat of rams.\" — 1 Samuel 15:22",
    keyFigures: "Hannah, Samuel, Eli, Saul, Jonathan, David, Goliath",
    historicalContext: "Covers approximately 1100–1010 BC. Samuel was written by Samuel, Nathan, and Gad (see 1 Chronicles 29:29). Originally one book with 2 Samuel, divided in the Greek translation."
  },
  "2 Samuel": {
    context: "2 Samuel covers the reign of King David — Israel's greatest king and the ancestor of Jesus Christ. The book is brutally honest about both David's triumphs and his catastrophic failures. His adultery with Bathsheba and the murder of Uriah set off a chain of family disintegration that haunts the rest of his reign. Yet God's covenant with David (ch 7) — the Davidic Covenant — is the foundation of all Messianic hope.",
    themes: "Key themes: (1) The Davidic Covenant — God promises David an eternal dynasty, fulfilled ultimately in Jesus; (2) Sin's consequences — David's family bears the weight of his moral failures; (3) Repentance and restoration — Psalm 51 is David's response to Nathan's confrontation; (4) God's sovereignty over human sin — He works even through David's failures; (5) Loyal love (hesed) in Jonathan's son Mephibosheth — a picture of undeserved grace.",
    application: "2 Samuel 11–12 is one of the most sobering passages in the Bible. David — a man after God's own heart — falls into adultery, deception, and murder through a series of small compromises. He was at the wrong place (on the roof when kings go to war), at the wrong time (evening, alone), looking in the wrong direction. Sin rarely arrives all at once. Guard against the small compromises that open the door.",
    memoryVerse: "\"Your house and your kingdom will endure forever before me; your throne will be established forever.\" — 2 Samuel 7:16",
    keyFigures: "David, Bathsheba, Nathan, Joab, Absalom, Mephibosheth, Uriah",
    historicalContext: "Covers David's reign approximately 1010–970 BC. The Davidic Covenant in chapter 7 is the theological heart of the book and of the entire Old Testament's Messianic hope."
  },
  "1 Kings": {
    context: "1 Kings opens with the glory of Solomon's reign — the temple, unparalleled wisdom, extraordinary wealth — and ends with the kingdom divided in two and both halves in spiritual decline. It is the story of how the wisest man who ever lived could end his life in idolatry, and what it cost a nation. The prophet Elijah dominates the second half as the lone voice for God against Ahab and Jezebel.",
    themes: "Key themes: (1) Wisdom and its limits — Solomon's wisdom was not matched by faithfulness; (2) The temple as the place of God's dwelling and prayer; (3) The divided kingdom — sin divides what God united; (4) Prophetic confrontation — Elijah versus the prophets of Baal; (5) The still small voice — God meets Elijah not in wind, earthquake, or fire but in a gentle whisper (19:12).",
    application: "Solomon's tragic end is a warning to every gifted, successful believer. Spiritual decline is rarely sudden. It began with 'loving many foreign women' in compromise, then accommodation of their religions 'to please them,' and finally outright idolatry. 1 Kings 11:4 records the epitaph: 'his wives turned his heart after other gods.' Who or what is turning your heart? Guard the first commandment fiercely.",
    memoryVerse: "\"Now, LORD my God, you have made your servant king in place of my father David. But I am only a little child and do not know how to carry out my duties... So give your servant a discerning heart.\" — 1 Kings 3:7,9",
    keyFigures: "Solomon, Rehoboam, Jeroboam, Ahab, Jezebel, Elijah, the widow of Zarephath",
    historicalContext: "Covers approximately 970–853 BC — from Solomon's coronation through the reign of Ahaziah of Israel. The kingdom divides around 930 BC after Solomon's death."
  },
  "2 Kings": {
    context: "2 Kings is the story of two kingdoms spiraling toward judgment. Israel (the northern kingdom) falls to Assyria in 722 BC after 19 kings — every single one of whom 'did evil in the eyes of the LORD.' Judah (the southern kingdom) lasts longer, with a few faithful kings like Hezekiah and Josiah, but eventually falls to Babylon in 586 BC. The book is a theological commentary: covenant unfaithfulness has consequences.",
    themes: "Key themes: (1) The prophetic word always comes true — what God said through Moses in Deuteronomy 28 is fulfilled; (2) Revival is possible even in dark times — Hezekiah and Josiah demonstrate this; (3) The power of the Word — Josiah's reform begins with the rediscovery of the Law (ch 22); (4) Elisha and double-portion ministry; (5) The exile as covenant judgment, not divine abandonment.",
    application: "Josiah's reform in 2 Kings 22–23 began when the Book of the Law was found in the temple — and Josiah wept when he heard it read, because he saw how far Israel had strayed. Revival begins with the Word of God. When we hear it truly — not casually but with open, convicted hearts — it produces transformation. Ask God to let His Word strike you with that kind of fresh force today.",
    memoryVerse: "\"Because your heart was responsive and you humbled yourself before the LORD... I have heard you, declares the LORD.\" — 2 Kings 22:19",
    keyFigures: "Elijah (departure), Elisha, Hezekiah, Isaiah, Josiah, Nebuchadnezzar",
    historicalContext: "Covers approximately 853–586 BC. Northern Israel falls to Assyria in 722 BC (ch 17). Judah falls to Babylon and the temple is destroyed in 586 BC (ch 25)."
  },
  "1 Chronicles": {
    context: "1 Chronicles covers much of the same history as Samuel and Kings, but from a priestly perspective written for the exiles returning from Babylon. It begins with nine chapters of genealogies — not boring lists but a declaration that God has not forgotten His people. The book focuses especially on David and his preparations for the temple, emphasizing that worship is at the center of Israel's national identity.",
    themes: "Key themes: (1) God's faithfulness across generations — the genealogies root Israel's identity in God's covenant history; (2) The Davidic covenant as the anchor of hope; (3) Worship and the temple as the heart of national life; (4) David's preparation for what Solomon would build — the importance of preparation in God's work; (5) Seeking God — 'seek the LORD your God' echoes throughout.",
    application: "1 Chronicles was written to a community that had lost everything — temple, land, monarchy — and needed to rediscover their identity in God's promises. When you feel stripped of everything familiar, the genealogies of Chronicles say: God has not forgotten. You are part of a story that started long before you and will continue long after. Your name is written in His book.",
    memoryVerse: "\"Give praise to the LORD, proclaim his name; make known among the nations what he has done.\" — 1 Chronicles 16:8",
    keyFigures: "David, Solomon (birth and preparation), the Levites, Nathan the prophet",
    historicalContext: "Written after the Babylonian exile (~450 BC), likely by Ezra. Covers from Adam through David's reign, ending with the transition to Solomon."
  },
  "2 Chronicles": {
    context: "2 Chronicles covers Solomon's reign and the kingdom of Judah from the temple's dedication to its destruction, with the book ending remarkably on a note of hope — Cyrus of Persia's decree permitting the exiles to return. The Chronicler evaluates each king by one criterion above all others: Did they seek God and maintain proper worship?",
    themes: "Key themes: (1) The temple as the place where heaven and earth meet — prayer toward the temple is answered (7:14); (2) Revival — Asa, Jehoshaphat, Hezekiah, and Josiah all lead national renewals; (3) 'If my people' (7:14) — the great prayer promise for national restoration through humility and repentance; (4) The prophets as God's persistent messengers; (5) Mercy extended even to the wicked — even Manasseh repents and is restored.",
    application: "2 Chronicles 7:14 — 'If my people, who are called by my name, will humble themselves and pray and seek my face and turn from their wicked ways, then I will hear from heaven, and I will forgive their sin and will heal their land' — is one of the most important verses in the Bible for understanding how God responds to His people in crisis. Note: it begins with God's people, not the world. Revival always starts with the church.",
    memoryVerse: "\"If my people, who are called by my name, will humble themselves and pray and seek my face and turn from their wicked ways, then I will hear from heaven, and I will forgive their sin and will heal their land.\" — 2 Chronicles 7:14",
    keyFigures: "Solomon, Rehoboam, Asa, Jehoshaphat, Hezekiah, Manasseh, Josiah",
    historicalContext: "Covers Solomon's reign (~970 BC) through the fall of Jerusalem (586 BC), ending with Cyrus' decree in 538 BC. Written by Ezra around 450 BC."
  },
  "Ezra": {
    context: "Ezra records the first two returns of Jewish exiles from Babylon to Jerusalem — under Zerubbabel (538 BC) to rebuild the temple, and under Ezra himself (458 BC) to restore the Law. Ezra was a priest and skilled scribe whose passion was to 'study and observe the Law of the LORD, and to teach its statutes and ordinances in Israel' (7:10). He models what a faithful minister of the Word looks like.",
    themes: "Key themes: (1) God's faithfulness — He uses a pagan king (Cyrus) to fulfill His promises; (2) The centrality of the Word — Ezra's reforms begin with public Scripture reading; (3) Repentance and restoration — the community deals honestly with sin (intermarriage); (4) Opposition to God's work does not stop it; (5) Prayer as the foundation of action — Ezra's prayer in chapter 9 is a model of corporate confession.",
    application: "Ezra 7:10 is a life verse for anyone called to ministry or discipleship: 'Ezra had devoted himself to the study and observance of the Law of the LORD, and to teaching its decrees and laws in Israel.' Note the order: study → practice → teach. You cannot give what you have not received. Before you can teach the Word to others, you must live it yourself. Are you doing both?",
    memoryVerse: "\"Ezra had devoted himself to the study and observance of the Law of the LORD, and to teaching its decrees and laws in Israel.\" — Ezra 7:10",
    keyFigures: "Ezra, Zerubbabel, Jeshua the high priest, Cyrus king of Persia, Artaxerxes",
    historicalContext: "First return under Zerubbabel in 538 BC. Temple completed 516 BC. Ezra's return in 458 BC. Set in the Persian period. Written by Ezra around 440 BC."
  },
  "Nehemiah": {
    context: "Nehemiah is one of the great leadership books of the Bible. A cupbearer to the Persian king Artaxerxes, Nehemiah received news of Jerusalem's broken walls and wept, prayed, planned, and then acted — leading the rebuilding of Jerusalem's walls in just 52 days against fierce opposition. The book is a masterclass in prayer, leadership, and perseverance.",
    themes: "Key themes: (1) Prayer as the foundation of all effective action — Nehemiah prays at every major juncture; (2) Leadership that combines vision, prayer, and practical wisdom; (3) Opposition from without and within — Sanballat, Tobiah, and internal conflicts; (4) The renewal of the covenant — public reading of the Law produces genuine revival (ch 8–10); (5) Finishing what God calls you to start.",
    application: "When Nehemiah heard bad news, his first response was to sit down, weep, mourn, fast — and pray (1:4). He didn't rush to act. He sought God first. Then when opportunity came before the king, he prayed again 'to the God of heaven' in the moment before answering (2:4). This is the discipline of 'arrow prayers' — constant communion with God woven into every circumstance. Practice it this week.",
    memoryVerse: "\"The joy of the LORD is your strength.\" — Nehemiah 8:10",
    keyFigures: "Nehemiah, Ezra, Sanballat, Tobiah, Artaxerxes",
    historicalContext: "Nehemiah's mission took place around 445 BC. The walls were rebuilt in 52 days. Written by Nehemiah himself (personal memoirs) around 430 BC."
  },
  "Esther": {
    context: "Esther is unique among OT books — God is never explicitly named, yet His providence is unmistakably present on every page. A Jewish girl becomes queen of Persia and, at great personal risk, saves her people from genocide. The story of Purim — the annual Jewish celebration of this deliverance — is rooted in this book.",
    themes: "Key themes: (1) Divine providence — God works through ordinary human choices and circumstances; (2) Courage — 'For such a time as this' (4:14); (3) The reversal of the wicked — Haman is hanged on the gallows he built for Mordecai; (4) The preservation of Israel — God will not allow His covenant people to be destroyed; (5) Fasting and intercession as preparation for action.",
    application: "Mordecai's challenge to Esther — 'Who knows whether you have not come to the kingdom for such a time as this?' (4:14) — is a word for every believer. You are not in your current position, relationships, or circumstances by accident. God has placed you there. The question is not 'Why am I here?' but 'What is God calling me to do with where He has placed me?' You have been positioned for purpose.",
    memoryVerse: "\"Who knows whether you have not come to the kingdom for such a time as this?\" — Esther 4:14",
    keyFigures: "Esther, Mordecai, Haman, King Ahasuerus (Xerxes)",
    historicalContext: "Set during the reign of Xerxes I of Persia (486–465 BC). The events likely occurred around 479 BC. Written by an unknown author, possibly Mordecai, around 450 BC."
  },
  "Ecclesiastes": {
    context: "Ecclesiastes (Hebrew: 'Qoheleth' — the Preacher/Gatherer) is the most philosophically daring book in the Bible. The author — presented as Solomon at his peak of wisdom and wealth — systematically explores every avenue of meaning 'under the sun' (apart from God) and concludes: 'Vanity of vanities, all is vanity.' It is an inspired demolition of secular humanism, written 3,000 years before secular humanism existed.",
    themes: "Key themes: (1) 'Vanity' (Hebrew: hevel — breath, vapor) — life apart from God is fleeting and ultimately empty; (2) The limits of human wisdom, pleasure, wealth, and achievement; (3) Fearing God as life's only solid foundation; (4) The gift of the present moment — 'eat, drink, and find satisfaction in your work' (2:24); (5) Judgment — 'God will bring every deed into judgment' (12:14).",
    application: "Ecclesiastes is God's inoculation against materialism and worldly ambition. Before you spend your life chasing wealth, fame, pleasure, or achievement, Solomon — who had all of it — wants you to hear his verdict: it is all vapor. The book's conclusion (12:13–14) is simple and absolute: fear God, keep His commandments, for this is the whole duty of humanity. Build your life on that, and nothing will be 'vanity.'",
    memoryVerse: "\"Fear God and keep his commandments, for this is the duty of all mankind. For God will bring every deed into judgment.\" — Ecclesiastes 12:13–14",
    keyFigures: "Qoheleth (the Preacher, presented as Solomon)",
    historicalContext: "Traditionally attributed to Solomon in his old age (~930 BC). It may reflect his reflections after years of experimentation with every form of earthly fulfillment."
  },
  "Song of Solomon": {
    context: "The Song of Solomon (also Song of Songs — 'the greatest of songs') is a collection of love poetry celebrating the beauty of romantic love between a husband and wife. Attributed to Solomon, it affirms that physical love within marriage is holy, God-given, and worthy of celebration. Throughout church history it has also been read as an allegory of God's love for Israel and Christ's love for the Church.",
    themes: "Key themes: (1) The sanctity and beauty of married love; (2) Desire, pursuit, and delight — love as mutual, joyful, and exclusive; (3) The beloved's worth — she is beautiful, sought after, and cherished; (4) Spiritual application — as Paul writes, marriage reflects Christ and the Church (Ephesians 5:31–32); (5) Love as strong as death (8:6).",
    application: "In a culture that either trivializes or corrupts sexuality, the Song of Solomon stands as God's endorsement of romantic love within marriage. If you are married, let this book rekindle your delight in your spouse. If you are single, let it fuel your vision for what God-honoring love looks like. And at every level, let it point you to the relentless, pursuing, delighted love of Christ for His Bride.",
    memoryVerse: "\"Place me like a seal over your heart, like a seal on your arm; for love is as strong as death.\" — Song of Solomon 8:6",
    keyFigures: "The Beloved (Shulamite woman), the Lover (Solomon), the daughters of Jerusalem",
    historicalContext: "Attributed to Solomon (~950 BC). One of the 'Megillot' — five scrolls read at Jewish festivals (read at Passover). Its inclusion in the canon was debated but affirmed at the Council of Jamnia (AD 90)."
  },
  "Jeremiah": {
    context: "Jeremiah is the 'weeping prophet' — called as a young man to preach an unpopular message of judgment for over 40 years with virtually no visible success. He preached through the final years of Judah, the siege of Jerusalem, the destruction of the temple, and the exile to Babylon. He suffered imprisonment, abandonment, and threats on his life. Yet he remained faithful, and God's word through him came to pass completely.",
    themes: "Key themes: (1) The new covenant — Jeremiah 31:31–34 is the greatest covenant promise in the OT, quoted in Hebrews as fulfilled in Christ; (2) The heart — God diagnoses the problem: 'The heart is deceitful above all things' (17:9); (3) Suffering as part of God's call — Jeremiah was not spared from pain; (4) God's sovereignty over nations — He uses Babylon as His instrument; (5) The remnant and restoration — 'I know the plans I have for you' (29:11).",
    application: "Jeremiah 29:11 is one of the most quoted verses in the Bible, but it was written to people in exile — people who had lost everything. God's plans for a future and a hope were not promises of immediate comfort but of ultimate faithfulness. The new covenant of Jeremiah 31 — the Law written on the heart by the Spirit — is what makes obedience finally possible. You are living under that covenant. Live in its fullness.",
    memoryVerse: "\"For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.\" — Jeremiah 29:11",
    keyFigures: "Jeremiah, Baruch, King Josiah, King Jehoiakim, King Zedekiah, Nebuchadnezzar",
    historicalContext: "Jeremiah prophesied 627–585 BC, from Josiah's reign through the fall of Jerusalem (586 BC) and into Egypt. The longest book in the Bible by word count."
  },
  "Lamentations": {
    context: "Lamentations is a collection of five poems written in the immediate aftermath of Jerusalem's destruction by Babylon in 586 BC. Attributed to Jeremiah, it is raw, unfiltered grief over the devastation of the city, the temple, and the people of God. Yet in the center of the book, surrounded by anguish, shines one of the greatest declarations of hope in all of Scripture.",
    themes: "Key themes: (1) Honest grief — God does not demand that His people pretend to be fine; (2) Acknowledgment of sin — the suffering is not denied or minimized, and its cause is named; (3) The steadfast love (hesed) of God in the middle of judgment; (4) Hope amid desolation — 'His mercies never come to an end; they are new every morning' (3:22–23); (5) The call to return to God.",
    application: "Lamentations 3:22–23 — 'Because of the LORD's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness' — was written in the ruins of a destroyed city. This is not easy, comfortable faith. This is faith forged in catastrophe. The next time you face devastation, remember: these words were written by a man sitting in rubble. And they are still true.",
    memoryVerse: "\"Because of the LORD's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.\" — Lamentations 3:22–23",
    keyFigures: "The narrator (Jeremiah), personified Jerusalem ('Daughter Zion')",
    historicalContext: "Written immediately after Jerusalem's fall in 586 BC. Five poems, the first four as acrostics following the Hebrew alphabet — a literary device suggesting completeness of grief."
  },
  "Ezekiel": {
    context: "Ezekiel was a priest taken into exile with the first deportation to Babylon (597 BC) who received spectacular visions and was called to prophesy to the exiles. His visions are among the most vivid and strange in Scripture — the divine chariot (Merkabah), the valley of dry bones, the restored temple. He is a prophet of God's glory — its departure from the temple due to sin, and its promised return.",
    themes: "Key themes: (1) The glory (Kabod) of God — it departs (chs 10–11) and returns (ch 43); (2) Individual responsibility — 'the soul who sins shall die' (18:4), a shift from collective to individual accountability; (3) The new heart — God promises to remove hearts of stone and give hearts of flesh (36:26); (4) The valley of dry bones (ch 37) — national resurrection and the work of the Spirit; (5) The restored temple as an eschatological vision of God's presence.",
    application: "Ezekiel 36:26–27 contains one of the most important promises in the OT: 'I will give you a new heart and put a new spirit in you; I will remove from you your heart of stone and give you a heart of flesh. And I will put my Spirit in you and move you to follow my decrees.' This is the promise of the new birth — not self-improvement but divine transformation. You cannot change your own heart. But God can, and does.",
    memoryVerse: "\"I will give you a new heart and put a new spirit in you; I will remove from you your heart of stone and give you a heart of flesh.\" — Ezekiel 36:26",
    keyFigures: "Ezekiel, the four living creatures, the prince of Israel, Gog and Magog",
    historicalContext: "Ezekiel prophesied 593–571 BC from Babylon. Contemporary with Jeremiah in Jerusalem and Daniel in Babylon. Jerusalem falls (586 BC) during his ministry."
  },
  "Hosea": {
    context: "Hosea is commanded by God to do something staggering: marry a prostitute named Gomer, who is unfaithful to him — and then take her back. This living parable is God's way of showing Israel what their spiritual adultery looks like to Him, and what His relentless, redeeming love looks like. Hosea is one of the most emotionally intense books in the Old Testament.",
    themes: "Key themes: (1) Spiritual adultery — Israel has left God for the Baals just as Gomer left Hosea; (2) God's heartbreak — He is not impassive toward His people's unfaithfulness; (3) Covenant love (hesed) that pursues even the unfaithful; (4) Return and restoration — God will 'allure her' and renew the marriage covenant; (5) 'I desire mercy, not sacrifice' (6:6) — quoted twice by Jesus in the NT.",
    application: "Hosea reveals the emotional depth of God's love. God is not a distant administrator of religion — He is a husband grieved by unfaithfulness and longing for return. Hosea 11:8 captures it: 'How can I give you up, Ephraim?... My heart is changed within me; all my compassion is aroused.' This is your God. When you wander, He is not indifferent — He is grieved and pursuing. Come back.",
    memoryVerse: "\"For I desire mercy, not sacrifice, and acknowledgment of God rather than burnt offerings.\" — Hosea 6:6",
    keyFigures: "Hosea, Gomer, their children (Jezreel, Lo-Ruhamah, Lo-Ammi)",
    historicalContext: "Hosea prophesied approximately 755–715 BC in the northern kingdom of Israel, during its final decades before Assyrian conquest (722 BC)."
  },
  "Joel": {
    context: "Joel uses a devastating locust plague as a launching pad for a sweeping vision of the coming Day of the LORD and the outpouring of the Holy Spirit. Quoted by Peter at Pentecost (Acts 2), Joel is the prophet of the Spirit's coming. His three chapters move from disaster to repentance to restoration to eschatological promise.",
    themes: "Key themes: (1) The Day of the LORD — a day of darkness and judgment, but ultimately of salvation for those who call on God's name; (2) Repentance — 'Rend your heart and not your garments' (2:13); (3) The Spirit poured out on all flesh — the great Pentecost prophecy (2:28–32); (4) God's jealousy for His land and people; (5) The valley of decision — all nations will be judged.",
    application: "Joel 2:13 cuts through religious performance to the heart: 'Rend your heart and not your garments.' In the ancient world, tearing garments was a sign of grief. But God is not interested in external signs — He wants internal reality. Outward religious activity without inward transformation is worthless. As you read Joel, ask God to expose any areas where your Christianity is more external performance than internal reality.",
    memoryVerse: "\"And afterward, I will pour out my Spirit on all people. Your sons and daughters will prophesy, your old men will dream dreams, your young men will see visions.\" — Joel 2:28",
    keyFigures: "Joel (son of Pethuel)",
    historicalContext: "The date of Joel is debated — possibly 9th century BC or post-exile (5th century BC). Its placement in the canon follows Hosea and precedes Amos."
  },
  "Amos": {
    context: "Amos was a shepherd and fig-tree farmer from Tekoa in Judah who was called to prophesy to the prosperous but corrupt northern kingdom of Israel. His message was shocking: external prosperity and religious activity cannot cover social injustice and covenant unfaithfulness. God cares deeply about how the poor are treated.",
    themes: "Key themes: (1) Social justice — oppression of the poor is an offense to God as serious as idolatry; (2) The danger of prosperity without faithfulness; (3) Religious activity without righteousness is an abomination to God (5:21–24); (4) 'Seek God and live' — repentance is still possible; (5) The restoration of David's fallen tent — a Messianic promise quoted in Acts 15.",
    application: "Amos 5:24 — 'But let justice roll on like a river, righteousness like a never-failing stream!' — is God's indictment of a church that sings worship songs while ignoring the poor and vulnerable. The OT prophets are relentless on this: you cannot claim to love God while treating the weak with contempt. Who are the poor, the marginalized, the exploited in your community? What is God calling you to do?",
    memoryVerse: "\"But let justice roll on like a river, righteousness like a never-failing stream!\" — Amos 5:24",
    keyFigures: "Amos, Amaziah the priest, Jeroboam II",
    historicalContext: "Amos prophesied around 760–750 BC during the prosperous reign of Jeroboam II in Israel, shortly before the Assyrian crisis."
  },
  "Obadiah": {
    context: "Obadiah is the shortest book in the Old Testament — a single chapter of 21 verses — directed entirely against Edom, the nation descended from Esau, Jacob's brother. Edom had gloated over and aided in Jerusalem's destruction and would face God's judgment. The book ends with the promise of Israel's restoration and God's kingdom.",
    themes: "Key themes: (1) Pride as the root sin — Edom trusted in its mountain strongholds and was deceived by its own arrogance; (2) The sin of indifference to a brother's suffering; (3) 'The day of the LORD' for all nations; (4) The principle of reaping what you sow — 'As you have done, it will be done to you' (v.15); (5) God's ultimate kingdom — 'The kingdom will be the LORD's' (v.21).",
    application: "Obadiah's indictment of Edom includes a specific sin: 'You should not have stood at the crossroads to cut down their fugitives, nor handed over their survivors in the day of their trouble' (v.14). Edom's sin was not just gloating — it was actively betraying those in need. The call is clear: when you have the power to help, helping is not optional. Indifference to a brother's suffering is a sin.",
    memoryVerse: "\"The pride of your heart has deceived you.\" — Obadiah 1:3",
    keyFigures: "Obadiah (the prophet), Edom (descendants of Esau)",
    historicalContext: "Most likely written after the fall of Jerusalem in 586 BC. Edom was later judged by the Nabataeans and ceased to exist as a nation by the 1st century AD."
  },
  "Jonah": {
    context: "Jonah is one of the most familiar and most misunderstood books in the Bible. It is not primarily about a big fish — it is about the scandal of God's grace for people we think don't deserve it. Jonah, a Hebrew prophet, runs from God's call to preach to Nineveh — Israel's brutal enemy — because he doesn't want them to repent and be spared. When they do repent, he is furious. God's compassion is wider than Jonah's.",
    themes: "Key themes: (1) The universality of God's mercy — 'Should I not be concerned about that great city?' (4:11); (2) Running from God is futile; (3) God uses even the disobedience of His servants to accomplish His purposes; (4) Genuine repentance is possible for the worst sinners; (5) The fish as a symbol of death and resurrection — Jesus explicitly cites Jonah as a sign of His own burial and resurrection (Matthew 12:40).",
    application: "Jonah's prayer from the fish's belly (ch 2) is beautiful and correct — yet by chapter 4 he is sitting outside Nineveh, angry that God showed grace to 120,000 people. The book ends with a question God asks Jonah — and never answers. It is left hanging for the reader: Do you agree with God's compassion, or with Jonah's bitterness? Is there a 'Nineveh' — a people or person you secretly hope God won't save?",
    memoryVerse: "\"Salvation comes from the LORD.\" — Jonah 2:9",
    keyFigures: "Jonah son of Amittai, the sailors, the king of Nineveh",
    historicalContext: "Jonah is historically identified with the prophet in 2 Kings 14:25 during Jeroboam II's reign (~785–750 BC). Nineveh was the capital of Assyria, Israel's most feared enemy."
  },
  "Micah": {
    context: "Micah was a contemporary of Isaiah, prophesying to both Israel and Judah during the 8th century BC. Like Amos, he confronts social injustice and corrupt leadership; like Isaiah, he offers magnificent visions of future hope. He famously prophesied the birthplace of the Messiah — Bethlehem — 700 years before Christ's birth.",
    themes: "Key themes: (1) God's case against His people — injustice, oppression, and false prophecy; (2) The Bethlehem prophecy — the Messiah will come from 'little Bethlehem' (5:2); (3) 'What does the LORD require of you?' — the famous triad of justice, mercy, and humility (6:8); (4) God's undefeatable mercy — 'Who is a God like you, who pardons sin?' (7:18); (5) The future kingdom of peace.",
    application: "Micah 6:8 is perhaps the most concise summary of ethical living in the entire Bible: 'He has shown you, O mortal, what is good. And what does the LORD require of you? To act justly and to love mercy and to walk humbly with your God.' Three things. Not sacrifice, not ceremony, not success — justice, mercy, and humility. Measure your life by these three standards today.",
    memoryVerse: "\"He has shown you, O mortal, what is good. And what does the LORD require of you? To act justly and to love mercy and to walk humbly with your God.\" — Micah 6:8",
    keyFigures: "Micah of Moresheth",
    historicalContext: "Micah prophesied approximately 740–700 BC, contemporary with Isaiah. The Bethlehem prophecy (5:2) is cited by Matthew (2:6) at the birth of Jesus."
  },
  "Nahum": {
    context: "Nahum is the sequel to Jonah — written about 100–150 years after Jonah's successful mission to Nineveh. Nineveh had repented under Jonah but returned to its brutal ways, and Nahum now pronounces its final, certain destruction. The book is a poem of terrifying power, describing Nineveh's fall with vivid detail — and affirming that God is both slow to anger AND certain in judgment.",
    themes: "Key themes: (1) The patience of God has limits — Nineveh was warned, repented, returned to sin, and now faces destruction; (2) God as jealous and avenging — 'The LORD is a jealous and avenging God' (1:2); (3) God as refuge for those who trust Him (1:7); (4) The joy of the oppressed when their oppressor falls; (5) No stronghold can stand against God's judgment.",
    application: "Nahum 1:7 — 'The LORD is good, a refuge in times of trouble. He cares for those who trust in him' — comes in the middle of terrifying judgment poetry. God's wrath and God's refuge exist together. To those who trust Him, He is protection. To those who oppose Him and oppress others, He is an unstoppable force of justice. This should produce both holy fear and deep security in the believer.",
    memoryVerse: "\"The LORD is good, a refuge in times of trouble. He cares for those who trust in him.\" — Nahum 1:7",
    keyFigures: "Nahum the Elkoshite",
    historicalContext: "Nahum prophesied between 663 BC (fall of Thebes, mentioned in 3:8) and 612 BC (fall of Nineveh). His prophecy was precisely fulfilled when Nineveh fell to Babylon and the Medes."
  },
  "Habakkuk": {
    context: "Habakkuk is the most philosophically honest book among the Minor Prophets — a dialogue between the prophet and God in which Habakkuk raises hard questions about injustice and divine silence. His questions are bold: 'How long, LORD, must I call for help, but you do not listen?' (1:2). God answers, and the book ends in one of the most powerful declarations of faith in Scripture.",
    themes: "Key themes: (1) The problem of unanswered prayer and divine silence; (2) God's mysterious ways — He uses the wicked Babylonians to judge Judah; (3) 'The righteous shall live by faith' (2:4) — quoted three times in the NT (Romans, Galatians, Hebrews); (4) God's sovereignty over all human history; (5) Praise in the absence of evidence (ch 3) — faith that does not require circumstances to justify it.",
    application: "Habakkuk 3:17–18 is the gold standard of faith: 'Though the fig tree does not bud and there are no grapes on the vines, though the olive crop fails... yet I will rejoice in the LORD, I will be joyful in God my Savior.' This is not denial — Habakkuk names every possible failure. It is the deliberate choice to praise God based on who He is, not on what circumstances are. This is where mature faith lives.",
    memoryVerse: "\"The righteous person will live by his faithfulness.\" — Habakkuk 2:4",
    keyFigures: "Habakkuk the prophet",
    historicalContext: "Habakkuk prophesied approximately 609–605 BC, just before and during Babylon's rise to power under Nebuchadnezzar. He witnesses God's answer in the Babylonian invasion."
  },
  "Zephaniah": {
    context: "Zephaniah, a great-great-grandson of King Hezekiah, prophesied during the early reign of Josiah before the great reform. He announces sweeping judgment — the Day of the LORD — upon Judah and the surrounding nations, before turning to a vision of breathtaking tenderness: God rejoicing over His restored people with singing.",
    themes: "Key themes: (1) The Day of the LORD as comprehensive judgment; (2) Seeking the LORD while there is still time; (3) The humble and poor of God ('anawim') as those who are truly safe; (4) Judgment on surrounding nations; (5) The unforgettable closing vision — God rejoicing over His people with singing (3:17).",
    application: "Zephaniah 3:17 is one of the most stunning verses in the Old Testament: 'The LORD your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.' Pause here. The God who spoke creation into existence takes delight in you. He rejoices over you — not grudgingly, not conditionally — with singing. Let this truth reshape how you see yourself today.",
    memoryVerse: "\"The LORD your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.\" — Zephaniah 3:17",
    keyFigures: "Zephaniah son of Cushi",
    historicalContext: "Zephaniah prophesied around 630–625 BC during Josiah's reign, possibly contributing to the spiritual climate that produced Josiah's great reform (621 BC)."
  },
  "Haggai": {
    context: "Haggai delivered four short, precise messages to the returned exiles who had laid the temple's foundations but then abandoned the work for 16 years, prioritizing their own homes. His message was direct: you are working hard and getting nowhere because God's house lies in ruins while you live in paneled houses. Prioritize God, and He will bless. The people obeyed within 23 days.",
    themes: "Key themes: (1) Priorities — putting God's house above personal comfort; (2) The connection between spiritual obedience and material blessing; (3) 'Consider your ways' — a call to honest self-reflection; (4) Zerubbabel as a signet ring — a Messianic pointer; (5) The promise of a greater glory for the rebuilt temple.",
    application: "Haggai 1:7 — 'This is what the LORD Almighty says: Give careful thought to your ways' — is a command to stop and audit your life. The returned exiles were busy, but busy on the wrong things. The result was futility: 'You earn wages, only to put them in a purse with holes in it' (1:6). Is there a 'temple' in your life — a call from God — that you have set aside because other priorities crowded it out? Consider your ways.",
    memoryVerse: "\"Be strong, all you people of the land, and work. For I am with you, declares the LORD Almighty.\" — Haggai 2:4",
    keyFigures: "Haggai the prophet, Zerubbabel (governor), Joshua the high priest",
    historicalContext: "Haggai prophesied in 520 BC, exactly 16 years after the first return under Zerubbabel. His ministry was brief but effective — the temple was completed in 516 BC."
  },
  "Zechariah": {
    context: "Zechariah, a contemporary of Haggai, gave eight night visions and a series of oracles to encourage the returned exiles and point forward to the coming Messiah. Of all the Minor Prophets, Zechariah contains the most extensive and detailed Messianic prophecy — the triumphal entry (9:9), the 30 pieces of silver (11:12–13), the pierced one (12:10), the shepherd struck (13:7) — all quoted in the NT.",
    themes: "Key themes: (1) Return to God — 'Return to me...and I will return to you' (1:3); (2) The eight night visions as encouragement for the rebuilding; (3) Messianic prophecy in extraordinary detail; (4) 'Not by might nor by power, but by my Spirit' (4:6); (5) The coming King who is both humble servant and mighty Lord; (6) Jerusalem as the center of the eschatological future.",
    application: "Zechariah 4:6 — 'Not by might nor by power, but by my Spirit, says the LORD Almighty' — was spoken over Zerubbabel as he faced the overwhelming task of rebuilding. What feels like an impossible mountain in your life right now? This is God's word over it. The work of the kingdom is not done through human strength, strategy, or resources — it is done through the Spirit. This is freedom: you don't have to be strong enough.",
    memoryVerse: "\"Not by might nor by power, but by my Spirit, says the LORD Almighty.\" — Zechariah 4:6",
    keyFigures: "Zechariah son of Berekiah, Zerubbabel, Joshua the high priest, the four horsemen",
    historicalContext: "Zechariah prophesied 520–518 BC (the visions), with later oracles possibly up to 480 BC. Contemporary with Haggai and the temple rebuilding."
  },
  "Malachi": {
    context: "Malachi (Hebrew: 'my messenger') is the last voice of the Old Testament — written approximately 430 BC, 400 years before John the Baptist and Christ. It addresses a weary, disillusioned post-exilic community that has slipped into religious cynicism, corrupt priesthood, and covenant unfaithfulness. And it closes the OT with a promise: God will send Elijah before the great Day of the LORD. Then silence — until a voice cries in the wilderness.",
    themes: "Key themes: (1) God's love questioned — 'How have you loved us?' Israel asks; (2) Corrupt priesthood — offering blind and lame animals; (3) Covenant faithfulness in marriage; (4) Robbing God in tithes and offerings; (5) The coming messenger — John the Baptist (3:1); (6) The refiner's fire — purifying the priests; (7) The sun of righteousness rising with healing (4:2).",
    application: "Malachi's six 'disputation speeches' all follow the same pattern: God makes a statement, the people question it, God answers in detail. The people's questions reveal a dangerous drift into spiritual lethargy — going through the motions while their hearts have grown cold. The remedy Malachi offers is radical honesty with God: bring your complaints to Him openly, and let Him answer. Don't drift — dispute. A God who answers hard questions is a God worth trusting.",
    memoryVerse: "\"But for you who revere my name, the sun of righteousness will rise with healing in its rays.\" — Malachi 4:2",
    keyFigures: "Malachi, the priests, the people of Judah",
    historicalContext: "Written approximately 430 BC, the last canonical prophet before 400 years of prophetic silence. Malachi's promise of 'Elijah' (4:5) is fulfilled in John the Baptist (Matthew 11:14, 17:12)."
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
  "Joshua": [
    { q: "What was Joshua commanded to do to prosper and succeed (Joshua 1:8)?", opts: ["Build a strong army", "Meditate on the Book of the Law day and night", "Seek counsel from the elders", "Fast for 40 days"], answer: 1 },
    { q: "What city did Israel march around for seven days before its walls fell?", opts: ["Ai", "Jericho", "Hebron", "Gibeon"], answer: 1 },
    { q: "Who hid the Israelite spies and hung a scarlet cord from her window?", opts: ["Deborah", "Ruth", "Rahab", "Tamar"], answer: 2 },
    { q: "What did Achan's sin cost Israel?", opts: ["A plague in the camp", "Defeat at the city of Ai", "Loss of the Ark of the Covenant", "40 years of wandering"], answer: 1 },
    { q: "How did Israel cross the Jordan River into Canaan?", opts: ["On boats Moses built", "God parted the waters when the priests stepped in", "They forded it at its shallowest point", "God dried up the river overnight"], answer: 1 },
    { q: "What did Joshua command to stand still as Israel fought the Amorites?", opts: ["The clouds", "The sun and moon", "The rain", "The Jordan River"], answer: 1 },
    { q: "The Gibeonites deceived Israel into making a covenant with them by pretending to be:", opts: ["Egyptians fleeing Pharaoh", "Travelers from a distant land", "Relatives of Rahab", "Merchants from Sidon"], answer: 1 },
    { q: "How was the Promised Land distributed among the tribes?", opts: ["By military strength", "By casting lots before the LORD", "By birth order of Jacob's sons", "By Moses' final assignment"], answer: 1 },
    { q: "What was the name of the city given to Caleb as his inheritance?", opts: ["Shiloh", "Shechem", "Hebron", "Beersheba"], answer: 2 },
    { q: "Joshua's farewell challenge to Israel was:", opts: ["'Build the temple before I die'", "'Choose for yourselves this day whom you will serve'", "'Drive out every remaining Canaanite'", "'Send your sons to Egypt for wisdom'"], answer: 1 },
  ],
  "Judges": [
    { q: "What cycle is repeated throughout the book of Judges?", opts: ["Prosperity, pride, battle, victory", "Sin, oppression, crying out, deliverance, peace", "Migration, settlement, war, peace", "Birth, growth, decline, exile"], answer: 1 },
    { q: "Which judge was a female prophet who led Israel to victory?", opts: ["Miriam", "Deborah", "Hulda", "Rahab"], answer: 1 },
    { q: "Gideon defeated the Midianites with how many men?", opts: ["10,000", "3,000", "300", "32"], answer: 2 },
    { q: "What sign did Gideon use to confirm God's call — the fleece?", opts: ["Rain on the fleece but dry ground, then dry fleece and wet ground", "Dew on the fleece twice in a row", "Fire consuming the fleece", "The fleece turning white"], answer: 0 },
    { q: "Samson's strength was connected to:", opts: ["His armor", "His uncut hair as a Nazirite", "His daily prayer", "A special sword given by God"], answer: 1 },
    { q: "Who betrayed Samson to the Philistines?", opts: ["His mother", "Deborah", "Delilah", "Rahab"], answer: 2 },
    { q: "The closing verse of Judges — 'Everyone did as they saw fit' — describes a society lacking:", opts: ["Military strength", "Agricultural productivity", "Godly leadership and covenant faithfulness", "A written law"], answer: 2 },
    { q: "Jephthah made a rash vow before battle that tragically affected:", opts: ["His entire army", "His only daughter", "The city of Mizpah", "His tribe of Manasseh"], answer: 1 },
    { q: "What was the tribe of Dan's failure in Judges?", opts: ["They refused to fight", "They abandoned their allotted territory and stole an idol", "They intermarried with Canaanites", "They built a rival temple"], answer: 1 },
    { q: "The purpose of the judges was primarily:", opts: ["To write down the Law", "To collect taxes for the tabernacle", "To deliver Israel from oppressors and call them back to God", "To prepare for the building of the temple"], answer: 2 },
  ],
  "Ruth": [
    { q: "Ruth was from what nation originally?", opts: ["Ammon", "Edom", "Moab", "Philistia"], answer: 2 },
    { q: "What is Ruth's famous declaration to Naomi?", opts: ["'I will return to my father's house'", "'Where you go I will go, your people my people, your God my God'", "'I will follow you to the ends of the earth'", "'Your God has shown me favor'"], answer: 1 },
    { q: "What was the name of Naomi's husband?", opts: ["Boaz", "Mahlon", "Elimelech", "Chilion"], answer: 2 },
    { q: "How did Ruth provide food for herself and Naomi?", opts: ["By trading in the market", "By gleaning in the fields after the reapers", "By selling her jewelry", "By working as a weaver"], answer: 1 },
    { q: "What is the role of the 'kinsman-redeemer' (go'el)?", opts: ["A military commander", "A close relative who redeems land and cares for the family", "A priest who mediates offerings", "A judge who settles disputes"], answer: 1 },
    { q: "Who was Boaz in relation to Naomi's late husband?", opts: ["His brother", "A distant cousin", "A close relative (kinsman)", "A neighbor with no family connection"], answer: 2 },
    { q: "What was the name of the nearer kinsman-redeemer who declined to redeem Ruth?", opts: ["He is unnamed — referred to as 'friend'", "Mahlon", "Tob", "Salmon"], answer: 0 },
    { q: "Ruth and Boaz's son was named:", opts: ["Jesse", "Obed", "David", "Salmon"], answer: 1 },
    { q: "Ruth is listed in the genealogy of Jesus in Matthew 1 as the great-grandmother of:", opts: ["Solomon", "Jesse", "David", "Abraham"], answer: 2 },
    { q: "The Hebrew word 'hesed' (loyal covenant love) is demonstrated in the book of Ruth primarily by:", opts: ["Ruth's loyalty to Naomi and Boaz's kindness", "The legal system of Judah", "The Moabite religion", "Naomi's bitterness being healed"], answer: 0 },
  ],
  "1 Samuel": [
    { q: "Hannah prayed for a son and promised to dedicate him to God. Who was that son?", opts: ["Saul", "Samuel", "David", "Eli"], answer: 1 },
    { q: "Who was Israel's first king?", opts: ["Samuel", "David", "Saul", "Jonathan"], answer: 2 },
    { q: "How did God describe His standard for choosing a king, contrasting with human judgment?", opts: ["'I look at strength and skill'", "'Man looks at outward appearance, the LORD looks at the heart'", "'I choose by birth order'", "'I select the most learned in the Law'"], answer: 1 },
    { q: "What was significant about David's victory over Goliath?", opts: ["David used superior weapons", "He trusted God when others were paralyzed by fear", "He had military training from Egypt", "He challenged Goliath to a non-violent contest"], answer: 1 },
    { q: "What was the relationship between David and Jonathan?", opts: ["They were rivals for the throne", "They had a covenant friendship of deep loyalty", "Jonathan was David's military commander", "They were cousins"], answer: 1 },
    { q: "Why did God reject Saul as king after the Amalekite battle?", opts: ["He lost the battle", "He disobeyed by sparing Agag and keeping plunder", "He refused to fight", "He taxed the people too heavily"], answer: 1 },
    { q: "What was the significance of 1 Samuel 15:22 — 'To obey is better than sacrifice'?", opts: ["Sacrifices were abolished", "External religious acts cannot substitute for obedience from the heart", "Samuel ended the sacrificial system", "Obedience to Samuel was equal to obedience to God"], answer: 1 },
    { q: "David was anointed king by whom while Saul was still reigning?", opts: ["Nathan the prophet", "Eli the priest", "Samuel", "Jonathan"], answer: 2 },
    { q: "What instrument was David known for playing?", opts: ["Trumpet", "Flute", "Harp/lyre", "Drum"], answer: 2 },
    { q: "Where did Saul consult a medium (witch) in desperation before his last battle?", opts: ["Bethlehem", "Endor", "Gibeah", "Mizpah"], answer: 1 },
  ],
  "2 Samuel": [
    { q: "What covenant did God make with David in 2 Samuel 7?", opts: ["That David would never sin again", "That David's dynasty would be established forever", "That David would build the temple", "That Israel would never be defeated"], answer: 1 },
    { q: "David's great sin involved:", opts: ["Stealing from the temple treasury", "Adultery with Bathsheba and arranging her husband Uriah's death", "Idolatry in his old age", "Refusing to go to war"], answer: 1 },
    { q: "Which prophet confronted David about his sin with Bathsheba?", opts: ["Samuel", "Elijah", "Nathan", "Gad"], answer: 2 },
    { q: "The parable Nathan used to confront David was about:", opts: ["A king who took his servant's land", "A rich man who stole a poor man's only beloved lamb", "A shepherd who abandoned his flock", "A father who showed favoritism to his sons"], answer: 1 },
    { q: "What was the name of Jonathan's crippled son whom David showed kindness to?", opts: ["Absalom", "Mephibosheth", "Amnon", "Ish-Bosheth"], answer: 1 },
    { q: "Which of David's sons led a rebellion and temporarily seized Jerusalem?", opts: ["Amnon", "Solomon", "Absalom", "Adonijah"], answer: 2 },
    { q: "The Davidic Covenant is significant because it points forward to:", opts: ["The Mosaic Law being replaced", "An eternal kingdom fulfilled in Jesus Christ, Son of David", "The rebuilding of the temple by Solomon", "Israel's geographic expansion"], answer: 1 },
    { q: "What sin did David commit in 2 Samuel 24 that brought judgment?", opts: ["Building a pagan altar", "Taking a census of Israel in pride, trusting in numbers", "Marrying foreign wives", "Failing to build the temple"], answer: 1 },
    { q: "Why was David not allowed to build the temple?", opts: ["He was too old", "He had shed much blood as a man of war", "He lacked the finances", "God chose Solomon directly without David's involvement"], answer: 1 },
    { q: "Psalm 51 — David's great prayer of repentance — was written in response to:", opts: ["Absalom's rebellion", "Nathan's confrontation after the Bathsheba incident", "His victory over Goliath", "His years of fleeing Saul"], answer: 1 },
  ],
  "1 Kings": [
    { q: "When God asked Solomon what he wanted, Solomon asked for:", opts: ["Long life and wealth", "Victory over his enemies", "A discerning heart to govern wisely", "The plans for the temple"], answer: 2 },
    { q: "Solomon's temple was built on which mountain?", opts: ["Sinai", "Carmel", "Moriah (Zion)", "Nebo"], answer: 2 },
    { q: "The kingdom of Israel divided after Solomon's death because:", opts: ["A foreign invasion split it", "Solomon's son Rehoboam refused to lighten the people's burden", "The northern tribes found gold and declared independence", "God commanded it as punishment"], answer: 1 },
    { q: "Who was the wicked king of Israel married to Jezebel who promoted Baal worship?", opts: ["Rehoboam", "Jeroboam", "Ahab", "Asa"], answer: 2 },
    { q: "On Mount Carmel, Elijah challenged the prophets of Baal. How many were there?", opts: ["200", "400", "450", "850"], answer: 2 },
    { q: "After the Mount Carmel victory, how did Elijah feel?", opts: ["Elated and confident", "Exhausted, fearful, and suicidal under a juniper tree", "Ready to confront Jezebel", "Filled with joy"], answer: 1 },
    { q: "How did God speak to Elijah at Mount Horeb?", opts: ["In a mighty wind", "In an earthquake", "In a fire", "In a still small voice (gentle whisper)"], answer: 3 },
    { q: "What was the purpose of Solomon's prayer at the temple dedication?", opts: ["To dedicate sacrifices for the year", "To pray that God would hear all prayers offered toward the temple", "To consecrate the priests", "To establish the Levitical order"], answer: 1 },
    { q: "Solomon's downfall was rooted in:", opts: ["Military defeat", "Financial ruin", "Loving foreign wives who turned his heart to idols", "A revolt by the Levites"], answer: 2 },
    { q: "The widow of Zarephath experienced what miracle through Elijah?", opts: ["Her dead son was raised", "Her jar of oil and flour did not run out during famine", "Both A and B occurred", "She was healed of leprosy"], answer: 2 },
  ],
  "2 Kings": [
    { q: "How did Elijah depart from the earth?", opts: ["He died peacefully and was buried by God", "He was taken up in a whirlwind in a chariot of fire", "He ascended from Mount Carmel", "He disappeared while praying"], answer: 1 },
    { q: "What did Elisha ask for when Elijah departed?", opts: ["His cloak", "A double portion of his spirit", "The ability to call down fire", "To be made a prophet to the king"], answer: 1 },
    { q: "The Syrian commander Naaman was healed of leprosy by:", opts: ["Elisha touching him", "Washing seven times in the Jordan River", "Sacrificing at the temple in Jerusalem", "Drinking from a spring Elisha blessed"], answer: 1 },
    { q: "The northern kingdom of Israel fell to which empire in 722 BC?", opts: ["Babylon", "Egypt", "Assyria", "Persia"], answer: 2 },
    { q: "Why did Israel fall, according to 2 Kings 17?", opts: ["They were outnumbered militarily", "They persistently sinned and rejected God's prophets", "Their king betrayed them to Assyria", "A drought weakened them over decades"], answer: 1 },
    { q: "King Hezekiah of Judah is noted for:", opts: ["His military conquests", "His faithful reforms and prayer during the Assyrian crisis", "Building a second temple", "His wisdom surpassing Solomon's"], answer: 1 },
    { q: "How did God deliver Jerusalem from Sennacherib's Assyrian army during Hezekiah's reign?", opts: ["A massive earthquake destroyed the army", "An angel struck 185,000 Assyrian soldiers in a night", "Israel's army routed them", "A plague of insects drove them away"], answer: 1 },
    { q: "Josiah's great reform began when:", opts: ["Jeremiah began preaching in the temple", "The Book of the Law was found in the temple", "The high priest had a vision", "God appeared to Josiah directly"], answer: 1 },
    { q: "The southern kingdom of Judah fell to Babylon under which king?", opts: ["Hezekiah", "Manasseh", "Zedekiah", "Jehoiakim"], answer: 2 },
    { q: "What happened to the temple when Jerusalem fell in 586 BC?", opts: ["It was captured and used for Babylonian worship", "It was destroyed and burned by Nebuchadnezzar's forces", "It was left standing but emptied of its contents", "It was dismantled and rebuilt in Babylon"], answer: 1 },
  ],
  "1 Chronicles": [
    { q: "Why does 1 Chronicles begin with nine chapters of genealogies?", opts: ["To demonstrate Hebrew record-keeping", "To root the returning exiles' identity in God's covenant history", "To establish priestly qualifications", "To show Israel's military lineage"], answer: 1 },
    { q: "What is the primary theological focus of 1 Chronicles compared to Samuel?", opts: ["Military history", "The prophets' ministry", "Worship, the temple, and the Davidic covenant", "Social justice and the poor"], answer: 2 },
    { q: "Who was forbidden from building the temple because he was a man of war?", opts: ["Solomon", "Joab", "David", "Benaiah"], answer: 2 },
    { q: "What was David's great contribution to the temple even though he couldn't build it?", opts: ["He wrote the architectural plans alone", "He gathered materials, organized the Levites, and prepared extensively for Solomon to build", "He chose the location and purchased the land", "He trained Solomon as a builder"], answer: 1 },
    { q: "The ark of the covenant was brought to Jerusalem by David amid:", opts: ["Silence and fasting", "Great celebration, singing, and dancing", "A solemn priestly procession only", "A military parade"], answer: 1 },
    { q: "What happened to Uzzah when he touched the ark of the covenant?", opts: ["He was healed of illness", "He was struck dead by God", "He was made high priest", "He was blinded temporarily"], answer: 1 },
    { q: "The Davidic Covenant in 1 Chronicles 17 promises:", opts: ["That David will defeat all enemies", "An everlasting dynasty through David's offspring", "That Israel will never go into exile", "That the temple will never be destroyed"], answer: 1 },
    { q: "What was David's prayer in 1 Chronicles 29:14 about the offering for the temple?", opts: ["'Lord, accept our sacrifice'", "'Everything comes from you, and we have given you only what comes from your hand'", "'We have given more than any generation'", "'Bless Solomon to complete this work'"], answer: 1 },
    { q: "Which tribe was specially set apart for temple worship and the carrying of the ark?", opts: ["Judah", "Benjamin", "Levi", "Ephraim"], answer: 2 },
    { q: "1 Chronicles was written primarily for:", opts: ["The Egyptians who needed to know Israel's history", "The returned exiles who needed to rediscover their identity", "Future Gentile nations to understand Israel", "King Solomon's descendants"], answer: 1 },
  ],
  "2 Chronicles": [
    { q: "At the dedication of Solomon's temple, what filled it so the priests could not stand?", opts: ["The sound of angelic singing", "The cloud of God's glory", "A great fire from heaven", "The fragrance of incense"], answer: 1 },
    { q: "God's famous promise in 2 Chronicles 7:14 is conditional on God's people doing what?", opts: ["Rebuilding the temple", "Humbling themselves, praying, seeking God's face, turning from sin", "Offering more sacrifices", "Keeping the Sabbath perfectly"], answer: 1 },
    { q: "Which king of Judah led a great revival by removing idols and renewing the covenant?", opts: ["Solomon", "Rehoboam", "Asa and Jehoshaphat", "Ahaz"], answer: 2 },
    { q: "Jehoshaphat's battle strategy when surrounded by enemies was:", opts: ["To retreat and regroup", "To fast, pray, and send the choir ahead of the army", "To hire mercenaries", "To seek alliance with Egypt"], answer: 1 },
    { q: "Manasseh was one of Judah's most wicked kings, yet what happened at the end of his life?", opts: ["He died in exile with no repentance", "He humbled himself before God and repented and was restored", "He was killed by his own servants", "He was converted by a foreign priest"], answer: 1 },
    { q: "Josiah's reform in 2 Chronicles 34 was catalyzed by:", opts: ["A vision of the burning temple", "Finding the Book of the Law", "Jeremiah's preaching", "A military defeat that humbled him"], answer: 1 },
    { q: "How does 2 Chronicles end?", opts: ["With Jerusalem in ruins permanently", "With the decree of Cyrus permitting the exiles to return and rebuild", "With the coronation of a new Davidic king", "With a prophecy of the Messiah"], answer: 1 },
    { q: "The Chronicler evaluates each king primarily by:", opts: ["Military victories and territorial expansion", "Economic prosperity and building projects", "Faithfulness to God and maintaining proper worship", "How they treated foreign nations"], answer: 2 },
    { q: "Hezekiah's Passover in 2 Chronicles 30 was significant because:", opts: ["It was the first Passover celebrated in 400 years", "He invited both Judah and remnants of Israel — an extraordinary national celebration", "It was celebrated in Egypt as a symbol of deliverance", "It was the first Passover with music"], answer: 1 },
    { q: "What was the Chronicler's primary message to the returning exiles?", opts: ["Rebuild the army first", "God has not abandoned you — His covenant promises through David still stand", "Learn from the mistakes of the kings and build a democracy", "The temple is more important than the king"], answer: 1 },
  ],
  "Ezra": [
    { q: "Whose decree allowed the Jewish exiles to return to Jerusalem?", opts: ["Darius", "Artaxerxes", "Cyrus king of Persia", "Nebuchadnezzar"], answer: 2 },
    { q: "Who led the first return of exiles to Jerusalem?", opts: ["Ezra", "Nehemiah", "Zerubbabel", "Joshua son of Nun"], answer: 2 },
    { q: "What building project did the first returning exiles focus on?", opts: ["The city walls", "The palace", "The temple", "The gates"], answer: 2 },
    { q: "Who were the Samaritans and what did they do when Israel returned?", opts: ["They welcomed Israel warmly", "They offered to help build the temple but were rejected, then opposed the work", "They attacked Israel militarily", "They converted to Judaism immediately"], answer: 1 },
    { q: "Ezra's personal commitment described in Ezra 7:10 was to:", opts: ["Rebuild the walls of Jerusalem", "Study, observe, and teach the Law of the LORD", "Lead a military campaign against opponents", "Establish a new priesthood"], answer: 1 },
    { q: "The problem Ezra confronted in chapters 9–10 was:", opts: ["Idol worship in the temple", "Intermarriage with surrounding pagan peoples", "Failure to pay temple taxes", "Priests performing unauthorized sacrifices"], answer: 1 },
    { q: "Ezra's prayer of confession in chapter 9 is remarkable for:", opts: ["Its length and technical detail", "Using 'we' — identifying himself with the corporate sin even though he personally hadn't sinned this way", "Demanding judgment on the offenders immediately", "Its focus on asking for military protection"], answer: 1 },
    { q: "The Persian king who sent Ezra to Jerusalem with authority to teach the Law was:", opts: ["Cyrus", "Darius", "Artaxerxes", "Xerxes"], answer: 2 },
    { q: "How long after the first return under Zerubbabel did Ezra arrive in Jerusalem?", opts: ["10 years", "25 years", "About 80 years", "150 years"], answer: 2 },
    { q: "The books of Ezra and Nehemiah were originally:", opts: ["Separate books from the beginning", "One single book in the Hebrew canon", "Part of Chronicles", "Written by the same author at the same time"], answer: 1 },
  ],
  "Nehemiah": [
    { q: "What was Nehemiah's position in the Persian court before returning to Jerusalem?", opts: ["A scribe and priest", "Cupbearer to King Artaxerxes", "Commander of the royal guard", "Treasurer of the empire"], answer: 1 },
    { q: "When Nehemiah heard Jerusalem's walls were broken down, what was his first response?", opts: ["He immediately requested permission to leave", "He sat down and wept, mourned, fasted, and prayed", "He organized a return expedition", "He wrote a letter to the elders of Jerusalem"], answer: 1 },
    { q: "How long did it take to rebuild Jerusalem's walls under Nehemiah?", opts: ["7 months", "52 days", "1 year and 3 months", "3 years"], answer: 1 },
    { q: "What was the opposition strategy of Sanballat and Tobiah?", opts: ["Military attack only", "Ridicule, threats, deception, and attempts to draw Nehemiah away from the work", "Economic blockade", "They appealed to the Persian king to stop the work"], answer: 1 },
    { q: "How did the builders respond to the threat of attack?", opts: ["They stopped building until the threat passed", "Half worked while half stood guard, and all carried weapons", "They built a defensive wall first", "They sent for Persian military protection"], answer: 1 },
    { q: "Nehemiah 8:10 — 'The joy of the LORD is your ___':", opts: ["portion", "shield", "strength", "refuge"], answer: 2 },
    { q: "What was the role of Ezra in Nehemiah 8?", opts: ["He rebuilt the Eastern Gate", "He read the Book of the Law publicly to the people while Levites explained it", "He led the military defense", "He negotiated with Sanballat"], answer: 1 },
    { q: "What social injustice did Nehemiah confront among the returned community?", opts: ["Slavery of foreigners", "Rich Jews charging interest and oppressing poor Jews who had mortgaged their fields", "Corruption of the priesthood", "Unfair taxation by Levites"], answer: 1 },
    { q: "Nehemiah's short 'arrow prayers' throughout the book demonstrate:", opts: ["That long prayer is not necessary", "Constant communion with God woven into every moment and decision", "That prayer is only for crises", "The superiority of silent prayer"], answer: 1 },
    { q: "What covenant renewal event occurs in Nehemiah 9–10?", opts: ["A new Passover celebration", "A public reading of the Law followed by corporate confession and covenant signing", "The rededication of the temple", "The appointment of new priests and Levites"], answer: 1 },
  ],
  "Esther": [
    { q: "Why was Queen Vashti deposed by King Ahasuerus (Xerxes)?", opts: ["She was found guilty of treason", "She refused to appear at the king's banquet when summoned", "She failed to produce an heir", "She was discovered to be of foreign origin"], answer: 1 },
    { q: "What was the plot that Haman devised against the Jewish people?", opts: ["To exile them to a distant province", "To annihilate all Jews throughout the Persian Empire", "To enslave them in the palace", "To strip them of property and citizenship"], answer: 1 },
    { q: "What was Mordecai's famous challenge to Esther about her unique position?", opts: ["'God has brought you to this moment for judgment'", "'Who knows whether you have not come to the kingdom for such a time as this?'", "'You must act or God will destroy our people'", "'Your beauty is a weapon God has given you'"], answer: 1 },
    { q: "What risk did Esther take in approaching the king unsummoned?", opts: ["She risked losing her position as queen", "She could be put to death — only those the king extended his scepter to were spared", "She risked embarrassing the king publicly", "She risked exposing Mordecai's rebellion"], answer: 1 },
    { q: "What preparation did Esther request before approaching the king?", opts: ["Three days of prayer", "Three days of fasting by herself, Mordecai, and all the Jews", "A consultation with the royal priests", "A public announcement of her plan"], answer: 1 },
    { q: "Haman built gallows to hang Mordecai. What was the ironic outcome?", opts: ["Mordecai was exiled instead", "Haman himself was hanged on the gallows he built", "The gallows collapsed before either was executed", "Haman escaped but Mordecai was exiled"], answer: 1 },
    { q: "What Jewish feast was instituted to celebrate the events of Esther?", opts: ["Hannukah", "Tabernacles", "Purim", "Firstfruits"], answer: 2 },
    { q: "Why is the book of Esther unique among OT books?", opts: ["It is the only book with a female author", "God is never explicitly named — yet His providence is unmistakable", "It is the only book set entirely outside Israel", "It contains no dialogue, only narrative"], answer: 1 },
    { q: "What position did Mordecai receive after Haman's fall?", opts: ["Commander of the Persian army", "Haman's former position of honor — second to the king", "High priest of Jerusalem", "Governor of Judah"], answer: 1 },
    { q: "The name 'Purim' comes from the Hebrew word 'pur' meaning:", opts: ["Salvation", "Lot (as in casting lots — Haman cast lots to choose the date)", "Feast", "Remembrance"], answer: 1 },
  ],
  "Ecclesiastes": [
    { q: "The Hebrew word translated 'vanity' or 'meaningless' in Ecclesiastes literally means:", opts: ["Sin and corruption", "Vapor or breath — something fleeting and insubstantial", "Darkness and emptiness", "Foolishness"], answer: 1 },
    { q: "The phrase 'under the sun' in Ecclesiastes refers to:", opts: ["Life in Egypt", "Life in the Promised Land", "Life viewed from a purely earthly/secular perspective without God", "The burning heat of judgment"], answer: 2 },
    { q: "After exploring wisdom, pleasure, wealth, and achievement, the Preacher's conclusion was:", opts: ["That wisdom is the only thing worth pursuing", "That all is vanity without God at the center", "That pleasure was the best option among bad ones", "That hard work always brings satisfaction"], answer: 1 },
    { q: "Ecclesiastes 3:1–8 ('For everything there is a season') teaches:", opts: ["That life is random and uncontrollable", "That God has ordered time with purpose — there is a right time for everything", "That we should be passive and accept whatever comes", "That seasons of joy always precede seasons of sorrow"], answer: 1 },
    { q: "The two-part conclusion of Ecclesiastes (12:13–14) is:", opts: ["Pursue wisdom and avoid foolishness", "Fear God and keep His commandments, for God will judge every deed", "Enjoy life and don't take it too seriously", "Worship God in the temple and give generously"], answer: 1 },
    { q: "Ecclesiastes 4:9–10 — 'Two are better than one' — emphasizes:", opts: ["The value of marriage over singleness", "The importance of community and mutual support", "Business partnerships over solo ventures", "The power of prayer partnerships"], answer: 1 },
    { q: "Who is traditionally credited as the author of Ecclesiastes?", opts: ["Moses", "David", "Solomon the Preacher/Qoheleth", "Ezra"], answer: 2 },
    { q: "Ecclesiastes 5:2 warns: 'Do not be hasty in your heart to utter anything before God... therefore let your words be ___':", opts: ["many and fervent", "few", "loud and clear", "written down"], answer: 1 },
    { q: "The 'Teacher' (Qoheleth) says in Ecclesiastes 12:1: 'Remember your Creator in the days of your ___':", opts: ["old age", "prosperity", "youth", "sorrow"], answer: 2 },
    { q: "Ecclesiastes is best described as:", opts: ["A prophecy of the Messiah", "An inspired critique of life lived apart from God, ending with the call to fear God", "A collection of proverbs about wisdom", "A history of Solomon's reign"], answer: 1 },
  ],
  "Song of Solomon": [
    { q: "What is the primary literal subject of the Song of Solomon?", opts: ["The relationship between God and Israel", "The love between a king and a bride, celebrating marriage", "A prophecy of the Messiah and the Church", "Solomon's diplomatic marriages"], answer: 1 },
    { q: "Song of Solomon 8:6 describes love as being as strong as:", opts: ["The mountains of Lebanon", "Death", "The cedars of God", "An army with banners"], answer: 1 },
    { q: "The refrain repeated three times — 'Do not arouse or awaken love until it so desires' — teaches:", opts: ["That arranged marriages are wrong", "The importance of not rushing into romantic love before the right time", "That love is dangerous and should be avoided", "That women should not pursue men"], answer: 1 },
    { q: "The dual application of the Song of Solomon in church tradition is:", opts: ["As a history of Israel and as poetry", "As literally celebrating marriage AND allegorically depicting God's love for His people/Christ for the Church", "As a guidebook for marriage and as prophecy", "As wisdom literature and as prayer"], answer: 1 },
    { q: "The Shulamite woman says of her beloved: 'His banner over me is ___' (2:4):", opts: ["peace", "strength", "love", "righteousness"], answer: 2 },
    { q: "The Song of Solomon is part of which category of OT literature?", opts: ["Law", "History", "Wisdom/Poetry", "Prophecy"], answer: 2 },
    { q: "Paul's reference to marriage in Ephesians 5:31–32 connects to the Song of Solomon by:", opts: ["Quoting it directly", "Establishing that marriage reflects the relationship between Christ and the Church", "Using its imagery of gardens and vineyards", "Citing it as the model for church community"], answer: 1 },
    { q: "How many chapters are in the Song of Solomon?", opts: ["5", "6", "8", "10"], answer: 2 },
    { q: "The beloved describes the Shulamite as having come up from the wilderness 'leaning on her beloved' (8:5), which pictures:", opts: ["Physical weakness from a long journey", "Total dependence on and intimacy with the one she loves", "Illness that required support", "A ritual procession"], answer: 1 },
    { q: "The opening verse of the Song — 'Let him kiss me with the kisses of his mouth' — establishes the book as:", opts: ["An inappropriate addition to Scripture", "A bold, God-honoring expression of desire within the covenant of love", "A coded political message", "A temple worship liturgy"], answer: 1 },
  ],
  "Jeremiah": [
    { q: "The New Covenant promised in Jeremiah 31:31–34 differs from the Mosaic Covenant because:", opts: ["It requires no obedience", "The Law will be written on the heart by God, not on stone tablets", "It applies only to the Gentiles", "It abolishes sacrifice entirely"], answer: 1 },
    { q: "Jeremiah 17:9 diagnoses the fundamental human problem as:", opts: ["Lack of education and wisdom", "'The heart is deceitful above all things and beyond cure'", "Poverty and social injustice", "Ignorance of the Law"], answer: 1 },
    { q: "Why is Jeremiah called the 'weeping prophet'?", opts: ["He had a medical condition affecting his eyes", "He wept over Jerusalem's sin and his own suffering as a rejected messenger", "He only prophesied funerals and deaths", "He mourned the death of King Josiah for years"], answer: 1 },
    { q: "Jeremiah 29:11 — 'I know the plans I have for you' — was originally written to:", opts: ["Jeremiah personally", "The exiles in Babylon who had lost everything", "The remnant remaining in Jerusalem", "Future generations only"], answer: 1 },
    { q: "What visual object lesson did God use through a potter's house (ch 18)?", opts: ["That broken things cannot be repaired", "That God as the Potter has sovereign authority to reshape His people", "That artisans are important to society", "That Israel should build more carefully"], answer: 1 },
    { q: "Who was Jeremiah's secretary/scribe who wrote down his prophecies?", opts: ["Ezekiel", "Baruch son of Neriah", "Zephaniah", "Hilkiah"], answer: 1 },
    { q: "Jeremiah was opposed by false prophets who preached:", opts: ["That Israel should repent immediately", "'Peace, peace' when there was no peace", "That Egypt would deliver them", "That Babylon would be quickly defeated"], answer: 1 },
    { q: "What happened to Jeremiah when he was thrown into a cistern?", opts: ["He was rescued by Baruch his scribe", "An Ethiopian official, Ebed-Melek, rescued him with the king's permission", "He escaped miraculously overnight", "He was left there until Babylon conquered Jerusalem"], answer: 1 },
    { q: "After Jerusalem's fall, where did Jeremiah end up?", opts: ["He went to Babylon with the captives", "He was taken to Egypt against his will by a group fleeing Babylon", "He remained in Jerusalem as its governor", "He died in the ruins of Jerusalem"], answer: 1 },
    { q: "Jeremiah's ministry lasted approximately how long?", opts: ["5 years", "15 years", "Over 40 years", "About 25 years"], answer: 2 },
  ],
  "Lamentations": [
    { q: "What is the literary structure of the first four chapters of Lamentations?", opts: ["Free verse poetry", "Acrostics following the Hebrew alphabet", "A series of prophetic visions", "Parallel narratives"], answer: 1 },
    { q: "Lamentations 3:22–23 — 'His mercies never come to an end; they are new every morning' — was written:", opts: ["During Israel's golden age", "In the ruins after Jerusalem's destruction — grief-tested faith", "As a praise song for temple worship", "By David during his years of plenty"], answer: 1 },
    { q: "Who is traditionally credited with writing Lamentations?", opts: ["Ezekiel", "Isaiah", "Jeremiah", "Baruch"], answer: 2 },
    { q: "The tone of Lamentations as a whole is:", opts: ["Triumphant despite suffering", "Raw, honest grief mixed with stubborn hope in God's character", "Angry accusation against God", "Detached theological analysis of judgment"], answer: 1 },
    { q: "Jerusalem is personified in Lamentations as:", opts: ["A widow mourning her husband", "A soldier defeated in battle", "A farmer who lost his harvest", "A king stripped of his throne"], answer: 0 },
    { q: "Does Lamentations deny that Jerusalem's suffering was God's judgment?", opts: ["Yes — it blames only Babylon", "No — it honestly acknowledges sin as the cause while still grieving the suffering", "It is ambiguous on the cause", "Yes — it portrays Israel as innocent victims"], answer: 1 },
    { q: "The great declaration of faith in Lamentations 3:24 is:", opts: ["'The LORD will restore what we have lost'", "'The LORD is my portion; therefore I will wait for him'", "'God is with us even in exile'", "'His anger lasts only a moment'"], answer: 1 },
    { q: "Lamentations 5:19–21 ends with a prayer asking God to:", opts: ["Destroy Babylon immediately", "'Restore us to yourself... renew our days as of old'", "Reveal the date of their return", "Judge the nations who rejoiced over Jerusalem's fall"], answer: 1 },
    { q: "What Jewish practice is associated with Lamentations today?", opts: ["It is read at Passover", "It is read on Tisha B'Av, the day commemorating the destruction of both temples", "It is chanted on the Day of Atonement", "It is read at Purim to contrast with Esther"], answer: 1 },
    { q: "Lamentations 3:40 calls the people to:", opts: ["Build new altars", "'Let us examine our ways and test them, and let us return to the LORD'", "Demand answers from God", "Flee to Egypt for safety"], answer: 1 },
  ],
  "Ezekiel": [
    { q: "Ezekiel's opening vision of the divine chariot (Merkabah) features four living creatures. What do they represent?", opts: ["The four compass points Israel must travel", "The all-seeing, all-powerful, all-present God who is not limited to Israel or the temple", "The four archangels of judgment", "The four kingdoms of Daniel's prophecy"], answer: 1 },
    { q: "The glory of God in Ezekiel's vision departs from the temple in chapters 10–11. What is the theological significance?", opts: ["The temple was architecturally flawed", "God's presence was not bound to the temple — sin drove it away", "The priests had made an error in worship", "It was a temporary absence for Israel's testing"], answer: 1 },
    { q: "In Ezekiel 18, God establishes that:", opts: ["Children always bear the sins of their fathers", "Each individual is responsible for their own sin — the soul that sins shall die", "Collective guilt is always greater than individual guilt", "Only the priests bear corporate responsibility"], answer: 1 },
    { q: "The valley of dry bones vision (Ezekiel 37) represents:", opts: ["Individual resurrection of believers", "The national spiritual and physical restoration of Israel by God's Spirit", "The judgment of the nations", "The destruction of Babylon"], answer: 1 },
    { q: "God's promise in Ezekiel 36:26 — 'I will give you a new heart' — points forward to:", opts: ["The Mosaic Law being rewritten", "The new birth and the work of the Holy Spirit in the New Covenant", "A reform of the priesthood", "Israel's return under Zerubbabel"], answer: 1 },
    { q: "What was Ezekiel commanded to do as a sign of Jerusalem's siege?", opts: ["Fast for 390 days", "Lie on his side for 390 days (Israel) then 40 days (Judah) bearing their sin", "Build a model of the temple", "Shave his head and burn his hair"], answer: 1 },
    { q: "Ezekiel's elaborate vision of the restored temple (chs 40–48) is interpreted as:", opts: ["A literal blueprint for Ezra to follow", "An eschatological vision of God's ultimate dwelling with His people", "A mistake by Ezekiel that wasn't fulfilled", "The Second Temple which Zerubbabel built"], answer: 1 },
    { q: "Gog and Magog in Ezekiel 38–39 represent:", opts: ["Babylon and Assyria", "A future coalition of nations that attacks Israel — showing God's ultimate defeat of all His enemies", "Egypt and the Philistines", "The ten northern tribes in exile"], answer: 1 },
    { q: "Ezekiel was a priest-prophet. His priestly background explains his strong emphasis on:", opts: ["Military strategy", "Social justice above all else", "Holiness, the glory of God, and proper temple worship", "Covenant law and civil society"], answer: 2 },
    { q: "The phrase 'they will know that I am the LORD' appears repeatedly in Ezekiel, emphasizing:", opts: ["That Ezekiel's authority was undeniable", "That all God's actions — judgment and salvation — reveal His identity and character", "That Babylon would eventually worship God", "That Israel needed to study the Law more carefully"], answer: 1 },
  ],
  "Hosea": [
    { q: "God commanded Hosea to marry a woman named Gomer as a living parable of:", opts: ["God's covenant with all of creation", "Israel's spiritual adultery — they had been unfaithful to God like Gomer to Hosea", "The redemption of Gentiles", "The future marriage supper of the Lamb"], answer: 1 },
    { q: "Hosea 6:6 — 'I desire mercy, not sacrifice' — was quoted by Jesus in:", opts: ["The Sermon on the Mount only", "Matthew 9:13 and 12:7, when confronted about associating with sinners and Sabbath rules", "John's Gospel in the temple cleansing", "The Lord's Prayer"], answer: 1 },
    { q: "The names of Hosea's children carried symbolic messages. 'Lo-Ammi' means:", opts: ["God has remembered", "'Not my people' — a declaration of judgment", "'Son of sorrow'", "'God is salvation'"], answer: 1 },
    { q: "Despite Israel's unfaithfulness, Hosea 11:8 records God saying:", opts: ["'I will destroy you completely'", "'How can I give you up, Ephraim? My heart is changed within me'", "'You have exhausted my patience'", "'Return to Egypt where you belong'"], answer: 1 },
    { q: "Hosea's message calls Israel to 'return to the LORD' — what does genuine return involve according to Hosea 14?", opts: ["Offering more sacrifices at Bethel", "Confessing sin and trusting in God's grace rather than military alliances", "Rebuilding the northern temple at Dan", "Appointing new priests"], answer: 1 },
    { q: "The northern kingdom of Israel in Hosea's day was trusting in:", opts: ["The prophets of Baal", "Military alliances with Assyria and Egypt rather than in God", "The Mosaic covenant only", "Egyptian technology and trade"], answer: 1 },
    { q: "Hosea 2:14 pictures God saying He will 'allure' Israel into the wilderness. This is an image of:", opts: ["Judgment and exile as final", "A loving, patient pursuit to renew the marriage covenant", "Preparation for military conquest", "A return to Sinai for a new giving of the Law"], answer: 1 },
    { q: "What does the name 'Hosea' mean?", opts: ["Judgment is coming", "Salvation", "God has remembered", "The LORD is my banner"], answer: 1 },
    { q: "The Baals that Israel pursued in Hosea's time were:", opts: ["Foreign kings Israel submitted to", "Canaanite fertility gods they believed controlled rain and harvest", "Greek philosophical ideas", "Egyptian household deities"], answer: 1 },
    { q: "Hosea's lasting significance for the NT is especially his influence on:", opts: ["The book of Revelation's imagery", "Paul's theology of grace — God loves the unlovable and pursues the unfaithful", "The book of Hebrews' priesthood theology", "James's teaching on practical ethics"], answer: 1 },
  ],
  "Joel": [
    { q: "Joel uses a locust plague as a metaphor for:", opts: ["Economic hardship under foreign rule", "The coming Day of the LORD — divine judgment on a massive scale", "A specific military defeat", "Spiritual drought from lack of the prophetic word"], answer: 1 },
    { q: "Joel 2:28–29 — the promise of the Spirit poured out — was quoted by Peter on:", opts: ["The day of Jesus' baptism", "The Day of Pentecost in Acts 2", "The day of Stephen's stoning", "The conversion of Cornelius"], answer: 1 },
    { q: "Joel 2:13 says God is gracious and compassionate, 'slow to anger and abounding in love.' This phrase originally comes from:", opts: ["Psalm 103", "Exodus 34:6 — God's self-revelation to Moses", "Deuteronomy 7", "Numbers 14"], answer: 1 },
    { q: "The call to repentance in Joel 2:12–13 emphasizes:", opts: ["External mourning rituals are most important", "'Rend your heart and not your garments' — inward reality over outward show", "Corporate fasting must precede individual prayer", "Only the priests need to repent"], answer: 1 },
    { q: "The 'valley of decision' in Joel 3:14 refers to:", opts: ["Israel choosing between God and the Baals", "The place where the nations will be judged by God", "A specific geographic location near Jerusalem", "The decision Israel must make about exile"], answer: 1 },
    { q: "Joel 2:25 contains a remarkable promise from God:", opts: ["'I will restore the years the locusts have eaten'", "'I will give you double for all your suffering'", "'I will bring you back from every land'", "'I will make your enemies worship you'"], answer: 0 },
    { q: "The promise that God's Spirit will be poured out on 'all flesh' in Joel 2:28 was groundbreaking because it included:", opts: ["Foreign nations and Gentiles", "Sons, daughters, old men, young men, and servants — transcending age, gender, and social status", "Only the tribe of Judah", "All the Minor Prophets' descendants"], answer: 1 },
    { q: "The three-chapter structure of Joel moves from:", opts: ["Creation to fall to redemption", "Disaster (locusts) to repentance to restoration and future glory", "Law to prophecy to fulfillment", "Individual sin to national sin to cosmic judgment"], answer: 1 },
    { q: "Joel is classified as a Minor Prophet because:", opts: ["His message was less important than the Major Prophets", "The book is short — three chapters — not because of theological significance", "He only prophesied to a small group", "His prophecies were only partially fulfilled"], answer: 1 },
    { q: "What does Joel say everyone who calls on the name of the LORD will receive (2:32)?", opts: ["Prosperity and long life", "Salvation", "Military victory", "The gift of prophecy"], answer: 1 },
  ],
  "Amos": [
    { q: "What was Amos's occupation before being called to prophesy?", opts: ["A priest at Bethel", "A shepherd and fig-tree farmer from Tekoa", "A royal scribe in the court", "A Levite from the tribe of Judah"], answer: 1 },
    { q: "Amos prophesied primarily to which kingdom?", opts: ["Judah (southern kingdom)", "Babylon", "Israel (northern kingdom)", "Edom"], answer: 2 },
    { q: "Amos 5:21–24 records God saying He despises Israel's religious feasts. Why?", opts: ["The calendar was wrong", "They were divorced from justice and righteousness toward the poor", "The sacrifices were ceremonially impure", "They had adopted Canaanite music styles"], answer: 1 },
    { q: "Amos 5:24 — 'Let justice roll on like a river' — calls for:", opts: ["Ritual purity in the temple", "Genuine social justice matching the standard of worship", "Political reform under a new king", "Military campaigns against oppressive nations"], answer: 1 },
    { q: "The wealthy women of Samaria Amos calls 'cows of Bashan' were guilty of:", opts: ["Participating in pagan rituals", "Oppressing the poor and demanding their husbands provide luxury at any cost", "Abandoning their children", "Intermarrying with Canaanites"], answer: 1 },
    { q: "Amos's vision of the plumb line (7:7–8) represents:", opts: ["The straightness of Israel's walls", "God measuring Israel against His standard and finding them crooked", "The rebuilding of the temple", "A call for better craftsmanship"], answer: 1 },
    { q: "When Amaziah the priest told Amos to stop prophesying and go back to Judah, Amos's response was:", opts: ["He obeyed and left Bethel immediately", "'I was not a prophet by profession — the LORD took me from my flock and sent me'", "'My authority comes from the king of Judah'", "'I will stop when God tells me to stop'"], answer: 1 },
    { q: "The restoration promise at the end of Amos (9:11–12) about rebuilding 'David's fallen tent' is quoted in:", opts: ["Hebrews 11", "Acts 15:16–17 — at the Jerusalem Council regarding Gentile inclusion", "Romans 11 regarding Israel's future", "Revelation 21 about the New Jerusalem"], answer: 1 },
    { q: "Amos warns Israel of a coming famine — not of bread and water, but of:", opts: ["Wisdom and good counsel", "'Hearing the words of the LORD' (8:11) — spiritual famine from prophetic silence", "Justice and righteous leaders", "Peace from military enemies"], answer: 1 },
    { q: "The social sins Amos condemns most strongly include:", opts: ["Idolatry and temple desecration alone", "Selling the poor for a pair of sandals, bribing judges, and exploiting the vulnerable", "Sexual immorality among the priests", "Failure to tithe and support the Levites"], answer: 1 },
  ],
  "Obadiah": [
    { q: "Obadiah is directed entirely against which nation?", opts: ["Babylon", "Assyria", "Edom", "Moab"], answer: 2 },
    { q: "Edom was descended from which biblical figure?", opts: ["Ishmael", "Lot", "Esau (Jacob's twin brother)", "Ham son of Noah"], answer: 2 },
    { q: "The primary sin Obadiah condemns in Edom is:", opts: ["Idolatry", "Pride and gloating over Jerusalem's destruction rather than helping", "Military aggression against Israel", "Failure to send tribute to Israel"], answer: 1 },
    { q: "Obadiah verse 3 — 'The pride of your heart has deceived you' — refers to Edom's confidence in:", opts: ["Their military strength", "Their mountain strongholds — they lived in the cliffs of Petra/Mount Seir", "Their wealth from trade routes", "Their alliance with Babylon"], answer: 1 },
    { q: "The principle of divine retribution in Obadiah verse 15 is:", opts: ["'The wicked will prosper for a season'", "'As you have done, it will be done to you; your deeds will return upon your own head'", "'The nations will be judged by their treatment of Israel alone'", "'Pride goes before destruction'"], answer: 1 },
    { q: "Obadiah is the shortest book in the OT. How many verses does it have?", opts: ["15", "21", "27", "33"], answer: 1 },
    { q: "What does Obadiah say about Edom handing over survivors to Babylon (v.14)?", opts: ["It was justified as tribute to Babylon", "It was a specific act of betrayal and cruelty that God would judge", "It was permitted since Edom was neutral", "Obadiah praises Edom for helping Babylon"], answer: 1 },
    { q: "The book of Obadiah ends with:", opts: ["A call for Edom to repent", "The promise that 'the kingdom will be the LORD's' after all enemies are judged", "A lament over the destruction of Jerusalem", "Instructions for how Israel should treat Edom"], answer: 1 },
    { q: "The historical fulfillment of Obadiah's prophecy against Edom is seen in:", opts: ["Edom's defeat by David", "Edom's eventual extinction — absorbed by Nabataeans, vanished from history by the 1st century AD", "Edom's exile to Babylon along with Judah", "Edom's military defeat by Nehemiah"], answer: 1 },
    { q: "The relationship between Edom's sin and the Christian principle it illustrates is:", opts: ["That national borders must be respected", "That rejoicing over a brother's downfall and failing to help in crisis is a serious sin", "That family ties are less important than political alliances", "That pride in geography is foolish"], answer: 1 },
  ],
  "Jonah": [
    { q: "Why did Jonah run from God's call to preach to Nineveh?", opts: ["He was afraid of being killed", "He knew God was gracious and feared Nineveh would repent and be spared", "He didn't believe Nineveh could understand Hebrew", "He was too old and unwell to make the journey"], answer: 1 },
    { q: "Where was Jonah going when he fled from God?", opts: ["Egypt", "Tarshish — in the opposite direction from Nineveh", "Babylon", "Sidon"], answer: 1 },
    { q: "What happened when the sailors cast lots to find who caused the storm?", opts: ["No one was identified", "The lot fell on Jonah", "The lot fell on the captain", "The storm stopped before they cast lots"], answer: 1 },
    { q: "Jonah's prayer from inside the fish (chapter 2) contains the line:", opts: ["'Lord, release me from this punishment'", "'Salvation comes from the LORD'", "'I will never disobey you again'", "'Send your angel to rescue me'"], answer: 1 },
    { q: "Jesus cited Jonah's three days in the fish as a sign of:", opts: ["The importance of obedience", "His own death and resurrection — three days in the heart of the earth", "God's judgment on disobedient prophets", "The mission to Gentiles"], answer: 1 },
    { q: "The Ninevites' repentance in response to Jonah's message was:", opts: ["Half-hearted and short-lived", "Extraordinary — from the king down to the animals, they fasted and turned from violence", "Limited to the royal court", "Permanent — Nineveh remained righteous for centuries"], answer: 1 },
    { q: "After Nineveh repented, Jonah's emotional response was:", opts: ["Joy at the successful mission", "Anger — he was displeased that God showed mercy to his enemies", "Relief and prayer of thanksgiving", "Confusion about what to do next"], answer: 1 },
    { q: "The plant (qiqayon) that God provided and then withered over Jonah served to:", opts: ["Provide permanent shade for Jonah's journey home", "Illustrate God's point about caring for 120,000 Ninevites — if Jonah can grieve a plant, how much more should God care for people?", "Show Jonah that comfort is temporary", "Symbolize Israel's coming destruction"], answer: 1 },
    { q: "The book of Jonah ends with:", opts: ["Jonah repenting of his anger", "God's unanswered question to Jonah about His right to show compassion", "Nineveh eventually being destroyed", "Jonah writing down his experience"], answer: 1 },
    { q: "The main theological message of Jonah is:", opts: ["Disobedience to God has consequences", "God's mercy extends to all people, including Israel's enemies, and His heart is wider than ours", "Fish are used by God as instruments of judgment", "Prophets must always obey immediately"], answer: 1 },
  ],
  "Micah": [
    { q: "Micah 5:2 prophesied that the Messiah would be born in:", opts: ["Jerusalem", "Nazareth", "Bethlehem Ephrathah", "Hebron"], answer: 2 },
    { q: "Micah 6:8 gives three requirements the LORD has for His people. They are:", opts: ["Sacrifice, prayer, and fasting", "Act justly, love mercy, and walk humbly with your God", "Worship, give, and serve", "Love God, love neighbor, and keep the Sabbath"], answer: 1 },
    { q: "Micah was a contemporary of which other major prophet?", opts: ["Jeremiah", "Ezekiel", "Isaiah", "Daniel"], answer: 2 },
    { q: "Micah 7:18 asks: 'Who is a God like you, who pardons sin and forgives the transgression of the ___':", opts: ["nation", "righteous", "remnant of his inheritance", "contrite heart"], answer: 2 },
    { q: "The corrupt leaders Micah condemns include:", opts: ["Only foreign rulers", "Priests, prophets, and rulers who exploit the poor while claiming God's blessing", "Tax collectors and merchants", "Soldiers and military commanders"], answer: 1 },
    { q: "Micah's prophecy of the Bethlehem birthplace is used in Matthew 2 when:", opts: ["The wise men inquire where the Messiah would be born", "Jesus returns to Bethlehem after Egypt", "Jesus is dedicated at the temple", "Herod's soldiers search for the child"], answer: 0 },
    { q: "The vision of swords beaten into plowshares and spears into pruning hooks (Micah 4:3) describes:", opts: ["A temporary peace treaty with Assyria", "The eschatological kingdom of God — ultimate peace when God reigns", "The disarmament of Israel in captivity", "A specific military victory"], answer: 1 },
    { q: "What does the name 'Micah' mean?", opts: ["God is holy", "'Who is like God?' — the same question as Micah 7:18", "God is my rock", "The LORD saves"], answer: 1 },
    { q: "Micah 3:8 — 'I am filled with power, with the Spirit of the LORD' — describes the source of a prophet's ability to:", opts: ["Perform miracles", "Declare sin, justice, and God's word boldly", "Lead military campaigns", "Interpret visions and dreams"], answer: 1 },
    { q: "Micah's message to the poor and oppressed of his day was:", opts: ["'Endure suffering quietly until God acts'", "'God sees your oppression — He will judge the wicked and restore the faithful remnant'", "'Join together and overthrow your oppressors'", "'Move to Jerusalem where you will be protected'"], answer: 1 },
  ],
  "Nahum": [
    { q: "Nahum prophesied the destruction of which city?", opts: ["Babylon", "Jerusalem", "Nineveh", "Samaria"], answer: 2 },
    { q: "Nahum 1:7 states: 'The LORD is good, a refuge in times of trouble. He cares for those who ___':", opts: ["fear him", "obey his law", "trust in him", "seek his face"], answer: 2 },
    { q: "What is the connection between Jonah and Nahum?", opts: ["They were contemporaries who prophesied together", "Jonah's mission to Nineveh (repentance) preceded Nahum's oracle of final destruction (return to wickedness)", "Nahum was Jonah's student", "Both prophesied only to Israel, not Nineveh"], answer: 1 },
    { q: "Nahum 1:2–3 describes God as:", opts: ["Patient with all sin indefinitely", "Jealous and avenging — but also slow to anger, and He will not leave the guilty unpunished", "Indifferent to the actions of foreign nations", "Exclusively a God of mercy without judgment"], answer: 1 },
    { q: "The prophecy of Nahum was fulfilled when Nineveh fell to:", opts: ["The Persians under Cyrus", "A coalition of Babylonians and Medes in 612 BC", "The Egyptians under Pharaoh Necho", "The Scythians from the north"], answer: 1 },
    { q: "Nahum 1:15 — 'Look, there on the mountains, the feet of one who brings good news' — echoes which other prophetic passage?", opts: ["Micah 5:2", "Isaiah 52:7, quoted by Paul in Romans 10:15", "Joel 2:28", "Jeremiah 31:31"], answer: 1 },
    { q: "The tone of Nahum toward Nineveh's fall is:", opts: ["Sorrowful — like Jonah wishing they had repented", "Celebratory — relief for all who suffered under Assyrian brutality", "Neutral — a detached recording of prophecy", "Uncertain — Nahum doubts whether it will really happen"], answer: 1 },
    { q: "What does Nahum's prophecy teach about the patience of God?", opts: ["God never judges — He always forgives", "God's patience has a limit — prolonged wickedness will ultimately face His justice", "God only judges nations that attack Israel", "Judgment is random and not connected to behavior"], answer: 1 },
    { q: "Nahum is described as 'An oracle concerning ___' (1:1):", opts: ["Judah", "Israel", "Nineveh", "Babylon"], answer: 2 },
    { q: "The vivid military imagery of Nahum (chariots, charging horses, flashing swords) serves to:", opts: ["Glorify military power", "Show the terrifying reality of God's judgment when it finally comes", "Encourage Israel to build a stronger army", "Describe the Babylonian army's tactics"], answer: 1 },
  ],
  "Habakkuk": [
    { q: "Habakkuk's opening complaint to God was:", opts: ["'Why have you abandoned Israel to pagan nations?'", "'How long, LORD, must I call for help, but you do not listen? Why do you tolerate wrongdoing?'", "'When will the Messiah come to save us?'", "'Why do the wicked prosper while the righteous suffer?'"], answer: 1 },
    { q: "Habakkuk 2:4 — 'The righteous person will live by his faithfulness' — was quoted three times in the NT. Which books quote it?", opts: ["Matthew, Mark, Luke", "Romans, Galatians, Hebrews", "John, Acts, Revelation", "Ephesians, Philippians, Colossians"], answer: 1 },
    { q: "God's answer to Habakkuk's complaint about injustice was disturbing because:", opts: ["God said He would never judge Judah", "God said He would use the even more wicked Babylonians as His instrument of judgment", "God said the innocent must simply endure", "God gave no answer at all"], answer: 1 },
    { q: "Habakkuk 2:14 promises: 'The earth will be filled with the knowledge of the glory of the LORD, as ___':", opts: ["the stars fill the sky", "the waters cover the sea", "fire fills the furnace", "wind fills the sails"], answer: 1 },
    { q: "Habakkuk 2:20 — 'The LORD is in his holy temple; let all the earth be silent before him' — calls for:", opts: ["The temple to be rebuilt immediately", "Reverential awe and silence before God's sovereign presence", "A new liturgy of silence in worship", "The nations to stop their wars"], answer: 1 },
    { q: "Habakkuk 3:17–18 — 'Though the fig tree does not bud...' — models what kind of faith?", opts: ["Faith that expects circumstances to improve", "Faith that praises God regardless of circumstances — based on who God is, not what He gives", "Faith that denies difficult realities", "Faith rooted in community encouragement"], answer: 1 },
    { q: "The 'woes' in Habakkuk 2:6–19 are pronounced against Babylon for sins including:", opts: ["Idolatry alone", "Plunder, violence, exploitation, drunkenness, and idolatry", "Only their attack on Jerusalem", "Breaking treaties with Israel"], answer: 1 },
    { q: "Habakkuk's approach to his doubts about God is a model for believers because:", opts: ["He kept his doubts private and eventually overcame them", "He brought them honestly to God and waited for God to answer — faith through dialogue", "He found the answer in the Law without needing God to speak", "He was rebuked for questioning God"], answer: 1 },
    { q: "The watchtower image in Habakkuk 2:1 — 'I will stand at my watch... and wait to see what he will say to me' — represents:", opts: ["A military defensive posture", "Expectant, active waiting on God for His answer to prayer", "The prophetic office of warning Israel", "Habakkuk's literal observation of enemy movements"], answer: 1 },
    { q: "The main theological contribution of Habakkuk is:", opts: ["An explanation of why God allows suffering", "The call to live by faith even when God's ways are incomprehensible — trusting His character over circumstances", "A detailed prophecy of Babylon's rise and fall", "A defense of the Mosaic covenant's continuing validity"], answer: 1 },
  ],
  "Zephaniah": [
    { q: "Zephaniah prophesied during the reign of which king of Judah?", opts: ["Hezekiah", "Manasseh", "Josiah", "Jehoiakim"], answer: 2 },
    { q: "The Day of the LORD in Zephaniah is described as:", opts: ["A day of universal celebration", "A day of wrath, anguish, distress, ruin, darkness, and gloom", "A day of military victory for Israel", "A day of sacrifice and feast"], answer: 1 },
    { q: "Zephaniah 2:3 calls the humble to seek what two things before the day of God's anger?", opts: ["Wisdom and strength", "The LORD and righteousness — and also humility", "Prayer and fasting", "Justice and mercy"], answer: 1 },
    { q: "Zephaniah 3:17 — one of the most beautiful verses in the OT — says God will:", opts: ["Rebuild Jerusalem immediately", "Rejoice over His people with singing and take great delight in them", "Destroy all their enemies at once", "Give them a new king from David's line"], answer: 1 },
    { q: "The 'anawim' (humble poor of God) in Zephaniah are those who:", opts: ["Are the wealthiest supporters of the temple", "Trust in the LORD rather than human pride or military power", "Have never sinned", "Are descendants of the Levitical priests"], answer: 1 },
    { q: "Zephaniah condemns which groups in Jerusalem alongside the foreign nations?", opts: ["Foreign merchants only", "Officials, prophets, priests, and the complacent who say 'The LORD will do nothing, either good or bad'", "The military class exclusively", "Poor people who failed to tithe"], answer: 1 },
    { q: "The promised restoration in Zephaniah 3:19–20 includes:", opts: ["Only the restoration of the temple", "Gathering the scattered, removing shame, and bringing praise and honor to God's people in all the earth", "A new Davidic king being crowned immediately", "The rebuilding of Jerusalem's walls"], answer: 1 },
    { q: "Zephaniah's royal ancestry (great-great-grandson of Hezekiah) was significant because:", opts: ["It gave him access to the palace to prophesy directly to the king", "Royalty prophecying to royalty — an insider calling his own family line to account", "It exempted him from certain aspects of the Law", "It made his words legally binding as royal decrees"], answer: 1 },
    { q: "The phrase 'Seek the LORD' in Zephaniah 2:3 implies that at the time of writing:", opts: ["Israel was already faithfully seeking God", "Many had turned away and needed to urgently return to God", "God was hiding Himself from Israel", "The temple had been destroyed"], answer: 1 },
    { q: "How does Zephaniah fit into the broader theme of the Day of the LORD in the Minor Prophets?", opts: ["It introduces the concept for the first time in the Minor Prophets", "It develops the most detailed and comprehensive picture of the Day of the LORD as both judgment and ultimate salvation", "It focuses only on judgment with no salvation", "It argues that the Day of the LORD was already past"], answer: 1 },
  ],
  "Haggai": [
    { q: "Why had the returned exiles stopped rebuilding the temple?", opts: ["They ran out of materials and money", "Enemy opposition had permanently stopped the work", "They had prioritized building their own houses and lost motivation for God's house", "They were waiting for a sign from God"], answer: 2 },
    { q: "God's diagnosis of why the people were working hard but getting nowhere (Haggai 1:6) was:", opts: ["They were using wrong methods", "'You have planted much, but harvested little... because of my house, which remains a ruin'", "They hadn't prayed for the harvest", "The land was cursed by their enemies"], answer: 1 },
    { q: "How quickly did the people respond to Haggai's message?", opts: ["After a year of debate", "After 23 days", "Immediately — the same day", "After a month of prayer and fasting"], answer: 1 },
    { q: "Haggai 2:4 — 'Be strong... and work. For I am with you' — was an encouragement because:", opts: ["The people were about to face military attack", "The rebuilt temple looked much smaller and less glorious than Solomon's, discouraging the builders", "Haggai himself was uncertain of the prophecy", "The Persian king had threatened to stop the work"], answer: 1 },
    { q: "The promise that 'the glory of this present house will be greater than the glory of the former house' (2:9) points to:", opts: ["A massive renovation that Herod would later complete", "Christ Himself — Emmanuel, 'God with us' — entering the rebuilt temple", "The outpouring of gold from Gentile nations", "The ark of the covenant being returned"], answer: 1 },
    { q: "Haggai's message is primarily about:", opts: ["Prophecies of the end times", "Repentance from idolatry", "Putting God's priorities first — His house before your house, His kingdom before your comfort", "The coming of the Messiah in detail"], answer: 2 },
    { q: "Zerubbabel is called God's 'signet ring' in Haggai 2:23, pointing to:", opts: ["His administrative authority in Persia", "His place in the Messianic line — David's dynasty continues toward Christ", "His military victories over enemies", "His role in designing the new temple"], answer: 1 },
    { q: "Haggai was written in what year?", opts: ["520 BC — the second year of Darius king of Persia", "586 BC — when Jerusalem fell", "538 BC — the first year of the return", "480 BC — during the events of Esther"], answer: 0 },
    { q: "Haggai 1:7 — 'Give careful thought to your ways' — is a call to:", opts: ["Study the Law more diligently", "Honest self-examination about priorities and spiritual condition", "Repent of specific named sins", "Prepare for military defense"], answer: 1 },
    { q: "The completion of the temple that Haggai's ministry helped accomplish occurred in:", opts: ["538 BC", "520 BC", "516 BC", "500 BC"], answer: 2 },
  ],
  "Zechariah": [
    { q: "Zechariah 9:9 — 'See, your king comes to you, righteous and victorious, lowly and riding on a donkey' — was fulfilled when:", opts: ["Solomon was crowned in Jerusalem", "Jesus rode into Jerusalem on Palm Sunday", "Zerubbabel led the returning exiles", "Nehemiah arrived to rebuild the walls"], answer: 1 },
    { q: "Zechariah 4:6 — 'Not by might nor by power, but by my Spirit' — was spoken over which leader?", opts: ["Ezra", "Nehemiah", "Zerubbabel", "Joshua the high priest"], answer: 2 },
    { q: "The 30 pieces of silver prophecy in Zechariah 11:12–13 was fulfilled in the NT when:", opts: ["The chief priests paid taxes to Rome", "Judas betrayed Jesus for 30 pieces of silver, which were later thrown into the temple", "Joseph was sold by his brothers", "The temple treasury was ransacked"], answer: 1 },
    { q: "Zechariah 12:10 — 'They will look on me, the one they have pierced' — is quoted in John 19:37 at:", opts: ["The Last Supper", "The crucifixion of Jesus", "Jesus' triumphal entry", "The resurrection appearance"], answer: 1 },
    { q: "Zechariah 13:7 — 'Strike the shepherd, and the sheep will be scattered' — was quoted by Jesus referring to:", opts: ["The false prophets of Israel", "His own arrest and the disciples' scattering (Matthew 26:31)", "Zerubbabel's death", "The exile of Israel to Babylon"], answer: 1 },
    { q: "The eight night visions in Zechariah 1–6 were given to:", opts: ["Comfort a discouraged community and confirm God's purposes for Jerusalem and His people", "Warn Jerusalem of coming judgment", "Predict the rise of Alexander the Great", "Prepare Zerubbabel for military battle"], answer: 0 },
    { q: "What is the central call of Zechariah 1:3?", opts: ["'Rebuild the temple immediately'", "'Return to me... and I will return to you, says the LORD Almighty'", "'Fear not, for I am with you'", "'Seek justice and love mercy'"], answer: 1 },
    { q: "Zechariah is significant in the NT because:", opts: ["It is the most quoted Minor Prophet in the book of Revelation", "It contains more direct prophecies of Christ's first coming than any other Minor Prophet", "It provides the framework for Paul's theology", "Its temple vision is quoted in Hebrews"], answer: 1 },
    { q: "In Zechariah's vision, Joshua the high priest is accused by Satan and then:", opts: ["Found guilty and removed from office", "Clothed in rich garments — his filthy garments replaced as a picture of justification", "Asked to prove himself through sacrifice", "Given new duties limited to the inner court"], answer: 1 },
    { q: "Zechariah 14 describes the ultimate eschatological future with:", opts: ["The permanent destruction of Jerusalem", "The LORD standing on the Mount of Olives, and His kingdom established over all the earth", "Israel's enemies absorbing Jerusalem permanently", "A new exodus to a land beyond the Nile"], answer: 1 },
  ],
  "Malachi": [
    { q: "Malachi is the last book of the OT. What follows it before the New Testament?", opts: ["100 years of silence", "400 years of prophetic silence — until John the Baptist", "200 years of priestly writings", "The Apocrypha, then the NT"], answer: 1 },
    { q: "Malachi 3:1 — 'I will send my messenger, who will prepare the way before me' — refers to:", opts: ["Ezra the scribe", "Nehemiah the governor", "John the Baptist, as confirmed by Jesus in Matthew 11:10", "An angel who precedes the Day of Atonement"], answer: 2 },
    { q: "The six 'disputation speeches' in Malachi all follow what pattern?", opts: ["God commands, people obey, God blesses", "God makes a statement, people question it ('How?'), God gives a detailed answer", "A sin is named, judgment is pronounced, repentance is called for", "A vision is given, it is interpreted, application follows"], answer: 1 },
    { q: "God's accusation of 'robbing' Him in Malachi 3:8–10 concerns:", opts: ["Temple theft by the priests", "Withholding tithes and offerings from God", "Using false weights in the marketplace", "Refusing to pay temple workers"], answer: 1 },
    { q: "Malachi 4:5 promises that God will send the prophet ___ before the great Day of the LORD:", opts: ["Isaiah", "Moses", "Elijah", "Samuel"], answer: 2 },
    { q: "The priests in Malachi's day were offering which kinds of animals?", opts: ["Only the best firstborn animals", "Blind, lame, and diseased animals — the worst of the flock", "Foreign imported animals", "Animals not specified in the Law"], answer: 1 },
    { q: "Malachi 4:2 promises that for those who revere God's name:", opts: ["They will be preserved from the Day of Judgment entirely", "'The sun of righteousness will rise with healing in its rays'", "'Their enemies will bow before them'", "'Their offerings will ascend like fire before God'"], answer: 1 },
    { q: "The people in Malachi said: 'It is futile to serve God' (3:14). This attitude reflected:", opts: ["Honest theological inquiry", "Spiritual weariness and disillusionment — they served God expecting visible reward and didn't see it", "A direct rejection of Mosaic law", "The influence of Babylonian philosophy"], answer: 1 },
    { q: "What does Malachi 2:16 — 'The man who hates and divorces his wife... does violence' — address?", opts: ["Unfair economic treatment of women", "The covenant faithfulness required in marriage — God sees and cares about broken vows", "The legal procedure for divorce in Judah", "Marriage to foreign women"], answer: 1 },
    { q: "Malachi's closing command in 4:4 — 'Remember the law of my servant Moses' — and the promise of Elijah (4:5–6) creates a bridge to the NT by pointing toward:", opts: ["The return of the exiles from Babylon", "John the Baptist (the new Elijah) and Jesus (who fulfills the Law) — the opening of the NT", "A final reformation under a Mosaic king", "The rebuilding of the second temple"], answer: 1 },
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

function lsGet(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
function lsList(prefix) {
  try {
    return Object.keys(localStorage).filter(k => k.startsWith(prefix));
  } catch { return []; }
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
    const keys = lsList("disciple_");
    const data = keys.map(k => lsGet(k)).filter(Boolean);
    setDisciples(data);
    setLoading(false);
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
    const saved = lsGet(storageKey);
    if (saved) {
      setCompleted(saved.completed || {});
      setNotes(saved.notes || {});
      setQuizScores(saved.quizScores || {});
    }
    setLoaded(true);
  }, []);

  const persist = (nc, nn, nq) => {
    const dc = Object.values(nc).filter(Boolean).length;
    const existing = lsGet(storageKey);
    lsSet(storageKey, { name: user.name, code: user.code, role: "disciple", completed: nc, notes: nn, quizScores: nq, daysCompleted: dc, lastActive: new Date().toISOString(), joinDate: existing?.joinDate || new Date().toISOString() });
  };

  const toggleDone = (d) => { const n = { ...completed, [d]: !completed[d] }; setCompleted(n); persist(n, notes, quizScores); };
  const saveNote = (d, t) => { const n = { ...notes, [d]: t }; setNotes(n); persist(completed, n, quizScores); };
  const saveQuizScore = (d, score, total) => { const pct = Math.round((score / total) * 100); const n = { ...quizScores, [d]: pct }; setQuizScores(n); persist(completed, notes, n); };

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
            <button onClick={() => { onSaveNote(day, note); setSaved(true); }}
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
  const [user, setUser] = useState(() => lsGet("nt90_user_v2"));

  const handleLogin = (u) => { lsSet("nt90_user_v2", u); setUser(u); };
  const handleLogout = () => { lsSet("nt90_user_v2", null); setUser(null); };

  if (!user) return <LoginScreen onLogin={handleLogin} />;
  if (user.role === "discipler") return <DisciplerDashboard user={user} onLogout={handleLogout} />;
  return <DiscipleApp user={user} onLogout={handleLogout} />;
}
