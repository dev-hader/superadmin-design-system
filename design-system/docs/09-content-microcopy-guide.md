# Content & Microcopy Guide — Arabic-first

**Status:** approved · v1.0 (2026-07-20). The writing system for every string in the
product — English and Arabic are **peer languages**; Arabic is never a translation
afterthought (rules §9). The shell's `AR_VOCAB` implements this guide; new strings
follow it *before* they ship.

## 1. Voice & tone

- **Calm operator, not marketer.** Front-desk staff read this UI 8 hours a day —
  no exclamation marks, no "🎉", no "Awesome!".
- Verb-first, present tense, one idea per sentence: *"Save changes"*, not
  *"Click here to save your changes"*.
- The system takes blame, the user never does: *"Something went wrong. Your changes
  couldn't be saved."* — never *"You entered an invalid value."*

## 2. Arabic register — الفصحى المبسّطة

- **Modern Standard Arabic (فصحى)** for ALL product and client-facing copy — never
  Egyptian/Gulf colloquial. (Locked owner directive, 2026-07-19.)
- Simple MSA: «تم حفظ التغييرات بنجاح.» not bureaucratic MSA («لقد تمت عملية الحفظ»).
- Address the user with the polite singular («أدخل رقم الهاتف») — imperative verb
  first, same as English.
- Gender: masculine generic for roles («محلل أعمال») per owner directive; avoid
  gendered participles referring to *the user* where a verb form works instead.
- Brand names stay Latin: **High Five** (never "هاي فايف", never "Hi5"), Mada, Visa.

## 3. Numerals, currency, dates — the policy table

| Context | Rule | Example (AR mode) |
|---|---|---|
| All digits | **Latin digits (0-9) in both languages** — GCC financial convention; Arabic-Indic (٠-٩) never used | «SAR 1,450» |
| Currency in UI chrome | `SAR` prefix, comma thousands, no decimals unless exact | SAR 12,480 |
| Currency in running Arabic copy | «ر.س» after the amount | «بقيمة 250 ر.س» |
| Exact money (tooltips, receipts) | two decimals | SAR 48,231.50 |
| Dates in chrome | `12 Jul` / «12 يوليو» — Gregorian, translated month names | «الخميس، 9 يوليو 2026» |
| Times | 12-hour + locale meridiem | 6:30 PM / «6:30 م» |
| Ranges | en-dash, spaces | «6:00 – 7:30 م» |
| Refs | Latin, monospaced | HF-24815 · INV-10432 |

## 4. Component copy contracts

| Surface | Contract | EN / AR example |
|---|---|---|
| Button | verb (+object), 1–3 words, no punctuation | Save changes / حفظ التغييرات |
| Destructive button | verb + object, never bare "Delete" | Remove employee / إزالة الموظف |
| Toast success | past participle + period | Changes saved successfully. / تم حفظ التغييرات بنجاح. |
| Toast failure | what happened + what to do | Something went wrong. Your changes couldn't be saved. Please try again. / حدث خطأ ما. تعذّر حفظ التغييرات. يُرجى المحاولة مرة أخرى. |
| Field error | rule, not accusation; names the fix | Minutes must be 1–59. / يجب أن تكون الدقائق بين 1 و59. |
| Empty state | 1 line what + 1 line how + 1 action | No bookings yet — When a guest books, it shows up here — Create a booking |
| Confirm modal | question title + consequence body + verb buttons | Remove Karim? — All his scan access ends immediately. — Cancel / Remove |
| Placeholder | example, not instruction | e.g. Omar Al-Fahad / مثال: عمر الفهد |

## 5. Terminology (locked glossary)

| EN | AR | Never |
|---|---|---|
| Booking | حجز | "reservation" mixed in — pick booking everywhere |
| Check-in | تسجيل الوصول | «دخول» |
| Guest / Customer | عميل | «زبون» |
| Employee | موظف | «عامل» |
| Branch | فرع | — |
| Package | باقة | «حزمة» |
| Membership | عضوية | «اشتراك» (that's subscription/billing) |
| Waitlist | قائمة الانتظار | — |
| Payout | تحويل الأرباح | — |

## 6. Mechanics

- Sentence case everywhere in English (headings included); no Title Case except brand
  names. Arabic has no case — punctuate identically («؟» «،»).
- Ellipsis `…` (one char) for truncation and busy states («جارٍ الحفظ…»).
- Arabic plurals: use the counted-noun rules the shell already ships
  («3 حجوزات», «11 حجزًا») — numbers 3–10 plural, 11+ singular accusative.
- Every new UI string lands in `AR_VOCAB` (exact-match) or `AR_REGEX` (parameterized)
  in the same PR — an untranslated string is a build gap, not a follow-up.

## 7. Forbidden list

Colloquial Arabic in product copy · Arabic-Indic digits · exclamation marks ·
"please" in English buttons · "invalid input" (name the rule instead) · ALL-CAPS
emphasis · mixing حجز/booking terminology mid-screen · humanized error jokes.
